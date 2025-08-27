# Environment Setup Guide

## Overview
This guide explains how to set up environment variables for the EGM Horeca frontend application.

## Quick Start

1. **Copy the example file:**
   ```bash
   cp env.example .env.local
   ```

2. **Edit `.env.local` with your actual values**
3. **Restart your development server**

## Required Environment Variables

### 🔑 Stripe Configuration (Required for Payments)
```bash
# Get these from your Stripe Dashboard
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### 🌐 API Configuration
```bash
# Backend API endpoints
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### 🖼️ Image Upload
```bash
# Where images are served from
NEXT_PUBLIC_UPLOAD_URL=http://localhost:8000/api/v1/images
```

## Optional Environment Variables

### 🔐 NextAuth.js (if using authentication)
```bash
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### 🗄️ Database (if connecting directly)
```bash
DATABASE_URL=postgresql://username:password@localhost:5432/horeca_db
```

### 📊 Analytics and Monitoring
```bash
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

### 🚀 Feature Flags
```bash
NEXT_PUBLIC_ENABLE_STRIPE=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

## Environment File Priority

Next.js loads environment variables in this order:
1. `.env.local` (highest priority, git ignored)
2. `.env.development` or `.env.production`
3. `.env` (lowest priority)

## Security Notes

### ✅ Public Variables (Safe to expose)
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Use for API endpoints, public keys, and feature flags

### 🔒 Private Variables (Keep secret)
- Variables without `NEXT_PUBLIC_` prefix are server-side only
- Use for API keys, database credentials, and secrets

### 🚫 Never commit these files:
- `.env.local`
- `.env.production`
- Any file containing real secrets

## Stripe Setup

1. **Create a Stripe account** at [stripe.com](https://stripe.com)
2. **Get your API keys** from the Stripe Dashboard
3. **Add them to your `.env.local` file**
4. **Test with test keys first** before going live

## Troubleshooting

### Common Issues:
- **"Environment variable not found"**: Check if `.env.local` exists and has correct variable names
- **"Stripe not working"**: Verify your Stripe keys are correct and in the right environment
- **"API calls failing"**: Check `NEXT_PUBLIC_API_BASE_URL` points to your running backend

### Development vs Production:
- **Development**: Use test keys and localhost URLs
- **Production**: Use live keys and production URLs
- **Environment-specific files**: Create `.env.production` for production settings

## Example .env.local

```bash
# Stripe (Replace with your actual keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51ABC123...
STRIPE_SECRET_KEY=sk_test_51ABC123...

# API
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Images
NEXT_PUBLIC_UPLOAD_URL=http://localhost:8000/api/v1/images

# Environment
NODE_ENV=development
```
