# ADMIN LEAD GEN OPERATIONS GUIDE
## How to Manage Your Lead Gen Consulting Business

---

## 🎯 YOUR ADMIN CONTROL CENTER

### **Access:** `/admin/lead-gen`

This is YOUR command center for managing all lead gen operations across all clients.

---

## 📊 DASHBOARD OVERVIEW

### **Stats You'll See:**
1. **Total Campaigns** - All campaigns across all clients
2. **Leads Delivered** - Total leads you've sold
3. **Total Revenue** - Estimated earnings (leads × avg rate)
4. **Avg Conversion Rate** - Overall performance metric

### **4 Main Tabs:**

#### **1. Overview Tab**
- See pending leads needing review
- View top performing campaigns
- Quick access to clients, leads, analytics

#### **2. All Campaigns Tab**
- Master list of every campaign
- Filter by status (active, paused, draft)
- Search by campaign name or client
- Quick manage access to each campaign

#### **3. Pending Review Tab** ⚠️ CRITICAL
- **New leads awaiting your approval**
- Review before delivery to client
- Approve or reject (quality control)
- Prevents bad leads from reaching clients

#### **4. Analytics Tab**
- Coming in Phase 2
- Performance tracking
- Revenue reports

---

## 🔄 YOUR DAILY WORKFLOW

### **Morning Routine (5-10 minutes)**

1. **Login to Admin** → Navigate to `/admin/lead-gen`

2. **Check Pending Review Tab**
   - New leads captured overnight
   - Review each lead:
     - Valid email? ✅
     - Valid phone? ✅
     - Real company? ✅
     - Meets target profile? ✅
     - Not spam/bot? ✅
   - Click **"Approve & Deliver"** for good leads
   - Click **"Reject"** for invalid leads (spam, fake, duplicate)

3. **Quick Stats Check**
   - Are campaigns performing well? (>20% conversion rate?)
   - Any campaigns with low scores? (<70 avg)
   - Any paused campaigns to restart?

### **What Happens When You Approve a Lead:**
1. Lead status changes to "delivered"
2. Client sees lead in their dashboard
3. Client gets email/SMS notification
4. Lead exported to their Google Sheet
5. **YOU get billed** in billing system (for invoicing)

### **What Happens When You Reject a Lead:**
1. Lead marked as "invalid"
2. NOT delivered to client
3. NOT billed
4. Logged for quality tracking

---

## 💰 BILLING & REVENUE TRACKING

### **After Approving Leads:**

1. Go to `/admin/clients/[id]/billing`
2. System automatically tracks:
   - **Leads Delivered:** Increments by 1
   - **Unbilled Leads:** Shows how many to invoice
3. **Weekly/Monthly:** Generate invoice
4. Mark leads as "invoiced"

### **Example:**
```
Client: Tech Corp
Pricing: $150/lead
Leads delivered this week: 8
Leads previously invoiced: 10
Unbilled leads: 8
Invoice amount: 8 × $150 = $1,200
```

**Action:** Send invoice, mark 8 leads as invoiced

---

## 👥 CLIENT MANAGEMENT

### **For Each Client:**

#### **View Client's Lead Gen** 
Path: `/admin/clients/[id]/lead-gen`

You can:
- See all their campaigns
- View performance stats
- Pause/activate campaigns
- Configure settings (lead limits, notifications)
- Access billing

#### **View Client's Leads**
Path: `/admin/clients/[id]/leads`

You can:
- See all leads delivered to this client
- Check lead quality
- Handle replacement requests
- Export for reports

#### **Configure Billing**
Path: `/admin/clients/[id]/billing`

You can:
- Set pricing (PPL, Pay-Per-Show, Hybrid)
- Track upfront fee payment
- Calculate unbilled leads
- Generate invoice preview
- Add internal notes

---

## 🎬 ONBOARDING NEW CLIENT WORKFLOW

### **Step 1: Contract Signed + Payment Received**
- Use `CLIENT_SERVICE_AGREEMENT.md`
- Get payment (upfront fee)

### **Step 2: Create Client Account**
1. Go to `/admin/clients/new`
2. Fill in business details
3. Create account

### **Step 3: Configure Billing**
1. Go to `/admin/clients/[id]/billing`
2. Select pricing model
3. Set upfront fee: $400
4. Set per-lead rate: $150
5. Mark upfront as "Paid"
6. Save

### **Step 4: Discovery Call**
- Use checklist in `CLIENT_IMPLEMENTATION_CHECKLIST.md`
- Document target customer profile
- Identify pain points & goals

### **Step 5: Build Campaign**

