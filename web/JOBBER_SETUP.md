# Jobber API + Email Fallback Setup Guide

## Current Status ✅

- **Jobber API integration** - Updated with correct schema
- **Email fallback system** - Professional templates ready
- **Form handling** - Complete error handling with fallback
- **TypeScript** - All types updated and working

## Quick Setup Steps

### 1. Your Environment Variables are Ready

Your `.env.local` should already have:

```env
# Jobber Configuration
JOBBER_CLIENT_ID=your_client_id
JOBBER_CLIENT_SECRET=your_client_secret
JOBBER_REDIRECT_URI=your_redirect_uri
JOBBER_ACCESS_TOKEN=your_access_token_from_graphiql
JOBBER_REFRESH_TOKEN=your_refresh_token
JOBBER_API_URL=https://api.getjobber.com/api/graphql
```

### 2. Add Email Service (Required for Fallback)

To complete the setup, add to your `.env.local`:

```env
# Get your API key from: https://resend.com/api-keys
EMAIL_API_KEY=re_your_api_key_here
ESTIMATES_EMAIL=estimates@example.com
FROM_EMAIL=noreply@example.com
REPLY_TO_EMAIL=estimates@example.com
```

**How to get Resend API key:**

1. Go to [resend.com](https://resend.com)
2. Sign up (free tier: 3,000 emails/month)
3. Go to API Keys section
4. Create new API key
5. Copy the `re_...` key to your `.env.local`

### 3. Test the Integration

**Test Jobber API:**

1. Go to `/estimate` page
2. Fill out the form completely
3. Submit - should create client + request in Jobber

**Test Email Fallback:**

1. Temporarily break Jobber (remove access token)
2. Submit form
3. Should send emails to estimates@example.com AND customer
4. Restore access token when done testing

## How the System Works

### Success Flow:

```
Form Submit → Jobber API → Client Created → Request Created → Success Dialog
```

### Fallback Flow:

```
Form Submit → Jobber Fails → Email to You + Customer → Success Dialog
```

### Complete Failure:

```
Form Submit → Jobber Fails → Email Fails → Error Dialog (Call us message)
```

## What You Get

### When Jobber Works:

- ✅ Client automatically created in Jobber
- ✅ Request created with all form details
- ✅ Customer sees success message
- ✅ You get the lead in your Jobber dashboard

### When Jobber Fails (Email Fallback):

- ✅ Professional email to estimates@example.com with all details
- ✅ Confirmation email sent to customer
- ✅ Customer still sees success message
- ✅ You manually enter the lead into Jobber

## Files Updated

### Schema & Types:

- `/src/lib/jobber-types.ts` - Fixed address fields (`street1`, `province`, `postalCode`)
- `/src/lib/jobber-client.ts` - Updated to match actual Jobber GraphQL schema

### API Endpoints:

- `/src/app/api/jobber/submit/route.ts` - Uses correct address mapping
- `/src/app/api/email-fallback/route.ts` - Professional email templates

### Frontend:

- `/src/components/organisms/EstimateForm.tsx` - Updated to use email fallback

## Next Steps

1. **Add Resend API key** to `.env.local`
2. **Test both flows** (success + fallback)
3. **Deploy to production** with environment variables

## Production Deployment

When ready for production:

1. Add all environment variables to Vercel
2. Set up proper Jobber OAuth for token refresh
3. Use production Jobber account (not test account)

The current setup with access token is perfect for testing and initial production use!
