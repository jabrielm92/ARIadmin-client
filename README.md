# ARI Solutions - Client Management Platform

A comprehensive admin dashboard and client management platform for managing AI Virtual Receptionist and Appointment Booking Accelerator services.

## 🎯 Overview

This platform enables ARI Solutions to:
- **Manage Multiple Clients**: Add, edit, and track clients across various industries
- **Configure AI Receptionists**: Set up voice AI assistants with custom knowledge bases
- **Setup Booking Accelerators**: Create landing pages and lead capture systems
- **Client Portal**: Allow clients to view their analytics and manage settings
- **Analytics Dashboard**: Track calls, appointments, leads, and revenue

## 🚀 Features Implemented (Phase 1)

### ✅ Admin Dashboard
- **Admin Authentication**: Secure login with Firebase Auth
- **Dashboard Overview**: View key metrics and stats
  - Total clients
  - Active AI receptionists
  - Appointments booked
  - Monthly revenue
  - Calls handled
  - Average call duration
- **Quick Actions**: Fast access to common tasks
- **Recent Activity**: Track latest updates

### ✅ Client Management
- **Client List View**: 
  - Searchable and filterable table
  - View all clients with their details
  - See which services are enabled (AI Receptionist, ABA)
  - Status indicators (active, inactive, suspended)
- **Add New Client**:
  - Business information (name, industry, website)
  - Contact details (email, phone, address)
  - Point of contact information
  - Service selection (AI Receptionist, Booking Accelerator)
  - Billing information
  - Internal notes
- **Edit Client**:
  - Update all client information
  - Toggle services on/off
  - Change client status
  - Delete client (with confirmation)

### 🎨 Beautiful UI
- Modern, professional design with ARI Solutions branding
- Responsive layout (mobile, tablet, desktop)
- Collapsible sidebar navigation
- Card-based layouts
- Color-coded stats and badges
- Smooth transitions and animations

## 📋 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Firebase/Firestore (with mock data fallback)
- **Authentication**: Firebase Auth
- **Icons**: Lucide React
- **Hosting**: Vercel

## 🔧 Setup Instructions

### 1. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it "ARI Solutions" (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create project"

#### Enable Authentication
1. In Firebase Console, go to **Build > Authentication**
2. Click "Get started"
3. Enable **Email/Password** sign-in method
4. Click "Save"

#### Create Admin User
1. In Authentication tab, click "Add user"
2. Email: `admin@arisolutions.com` (or your preferred email)
3. Password: Create a secure password
4. Click "Add user"

#### Setup Firestore Database
1. In Firebase Console, go to **Build > Firestore Database**
2. Click "Create database"
3. Select "Start in test mode" (for development)
4. Choose a location (e.g., us-central)
5. Click "Enable"

#### Get Firebase Config
1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps"
3. Click the web icon `</>`
4. Register app (name: "ARI Solutions Admin")
5. Copy the firebaseConfig object

### 2. Environment Variables

1. Open `/app/.env.local`
2. Replace the placeholder values with your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ari-solutions.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ari-solutions
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ari-solutions.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

3. Save the file
4. Restart the Next.js server:

```bash
sudo supervisorctl restart nextjs
```

### 3. Test the Application

1. Open your browser to: `https://clienthub-39.preview.emergentagent.com`
2. Click "Admin Login"
3. Login with your Firebase admin credentials
4. You should see the dashboard with mock data
5. Try adding a new client
6. Try editing and deleting clients

## 📁 Project Structure

