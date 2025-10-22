# Google Sign-In Setup Guide

## Prerequisites
- Google Cloud Console account
- LegalEase AI project running locally

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure consent screen if prompted:
   - User Type: External
   - App name: LegalEase AI
   - User support email: your-email@example.com
   - Developer contact: your-email@example.com
   - Add scopes: email, profile
   - Add test users if in testing mode

## Step 2: Configure OAuth Client

1. Application type: **Web application**
2. Name: `LegalEase AI - Local Development`
3. Authorized JavaScript origins:
   ```
   http://localhost:3000
   ```
4. Authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
5. Click **Create**
6. Copy the **Client ID** and **Client Secret**

## Step 3: Update Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Google OAuth credentials:
   ```env
   GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret-here
   ```

## Step 4: Test the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to http://localhost:3000/signin

3. Click **Continue with Google**

4. Sign in with your Google account

5. You should be redirected to the homepage

6. Check your profile at http://localhost:3000/profile

## Step 5: Production Setup

For production deployment:

1. Add production domain to authorized origins:
   ```
   https://yourdomain.com
   ```

2. Add production callback URL:
   ```
   https://yourdomain.com/api/auth/callback/google
   ```

3. Update environment variables in your hosting platform:
   - Vercel: Project Settings > Environment Variables
   - Netlify: Site Settings > Build & Deploy > Environment
   - Other platforms: Follow their documentation

## Troubleshooting

### "redirect_uri_mismatch" error
- Verify the redirect URI in Google Console matches exactly: `http://localhost:3000/api/auth/callback/google`
- Check that you're using the correct port (3000)
- Ensure no trailing slashes in the URIs

### "access_denied" error
- Check if your Google account is added as a test user (if in testing mode)
- Verify consent screen is properly configured
- Check OAuth scopes are correct

### Profile not creating in Firestore
- Verify Firebase configuration is correct
- Check Firestore security rules allow write access
- Look for errors in browser console and server logs

### Session not persisting
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies and try again

## Features Enabled by Google Sign-In

✅ One-click authentication
✅ Automatic profile creation in Firestore
✅ Profile photo from Google account
✅ Email verification (Google handles this)
✅ Secure OAuth 2.0 flow
✅ Seamless user experience

## Next Steps

After setting up Google Sign-In:

1. Test both Google and email/password authentication
2. Verify user profiles are created correctly in Firestore
3. Check that blog posts associate with the correct author
4. Test profile editing functionality
5. Deploy to production and update OAuth settings

## Support

For more information:
- [NextAuth.js Google Provider Docs](https://next-auth.js.org/providers/google)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
