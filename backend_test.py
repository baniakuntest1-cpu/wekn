#!/usr/bin/env python3
"""
Backend Test Suite for WEEKN POS Shift Management
Tests the complete shift management flow including:
1. Open shift
2. Check active shift
3. Create transactions with different payment methods
4. Close shift with cash reconciliation
5. View shift history
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any

# Get backend URL from environment
BACKEND_URL = "https://weeknpos-1.preview.emergentagent.com/api"

class ShiftManagementTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.test_results = []
        self.shift_id = None
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
    
    def test_1_open_shift(self):
        """Test opening a new shift"""
        print("\n=== Test 1: Open Shift ===")
        
        # First, close any existing open shifts for clean test
        try:
            response = requests.get(f"{self.base_url}/shifts/active")
            if response.status_code == 200 and response.json():
                existing_shift = response.json()
                close_response = requests.post(
                    f"{self.base_url}/shifts/{existing_shift['id']}/close",
                    json={"actual_cash": existing_shift['opening_cash']}
                )
                print(f"Closed existing shift: {existing_shift['id']}")
        except Exception as e:
            print(f"No existing shift to close: {e}")
        
        # Test opening a new shift
        shift_data = {
            "cashier_name": "Sari Bakery",
            "opening_cash": 500000
        }
        
        try:
            response = requests.post(f"{self.base_url}/shifts/open", json=shift_data)
            
            if response.status_code == 200:
                shift = response.json()
                self.shift_id = shift['id']
                
                # Validate response structure
                required_fields = ['id', 'cashier_name', 'opening_cash', 'opening_time', 'status']
                missing_fields = [field for field in required_fields if field not in shift]
                
                if missing_fields:
                    self.log_test("Open Shift", False, f"Missing fields: {missing_fields}", shift)
                elif shift['status'] != 'open':
                    self.log_test("Open Shift", False, f"Expected status 'open', got '{shift['status']}'", shift)
                elif shift['cashier_name'] != shift_data['cashier_name']:
                    self.log_test("Open Shift", False, "Cashier name mismatch", shift)
                elif shift['opening_cash'] != shift_data['opening_cash']:
                    self.log_test("Open Shift", False, "Opening cash mismatch", shift)
                else:
                    self.log_test("Open Shift", True, f"Shift opened successfully with ID: {self.shift_id}", shift)
            else:
                self.log_test("Open Shift", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Open Shift", False, f"Request failed: {str(e)}")
    
    def test_2_duplicate_shift_prevention(self):
        """Test that opening multiple shifts fails"""
        print("\n=== Test 2: Duplicate Shift Prevention ===")
        
        shift_data = {
            "cashier_name": "Another Cashier",
            "opening_cash": 300000
        }
        
        try:
            response = requests.post(f"{self.base_url}/shifts/open", json=shift_data)
            
            if response.status_code == 400:
                error_msg = response.json().get('detail', '')
                if "shift yang masih aktif" in error_msg.lower() or "active" in error_msg.lower():
                    self.log_test("Duplicate Shift Prevention", True, "Correctly prevented duplicate shift opening")
                else:
                    self.log_test("Duplicate Shift Prevention", False, f"Wrong error message: {error_msg}")
            else:
                self.log_test("Duplicate Shift Prevention", False, f"Expected 400 error, got {response.status_code}")
                
        except Exception as e:
            self.log_test("Duplicate Shift Prevention", False, f"Request failed: {str(e)}")
    
    def test_3_get_active_shift(self):
        """Test getting the active shift"""
        print("\n=== Test 3: Get Active Shift ===")
        
        try:
            response = requests.get(f"{self.base_url}/shifts/active")
            
            if response.status_code == 200:
                shift = response.json()
                
                if not shift:
                    self.log_test("Get Active Shift", False, "No active shift returned")
                elif shift['id'] != self.shift_id:
                    self.log_test("Get Active Shift", False, f"Wrong shift ID returned: {shift['id']} vs {self.shift_id}")
                elif shift['status'] != 'open':
                    self.log_test("Get Active Shift", False, f"Wrong status: {shift['status']}")
                else:
                    required_fields = ['id', 'cashier_name', 'opening_cash', 'opening_time', 'status']
                    missing_fields = [field for field in required_fields if field not in shift]
                    
                    if missing_fields:
                        self.log_test("Get Active Shift", False, f"Missing fields: {missing_fields}", shift)
                    else:
                        self.log_test("Get Active Shift", True, "Active shift retrieved successfully", shift)
            else:
                self.log_test("Get Active Shift", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Get Active Shift", False, f"Request failed: {str(e)}")
    
    def test_4_create_transactions(self):
        """Test creating transactions with different payment methods"""
        print("\n=== Test 4: Create Transactions ===")
        
        # Transaction 1: Cash payment (50,000)
        transaction1 = {
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
            "cashier_name": "Sari Bakery"
        }
        
        # Transaction 2: Split payment (30,000 cash + 20,000 QRIS)
        transaction2 = {
            "items": [
                {
                    "product_id": "test-product-2",
                    "product_name": "Kue Lapis",
                    "quantity": 1,
                    "price": 50000,
                    "subtotal": 50000
                }
            ],
            "subtotal": 50000,
            "discount_amount": 0,
            "total": 50000,
            "payment_methods": [
                {
                    "method": "cash",
                    "amount": 30000
                },
                {
                    "method": "qris",
                    "amount": 20000,
                    "reference": "QRIS123456"
                }
            ],
            "cashier_name": "Sari Bakery"
        }
        
        # Transaction 3: Non-cash payment (100,000 GoPay)
        transaction3 = {
            "items": [
                {
                    "product_id": "test-product-3",
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
            "cashier_name": "Sari Bakery"
        }
        
        transactions = [
            ("Cash Payment (50k)", transaction1),
            ("Split Payment (30k cash + 20k QRIS)", transaction2),
            ("Non-cash Payment (100k GoPay)", transaction3)
        ]
        
        for test_name, transaction_data in transactions:
            try:
                response = requests.post(f"{self.base_url}/transactions", json=transaction_data)
                
                if response.status_code == 200:
                    transaction = response.json()
                    self.transaction_ids.append(transaction['id'])
                    
                    # Validate transaction structure
                    if transaction['cashier_name'] != transaction_data['cashier_name']:
                        self.log_test(f"Create Transaction - {test_name}", False, "Cashier name mismatch")
                    elif transaction['total'] != transaction_data['total']:
                        self.log_test(f"Create Transaction - {test_name}", False, "Total amount mismatch")
                    else:
                        self.log_test(f"Create Transaction - {test_name}", True, f"Transaction created: {transaction['id']}")
                else:
                    self.log_test(f"Create Transaction - {test_name}", False, f"HTTP {response.status_code}: {response.text}")
                    
            except Exception as e:
                self.log_test(f"Create Transaction - {test_name}", False, f"Request failed: {str(e)}")
    
    def test_5_close_shift(self):
        """Test closing the shift with cash reconciliation"""
        print("\n=== Test 5: Close Shift ===")
        
        if not self.shift_id:
            self.log_test("Close Shift", False, "No shift ID available for closing")
            return
        
        # Expected cash calculation:
        # Opening cash: 500,000
        # Cash from Transaction 1: 50,000
        # Cash from Transaction 2: 30,000 (split payment)
        # Cash from Transaction 3: 0 (GoPay only)
        # Expected total: 500,000 + 50,000 + 30,000 = 580,000
        
        close_data = {
            "actual_cash": 580000  # Should have 0 discrepancy
        }
        
        try:
            response = requests.post(f"{self.base_url}/shifts/{self.shift_id}/close", json=close_data)
            
            if response.status_code == 200:
                closed_shift = response.json()
                
                # Validate calculations
                expected_cash = closed_shift.get('expected_cash')
                actual_cash = closed_shift.get('actual_cash')
                discrepancy = closed_shift.get('discrepancy')
                total_sales = closed_shift.get('total_sales')
                
                validation_errors = []
                
                if closed_shift.get('status') != 'closed':
                    validation_errors.append(f"Status should be 'closed', got '{closed_shift.get('status')}'")
                
                if expected_cash != 580000:
                    validation_errors.append(f"Expected cash should be 580000, got {expected_cash}")
                
                if actual_cash != 580000:
                    validation_errors.append(f"Actual cash should be 580000, got {actual_cash}")
                
                if discrepancy != 0:
                    validation_errors.append(f"Discrepancy should be 0, got {discrepancy}")
                
                if total_sales != 200000:  # 50k + 50k + 100k
                    validation_errors.append(f"Total sales should be 200000, got {total_sales}")
                
                if validation_errors:
                    self.log_test("Close Shift", False, f"Validation errors: {'; '.join(validation_errors)}", closed_shift)
                else:
                    self.log_test("Close Shift", True, "Shift closed successfully with correct calculations", {
                        "expected_cash": expected_cash,
                        "actual_cash": actual_cash,
                        "discrepancy": discrepancy,
                        "total_sales": total_sales
                    })
            else:
                self.log_test("Close Shift", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Close Shift", False, f"Request failed: {str(e)}")
    
    def test_6_duplicate_close_prevention(self):
        """Test that closing a shift twice fails"""
        print("\n=== Test 6: Duplicate Close Prevention ===")
        
        if not self.shift_id:
            self.log_test("Duplicate Close Prevention", False, "No shift ID available")
            return
        
        close_data = {
            "actual_cash": 580000
        }
        
        try:
            response = requests.post(f"{self.base_url}/shifts/{self.shift_id}/close", json=close_data)
            
            if response.status_code == 400:
                error_msg = response.json().get('detail', '')
                if "sudah ditutup" in error_msg.lower() or "already closed" in error_msg.lower():
                    self.log_test("Duplicate Close Prevention", True, "Correctly prevented duplicate shift closing")
                else:
                    self.log_test("Duplicate Close Prevention", False, f"Wrong error message: {error_msg}")
            else:
                self.log_test("Duplicate Close Prevention", False, f"Expected 400 error, got {response.status_code}")
                
        except Exception as e:
            self.log_test("Duplicate Close Prevention", False, f"Request failed: {str(e)}")
    
    def test_7_shift_history(self):
        """Test viewing shift history"""
        print("\n=== Test 7: Shift History ===")
        
        try:
            response = requests.get(f"{self.base_url}/shifts")
            
            if response.status_code == 200:
                shifts = response.json()
                
                if not isinstance(shifts, list):
                    self.log_test("Shift History", False, "Response should be a list")
                elif len(shifts) == 0:
                    self.log_test("Shift History", False, "No shifts returned")
                else:
                    # Find our test shift
                    test_shift = None
                    for shift in shifts:
                        if shift.get('id') == self.shift_id:
                            test_shift = shift
                            break
                    
                    if not test_shift:
                        self.log_test("Shift History", False, f"Test shift {self.shift_id} not found in history")
                    elif test_shift.get('status') != 'closed':
                        self.log_test("Shift History", False, f"Test shift status should be 'closed', got '{test_shift.get('status')}'")
                    else:
                        # Check if shifts are sorted by opening_time descending
                        is_sorted = True
                        for i in range(len(shifts) - 1):
                            if shifts[i].get('opening_time', '') < shifts[i + 1].get('opening_time', ''):
                                is_sorted = False
                                break
                        
                        if not is_sorted:
                            self.log_test("Shift History", False, "Shifts not sorted by opening_time descending")
                        else:
                            self.log_test("Shift History", True, f"Shift history retrieved successfully ({len(shifts)} shifts)", {
                                "total_shifts": len(shifts),
                                "test_shift_found": True
                            })
            else:
                self.log_test("Shift History", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("Shift History", False, f"Request failed: {str(e)}")
    
    def test_8_no_active_shift_after_close(self):
        """Test that no active shift exists after closing"""
        print("\n=== Test 8: No Active Shift After Close ===")
        
        try:
            response = requests.get(f"{self.base_url}/shifts/active")
            
            if response.status_code == 200:
                active_shift = response.json()
                
                if active_shift is None:
                    self.log_test("No Active Shift After Close", True, "Correctly returns null for active shift")
                else:
                    self.log_test("No Active Shift After Close", False, f"Active shift still exists: {active_shift.get('id')}")
            else:
                self.log_test("No Active Shift After Close", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test("No Active Shift After Close", False, f"Request failed: {str(e)}")
    
    def run_all_tests(self):
        """Run all shift management tests"""
        print(f"🚀 Starting Shift Management Tests")
        print(f"Backend URL: {self.base_url}")
        print("=" * 60)
        
        # Run tests in sequence
        self.test_1_open_shift()
        self.test_2_duplicate_shift_prevention()
        self.test_3_get_active_shift()
        self.test_4_create_transactions()
        self.test_5_close_shift()
        self.test_6_duplicate_close_prevention()
        self.test_7_shift_history()
        self.test_8_no_active_shift_after_close()
        
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
    tester = ShiftManagementTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed!")
        exit(0)
    else:
        print("\n💥 Some tests failed!")
        exit(1)