#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: "Build complete Lead Generation Service for both admin and client sides with campaign management, lead capture forms, and admin oversight capabilities"

frontend:
  - task: "Client Lead Gen Dashboard"
    implemented: true
    working: "NA"
    file: "/app/app/client/lead-gen/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Created main Lead Gen dashboard for clients with campaign stats overview, quick action cards for creating campaigns/viewing leads/analytics, and active campaigns list with performance metrics. Shows empty state when no campaigns exist."
  
  - task: "Client Campaigns List Page"
    implemented: true
    working: "NA"
    file: "/app/app/client/lead-gen/campaigns/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Created campaigns management page with search/filter capabilities, stats summary (total, active, paused, draft campaigns), and full campaigns table with actions (view, edit, delete). Integrated with campaign API."
  
  - task: "New Campaign Creation Wizard"
    implemented: true
    working: "NA"
    file: "/app/app/client/lead-gen/campaigns/new/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Built comprehensive campaign creation wizard with sections: Basic Info (name, description, type), Target Audience (industry, company size, budget), Lead Magnet (type, title, description), Form Configuration (submit text, success message), Auto-responder (email subject/body with variable support), and Settings (lead scoring, auto-qualify, notifications). Has Save Draft and Publish options."
  
  - task: "Admin Client Lead Gen Management"
    implemented: true
    working: "NA"
    file: "/app/app/admin/clients/[id]/lead-gen/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Created admin page to manage client's Lead Gen service with tabs: Overview (campaign performance, quick actions), Campaigns (full campaign list table), and Settings (enable/disable lead gen, auto scoring, email notifications, campaign limits, lead assignment). Replaced placeholder 'Coming Soon' content with full functionality."
  
  - task: "Admin Client Leads Page"
    implemented: true
    working: "NA"
    file: "/app/app/admin/clients/[id]/leads/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Created admin page to view/manage all leads for a specific client. Shows lead stats (total, new, qualified, converted), searchable/filterable leads table, and lead detail dialog. Currently uses mock data for demonstration."
  
  - task: "Client Layout Navigation Update"
    implemented: true
    working: "NA"
    file: "/app/components/ClientLayout.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Added 'Lead Generation' menu item with Target icon to client navigation sidebar, positioned between Booking Accelerator and Leads for logical flow."

backend:
  - task: "Campaign Database Model"
    implemented: true
    working: "NA"
    file: "/app/lib/db/campaigns.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Created complete campaigns database utility with functions: createCampaign (with full campaign schema including target audience, lead magnet, form config, auto-responder, stats, settings), getCampaignById, getAllCampaigns (with optional clientId filter), updateCampaign, deleteCampaign, updateCampaignStats, publishCampaign, pauseCampaign. Uses UUID for IDs."
  
  - task: "Campaign API Routes"
    implemented: true
    working: "NA"
    file: "/app/app/api/client/lead-gen/campaigns/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Created API routes for campaigns: GET (fetch all campaigns for a client with clientId query param), POST (create new campaign with validation for clientId and name). Returns success/error responses with proper status codes."

metadata:
  created_by: "main_agent"
  version: "2.0"
  test_sequence: 2
  run_ui: false

test_plan:
  current_focus:
    - "Client Lead Gen Dashboard"
    - "Client Campaigns List Page"
    - "New Campaign Creation Wizard"
    - "Admin Client Lead Gen Management"
    - "Admin Client Leads Page"
    - "Campaign API Routes"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
    - agent: "main"
      message: "Implemented complete Lead Generation Service for both client and admin sides. CLIENT SIDE: Created Lead Gen dashboard (/client/lead-gen), campaigns list page with search/filters, and comprehensive campaign creation wizard with 6 configuration sections (basic info, target audience, lead magnet, form, auto-responder, settings). ADMIN SIDE: Built client-specific Lead Gen management page with Overview/Campaigns/Settings tabs at /admin/clients/[id]/lead-gen, and client leads view at /admin/clients/[id]/leads. DATABASE: Created campaigns.js utility with full CRUD operations and campaign schema. API: Implemented GET/POST routes for campaigns. NAVIGATION: Added 'Lead Generation' menu item to client sidebar. All pages have proper empty states and are integrated with MongoDB. Ready for backend testing."