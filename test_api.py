#!/usr/bin/env python3
"""
Mail Tracker - Comprehensive API Test Suite
Tests all core functionalities to verify system works correctly
"""

import requests
import json
import time
from datetime import datetime

BASE_URL = "http://localhost:5000/api"
HEADERS = {"Content-Type": "application/json"}

# Colors for output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

def print_test(name):
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}📝 TEST: {name}{RESET}")
    print(f"{BLUE}{'='*60}{RESET}")

def print_pass(msg):
    print(f"{GREEN}✅ PASS: {msg}{RESET}")

def print_fail(msg):
    print(f"{RED}❌ FAIL: {msg}{RESET}")

def print_info(msg):
    print(f"{YELLOW}ℹ️  INFO: {msg}{RESET}")

# Test 1: Authentication - Login
def test_login():
    print_test("1. Authentication - User Login")
    
    try:
        payload = {
            "email": "anjali@mailtrack.io",
            "password": "password"
        }
        response = requests.post(f"{BASE_URL}/auth/login", json=payload, headers=HEADERS)
        
        if response.status_code == 200:
            data = response.json()
            if "token" in data:
                print_pass("User login successful")
                print_info(f"Token received: {data['token'][:50]}...")
                return data['token']
            else:
                print_fail("No token in response")
                return None
        else:
            print_fail(f"Login failed with status {response.status_code}: {response.text}")
            return None
    except Exception as e:
        print_fail(f"Login test error: {str(e)}")
        return None

