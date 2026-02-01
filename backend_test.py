#!/usr/bin/env python3
"""
Backend Test Suite for WEEKN POS Phase 2.3 - Customer Integration into Transaction
Tests the complete customer integration flow including:
1. Transaction with customer - verify customer stats update
2. Transaction without customer - verify backward compatibility  
3. Customer stats calculation - verify correct calculations
4. Multiple customers - verify independent stats
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any

# Get backend URL from environment
BACKEND_URL = "https://weeknpos-1.preview.emergentagent.com/api"

class CustomerIntegrationTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.test_results = []
        self.customer_ids = []
        self.transaction_ids = []
        
    def log_test(self, test_name: str, success: bool, message: str, details: Dict[Any, Any] = None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "details": details or {}
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {json.dumps(details, indent=2)}")
    
    def cleanup_test_data(self):
        """Clean up any existing test data"""
        print("\n=== Cleanup: Removing existing test data ===")
        
        # Clean up test customers
        test_phones = ["081234567890", "081234567891", "081234567892"]
        for phone in test_phones:
            try:
                # Search for customer by phone
                response = requests.get(f"{self.base_url}/customers/search?q={phone}")
                if response.status_code == 200:
                    customers = response.json()
                    for customer in customers:
                        if customer.get('phone') == phone:
                            delete_response = requests.delete(f"{self.base_url}/customers/{customer['id']}")
                            if delete_response.status_code == 200:
                                print(f"Deleted existing customer: {customer['name']} ({phone})")
            except Exception as e:
                print(f"Cleanup error for {phone}: {e}")
    
    def test_1_create_test_customers(self):
        """Test creating customers for testing"""
        print("\n=== Test 1: Create Test Customers ===")
        
        customers_data = [
            {"name": "John Doe", "phone": "081234567890"},
            {"name": "Jane Smith", "phone": "081234567891"},
            {"name": "Bob Wilson", "phone": "081234567892"}
        ]
        
        for i, customer_data in enumerate(customers_data):
            try:
                response = requests.post(f"{self.base_url}/customers", json=customer_data)
                
                if response.status_code == 200:
                    customer = response.json()
                    self.customer_ids.append(customer['id'])
                    
                    # Validate customer structure
                    required_fields = ['id', 'name', 'phone', 'registered_date', 'total_transactions', 'total_spent']
                    missing_fields = [field for field in required_fields if field not in customer]
                    
                    if missing_fields:
                        self.log_test(f"Create Customer {i+1}", False, f"Missing fields: {missing_fields}", customer)
                    elif customer['total_transactions'] != 0:
                        self.log_test(f"Create Customer {i+1}", False, f"Initial total_transactions should be 0, got {customer['total_transactions']}")
                    elif customer['total_spent'] != 0.0:
                        self.log_test(f"Create Customer {i+1}", False, f"Initial total_spent should be 0.0, got {customer['total_spent']}")
                    else:
                        self.log_test(f"Create Customer {i+1}", True, f"Customer created: {customer['name']} (ID: {customer['id']})")
                else:
                    self.log_test(f"Create Customer {i+1}", False, f"HTTP {response.status_code}: {response.text}")
                    
            except Exception as e:
                self.log_test(f"Create Customer {i+1}", False, f"Request failed: {str(e)}")
    
    def test_2_transaction_with_customer(self):
        """Test creating transaction with customer_id and customer_name"""
        print("\n=== Test 2: Transaction with Customer ===")
        
        if not self.customer_ids:
            self.log_test("Transaction with Customer", False, "No customer IDs available")
            return
        
        # Transaction for John Doe (50,000)
        transaction_data = {
            "items": [
                {
                    "product_id": "test-product-1",
                    "product_name": "Roti Tawar",
                    "quantity": 2,
                    "price": 25000,
                    "subtotal": 50000
                }
            ],
            "subtotal": 50000,
            "discount_amount": 0,
            "total": 50000,
            "payment_methods": [
                {
                    "method": "cash",
                    "amount": 50000
                }
            ],
            "cashier_name": "Sari Bakery",
            "customer_id": self.customer_ids[0],  # John Doe
            "customer_name": "John Doe"
        }
        
        try:
            response = requests.post(f"{self.base_url}/transactions", json=transaction_data)
            
            if response.status_code == 200:
                transaction = response.json()
                self.transaction_ids.append(transaction['id'])
                
                # Validate transaction structure
                validation_errors = []
                
                if transaction.get('customer_id') != self.customer_ids[0]:
                    validation_errors.append(f"customer_id mismatch: expected {self.customer_ids[0]}, got {transaction.get('customer_id')}")
                
                if transaction.get('customer_name') != "John Doe":
                    validation_errors.append(f"customer_name mismatch: expected 'John Doe', got '{transaction.get('customer_name')}'")
                
                if transaction.get('total') != 50000:
                    validation_errors.append(f"total mismatch: expected 50000, got {transaction.get('total')}")
                
                if validation_errors:
                    self.log_test("Transaction with Customer", False, f"Validation errors: {'; '.join(validation_errors)}", transaction)
                else:
                    self.log_test("Transaction with Customer", True, f"Transaction created with customer info: {transaction['id']}")
            else:
                self.log_test("Transaction with Customer", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Transaction with Customer", False, f"Request failed: {str(e)}")
    
    def test_3_verify_customer_stats_update(self):
        """Test that customer stats are updated correctly after transaction"""
        print("\n=== Test 3: Verify Customer Stats Update ===")
        
        if not self.customer_ids:
            self.log_test("Customer Stats Update", False, "No customer IDs available")
            return
        
        try:
            # Get John Doe's updated stats
            response = requests.get(f"{self.base_url}/customers/{self.customer_ids[0]}")
            
            if response.status_code == 200:
                customer = response.json()
                
                validation_errors = []
                
                if customer.get('total_transactions') != 1:
                    validation_errors.append(f"total_transactions should be 1, got {customer.get('total_transactions')}")
                
                if customer.get('total_spent') != 50000.0:
                    validation_errors.append(f"total_spent should be 50000.0, got {customer.get('total_spent')}")
                
                if validation_errors:
                    self.log_test("Customer Stats Update", False, f"Validation errors: {'; '.join(validation_errors)}", customer)
                else:
                    self.log_test("Customer Stats Update", True, f"Customer stats updated correctly: {customer['total_transactions']} transactions, Rp {customer['total_spent']} spent")
            else:
                self.log_test("Customer Stats Update", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Customer Stats Update", False, f"Request failed: {str(e)}")
    
    def test_4_transaction_without_customer(self):
        """Test creating transaction without customer (backward compatibility)"""
        print("\n=== Test 4: Transaction without Customer ===")
        
        transaction_data = {
            "items": [
                {
                    "product_id": "test-product-2",
                    "product_name": "Kue Lapis",
                    "quantity": 1,
                    "price": 30000,
                    "subtotal": 30000
                }
            ],
            "subtotal": 30000,
            "discount_amount": 0,
            "total": 30000,
            "payment_methods": [
                {
                    "method": "cash",
                    "amount": 30000
                }
            ],
            "cashier_name": "Sari Bakery"
            # No customer_id or customer_name
        }
        
        try:
            response = requests.post(f"{self.base_url}/transactions", json=transaction_data)
            
            if response.status_code == 200:
                transaction = response.json()
                self.transaction_ids.append(transaction['id'])
                
                # Validate transaction structure
                validation_errors = []
                
                if transaction.get('customer_id') is not None:
                    validation_errors.append(f"customer_id should be null, got {transaction.get('customer_id')}")
                
                if transaction.get('customer_name') is not None:
                    validation_errors.append(f"customer_name should be null, got {transaction.get('customer_name')}")
                
                if transaction.get('total') != 30000:
                    validation_errors.append(f"total mismatch: expected 30000, got {transaction.get('total')}")
                
                if validation_errors:
                    self.log_test("Transaction without Customer", False, f"Validation errors: {'; '.join(validation_errors)}", transaction)
                else:
                    self.log_test("Transaction without Customer", True, f"Transaction created without customer: {transaction['id']}")
            else:
                self.log_test("Transaction without Customer", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Transaction without Customer", False, f"Request failed: {str(e)}")
    
    def test_5_customer_stats_calculation(self):
        """Test customer stats calculation with multiple transactions"""
        print("\n=== Test 5: Customer Stats Calculation ===")
        
        if not self.customer_ids:
            self.log_test("Customer Stats Calculation", False, "No customer IDs available")
            return
        
        # Create second transaction for John Doe (30,000)
        transaction_data = {
            "items": [
                {
                    "product_id": "test-product-3",
                    "product_name": "Brownies",
                    "quantity": 1,
                    "price": 30000,
                    "subtotal": 30000
                }
            ],
            "subtotal": 30000,
            "discount_amount": 0,
            "total": 30000,
            "payment_methods": [
                {
                    "method": "qris",
                    "amount": 30000,
                    "reference": "QRIS123456"
                }
            ],
            "cashier_name": "Sari Bakery",
            "customer_id": self.customer_ids[0],  # John Doe again
            "customer_name": "John Doe"
        }
        
        try:
            # Create second transaction
            response = requests.post(f"{self.base_url}/transactions", json=transaction_data)
            
            if response.status_code == 200:
                transaction = response.json()
                self.transaction_ids.append(transaction['id'])
                
                # Verify John Doe's updated stats
                customer_response = requests.get(f"{self.base_url}/customers/{self.customer_ids[0]}")
                
                if customer_response.status_code == 200:
                    customer = customer_response.json()
                    
                    validation_errors = []
                    
                    # Should have 2 transactions totaling 80,000
                    if customer.get('total_transactions') != 2:
                        validation_errors.append(f"total_transactions should be 2, got {customer.get('total_transactions')}")
                    
                    if customer.get('total_spent') != 80000.0:
                        validation_errors.append(f"total_spent should be 80000.0, got {customer.get('total_spent')}")
                    
                    if validation_errors:
                        self.log_test("Customer Stats Calculation", False, f"Validation errors: {'; '.join(validation_errors)}", customer)
                    else:
                        self.log_test("Customer Stats Calculation", True, f"Customer stats calculated correctly: {customer['total_transactions']} transactions, Rp {customer['total_spent']} total")
                else:
                    self.log_test("Customer Stats Calculation", False, f"Failed to get customer: HTTP {customer_response.status_code}")
            else:
                self.log_test("Customer Stats Calculation", False, f"Failed to create transaction: HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Customer Stats Calculation", False, f"Request failed: {str(e)}")
    
    def test_6_multiple_customers_independence(self):
        """Test that multiple customers have independent stats"""
        print("\n=== Test 6: Multiple Customers Independence ===")
        
        if len(self.customer_ids) < 2:
            self.log_test("Multiple Customers Independence", False, "Need at least 2 customer IDs")
            return
        
        # Create transaction for Jane Smith (100,000)
        transaction_data = {
            "items": [
                {
                    "product_id": "test-product-4",
                    "product_name": "Birthday Cake",
                    "quantity": 1,
                    "price": 100000,
                    "subtotal": 100000
                }
            ],
            "subtotal": 100000,
            "discount_amount": 0,
            "total": 100000,
            "payment_methods": [
                {
                    "method": "gopay",
                    "amount": 100000,
                    "reference": "GP789012"
                }
            ],
            "cashier_name": "Sari Bakery",
            "customer_id": self.customer_ids[1],  # Jane Smith
            "customer_name": "Jane Smith"
        }
        
        try:
            # Create transaction for Jane Smith
            response = requests.post(f"{self.base_url}/transactions", json=transaction_data)
            
            if response.status_code == 200:
                transaction = response.json()
                self.transaction_ids.append(transaction['id'])
                
                # Verify all customers' stats
                customers_stats = []
                for i, customer_id in enumerate(self.customer_ids):
                    customer_response = requests.get(f"{self.base_url}/customers/{customer_id}")
                    if customer_response.status_code == 200:
                        customer = customer_response.json()
                        customers_stats.append({
                            "name": customer['name'],
                            "transactions": customer['total_transactions'],
                            "spent": customer['total_spent']
                        })
                
                # Expected stats:
                # John Doe: 2 transactions, 80,000 total
                # Jane Smith: 1 transaction, 100,000 total  
                # Bob Wilson: 0 transactions, 0 total
                expected_stats = [
                    {"name": "John Doe", "transactions": 2, "spent": 80000.0},
                    {"name": "Jane Smith", "transactions": 1, "spent": 100000.0},
                    {"name": "Bob Wilson", "transactions": 0, "spent": 0.0}
                ]
                
                validation_errors = []
                
                for i, (actual, expected) in enumerate(zip(customers_stats, expected_stats)):
                    if actual['name'] != expected['name']:
                        validation_errors.append(f"Customer {i+1} name mismatch: expected {expected['name']}, got {actual['name']}")
                    if actual['transactions'] != expected['transactions']:
                        validation_errors.append(f"{actual['name']} transactions: expected {expected['transactions']}, got {actual['transactions']}")
                    if actual['spent'] != expected['spent']:
                        validation_errors.append(f"{actual['name']} spent: expected {expected['spent']}, got {actual['spent']}")
                
                if validation_errors:
                    self.log_test("Multiple Customers Independence", False, f"Validation errors: {'; '.join(validation_errors)}", {
                        "actual_stats": customers_stats,
                        "expected_stats": expected_stats
                    })
                else:
                    self.log_test("Multiple Customers Independence", True, "All customers have correct independent stats", {
                        "customer_stats": customers_stats
                    })
            else:
                self.log_test("Multiple Customers Independence", False, f"Failed to create transaction: HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Multiple Customers Independence", False, f"Request failed: {str(e)}")
    
    def test_7_verify_final_stats(self):
        """Final verification of all customer stats"""
        print("\n=== Test 7: Final Stats Verification ===")
        
        if len(self.customer_ids) != 3:
            self.log_test("Final Stats Verification", False, f"Expected 3 customer IDs, have {len(self.customer_ids)}")
            return
        
        try:
            # Get our specific test customers by ID
            test_customers = []
            test_names = ["John Doe", "Jane Smith", "Bob Wilson"]
            
            for i, customer_id in enumerate(self.customer_ids):
                response = requests.get(f"{self.base_url}/customers/{customer_id}")
                if response.status_code == 200:
                    customer = response.json()
                    test_customers.append(customer)
                else:
                    self.log_test("Final Stats Verification", False, f"Failed to get customer {customer_id}: HTTP {response.status_code}")
                    return
            
            if len(test_customers) != 3:
                self.log_test("Final Stats Verification", False, f"Expected 3 test customers, found {len(test_customers)}")
                return
            
            # Verify final expected stats
            expected_final_stats = {
                "John Doe": {"transactions": 2, "spent": 80000.0},
                "Jane Smith": {"transactions": 1, "spent": 100000.0},
                "Bob Wilson": {"transactions": 0, "spent": 0.0}
            }
            
            validation_errors = []
            
            for customer in test_customers:
                name = customer['name']
                expected = expected_final_stats[name]
                
                if customer['total_transactions'] != expected['transactions']:
                    validation_errors.append(f"{name} transactions: expected {expected['transactions']}, got {customer['total_transactions']}")
                
                if customer['total_spent'] != expected['spent']:
                    validation_errors.append(f"{name} spent: expected {expected['spent']}, got {customer['total_spent']}")
            
            if validation_errors:
                self.log_test("Final Stats Verification", False, f"Final validation errors: {'; '.join(validation_errors)}")
            else:
                stats_summary = []
                for customer in test_customers:
                    stats_summary.append(f"{customer['name']}: {customer['total_transactions']} transactions, Rp {customer['total_spent']}")
                
                self.log_test("Final Stats Verification", True, f"All final stats correct. Summary: {'; '.join(stats_summary)}")
                
        except Exception as e:
            self.log_test("Final Stats Verification", False, f"Request failed: {str(e)}")
    
    def run_all_tests(self):
        """Run all customer integration tests"""
        print(f"🚀 Starting Phase 2.3 Customer Integration Tests")
        print(f"Backend URL: {self.base_url}")
        print("=" * 60)
        
        # Cleanup first
        self.cleanup_test_data()
        
        # Run tests in sequence
        self.test_1_create_test_customers()
        self.test_2_transaction_with_customer()
        self.test_3_verify_customer_stats_update()
        self.test_4_transaction_without_customer()
        self.test_5_customer_stats_calculation()
        self.test_6_multiple_customers_independence()
        self.test_7_verify_final_stats()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        print("\n📋 DETAILED RESULTS:")
        for result in self.test_results:
            status = "✅" if result['success'] else "❌"
            print(f"{status} {result['test']}: {result['message']}")
        
        # Failed tests details
        failed_tests = [result for result in self.test_results if not result['success']]
        if failed_tests:
            print("\n🔍 FAILED TEST DETAILS:")
            for result in failed_tests:
                print(f"\n❌ {result['test']}")
                print(f"   Error: {result['message']}")
                if result['details']:
                    print(f"   Details: {json.dumps(result['details'], indent=4)}")
        
        return passed == total

if __name__ == "__main__":
    tester = CustomerIntegrationTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed!")
        exit(0)
    else:
        print("\n💥 Some tests failed!")
        exit(1)