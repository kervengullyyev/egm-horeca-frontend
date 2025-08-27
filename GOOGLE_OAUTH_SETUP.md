# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the EGM Horeca frontend.

## Prerequisites

- Google Cloud Console account
- Access to create OAuth 2.0 credentials

## Step 1: Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (if not already enabled)
4. Go to "Credentials" in the left sidebar
5. Click "Create Credentials" → "OAuth 2.0 Client IDs"
6. Choose "Web application" as the application type
7. Add the following authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (for development)
   - `https://yourdomain.com/auth/callback` (for production)
8. Click "Create"
9. Copy the Client ID and Client Secret

## Step 2: Configure Environment Variables

1. Copy `env.example` to `.env.local`
2. Add your Google OAuth credentials:

```bash
# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

**Important**: Only the `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is needed in the frontend. The `GOOGLE_CLIENT_SECRET` is for backend use only.

## Step 3: Update Backend Configuration

Make sure your backend is configured to handle Google OAuth tokens. The backend should:

1. Accept the Google ID token from the frontend
2. Verify the token with Google's servers
3. Create or authenticate the user
4. Return a JWT token for the frontend

## Step 4: Test the Integration

1. Start your frontend development server: `npm run dev`
2. Navigate to `/account` or `/login`
3. Click "Continue with Google"
4. Complete the Google OAuth flow
5. You should be redirected to `/auth/callback` and then to `/dashboard`

## How It Works

1. **User clicks "Continue with Google"**
   - Frontend initializes Google OAuth
   - Triggers Google's authentication popup

2. **Google OAuth response**
   - Google returns user credentials
   - Frontend stores data temporarily in sessionStorage
   - Redirects to `/auth/callback`

3. **Auth callback processing**
   - Retrieves stored Google user data
   - Sends data to backend SSO endpoint
   - Backend verifies and creates/authenticates user
   - Frontend receives JWT token and redirects to dashboard

## Troubleshooting

### Common Issues

1. **"Google Client ID is not configured"**
   - Check that `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set in `.env.local`
   - Restart your development server after changing environment variables

2. **"Failed to load Google OAuth"**
   - Check your internet connection
   - Verify the Google OAuth script is loading in browser dev tools

3. **Redirect URI mismatch**
   - Ensure the redirect URI in Google Cloud Console matches exactly
   - Include protocol (http/https) and port numbers

4. **CORS issues**
   - Make sure your backend allows requests from your frontend domain
   - Check that the backend SSO endpoint is working

### Debug Mode

To enable debug logging, add this to your `.env.local`:

```bash
NODE_ENV=development
NEXT_PUBLIC_DEBUG_OAUTH=true
```

## Security Considerations

1. **Never expose Client Secret in frontend code**
2. **Always verify tokens on the backend**
3. **Use HTTPS in production**
4. **Implement proper session management**
5. **Add rate limiting to prevent abuse**

## Production Deployment

1. Update redirect URIs in Google Cloud Console
2. Set production environment variables
3. Ensure HTTPS is enabled
4. Test the complete authentication flow
5. Monitor authentication logs for any issues

## Support

If you encounter issues:

1. Check the browser console for JavaScript errors
2. Verify network requests in the Network tab
3. Ensure all environment variables are set correctly
4. Check that the backend SSO endpoint is responding properly
5. Review Google Cloud Console for any credential issues
