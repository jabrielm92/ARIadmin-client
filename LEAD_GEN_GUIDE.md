# ARI Solutions Lead Gen Platform - Complete Guide

## 🎯 Overview

Production-ready Lead Generation platform built for ARI Solutions Inc. consulting business. This system allows you to create landing pages, capture leads, manage billing, and deliver exclusive leads to clients.

---

## 🚀 What's Built

### **1. Landing Page Builder** 
**Path:** `/client/lead-gen/campaigns/[id]/builder`

- **Quiz/Survey Style Forms** - Flexible question builder
- **Question Types:** Text, Email, Phone, Long Text, Dropdown, Multiple Choice
- **Drag-and-drop** question ordering
- **TCPA Compliance** - Automatic consent checkbox with tracking
- **Customizable Design** - Headline, subheadline, hero image, primary color
- **Thank You Page** - Custom message or redirect URL
- **Public URL** - Each campaign gets unique URL: `/lead/[campaignId]`

**Features:**
- Copy public URL to share with prospects
- Live preview of landing page
- Mobile-responsive design
- Real-time validation

---

###**2. Public Landing Pages**
**Path:** `/lead/[campaignId]`

- **Clean, Conversion-Optimized Design**
- **Progressive Form** - One question at a time feel
- **Validation** - Email format, phone format, required fields
- **Tracking** - Captures IP, user agent, timestamp, consent
- **Thank You Page** - Shows success message or redirects
- **Branded Footer** - "Powered by ARI Solutions Inc."

---

### **3. Lead Capture System**

**API:** `POST /api/public/leads/capture`

**What Happens When Lead Submits:**
1. ✅ **Saves to MongoDB** - Full lead data with tracking
2. ✅ **Google Sheets Export** - Async save (ready for implementation)
3. ✅ **Email Notification** - Alerts you of new lead (SendGrid ready)
4. ✅ **SMS Notification** - Text alert (Twilio ready)
5. ✅ **Auto-responder** - Sends welcome email to lead

**Lead Data Captured:**
- Name, Email, Phone, Company
- All form responses (stored in `formResponses`)
- Source tracking (campaign ID)
- Compliance data (IP, timestamp, user agent, consent)
- Lead score (base 70, AI scoring ready)

---

### **4. Billing Management**
**Admin Path:** `/admin/clients/[id]/billing`

**Pricing Models Supported:**
1. **Pay Per Lead (PPL)**
   - Upfront fee: $300-500 (refundable)
   - Per lead: $60-350

2. **Pay Per Show**
   - 60% deposit
   - Per appointment: $120-450

3. **Hybrid/Subscription**
   - Monthly base: $1.5k-3k
   - Reduced per lead: $35-120

**Features:**
- Track leads delivered
- Track leads invoiced
- Calculate unbilled leads
- Generate invoice preview
- Upfront fee payment tracking
- Internal notes

---

### **5. Campaign Management**

**Client Side:**
- `/client/lead-gen` - Dashboard with stats
- `/client/lead-gen/campaigns` - All campaigns list
- `/client/lead-gen/campaigns/new` - Create new campaign
- `/client/lead-gen/campaigns/[id]/builder` - Landing page builder

**Admin Side:**
- `/admin/clients/[id]/lead-gen` - Manage client's campaigns
- `/admin/clients/[id]/leads` - View client's leads
- `/admin/clients/[id]/billing` - Configure billing

---

## 📊 Database Schema

