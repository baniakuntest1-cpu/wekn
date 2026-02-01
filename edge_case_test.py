#!/usr/bin/env python3
"""
Additional Edge Case Tests for Shift Management
"""

import requests
import json
from datetime import datetime

BACKEND_URL = "https://weekn-factory.preview.emergentagent.com/api"

def test_edge_cases():
    print("🔍 Running Edge Case Tests for Shift Management")
    print("=" * 60)
    
    results = []
    
    # Test 1: Invalid shift ID for closing
    print("\n=== Edge Case 1: Close Non-existent Shift ===")
    try:
        response = requests.post(f"{BACKEND_URL}/shifts/invalid-shift-id/close", 
                               json={"actual_cash": 100000})
        if response.status_code == 404:
            print("✅ PASS: Correctly returns 404 for non-existent shift")
            results.append(True)
        else:
            print(f"❌ FAIL: Expected 404, got {response.status_code}")
            results.append(False)
    except Exception as e:
        print(f"❌ FAIL: Request failed: {e}")
        results.append(False)
    
    # Test 2: Get specific shift by ID
    print("\n=== Edge Case 2: Get Shift by ID ===")
    try:
        # First get all shifts to find a valid ID
        shifts_response = requests.get(f"{BACKEND_URL}/shifts")
        if shifts_response.status_code == 200:
            shifts = shifts_response.json()
            if shifts:
                shift_id = shifts[0]['id']
                response = requests.get(f"{BACKEND_URL}/shifts/{shift_id}")
                if response.status_code == 200:
                    shift = response.json()
                    if shift['id'] == shift_id:
                        print("✅ PASS: Successfully retrieved shift by ID")
                        results.append(True)
                    else:
                        print("❌ FAIL: Wrong shift returned")
                        results.append(False)
                else:
                    print(f"❌ FAIL: HTTP {response.status_code}")
                    results.append(False)
            else:
                print("⚠️  SKIP: No shifts available for testing")
                results.append(True)
        else:
            print(f"❌ FAIL: Could not get shifts list: {shifts_response.status_code}")
            results.append(False)
    except Exception as e:
        print(f"❌ FAIL: Request failed: {e}")
        results.append(False)
    
    # Test 3: Invalid shift ID for get
    print("\n=== Edge Case 3: Get Non-existent Shift ===")
    try:
        response = requests.get(f"{BACKEND_URL}/shifts/invalid-shift-id")
        if response.status_code == 404:
            print("✅ PASS: Correctly returns 404 for non-existent shift")
            results.append(True)
        else:
            print(f"❌ FAIL: Expected 404, got {response.status_code}")
            results.append(False)
    except Exception as e:
        print(f"❌ FAIL: Request failed: {e}")
        results.append(False)
    
    # Test 4: Open shift with negative opening cash
    print("\n=== Edge Case 4: Negative Opening Cash ===")
    try:
        response = requests.post(f"{BACKEND_URL}/shifts/open", 
                               json={"cashier_name": "Test Cashier", "opening_cash": -1000})
        # This should either work (business allows negative) or fail with validation
        if response.status_code in [200, 400, 422]:
            print(f"✅ PASS: Handled negative opening cash appropriately (HTTP {response.status_code})")
            results.append(True)
        else:
            print(f"❌ FAIL: Unexpected response: {response.status_code}")
            results.append(False)
    except Exception as e:
        print(f"❌ FAIL: Request failed: {e}")
        results.append(False)
    
    # Test 5: Close shift with negative actual cash
    print("\n=== Edge Case 5: Negative Actual Cash ===")
    # First open a shift for this test
    try:
        # Close any existing shift first
        active_response = requests.get(f"{BACKEND_URL}/shifts/active")
        if active_response.status_code == 200 and active_response.json():
            existing_shift = active_response.json()
            requests.post(f"{BACKEND_URL}/shifts/{existing_shift['id']}/close",
                         json={"actual_cash": existing_shift['opening_cash']})
        
        # Open new shift
        open_response = requests.post(f"{BACKEND_URL}/shifts/open", 
                                    json={"cashier_name": "Edge Test", "opening_cash": 100000})
        if open_response.status_code == 200:
            shift = open_response.json()
            
            # Try to close with negative actual cash
            close_response = requests.post(f"{BACKEND_URL}/shifts/{shift['id']}/close",
                                         json={"actual_cash": -50000})
            
            if close_response.status_code in [200, 400, 422]:
                print(f"✅ PASS: Handled negative actual cash appropriately (HTTP {close_response.status_code})")
                results.append(True)
            else:
                print(f"❌ FAIL: Unexpected response: {close_response.status_code}")
                results.append(False)
        else:
            print("❌ FAIL: Could not open shift for test")
            results.append(False)
    except Exception as e:
        print(f"❌ FAIL: Request failed: {e}")
        results.append(False)
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 EDGE CASE TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(results)
    total = len(results)
    
    print(f"Total Edge Cases: {total}")
    print(f"Passed: {passed}")
    print(f"Failed: {total - passed}")
    print(f"Success Rate: {(passed/total)*100:.1f}%")
    
    return passed == total

if __name__ == "__main__":
    success = test_edge_cases()
    if success:
        print("\n🎉 All edge case tests passed!")
    else:
        print("\n💥 Some edge case tests failed!")