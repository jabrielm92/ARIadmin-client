# Vapi.ai Virtual Receptionist Setup Guide
## ARI Solutions Inc. - Complete Integration Instructions

---

## **STEP 1: Sign up for Vapi.ai Account**

1. Go to https://vapi.ai
2. Click "Sign Up" and create your free account
3. You'll get 10 free minutes per month on the free tier
4. After signup, you'll be redirected to the dashboard

---

## **STEP 2: Get Your API Keys**

1. In the Vapi dashboard, click on your profile/settings (usually top right)
2. Navigate to "API Keys" section
3. Copy these two keys (you'll need them later):
   - **Public Key** (starts with something like `pk_...`)
   - **Private Token** (starts with something like `sk_...`)
4. Keep these safe - you'll add them to your .env file

---

## **STEP 3: Create Your AI Assistant**

1. In Vapi dashboard, go to "Assistants"
2. Click "Create Assistant" button
3. Fill in the configuration:

### Basic Settings:
- **Name**: "Phone Receptionist"
- **Model**: Select "OpenAI" → "gpt-4-turbo"
- **Temperature**: 0.7
- **Voice Provider**: "OpenAI"
- **Voice ID**: "alloy" (or choose another voice)

### First Message:
```
Hello! Thank you for calling. I'm your AI receptionist. How can I help you today?
```

### System Prompt:
```
You are a professional and friendly AI phone receptionist. Your job is to:
1. Answer calls politely and professionally
2. Take messages for the team
3. Book appointments when requested
4. Qualify leads by asking about their needs, budget, and timeline
5. Generate quotes based on service requirements

Always be helpful, concise, and professional. Collect relevant information from callers including name, email, phone number, and specific needs. If they want to book an appointment, use the check_availability and book_appointment functions. If they need a quote, use the generate_quote function.

After collecting information, summarize what you've learned and confirm next steps with the caller.
```

### Analysis Configuration:
Scroll down to "Analysis Plan" section and configure:

**Summary Prompt**:
```
Provide a concise summary of this call, highlighting key points discussed, any actions taken, and follow-up items.
```

**Structured Data Schema** (This extracts lead information):
```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string", "description": "The caller's full name" },
    "email": { "type": "string", "description": "The caller's email address" },
    "phone": { "type": "string", "description": "The caller's phone number" },
    "company": { "type": "string", "description": "The caller's company name" },
    "interest": { "type": "string", "description": "What product or service the caller is interested in" },
    "budget": { "type": "string", "description": "The caller's budget range" },
    "timeline": { "type": "string", "description": "When the caller needs the product or service" },
    "leadQuality": { "type": "string", "enum": ["hot", "warm", "cold"], "description": "Assessment of lead quality" },
    "notes": { "type": "string", "description": "Any additional important information" }
  }
}
```

### Function Tools:
Add three functions that the AI can use during calls:

**Function 1: check_availability**
```json
{
  "name": "check_availability",
  "description": "Check available appointment slots",
  "parameters": {
    "type": "object",
    "properties": {
      "date": { "type": "string", "description": "Date to check (YYYY-MM-DD)" },
      "service": { "type": "string", "description": "Service type needed" }
    },
    "required": ["date"]
  }
}
```

**Function 2: book_appointment**
```json
{
  "name": "book_appointment",
  "description": "Book an appointment",
  "parameters": {
    "type": "object",
    "properties": {
      "date": { "type": "string", "description": "Appointment date (YYYY-MM-DD)" },
      "time": { "type": "string", "description": "Appointment time (e.g., '10:00 AM')" },
      "name": { "type": "string", "description": "Customer name" },
      "email": { "type": "string", "description": "Customer email" },
      "phone": { "type": "string", "description": "Customer phone number" },
      "service": { "type": "string", "description": "Service requested" }
    },
    "required": ["date", "time", "name"]
  }
}
```

**Function 3: generate_quote**
```json
{
  "name": "generate_quote",
  "description": "Generate a price quote",
  "parameters": {
    "type": "object",
    "properties": {
      "service": { "type": "string", "description": "Service type (standard, premium, etc.)" },
      "quantity": { "type": "number", "description": "Quantity or scope" },
      "requirements": { "type": "string", "description": "Specific requirements" }
    },
    "required": ["service"]
  }
}
```

4. **IMPORTANT**: After creating the assistant, copy the **Assistant ID** - you'll need this!

---

## **STEP 4: Configure Webhook (For Production)**

1. In your assistant settings, find "Server URL" field
2. For now, leave it blank (we'll set it up after deployment)
3. When deploying to production, set it to: `https://your-domain.com/api/vapi/webhook`

For local testing with ngrok:
- Install ngrok: `npm install -g ngrok`
- Run: `ngrok http 3000`
- Copy the ngrok URL
- Set Server URL to: `https://your-ngrok-url.ngrok.io/api/vapi/webhook`

---

## **STEP 5: Add Keys to Your Application**

Create or update `/app/.env.local` file:
```
# Vapi.ai Configuration
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_public_key_here
VAPI_PRIVATE_TOKEN=your_private_token_here
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_assistant_id_here
```

**CRITICAL**: 
- Replace `your_public_key_here` with your actual public key from Step 2
- Replace `your_private_token_here` with your actual private token from Step 2
- Replace `your_assistant_id_here` with your assistant ID from Step 3

---

## **STEP 6: Install Dependencies**

Run in your terminal:
```bash
cd /app
yarn add @vapi-ai/web @vapi-ai/server-sdk date-fns
```

---

## **STEP 7: Testing Your Setup**

### For Quick Test (Browser):
1. The receptionist component will be available in the client portal
2. Clients can click "Test Call" to make a test call from their browser
3. Make sure to allow microphone permissions

### For Real Phone Calls:
1. You need to purchase a phone number from Vapi
2. In Vapi dashboard, go to "Phone Numbers"
3. Purchase a number (costs vary by country)
4. Assign the number to your assistant
5. Now people can call that number and talk to your AI receptionist!

---

## **COST BREAKDOWN**

### Free Tier:
- 10 minutes of call time per month
- Perfect for testing and demos

### Paid Usage:
- ~$0.05 per minute of call time
- Phone number: ~$2-5/month (varies by country)
- For a demo, 10 free minutes is enough for 5-10 test calls

### Example Cost for Real Client:
- Phone number: $3/month
- 200 minutes of calls: $10/month
- **Total: ~$13/month per client**

---

## **HOW IT WORKS**

1. **Client calls the number** → Vapi answers
2. **AI talks to caller** → Collects info, books appointments, gives quotes
3. **Call ends** → Vapi sends webhook with:
   - Full transcript
   - Extracted lead data (name, email, interest, etc.)
   - Call summary
4. **Your platform receives data** → Stores in MongoDB
5. **Client sees everything** → In their portal dashboard

---

## **WHAT YOU'LL SEE IN THE PORTAL**

After calls come in:
- **Leads Page**: All captured leads with contact info
- **Calls Page**: Full transcripts and summaries
- **Appointments Page**: Booked appointments
- **Analytics**: Call volume, lead quality, conversion rates

---

## **CUSTOMIZATION OPTIONS**

### Change Voice:
- In Vapi assistant settings, try different voices
- Options: alloy, echo, fable, onyx, nova, shimmer (OpenAI voices)
- Or use ElevenLabs for ultra-realistic voices (costs more)

### Customize Responses:
- Edit the System Prompt to match your business style
- Add specific information about your services/pricing
- Train it on your FAQs

### Add More Functions:
- Check inventory
- Process payments
- Send SMS/email
- Update CRM
- And more!

---

## **TROUBLESHOOTING**

**Call won't connect:**
- Check microphone permissions in browser
- Verify VAPI_PUBLIC_KEY is correct in .env.local
- Check browser console for errors

**Webhook not working:**
- Make sure ngrok is running (for local testing)
- Verify Server URL is set correctly in Vapi assistant
- Check your backend logs for webhook errors

**AI not understanding:**
- Make System Prompt more specific
- Add example conversations
- Adjust temperature (lower = more consistent, higher = more creative)

---

## **NEXT STEPS AFTER DEMO**

1. **Get feedback** from test calls
2. **Refine the prompts** based on what works
3. **Purchase a real phone number** for the client
4. **Deploy to production** with proper webhook URL
5. **Monitor and optimize** based on call analytics

---

## **SUPPORT**

- Vapi Documentation: https://docs.vapi.ai
- Vapi Discord Community: https://discord.gg/vapi (great for quick questions)
- This platform support: [Your support contact]

---

**You're all set! 🎉**

The code implementation is already done. Just follow these steps to set up your Vapi account, get the keys, and you'll have a working AI phone receptionist!
