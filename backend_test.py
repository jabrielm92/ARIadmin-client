#!/usr/bin/env python3
"""
Backend Test Suite for Lead Generation Service
Tests Campaign API endpoints and database functions
"""

import requests
import json
import uuid
import time
from datetime import datetime

# Configuration
BASE_URL = "https://clienthub-39.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

class LeadGenBackendTester:
    def __init__(self):
        self.test_client_id = str(uuid.uuid4())
        self.created_campaigns = []
        self.test_results = {
            "total_tests": 0,
            "passed": 0,
            "failed": 0,
            "errors": []
        }
    
    def log_test(self, test_name, passed, message=""):
        """Log test result"""
        self.test_results["total_tests"] += 1
        if passed:
            self.test_results["passed"] += 1
            print(f"✅ {test_name}: PASSED {message}")
        else:
            self.test_results["failed"] += 1
            self.test_results["errors"].append(f"{test_name}: {message}")
            print(f"❌ {test_name}: FAILED {message}")
    
    def test_create_campaign_success(self):
        """Test creating a campaign with all required fields"""
        print("\n=== Testing Campaign Creation (Success) ===")
        
        campaign_data = {
            "clientId": self.test_client_id,
            "name": "Test Lead Capture Campaign",
            "description": "A test campaign for lead capture",
            "type": "lead-capture",
            "targetAudience": {
                "industry": "Technology",
                "companySize": "50-200",
                "budget": "10000-50000"
            },
            "leadMagnet": {
                "type": "ebook",
                "title": "Ultimate Guide to Lead Generation",
                "description": "Comprehensive guide to generating quality leads"
            },
            "form": {
                "fields": ["name", "email", "company"],
                "submitText": "Get My Free Guide",
                "successMessage": "Thank you! Check your email for the guide."
            },
            "autoResponder": {
                "enabled": True,
                "subject": "Your Free Guide is Here!",
                "body": "Hi {{name}}, thanks for downloading our guide..."
            },
            "settings": {
                "leadScoring": True,
                "autoQualify": False,
                "notifyOnSubmit": True
            }
        }
        
        try:
            response = requests.post(
                f"{API_BASE}/client/lead-gen/campaigns",
                json=campaign_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "campaign" in data:
                    campaign = data["campaign"]
                    self.created_campaigns.append(campaign["id"])
                    
                    # Verify campaign structure
                    required_fields = ["id", "clientId", "name", "description", "type", "status", 
                                     "targetAudience", "form", "autoResponder", "stats", "settings", 
                                     "createdAt", "updatedAt"]
                    
                    missing_fields = [field for field in required_fields if field not in campaign]
                    if missing_fields:
                        self.log_test("Create Campaign - Schema Validation", False, 
                                    f"Missing fields: {missing_fields}")
                    else:
                        # Verify UUID format
                        try:
                            uuid.UUID(campaign["id"])
                            self.log_test("Create Campaign - Success", True, 
                                        f"Campaign created with ID: {campaign['id']}")
                        except ValueError:
                            self.log_test("Create Campaign - UUID Validation", False, 
                                        f"Invalid UUID format: {campaign['id']}")
                else:
                    self.log_test("Create Campaign - Response Format", False, 
                                f"Invalid response format: {data}")
            else:
                self.log_test("Create Campaign - HTTP Status", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("Create Campaign - Network Error", False, str(e))
        except Exception as e:
            self.log_test("Create Campaign - Unexpected Error", False, str(e))
    
    def test_create_campaign_missing_fields(self):
        """Test creating campaign with missing required fields"""
        print("\n=== Testing Campaign Creation (Missing Fields) ===")
        
        # Test missing clientId
        try:
            response = requests.post(
                f"{API_BASE}/client/lead-gen/campaigns",
                json={"name": "Test Campaign"},
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 400:
                data = response.json()
                if not data.get("success") and "error" in data:
                    self.log_test("Create Campaign - Missing ClientId Validation", True, 
                                "Correctly rejected missing clientId")
                else:
                    self.log_test("Create Campaign - Missing ClientId Response", False, 
                                f"Unexpected response format: {data}")
            else:
                self.log_test("Create Campaign - Missing ClientId Status", False, 
                            f"Expected 400, got {response.status_code}")
                
        except Exception as e:
            self.log_test("Create Campaign - Missing ClientId Error", False, str(e))
        
        # Test missing name
        try:
            response = requests.post(
                f"{API_BASE}/client/lead-gen/campaigns",
                json={"clientId": self.test_client_id},
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 400:
                data = response.json()
                if not data.get("success") and "error" in data:
                    self.log_test("Create Campaign - Missing Name Validation", True, 
                                "Correctly rejected missing name")
                else:
                    self.log_test("Create Campaign - Missing Name Response", False, 
                                f"Unexpected response format: {data}")
            else:
                self.log_test("Create Campaign - Missing Name Status", False, 
                            f"Expected 400, got {response.status_code}")
                
        except Exception as e:
            self.log_test("Create Campaign - Missing Name Error", False, str(e))
    
    def test_get_campaigns_success(self):
        """Test fetching campaigns for a client"""
        print("\n=== Testing Get Campaigns (Success) ===")
        
        try:
            response = requests.get(
                f"{API_BASE}/client/lead-gen/campaigns?clientId={self.test_client_id}",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "campaigns" in data:
                    campaigns = data["campaigns"]
                    if isinstance(campaigns, list):
                        if len(campaigns) > 0:
                            # Verify we get our created campaign
                            found_campaign = any(c["id"] in self.created_campaigns for c in campaigns)
                            if found_campaign:
                                self.log_test("Get Campaigns - Success", True, 
                                            f"Retrieved {len(campaigns)} campaigns")
                            else:
                                self.log_test("Get Campaigns - Data Consistency", False, 
                                            "Created campaign not found in results")
                        else:
                            self.log_test("Get Campaigns - Empty Result", True, 
                                        "No campaigns found (valid empty result)")
                    else:
                        self.log_test("Get Campaigns - Response Type", False, 
                                    f"Expected array, got {type(campaigns)}")
                else:
                    self.log_test("Get Campaigns - Response Format", False, 
                                f"Invalid response format: {data}")
            else:
                self.log_test("Get Campaigns - HTTP Status", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Get Campaigns - Error", False, str(e))
    
    def test_get_campaigns_missing_client_id(self):
        """Test fetching campaigns without clientId parameter"""
        print("\n=== Testing Get Campaigns (Missing ClientId) ===")
        
        try:
            response = requests.get(
                f"{API_BASE}/client/lead-gen/campaigns",
                timeout=10
            )
            
            if response.status_code == 400:
                data = response.json()
                if not data.get("success") and "error" in data:
                    self.log_test("Get Campaigns - Missing ClientId Validation", True, 
                                "Correctly rejected missing clientId parameter")
                else:
                    self.log_test("Get Campaigns - Missing ClientId Response", False, 
                                f"Unexpected response format: {data}")
            else:
                self.log_test("Get Campaigns - Missing ClientId Status", False, 
                            f"Expected 400, got {response.status_code}")
                
        except Exception as e:
            self.log_test("Get Campaigns - Missing ClientId Error", False, str(e))
    
    def test_get_campaigns_nonexistent_client(self):
        """Test fetching campaigns for non-existent client"""
        print("\n=== Testing Get Campaigns (Non-existent Client) ===")
        
        fake_client_id = str(uuid.uuid4())
        
        try:
            response = requests.get(
                f"{API_BASE}/client/lead-gen/campaigns?clientId={fake_client_id}",
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "campaigns" in data:
                    campaigns = data["campaigns"]
                    if isinstance(campaigns, list) and len(campaigns) == 0:
                        self.log_test("Get Campaigns - Non-existent Client", True, 
                                    "Correctly returned empty array for non-existent client")
                    else:
                        self.log_test("Get Campaigns - Non-existent Client Data", False, 
                                    f"Expected empty array, got {len(campaigns)} campaigns")
                else:
                    self.log_test("Get Campaigns - Non-existent Client Response", False, 
                                f"Invalid response format: {data}")
            else:
                self.log_test("Get Campaigns - Non-existent Client Status", False, 
                            f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Get Campaigns - Non-existent Client Error", False, str(e))
    
    def test_campaign_types(self):
        """Test creating campaigns with different types"""
        print("\n=== Testing Different Campaign Types ===")
        
        campaign_types = ["lead-capture", "lead-magnet", "webinar", "free-trial", "consultation"]
        
        for campaign_type in campaign_types:
            try:
                campaign_data = {
                    "clientId": self.test_client_id,
                    "name": f"Test {campaign_type.title()} Campaign",
                    "description": f"Test campaign for {campaign_type}",
                    "type": campaign_type
                }
                
                response = requests.post(
                    f"{API_BASE}/client/lead-gen/campaigns",
                    json=campaign_data,
                    headers={"Content-Type": "application/json"},
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("success") and "campaign" in data:
                        campaign = data["campaign"]
                        if campaign["type"] == campaign_type:
                            self.created_campaigns.append(campaign["id"])
                            self.log_test(f"Create Campaign - Type {campaign_type}", True, 
                                        f"Successfully created {campaign_type} campaign")
                        else:
                            self.log_test(f"Create Campaign - Type {campaign_type} Validation", False, 
                                        f"Expected type {campaign_type}, got {campaign['type']}")
                    else:
                        self.log_test(f"Create Campaign - Type {campaign_type} Response", False, 
                                    f"Invalid response: {data}")
                else:
                    self.log_test(f"Create Campaign - Type {campaign_type} Status", False, 
                                f"Status: {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"Create Campaign - Type {campaign_type} Error", False, str(e))
    
    def test_integration_flow(self):
        """Test complete integration flow: create campaign then fetch it"""
        print("\n=== Testing Integration Flow ===")
        
        # Create a specific campaign for integration test
        integration_client_id = str(uuid.uuid4())
        
        try:
            # Step 1: Create campaign
            campaign_data = {
                "clientId": integration_client_id,
                "name": "Integration Test Campaign",
                "description": "Campaign for integration testing",
                "type": "lead-magnet"
            }
            
            create_response = requests.post(
                f"{API_BASE}/client/lead-gen/campaigns",
                json=campaign_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if create_response.status_code != 200:
                self.log_test("Integration - Create Step", False, 
                            f"Create failed with status {create_response.status_code}")
                return
            
            create_data = create_response.json()
            if not create_data.get("success"):
                self.log_test("Integration - Create Success", False, 
                            f"Create returned success=false: {create_data}")
                return
            
            created_campaign_id = create_data["campaign"]["id"]
            
            # Step 2: Fetch campaigns for the client
            time.sleep(1)  # Brief delay to ensure data consistency
            
            get_response = requests.get(
                f"{API_BASE}/client/lead-gen/campaigns?clientId={integration_client_id}",
                timeout=10
            )
            
            if get_response.status_code != 200:
                self.log_test("Integration - Fetch Step", False, 
                            f"Fetch failed with status {get_response.status_code}")
                return
            
            get_data = get_response.json()
            if not get_data.get("success"):
                self.log_test("Integration - Fetch Success", False, 
                            f"Fetch returned success=false: {get_data}")
                return
            
            # Step 3: Verify the created campaign appears in the list
            campaigns = get_data["campaigns"]
            found_campaign = next((c for c in campaigns if c["id"] == created_campaign_id), None)
            
            if found_campaign:
                # Verify campaign data integrity
                if (found_campaign["name"] == campaign_data["name"] and 
                    found_campaign["clientId"] == integration_client_id and
                    found_campaign["type"] == campaign_data["type"]):
                    self.log_test("Integration - Complete Flow", True, 
                                "Successfully created and retrieved campaign with correct data")
                else:
                    self.log_test("Integration - Data Integrity", False, 
                                "Campaign data doesn't match between create and fetch")
            else:
                self.log_test("Integration - Campaign Retrieval", False, 
                            "Created campaign not found in fetch results")
                
        except Exception as e:
            self.log_test("Integration - Flow Error", False, str(e))
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Lead Generation Service Backend Tests")
        print(f"Testing against: {API_BASE}")
        print(f"Test Client ID: {self.test_client_id}")
        
        # Run all test methods
        self.test_create_campaign_success()
        self.test_create_campaign_missing_fields()
        self.test_get_campaigns_success()
        self.test_get_campaigns_missing_client_id()
        self.test_get_campaigns_nonexistent_client()
        self.test_campaign_types()
        self.test_integration_flow()
        
        # Print summary
        print("\n" + "="*60)
        print("📊 TEST SUMMARY")
        print("="*60)
        print(f"Total Tests: {self.test_results['total_tests']}")
        print(f"Passed: {self.test_results['passed']}")
        print(f"Failed: {self.test_results['failed']}")
        
        if self.test_results['failed'] > 0:
            print("\n❌ FAILED TESTS:")
            for error in self.test_results['errors']:
                print(f"  - {error}")
        
        success_rate = (self.test_results['passed'] / self.test_results['total_tests']) * 100
        print(f"\nSuccess Rate: {success_rate:.1f}%")
        
        if success_rate >= 80:
            print("🎉 Backend tests mostly successful!")
        elif success_rate >= 60:
            print("⚠️  Backend has some issues that need attention")
        else:
            print("🚨 Backend has significant issues requiring fixes")
        
        return self.test_results

if __name__ == "__main__":
    tester = LeadGenBackendTester()
    results = tester.run_all_tests()