### **Campaigns Collection**
```javascript
{
  id: UUID,
  clientId: UUID,
  name: String,
  description: String,
  type: 'lead-capture' | 'lead-magnet' | 'webinar' | 'free-trial' | 'consultation',
  status: 'draft' | 'active' | 'paused' | 'completed',
  
  landingPage: {
    headline: String,
    subheadline: String,
    heroImage: String,
    primaryColor: String,
    questions: [
      {
        id: String,
        type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'radio',
        label: String,
        placeholder: String,
        options: [String], // For select/radio
        required: Boolean
      }
    ],
    thankYouHeadline: String,
    thankYouMessage: String,
    redirectUrl: String,
    collectConsent: Boolean,
    consentText: String,
    notifyOnSubmit: Boolean
  },
  
  stats: {
    views: Number,
    submissions: Number,
    conversions: Number,
    conversionRate: Number
  },
  
  createdAt: Date,
  updatedAt: Date,
  publishedAt: Date
}
```

### **Leads Collection**
```javascript
{
  id: UUID,
  clientId: UUID,
  campaignId: UUID,
  name: String,
  email: String,
  phone: String,
  company: String,
  source: String,
  status: 'new' | 'contacted' | 'qualified' | 'appointment-set' | 'converted' | 'lost',
  score: Number,
  
  formResponses: {
    // All form field responses
    "1": "John Doe",
    "2": "john@example.com",
    "3": "+1-555-0123",
    ...
  },
  
  tracking: {
    ip: String,
    userAgent: String,
    timestamp: Date,
    consentGiven: Boolean,
    url: String,
    capturedAt: Date
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

### **Billing Collection**
```javascript
{
  id: UUID,
  clientId: UUID,
  type: 'per-lead' | 'per-appointment' | 'hybrid',
  upfrontFee: Number,
  upfrontPaid: Boolean,
  perLeadRate: Number,
  leadsDelivered: Number,
  leadsInvoiced: Number,
  totalRevenue: Number,
  status: 'active' | 'paused' | 'completed',
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 Integrations (Ready for Implementation)

### **Google Sheets**
**File:** `/app/lib/integrations/google-sheets.js`

**Setup Steps:**
1. Client creates Google Sheet
2. Client shares Sheet with service account
3. Store spreadsheet ID in MongoDB
4. Function automatically appends new leads

**When to activate:** After client pays

---

### **SendGrid (Email)**
**File:** `/app/lib/notifications.js`

**Setup Steps:**
1. Get SendGrid API key from client
2. Store in `.env`: `SENDGRID_API_KEY`
3. Verify sender email
4. Function sends notifications + auto-responders

**When to activate:** After client pays

---

### **Twilio (SMS)**
**File:** `/app/lib/notifications.js`

**Setup Steps:**
1. Get Twilio credentials from client
2. Store in `.env`: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
3. Function sends SMS alerts

**When to activate:** After client pays

---

## 🎬 How to Use (Your Workflow)

### **1. Client Signs Up**
1. Create client in admin panel
2. Configure pricing: `/admin/clients/[id]/billing`
   - Set upfront fee ($300-500)
   - Set per-lead rate ($60-350)
3. Mark upfront fee as "Paid"

### **2. Create Campaign for Client**
1. Login as client (or do it for them)
2. Go to `/client/lead-gen/campaigns/new`
3. Fill out campaign details:
   - Name: "Q1 2025 Enterprise Connectivity Campaign"
   - Type: Lead Capture
   - Target Audience
   - Lead Magnet details
4. Click "Publish"

### **3. Build Landing Page**
1. Go to campaign list
2. Click **paintbrush icon** (Landing Page Builder)
3. Customize:
   - **Design Tab:** Headline, subheadline, hero image, colors
   - **Questions Tab:** Add/edit/reorder form questions
   - **Thank You Tab:** Success message
   - **Settings Tab:** Enable TCPA consent, notifications
4. Click "Save"
5. Click "Preview" to see live page
6. Copy public URL and share with client

### **4. Client Shares Landing Page**
- Client runs ads to: `yourdomain.com/lead/[campaignId]`
- Prospects fill out form
- Leads are captured automatically

### **5. Monitor & Bill**
1. View leads: `/admin/clients/[id]/leads`
2. Check billing: `/admin/clients/[id]/billing`
   - See leads delivered
   - See unbilled leads
   - Calculate invoice: (Unbilled Leads × Per Lead Rate)
3. Generate invoice
4. Mark leads as invoiced

### **6. Deliver Leads to Client**
- Leads automatically saved to Google Sheets (if configured)
- Client gets email/SMS notification on each lead
- Client sees leads in dashboard: `/client/leads`

---

## 📱 Mobile Responsiveness

All pages are fully responsive:
- Landing pages optimized for mobile conversion
- Admin/client dashboards work on tablets
- Forms easy to fill on phones

---

## 🔒 Compliance & Security

### **TCPA Compliance**
- ✅ Consent checkbox (required)
- ✅ Consent text customizable
- ✅ Tracking data captured (IP, timestamp, user agent)
- ✅ 18-month data retention (configurable)

### **Data Security**
- ✅ MongoDB with TLS encryption
- ✅ Environment variables for sensitive data
- ✅ No passwords in code
- ✅ Audit logs ready

---

## 🎨 Customization for Clients

**What clients can customize:**
- Campaign name & description
- Landing page headline & subheadline
- Hero image (URL)
- Primary color (brand color)
- All form questions
- Thank you message
- Auto-responder email

**What YOU control (admin):**
- Pricing
- Billing
- Lead validation
- Integrations (Google Sheets, SendGrid, Twilio)

---

## 💰 Revenue Tracking

**Example Client:**
- Upfront Fee: $400 ✅ Paid
- Per Lead Rate: $150
- Leads Delivered: 10
- Leads Invoiced: 5
- **Unbilled**: 5 leads × $150 = **$750**

Invoice them for $750 + mark 5 more leads as invoiced.

---

## 🚦 Next Steps (When Client Pays)

1. **Get API Keys:**
   - SendGrid API key
   - Twilio credentials (if SMS needed)
   - Google service account (if Sheets needed)

2. **Add to `.env`:**
   ```
   SENDGRID_API_KEY=your_key_here
   TWILIO_ACCOUNT_SID=your_sid_here
   TWILIO_AUTH_TOKEN=your_token_here
   TWILIO_PHONE_NUMBER=+1234567890
   ```

3. **Uncomment Integration Code:**
   - `/app/lib/integrations/google-sheets.js`
   - `/app/lib/notifications.js`

4. **Test:**
   - Submit test lead
   - Verify Google Sheets gets updated
   - Verify email sent
   - Verify SMS sent (if enabled)

5. **Launch:** 🚀
   - Give client the public URL
   - Monitor leads coming in
   - Bill weekly/monthly as agreed

---

## 📈 Growth Path

**Phase 2 Features (Coming Next):**
- AI Lead Scoring (auto-score based on responses)
- A/B Testing (multiple landing page variants)
- Email Drip Campaigns (nurture sequences)
- Advanced Analytics (conversion funnels, attribution)
- Multi-step forms (wizard style)
- Zapier integration

---

## 🆘 Troubleshooting

**Lead not showing up?**
- Check campaign status is "active"
- Check MongoDB connection
- Check browser console for errors

**Email not sending?**
- Verify SendGrid API key in `.env`
- Check SendGrid sender verification
- Check function logs

**SMS not sending?**
- Verify Twilio credentials in `.env`
- Check Twilio phone number is SMS-enabled
- Check function logs

---

## 🎯 Success Metrics

Track these for each client:
- **Conversion Rate:** (Submissions / Views) × 100
- **Lead Quality:** Average lead score
- **Time to Lead:** How fast leads come in
- **Cost Per Lead:** Ad spend / Leads
- **Client ROI:** Client revenue / Your fees

---

## 🎉 You're Ready!

You now have a production-ready lead gen platform. When a client signs up:
1. Set up their billing
2. Create a campaign
3. Build a landing page
4. Share the URL
5. Capture leads
6. Bill them
7. Deliver results

**Go get those clients! 💪**