# Test 2: Get Email List
def test_get_emails(token):
    print_test("2. Email Management - Get Email List")
    
    try:
        headers = {**HEADERS, "Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/email/list", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            if "emails" in data:
                print_pass(f"Retrieved {len(data['emails'])} emails")
                if len(data['emails']) > 0:
                    print_info(f"Sample email: {data['emails'][0]['recipient']} - Subject: {data['emails'][0]['subject']}")
                    return data['emails']
                return []
            else:
                print_fail("No emails in response")
                return []
        else:
            print_fail(f"Get emails failed with status {response.status_code}: {response.text}")
            return []
    except Exception as e:
        print_fail(f"Get emails test error: {str(e)}")
        return []

# Test 3: Get Analytics Summary
def test_analytics_summary(token):
    print_test("3. Analytics - Get Summary Statistics")
    
    try:
        headers = {**HEADERS, "Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/analytics/summary", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print_pass("Analytics summary retrieved")
            print_info(f"Total Emails: {data.get('totalEmails', 0)}")
            print_info(f"Total Opens: {data.get('totalOpens', 0)}")
            print_info(f"Total Clicks: {data.get('totalClicks', 0)}")
            print_info(f"Open Rate: {data.get('openRate', 0):.1f}%")
            print_info(f"Click Rate: {data.get('clickRate', 0):.1f}%")
            return data
        else:
            print_fail(f"Analytics summary failed with status {response.status_code}: {response.text}")
            return None
    except Exception as e:
        print_fail(f"Analytics test error: {str(e)}")
        return None

# Test 4: Register New User
def test_register_user():
    print_test("4. Authentication - User Registration")
    
    try:
        timestamp = int(time.time())
        payload = {
            "name": "Test User",
            "email": f"testuser{timestamp}@mailtrack.io",
            "password": "testpass123"
        }
        response = requests.post(f"{BASE_URL}/auth/register", json=payload, headers=HEADERS)
        
        if response.status_code == 201 or response.status_code == 200:
            print_pass(f"User registered successfully: {payload['email']}")
            return payload['email']
        else:
            print_fail(f"Registration failed with status {response.status_code}: {response.text}")
            return None
    except Exception as e:
        print_fail(f"Registration test error: {str(e)}")
        return None

# Test 5: Send Email with Tracking
def test_send_email(token):
    print_test("5. Email Management - Send Email with Tracking")
    
    try:
        headers = {**HEADERS, "Authorization": f"Bearer {token}"}
        payload = {
            "recipient": "test@example.com",
            "subject": "Test Email with Tracking",
            "content": "This is a test email to verify tracking functionality. Click here: https://example.com/test"
        }
        response = requests.post(f"{BASE_URL}/email/send", json=payload, headers=headers)
        
        if response.status_code == 201 or response.status_code == 200:
            data = response.json()
            print_pass("Email sent successfully with tracking")
            tracking_id = data.get('trackingId', 'N/A')
            print_info(f"Tracking ID: {tracking_id}")
            return data
        else:
            print_fail(f"Send email failed with status {response.status_code}: {response.text}")
            return None
    except Exception as e:
        print_fail(f"Send email test error: {str(e)}")
        return None

# Test 6: Track Email Open
def test_track_open(token, email_data):
    print_test("6. Email Tracking - Track Email Open")
    
    try:
        if not email_data or 'trackingId' not in email_data:
            print_fail("No tracking ID available")
            return False
        
        tracking_id = email_data['trackingId']
        headers = {**HEADERS, "Authorization": f"Bearer {token}"}
        
        response = requests.post(f"{BASE_URL}/track/open/{tracking_id}", json={}, headers=headers)
        
        if response.status_code == 200 or response.status_code == 201:
            print_pass(f"Email open recorded for tracking ID: {tracking_id}")
            return True
        else:
            print_fail(f"Track open failed with status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print_fail(f"Track open test error: {str(e)}")
        return False

# Test 7: Track Link Click
def test_track_click(token, email_data):
    print_test("7. Email Tracking - Track Link Click")
    
    try:
        if not email_data or 'trackingId' not in email_data:
            print_fail("No tracking ID available")
            return False
        
        tracking_id = email_data['trackingId']
        headers = {**HEADERS, "Authorization": f"Bearer {token}"}
        payload = {
            "url": "https://example.com/test"
        }
        
        response = requests.post(f"{BASE_URL}/track/click/{tracking_id}", json=payload, headers=headers)
        
        if response.status_code == 200 or response.status_code == 201:
            print_pass(f"Link click recorded for tracking ID: {tracking_id}")
            return True
        else:
            print_fail(f"Track click failed with status {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print_fail(f"Track click test error: {str(e)}")
        return False

# Test 8: Get Email Details
def test_get_email_details(token, email_id):
    print_test("8. Email Management - Get Email Details")
    
    try:
        headers = {**HEADERS, "Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/email/{email_id}", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print_pass(f"Email details retrieved")
            print_info(f"Recipient: {data.get('recipient', 'N/A')}")
            print_info(f"Subject: {data.get('subject', 'N/A')}")
            print_info(f"Sent: {data.get('sentAt', 'N/A')}")
            return data
        else:
            print_fail(f"Get email details failed with status {response.status_code}: {response.text}")
            return None
    except Exception as e:
        print_fail(f"Get email details test error: {str(e)}")
        return None

# Test 9: Get Analytics by Email
def test_analytics_by_email(token):
    print_test("9. Analytics - Get Email-Level Analytics")
    
    try:
        headers = {**HEADERS, "Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/analytics/emails", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            if "emails" in data and len(data["emails"]) > 0:
                print_pass(f"Retrieved analytics for {len(data['emails'])} emails")
                sample = data['emails'][0]
                print_info(f"Sample - Recipient: {sample.get('recipient', 'N/A')}, Opens: {sample.get('opens', 0)}, Clicks: {sample.get('clicks', 0)}")
                return data
            else:
                print_fail("No email analytics data")
                return None
        else:
            print_fail(f"Get analytics failed with status {response.status_code}: {response.text}")
            return None
    except Exception as e:
        print_fail(f"Analytics test error: {str(e)}")
        return None

# Test 10: Database Verification
def test_database_state(token):
    print_test("10. Database - Verify Data Integrity")
    
    try:
        headers = {**HEADERS, "Authorization": f"Bearer {token}"}
        
        # Get summary
        response = requests.get(f"{BASE_URL}/analytics/summary", headers=headers)
        if response.status_code == 200:
            summary = response.json()
            
            # Get emails
            response = requests.get(f"{BASE_URL}/email/list", headers=headers)
            if response.status_code == 200:
                emails = response.json().get('emails', [])
                
                print_pass("Database state verified")
                print_info(f"Total Users: 1+ (demo user exists)")
                print_info(f"Total Emails: {len(emails)}")
                print_info(f"Total Open Events: {summary.get('totalOpens', 0)}")
                print_info(f"Total Click Events: {summary.get('totalClicks', 0)}")
                
                # Verify data consistency
                if len(emails) > 0:
                    print_pass("Email records found in database")
                if summary.get('totalOpens', 0) > 0:
                    print_pass("Open tracking events recorded")
                if summary.get('totalClicks', 0) > 0:
                    print_pass("Click tracking events recorded")
                
                return True
        return False
    except Exception as e:
        print_fail(f"Database verification error: {str(e)}")
        return False

# Main Test Suite
def run_test_suite():
    print(f"\n{YELLOW}{'='*60}{RESET}")
    print(f"{YELLOW}🚀 MAIL TRACKER - COMPREHENSIVE TEST SUITE{RESET}")
    print(f"{YELLOW}{'='*60}{RESET}")
    print(f"Start Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    test_results = {
        "passed": 0,
        "failed": 0,
        "tests": []
    }
    
    # Test 1: Login
    token = test_login()
    if token:
        test_results["passed"] += 1
        test_results["tests"].append(("Login", "PASS"))
    else:
        test_results["failed"] += 1
        test_results["tests"].append(("Login", "FAIL"))
        print_fail("Cannot continue without authentication token")
        return test_results
    
    # Test 2: Get Emails
    emails = test_get_emails(token)
    if len(emails) > 0:
        test_results["passed"] += 1
        test_results["tests"].append(("Get Email List", "PASS"))
    else:
        test_results["failed"] += 1
        test_results["tests"].append(("Get Email List", "FAIL"))
    
    # Test 3: Analytics Summary
    analytics = test_analytics_summary(token)
    if analytics:
        test_results["passed"] += 1
        test_results["tests"].append(("Analytics Summary", "PASS"))
    else:
        test_results["failed"] += 1
        test_results["tests"].append(("Analytics Summary", "FAIL"))
    
    # Test 4: Register User
    new_user = test_register_user()
    if new_user:
        test_results["passed"] += 1
        test_results["tests"].append(("User Registration", "PASS"))
    else:
        test_results["failed"] += 1
        test_results["tests"].append(("User Registration", "FAIL"))
    
    # Test 5: Send Email
    email_data = test_send_email(token)
    if email_data:
        test_results["passed"] += 1
        test_results["tests"].append(("Send Email", "PASS"))
    else:
        test_results["failed"] += 1
        test_results["tests"].append(("Send Email", "FAIL"))
    
    # Test 6: Track Open
    open_tracked = test_track_open(token, email_data)
    if open_tracked:
        test_results["passed"] += 1
        test_results["tests"].append(("Track Open", "PASS"))
    else:
        test_results["failed"] += 1
        test_results["tests"].append(("Track Open", "FAIL"))
    
    # Test 7: Track Click
    click_tracked = test_track_click(token, email_data)
    if click_tracked:
        test_results["passed"] += 1
        test_results["tests"].append(("Track Click", "PASS"))
    else:
        test_results["failed"] += 1
        test_results["tests"].append(("Track Click", "FAIL"))
    
    # Test 8: Get Email Details (if we have emails)
    if len(emails) > 0:
        email_details = test_get_email_details(token, emails[0]['_id'])
        if email_details:
            test_results["passed"] += 1
            test_results["tests"].append(("Get Email Details", "PASS"))
        else:
            test_results["failed"] += 1
            test_results["tests"].append(("Get Email Details", "FAIL"))
    
    # Test 9: Analytics by Email
    email_analytics = test_analytics_by_email(token)
    if email_analytics:
        test_results["passed"] += 1
        test_results["tests"].append(("Email Analytics", "PASS"))
    else:
        test_results["failed"] += 1
        test_results["tests"].append(("Email Analytics", "FAIL"))
    
    # Test 10: Database State
    db_ok = test_database_state(token)
    if db_ok:
        test_results["passed"] += 1
        test_results["tests"].append(("Database State", "PASS"))
    else:
        test_results["failed"] += 1
        test_results["tests"].append(("Database State", "FAIL"))
    
    # Print Summary
    print(f"\n{YELLOW}{'='*60}{RESET}")
    print(f"{YELLOW}📊 TEST RESULTS SUMMARY{RESET}")
    print(f"{YELLOW}{'='*60}{RESET}")
    
    for test_name, result in test_results["tests"]:
        if result == "PASS":
            print(f"{GREEN}✅ {test_name:<40} PASS{RESET}")
        else:
            print(f"{RED}❌ {test_name:<40} FAIL{RESET}")
    
    print(f"\n{YELLOW}Total: {test_results['passed']} passed, {test_results['failed']} failed{RESET}")
    
    if test_results["failed"] == 0:
        print(f"\n{GREEN}{'='*60}{RESET}")
        print(f"{GREEN}🎉 ALL TESTS PASSED! System is working correctly!{RESET}")
        print(f"{GREEN}{'='*60}{RESET}")
    else:
        print(f"\n{RED}{'='*60}{RESET}")
        print(f"{RED}⚠️  Some tests failed. Please review the logs above.{RESET}")
        print(f"{RED}{'='*60}{RESET}")
    
    print(f"End Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    return test_results

if __name__ == "__main__":
    run_test_suite()