```
/app/
├── app/
│   ├── admin/
│   │   ├── login/page.js          # Admin login
│   │   ├── dashboard/page.js      # Admin dashboard
│   │   └── clients/
│   │       ├── page.js             # Client list
│   │       ├── new/page.js         # Add client
│   │       └── [id]/edit/page.js   # Edit client
│   ├── api/
│   │   └── clients/
│   │       ├── route.js            # Client CRUD API
│   │       └── [id]/route.js       # Single client API
│   ├── page.js                     # Landing page
│   ├── layout.js                   # Root layout
│   └── globals.css                 # Global styles
├── components/
│   ├── AdminLayout.js              # Admin sidebar layout
│   ├── StatsCard.js                # Dashboard stat cards
│   ├── ClientTable.js              # Client list table
│   └── ui/                         # shadcn components
├── lib/
│   ├── firebase.js                 # Firebase config
│   ├── auth.js                     # Auth helpers
│   └── firestore.js                # Firestore helpers
└── hooks/
    └── use-toast.js                # Toast notifications
```

## 🔐 Authentication

### Admin Login
- URL: `/admin/login`
- Uses Firebase Authentication
- Email/password login
- Protected routes (redirects if not authenticated)

### Default Test Credentials
- Email: `admin@arisolutions.com`
- Password: (set during Firebase user creation)

## 📊 Mock Data

For demonstration purposes, the app includes 3 sample clients:
1. **ABC Healthcare** - Healthcare industry, both services enabled
2. **Premier Legal Services** - Legal industry, AI Receptionist only
3. **Elite Real Estate Group** - Real Estate, Booking Accelerator only

Once Firebase is configured, you can:
- Add real clients
- Data persists in Firestore
- Mock data can be removed

## 🎯 Next Steps (Upcoming Phases)

### Phase 2: AI Receptionist Configuration
- Knowledge base editor
- Voice & personality settings
- Call routing rules
- Appointment booking integration
- Quote generation
- Phone number management

### Phase 3: Booking Accelerator
- Landing page builder
- Form builder
- Lead qualification system
- Calendar integration
- Email/SMS automation
- Public booking pages

### Phase 4: Client Portal
- Client authentication
- Client dashboard
- Call history
- Appointment management
- Lead inbox
- Analytics

### Phase 5: Advanced Analytics
- System-wide metrics
- Client comparison
- Revenue analytics
- Custom reports
- Scheduled reports

## 🔌 Third-Party Integration Placeholders

The following integrations will be added in later phases:
- **Vapi.ai / Bland AI**: Voice AI for phone calls
- **Twilio**: Phone numbers and SMS
- **Calendly**: Appointment booking
- **Stripe**: Payment processing (optional)
- **Resend**: Email notifications

API keys for these services will be added to `.env.local` when ready.

## 🎨 Brand Colors

- **Primary**: Navy Blue (#1e3a8a)
- **Secondary**: Teal (#14b8a6)
- **Accent**: Blue Gradient
- **Background**: White / Light Gray
- **Text**: Dark Gray / Black

## 💡 Tips

1. **Development Mode**: The app uses mock data by default. Configure Firebase to enable persistence.

2. **Adding Clients**: Use realistic data when testing. The system validates email formats and required fields.

3. **Services Toggle**: Each client can have AI Receptionist, Booking Accelerator, or both enabled.

4. **Status Management**: Clients can be marked as active, inactive, or suspended.

5. **Search Functionality**: The client list supports real-time search across business name, email, and industry.

## 🐛 Troubleshooting

### Firebase Connection Issues
- Verify all Firebase config values in `.env.local`
- Check Firebase project is in "test mode" for Firestore
- Ensure Email/Password auth is enabled

### Authentication Not Working
- Verify admin user exists in Firebase Authentication
- Check browser console for Firebase errors
- Clear browser cache and cookies

### Build Errors
- Run `yarn install` to ensure all dependencies are installed
- Restart Next.js: `sudo supervisorctl restart nextjs`
- Check logs: `tail -f /var/log/supervisor/nextjs.out.log`

## 📞 Support

For questions or issues:
1. Check the Firebase Console for error logs
2. Review browser console for client-side errors
3. Check Next.js logs for server-side issues

## 📝 License

Proprietary - ARI Solutions Inc.

---

**Built with ❤️ for ARI Solutions**
