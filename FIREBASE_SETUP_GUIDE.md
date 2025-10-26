# Firebase Setup Guide for ARI Solutions Platform

This guide will walk you through setting up Firebase for the ARI Solutions Client Management Platform.

## Prerequisites

- Google account
- Access to [Firebase Console](https://console.firebase.google.com/)

---

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: **"ARI Solutions"** (or your preferred name)
4. Click **Continue**
5. Disable Google Analytics (optional for this project)
6. Click **"Create project"**
7. Wait for the project to be created (~30 seconds)
8. Click **"Continue"** when ready

---

## Step 2: Enable Firebase Authentication

### Enable Email/Password Authentication

1. In the Firebase Console, select your project
2. Click **"Build"** in the left sidebar
3. Click **"Authentication"**
4. Click **"Get started"**
5. Click on the **"Sign-in method"** tab
6. Click on **"Email/Password"** provider
7. Toggle **"Enable"** to ON
8. Click **"Save"**

### Create Your First Admin User

1. Click on the **"Users"** tab in Authentication
2. Click **"Add user"**
3. Enter your admin email (e.g., `admin@arisolutions.com`)
4. Enter a strong password (you'll use this to login)
5. Click **"Add user"**

✅ **Note down your admin credentials:**
- Email: _________________
- Password: _________________

---

## Step 3: Setup Firestore Database

### Create Firestore Database

1. In Firebase Console, click **"Build"** > **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in test mode"** (for development)
   - ⚠️ Test mode allows read/write access for 30 days
   - You can update security rules later
4. Choose your database location (e.g., `us-central`)
5. Click **"Enable"**
6. Wait for database creation (~1 minute)

### Create Collections (Optional - Will be auto-created)

The app will automatically create these collections when you add data:
- `clients` - All client information
- `aiReceptionistConfig` - AI receptionist settings per client
- `bookingAcceleratorConfig` - Booking accelerator settings per client
- `calls` - Call history per client
- `leads` - Captured leads per client
- `appointments` - Booked appointments per client

---

## Step 4: Get Firebase Configuration

### Copy Your Firebase Config

1. In Firebase Console, click the **gear icon** ⚙️ (Project Settings)
2. Scroll down to **"Your apps"** section
3. Click on the **web icon** `</>`
4. Register your app:
   - App nickname: **"ARI Solutions Admin"**
   - Leave "Firebase Hosting" unchecked
   - Click **"Register app"**
5. You'll see a `firebaseConfig` object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC-xxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "ari-solutions-xxxxx.firebaseapp.com",
  projectId: "ari-solutions-xxxxx",
  storageBucket: "ari-solutions-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

6. **Copy these values** - you'll need them next!

---

## Step 5: Configure Environment Variables

### Update .env.local File

1. Open `/app/.env.local` in your code editor
2. Replace the placeholder values with your Firebase config:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC-xxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ari-solutions-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ari-solutions-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ari-solutions-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

3. Save the file

### Restart the Application

```bash
sudo supervisorctl restart nextjs
```

Or if you're running locally:
```bash
yarn dev
```

---

## Step 6: Test Your Setup

### Test Admin Login

1. Open your browser to: `https://clienthub-39.preview.emergentagent.com`
2. Click **"Admin Login"**
3. Enter your admin credentials:
   - Email: The email you created in Step 2
   - Password: The password you set
4. Click **"Login"**

✅ **Success!** You should be redirected to the admin dashboard.

### Test Client Management

1. From the dashboard, click **"Add New Client"**
2. Fill in the form with test data:
   - Business Name: Test Company
   - Industry: Select any
   - Email: test@example.com
   - Phone: +1-555-0000
   - Enable AI Receptionist: ON
3. Click **"Create Client"**

✅ **Success!** You should see your new client in the client list.

### Verify Firestore Data

1. Go back to Firebase Console
2. Click **"Firestore Database"**
3. You should see a `clients` collection
4. Click on it to see your test client data

---

## Step 7: Update Firestore Security Rules (Production)

⚠️ **Important:** Test mode allows anyone to read/write for 30 days. Before going to production, update your security rules.

### Recommended Security Rules

1. In Firebase Console, go to **"Firestore Database"**
2. Click on the **"Rules"** tab
3. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Clients collection - only authenticated users
    match /clients/{clientId} {
      allow read, write: if request.auth != null;
    }
    
    // Sub-collections under clients
    match /clients/{clientId}/{subcollection}/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. Click **"Publish"**

---

## Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"

**Solution:** Double-check your `NEXT_PUBLIC_FIREBASE_API_KEY` in `.env.local`

### Error: "Firebase: Error (auth/user-not-found)"

**Solution:** Make sure you created an admin user in Firebase Authentication

### Error: "Missing or insufficient permissions"

**Solution:** Your Firestore security rules are too restrictive. Set to test mode or update rules.

### Application Won't Start

**Solution:** 
1. Check for syntax errors in `.env.local`
2. Ensure all Firebase config values are correct
3. Restart the server: `sudo supervisorctl restart nextjs`
4. Check logs: `tail -f /var/log/supervisor/nextjs.out.log`

### Can't See Firestore Data

**Solution:**
1. Check Firestore is enabled in Firebase Console
2. Verify security rules allow read/write
3. Check browser console for errors

---

## Next Steps

Once Firebase is working:

1. ✅ **Phase 1 Complete**: Admin Dashboard + Client Management
2. 📋 **Phase 2**: Configure AI Receptionist settings per client
3. 📋 **Phase 3**: Setup Booking Accelerator with landing pages
4. 📋 **Phase 4**: Build Client Portal for clients to login
5. 📋 **Phase 5**: Advanced Analytics and Reporting

---

## Support

If you need help:
1. Check Firebase Console > Authentication > Users (verify admin exists)
2. Check Firebase Console > Firestore Database (verify database exists)
3. Check browser console (F12) for JavaScript errors
4. Check server logs for backend errors

---

## Security Best Practices

1. ✅ Never commit `.env.local` to git
2. ✅ Use strong passwords for admin accounts
3. ✅ Update Firestore security rules before production
4. ✅ Enable Firebase App Check for production
5. ✅ Regularly review Firebase Console > Usage for anomalies

---

**Setup Complete!** 🎉

You now have a fully functional admin dashboard with Firebase authentication and Firestore database.
