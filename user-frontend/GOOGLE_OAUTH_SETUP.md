# Google OAuth Setup Instructions - IMPORTANT!

## ❌ Current Error: "OAuth client was not found" / "Error 401: invalid_client"

This error occurs because you don't have a valid Google OAuth Client ID configured. Follow these steps exactly:

## 🔧 STEP 1: Get Real Google OAuth Credentials (REQUIRED)

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Create or select a project**
3. **Enable Google Identity API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Identity" and enable it
4. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - **Name**: `INSA User Frontend`
   - **Authorized JavaScript origins**:
     ```
     http://localhost:5173
     http://localhost:3000
     ```
   - **Authorized redirect URIs**: (same as origins)
     ```
     http://localhost:5173
     http://localhost:3000
     ```
   - Click "Create"
5. **Copy the Client ID** (looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)

## 🔧 STEP 2: Configure Environment Variables

**Create `.env` file in user-frontend directory:**

```bash
# In PowerShell (user-frontend directory)
echo "VITE_GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_HERE" > .env
```

**Replace `YOUR_ACTUAL_CLIENT_ID_HERE` with your real Client ID from step 1!**

Example:
```env
VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
```

## 🔧 STEP 3: Restart Development Server

```bash
# Stop current server (Ctrl+C) then restart
npm run dev
```

## 🔧 STEP 4: Verify Setup

1. **Check browser console** for: `Google Client ID from env: [your-actual-id]`
2. **If you see**: `Google Client ID from env: undefined` → Environment file not loaded
3. **If you see**: `PLACEHOLDER_CLIENT_ID` → You need to create the .env file

## ⚠️ Common Issues & Solutions

### Issue 1: "VITE_GOOGLE_CLIENT_ID not found"
**Solution**: Create `.env` file with correct variable name (must start with `VITE_`)

### Issue 2: Still getting "invalid_client"
**Solution**: 
- Double-check your Client ID is correct
- Make sure you copied the full ID including `.apps.googleusercontent.com`
- Verify the origins in Google Console match exactly: `http://localhost:5173`

### Issue 3: "This app isn't verified"
**Solution**: This is normal for development. Click "Advanced" → "Go to [your-app] (unsafe)"

## 🚀 Quick Setup Commands

```bash
# 1. Navigate to user-frontend
cd user-frontend

# 2. Create .env file (replace with your actual client ID)
echo "VITE_GOOGLE_CLIENT_ID=your-real-client-id.apps.googleusercontent.com" > .env

# 3. Restart server
npm run dev
```

## 📋 Verification Checklist

- [ ] ✅ Google Cloud project created
- [ ] ✅ Google Identity API enabled
- [ ] ✅ OAuth 2.0 Client ID created
- [ ] ✅ Authorized origins set to `http://localhost:5173`
- [ ] ✅ `.env` file created with real client ID
- [ ] ✅ Environment variable starts with `VITE_`
- [ ] ✅ Development server restarted
- [ ] ✅ Browser console shows real client ID (not "undefined")

## 🎯 After Setup Success

Once properly configured, you'll see:
1. **Signup page**: "Continue with Google" button works
2. **Login page**: "Sign in with Google" button works  
3. **Google popup**: Opens for authentication
4. **Auto redirect**: Takes you to `/user` dashboard after success

## 📞 Still Having Issues?

If you're still getting the error after following all steps:
1. **Check browser network tab** for the actual request being made
2. **Verify the client ID** in the request matches your Google Console
3. **Clear browser cache** and try again
4. **Try incognito/private browsing** mode

## 3. Features Added

### Frontend (user-frontend)
- ✅ Google OAuth provider wrapper in App.jsx
- ✅ Google login/signup buttons in Login.jsx and Signup.jsx
- ✅ JWT token decoding to extract user info
- ✅ Automatic account creation or login for Google users
- ✅ Beautiful UI with divider between OAuth and manual forms

### Backend
- ✅ New `googleSignup` endpoint: `/api/v1/user/google-signup`
- ✅ Google ID and profile picture fields in User model
- ✅ Automatic user creation for new Google users
- ✅ Account linking for existing users

## 4. How it Works

1. **Signup**: User clicks "Continue with Google" → Google OAuth popup → User grants permission → JWT token created → Account created/linked → User redirected to dashboard

2. **Login**: Same flow as signup - if user exists, they're logged in; if not, account is created automatically

## 5. Testing

1. Make sure your Google OAuth credentials are set up correctly
2. Add your Client ID to the `.env` file
3. Start the frontend: `npm run dev`
4. Start the backend: `npm start`
5. Go to signup or login page
6. Click "Continue with Google" or "Sign in with Google"
7. Test with a Google account

## 6. Security Notes

- Google ID is stored and used for account identification
- Random password is generated for Google users (they won't need it)
- Email uniqueness is maintained
- Existing users can link their Google account

## 7. Troubleshooting

- Make sure your domain is added to authorized origins in Google Console
- Check that the Client ID is correct in the environment variable
- Ensure the backend is running on port 5000
- Check browser console for any CORS errors 