**Option A: Build for Client (Recommended)**
1. Login as yourself (admin)
2. Go to client's account settings
3. Navigate to `/client/lead-gen/campaigns/new` (as client)
4. Create campaign for them
5. Build landing page

**Option B: Guide Client to Build**
1. Send them login credentials
2. Walk through together on screen share
3. They build their own (with your guidance)

### **Step 6: Landing Page Builder**
1. Click paintbrush icon
2. **Design Tab:**
   - Headline: Focus on their value prop
   - Subheadline: Qualification statement
   - Primary color: Their brand color
3. **Questions Tab:**
   - Name, Email, Phone (required)
   - Company (optional but recommended)
   - Qualifying question (budget, need, timeline)
   - Details/Notes
4. **Settings:**
   - Enable TCPA consent
   - Enable notifications
5. Save

### **Step 7: Integrations**
Follow `CLIENT_IMPLEMENTATION_CHECKLIST.md`:
- Google Sheets (if they want)
- SendGrid (email notifications)
- Twilio (SMS notifications - optional)

### **Step 8: Test**
1. Submit test lead
2. Verify it appears in Pending Review
3. Approve it
4. Check client dashboard
5. Check Google Sheets
6. Check email/SMS sent

### **Step 9: Launch**
1. Copy public URL: `yourdomain.com/lead/[campaignId]`
2. Share with client
3. They run ads
4. Leads start flowing!

---

## 🚨 DAILY OPERATIONS

### **Leads Come In → Here's What You Do:**

#### **Morning (9 AM)**
1. Check `/admin/lead-gen` → Pending Review tab
2. Review overnight leads (takes 2-5 min per lead)
3. Approve good ones
4. Reject bad ones

#### **Midday (12 PM)**
1. Quick check for new leads
2. Respond to client questions
3. Monitor campaign performance

#### **Evening (5 PM)**
1. Final lead review
2. Check any alerts
3. Prepare for next day

### **Weekly Tasks (Friday)**
1. Generate invoices for each client
2. Send performance reports
3. Review campaign stats
4. Identify optimization opportunities

### **Monthly Tasks (End of Month)**
1. Send monthly summary to each client
2. Schedule check-in calls
3. Discuss scaling/new campaigns
4. Review renewals

---

## ✅ QUALITY CONTROL CHECKLIST

### **Before Approving a Lead, Verify:**

**Contact Info Valid?**
- [ ] Email format looks real (not throwaway)
- [ ] Phone number has correct format
- [ ] Not obviously fake (555-555-5555)

