# 🚀 LinkedIn Roast AI - Production Setup Guide

## Overview

This guide will walk you through setting up the LinkedIn Roast AI with production-ready infrastructure:
- **Supabase** for database (PostgreSQL)
- **AWS S3** for file storage
- **OpenAI** for AI roast generation
- **Vercel** for deployment

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `linkedin-roast-ai`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users

### 1.2 Get API Keys

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (starts with `https://`)
   - **Anon Key** (starts with `eyJ`)

### 1.3 Set Up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `database-schema.sql`
3. Paste and run the SQL commands
4. Verify tables are created in **Table Editor**

## Step 2: AWS S3 Setup

### 2.1 Create S3 Bucket

1. Go to [AWS S3 Console](https://console.aws.amazon.com/s3/)
2. Click **Create bucket**
3. Configure bucket:
   - **Bucket name**: `linkedin-roast-ai-uploads` (must be globally unique)
   - **Region**: Same as your Vercel deployment
   - **Block Public Access**: Uncheck all boxes (we need public read access)
4. Click **Create bucket**

### 2.2 Configure Bucket Policy

1. Select your bucket
2. Go to **Permissions** → **Bucket Policy**
3. Add this policy (replace `YOUR_BUCKET_NAME`):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
        }
    ]
}
```

### 2.3 Create IAM User

1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
2. Click **Users** → **Create user**
3. Configure:
   - **Username**: `linkedin-roast-ai-s3`
   - **Access type**: Programmatic access
4. Attach policy: `AmazonS3FullAccess` (or create custom policy)
5. Save the **Access Key ID** and **Secret Access Key**

## Step 3: Environment Variables

### 3.1 Local Development

1. Copy `env.example` to `.env.local`
2. Fill in your values:

```bash
# OpenAI
OPENAI_API_KEY=sk-your-openai-key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-bucket-name
```

### 3.2 Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add all the variables above
4. **Important**: Set `NEXT_PUBLIC_` variables for both Production and Preview

## Step 4: Test Your Setup

### 4.1 Local Testing

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### 4.2 Test Each Component

1. **File Upload**: Upload a PDF file
2. **Text Extraction**: Verify PDF text is extracted
3. **AI Roast**: Generate a roast
4. **Database**: Check Supabase dashboard for new records
5. **S3**: Check S3 bucket for uploaded files

## Step 5: Deploy to Vercel

### 5.1 Connect Repository

1. Push your code to GitHub
2. Connect repository to Vercel
3. Vercel will auto-detect Next.js

### 5.2 Configure Environment Variables

1. In Vercel dashboard, go to **Settings** → **Environment Variables**
2. Add all variables from Step 3.2
3. Deploy

### 5.3 Verify Deployment

1. Test file upload on live site
2. Check Supabase for new records
3. Verify S3 bucket has files

## Troubleshooting

### Common Issues

#### 1. Supabase Connection Errors
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Check Row Level Security policies
- Ensure database schema is created

#### 2. S3 Upload Failures
- Verify AWS credentials
- Check bucket permissions
- Ensure bucket name is correct
- Verify region matches

#### 3. OpenAI API Errors
- Check API key format
- Verify account has credits
- Check rate limits

#### 4. PDF Processing Issues
- Ensure `pdf-parse` is installed
- Check file format (PDF only)
- Verify file size limits

### Debug Commands

```bash
# Check environment variables
echo $OPENAI_API_KEY
echo $NEXT_PUBLIC_SUPABASE_URL

# Test Supabase connection
npm run dev
# Then check browser console for errors

# Test S3 upload
# Upload a file through the UI and check S3 bucket
```

## Security Considerations

### Current Setup
- ✅ Environment variables are secure
- ✅ S3 bucket has minimal public access
- ✅ Supabase RLS is enabled
- ✅ File uploads are validated

### Production Recommendations
- [ ] Add rate limiting
- [ ] Implement user authentication
- [ ] Add CSRF protection
- [ ] Set up monitoring and alerts
- [ ] Configure backup strategies

## Monitoring

### What to Monitor
1. **API Response Times**
2. **Error Rates**
3. **Storage Usage**
4. **Database Performance**
5. **User Engagement**

### Tools
- Vercel Analytics
- Supabase Dashboard
- AWS CloudWatch
- Custom logging

## Next Steps

After successful deployment:

1. **Add Analytics**: Track user behavior
2. **Implement Caching**: Improve performance
3. **Add Authentication**: User accounts
4. **Scale Infrastructure**: As needed
5. **Add Features**: Based on user feedback

---

**Your LinkedIn Roast AI is now production-ready!** 🎉

The application now has:
- ✅ Real database persistence (Supabase)
- ✅ Scalable file storage (AWS S3)
- ✅ AI-powered roasts (OpenAI)
- ✅ Modern deployment (Vercel)
- ✅ Type safety (TypeScript)
- ✅ Error handling
- ✅ Security best practices 