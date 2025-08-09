# Firebase Setup Guide for Google Keep Clone

This guide will help you set up Firebase authentication and Firestore database for the Google Keep Clone project.

## Prerequisites

1. **Node.js and npm** - Make sure you have Node.js installed
2. **Firebase Account** - Create a free Firebase account at [firebase.google.com](https://firebase.google.com)

## Step 1: Install Dependencies

First, install the Firebase SDK:

```bash
npm install firebase
```

## Step 2: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "google-keep-clone")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 3: Enable Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click **Get started**
3. Go to the **Sign-in method** tab
4. Click on **Google** provider
5. Enable it and configure:
   - **Project support email**: Your email
   - **Web SDK configuration**: Add your domain (localhost for development)
6. Click **Save**

## Step 4: Set Up Firestore Database

1. In your Firebase project, go to **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location close to your users
5. Click **Done**

## Step 5: Get Firebase Configuration

1. In your Firebase project, click the gear icon ⚙️ next to "Project Overview"
2. Select **Project settings**
3. Scroll down to **Your apps** section
4. Click the web icon (</>) to add a web app
5. Register your app with a nickname (e.g., "google-keep-clone-web")
6. Copy the Firebase configuration object

## Step 6: Update Firebase Configuration

Replace the placeholder configuration in `src/firebase.js` with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
};
```

## Step 7: Set Up Firestore Security Rules

In your Firebase console, go to **Firestore Database** → **Rules** and update the rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Users can only access their own notes
    match /notes/{noteId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## Step 8: Test the Application

1. Start the development server:

   ```bash
   npm start
   ```

2. Open your browser to `http://localhost:3000`
3. You should see the login prompt
4. Click "Sign in with Google" to test authentication
5. After signing in, you should see the notes interface with your profile picture in the top-right corner

## Features Implemented

✅ **Google Authentication** - Native Google sign-in popup
✅ **User Profile Display** - Profile picture in header with dropdown menu
✅ **User-Specific Notes** - Each user sees only their own notes
✅ **Real-time Database** - Notes stored in Firestore
✅ **Error Handling** - Comprehensive error messages
✅ **Loading States** - Professional loading experience
✅ **Sign Out** - Complete logout functionality

## Database Structure

### Users Collection

```javascript
users: {
  userId: {
    email: string,
    displayName: string,
    photoURL: string,
    emailVerified: boolean,
    lastLogin: timestamp,
    createdAt: timestamp
  }
}
```

### Notes Collection

```javascript
notes: {
  noteId: {
    userId: string, // Reference to user
    title: string,
    content: string,
    bgColor: string,
    bgImage: string,
    timeStamp: object,
    createdAt: timestamp,
    updatedAt: timestamp
  }
}
```

## Troubleshooting

### Common Issues:

1. **"Firebase not initialized"** - Make sure you've installed Firebase and updated the config
2. **"Google sign-in not enabled"** - Enable Google provider in Firebase Authentication
3. **"Permission denied"** - Check your Firestore security rules
4. **"Pop-up blocked"** - Allow pop-ups for your domain

### Development vs Production:

- **Development**: Use `localhost` in authorized domains
- **Production**: Add your actual domain to authorized domains in Firebase console

## Security Notes

- Never commit your Firebase config with real API keys to public repositories
- Use environment variables for production
- Regularly review your Firestore security rules
- Monitor your Firebase usage to stay within free tier limits

## Next Steps

1. **Deploy to production** - Use Firebase Hosting or other platforms
2. **Add more features** - Real-time collaboration, note sharing, etc.
3. **Optimize performance** - Implement pagination for large note collections
4. **Add offline support** - Enable offline persistence in Firebase

Happy coding! 🚀