**Company Info Real?**
- [ ] Company name provided (if required)
- [ ] Matches target industry (if specified)
- [ ] Not competitor (check client's exclusions)

**Form Responses Complete?**
- [ ] All required questions answered
- [ ] Responses make sense (not gibberish)
- [ ] Budget/timeline aligns with target

**Not Spam/Bot?**
- [ ] Human-like responses (not all caps, proper grammar)
- [ ] Time on page >30 seconds (check tracking)
- [ ] Realistic information

**Consent Given?**
- [ ] TCPA checkbox confirmed (see compliance tab)
- [ ] IP address captured
- [ ] Timestamp logged

### **Red Flags (Reject These):**
❌ Email: test@test.com, asdf@asdf.com
❌ Phone: 111-111-1111, 000-000-0000
❌ Company: "N/A", "None", blank
❌ Responses: All caps, gibberish, copy-paste spam
❌ Same lead submitted multiple times (duplicate)
❌ Known competitor
❌ No TCPA consent

---

## 💬 CLIENT COMMUNICATION

### **When Client Complains About Lead Quality:**

1. **Pull Up Lead Detail**
   - Go to `/client/leads/[id]`
   - Show them Form Responses tab
   - Show Compliance tab (TCPA proof)

2. **Assess Validity**
   - Is phone/email actually wrong? → Replace
   - Did they try calling? → Speed-to-lead issue
   - Is lead "not interested"? → Not invalid, just objection

3. **Replacement Policy (Per Contract)**
   **Replace if:**
   - Wrong phone number (disconnected, doesn't exist)
   - Bounced email (invalid address)
   - Duplicate (we sent same lead before)
   - Fraudulent (obvious spam/bot)

   **DO NOT replace if:**
   - Lead says "not interested" after contact
   - Lead outside service area (if not specified)
   - Lead doesn't convert to sale

4. **Issue Replacement**
   - Mark original lead as "invalid"
   - Don't invoice for it
   - Deliver replacement lead when available
   - Document in client notes

---

## 📈 OPTIMIZATION

### **Campaign Performance Review (Weekly)**

**Good Campaign Metrics:**
- Conversion rate: >20%
- Avg lead score: >75
- Lead validity: >85%
- Client satisfaction: High

**If Campaign Underperforming:**

**Low Conversion Rate (<15%):**
- Review landing page copy (too aggressive?)
- Check form length (too many questions?)
- Test different headline
- Simplify questions

**Low Lead Score (<70 avg):**
- Questions not qualifying enough
- Target audience too broad
- Need more qualifying questions

**High Invalid Rate (>15%):**
- Bot traffic issue
- Need better spam filtering
- Questions too easy (bots filling out)

### **Optimization Actions:**
1. A/B test headlines
2. Adjust question order
3. Add/remove qualifying questions
4. Change primary color (conversion psychology)
5. Shorten/lengthen form

---

## 🔥 HOT TIPS

### **Maximize Client Success (= Your Renewals):**

1. **Speed-to-Lead Matters**
   - Remind clients: Call within 5 minutes
   - Leads go cold fast
   - Set up SMS alerts for them

2. **Quality Over Quantity**
   - Better to deliver 10 great leads than 30 mediocre
   - Maintain high standards
   - Reject aggressively

3. **Communicate Performance**
   - Send weekly reports (even if automated)
   - Highlight wins ("3 leads closed this week!")
   - Be proactive with issues

4. **Upsell Opportunities**
   - Client doing well? Suggest second campaign
   - Multiple services? Bundle pricing
   - Happy client? Ask for referral

5. **Track Everything**
   - Client's close rate
   - Their ROI
   - Your lead quality metrics
   - Use data in renewals

---

## 🆘 TROUBLESHOOTING

### **Problem: No Leads Coming In**
**Possible Causes:**
- Campaign status is "paused" or "draft" (activate it)
- Client hasn't launched ads yet
- Landing page URL incorrect
- Form broken (test it yourself)

**Solution:**
- Check campaign status → Set to "active"
- Confirm with client ads are running
- Test landing page submission
- Check logs for errors

---

### **Problem: Too Many Invalid Leads**
**Possible Causes:**
- Bot traffic
- Poor targeting (client's ads)
- Questions too easy

**Solution:**
- Add CAPTCHA (if available)
- Review client's ad targeting
- Add more qualifying questions
- Increase required fields

---

### **Problem: Client Unhappy with Lead Quality**
**Possible Causes:**
- Mismatch on expectations
- Client not following up fast enough
- Questions not aligned with their actual needs

**Solution:**
- Review target customer profile together
- Check client's follow-up speed (>5 min? Problem!)
- Adjust qualifying questions
- Set clearer expectations (not all leads close!)

---

## 💼 SCALING YOUR BUSINESS

### **You Can Handle:**
- **1-3 clients:** Easy, part-time
- **5-10 clients:** Full-time income
- **10+ clients:** Need systems/automation

### **At 5 Clients:**
- ~10-15 leads/day to review (15-20 min/day)
- ~5 invoices/week (30 min/week)
- ~5 weekly reports (1 hour/week)
- **Total: ~2 hours/week operations**

### **At 10 Clients:**
- ~20-30 leads/day (30-40 min/day)
- Consider hiring VA for lead review
- Automate reports
- Raise prices

### **Automation Opportunities:**
- Auto-approve leads >85 score (Phase 4: AI Scoring)
- Automated weekly reports
- Self-service client portal (Phase 6)

---

## 🎯 SUCCESS METRICS

### **Track These:**

**Per Client:**
- Leads delivered/month
- Lead quality (validity %)
- Campaign conversion rate
- Client ROI (their revenue/your fees)
- Renewal likelihood

**Overall Business:**
- Total active campaigns
- Total leads/month
- MRR (Monthly Recurring Revenue)
- Churn rate
- Profit margin

### **Goals:**
- 85%+ lead validity
- 20%+ avg conversion rate
- 3x-5x client ROI minimum
- <10% churn rate
- $10k+ MRR within 6 months

---

## 🚀 YOU'RE IN CONTROL

You now have complete admin control over your lead gen consulting business:

✅ **Review & approve** every lead (quality control)
✅ **Monitor** all campaigns across all clients
✅ **Track billing** and generate invoices
✅ **Manage clients** and their settings
✅ **Optimize** campaigns for better performance
✅ **Scale** to 10+ clients profitably

**Go manage those leads and make that money! 💰**

---

*For technical issues, see: `LEAD_GEN_GUIDE.md`*
*For client onboarding, see: `CLIENT_IMPLEMENTATION_CHECKLIST.md`*
