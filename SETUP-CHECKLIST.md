# 🔐 LinkedIn Roast AI - Secure Setup Checklist

## ✅ **Step 1: Supabase Setup**

### 1.1 Create Supabase Project
- [ ] Go to [supabase.com](https://supabase.com)
- [ ] Click "New Project"
- [ ] **Project Name**: `linkedin-roast-ai`
- [ ] **Database Password**: Create a strong password (save it!)
- [ ] **Region**: Choose closest to your users
- [ ] Click "Create new project"

### 1.2 Get API Keys
- [ ] Go to **Settings** → **API**
- [ ] Copy **Project URL** (starts with `https://`)
- [ ] Copy **Anon Key** (starts with `eyJ`)
- [ ] Copy **Service Role Key** (starts with `eyJ` - this is for server-side writes!)

### 1.3 Set Up Database Schema
- [ ] Go to **SQL Editor** in your Supabase dashboard
- [ ] Copy the entire contents of `database-schema.sql`
- [ ] Paste into SQL Editor
- [ ] Click "Run"
- [ ] Verify tables are created in **Table Editor**

### 1.4 Set Up Supabase Storage
- [ ] Go to **Storage** in your Supabase dashboard
- [ ] Click **Create a new bucket**
- [ ] **Bucket name**: `roast-pdfs`
- [ ] **Public bucket**: ✅ Check this (files need to be publicly accessible)
- [ ] Click **Create bucket**
- [ ] Go to **Settings** → **Storage**
- [ ] **File size limit**: Set to 50MB (or your preferred limit)
- [ ] **Allowed MIME types**: Add `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

### 1.5 Enable Row Level Security (RLS)
- [ ] Go to **Authentication** → **Policies**
- [ ] For `roasts` table:
  - [ ] Enable RLS: `ALTER TABLE roasts ENABLE ROW LEVEL SECURITY;`
  - [ ] **NO public insert policies** (writes go through API with service role)
- [ ] For `emails` table:
  - [ ] Enable RLS: `ALTER TABLE emails ENABLE ROW LEVEL SECURITY;`
  - [ ] **NO public insert policies** (writes go through API with service role)

---

## ✅ **Step 2: Environment Variables**

### 2.1 Create .env.local
- [ ] Copy `env.example` to `.env.local`
- [ ] Replace `your-openai-api-key-here` with your OpenAI API key
- [ ] Replace `your-project.supabase.co` with your Supabase project URL
- [ ] Replace `your-supabase-anon-key` with your Supabase anon key
- [ ] Replace `your-supabase-service-role-key` with your Supabase service role key

### 2.2 Verify Environment Variables
- [ ] `OPENAI_API_KEY` is set and valid
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set and valid
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set and valid
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set and valid

---

## ✅ **Step 3: Local Development**

### 3.1 Install Dependencies
- [ ] Run `npm install`
- [ ] Verify no errors in installation

### 3.2 Start Development Server
- [ ] Run `npm run dev`
- [ ] Open [http://localhost:3000](http://localhost:3000)
- [ ] Verify the app loads without errors

### 3.3 Test File Upload
- [ ] Upload a PDF file through the UI
- [ ] Verify file appears in Supabase Storage bucket
- [ ] Verify file URL is stored in database

### 3.4 Test Roast Generation
- [ ] Submit a roast request
- [ ] Verify roast is generated and stored in database
- [ ] Verify file URLs are preserved in roast record

---

## ✅ **Step 4: Production Deployment**

### 4.1 Vercel Deployment
- [ ] Push code to GitHub
- [ ] Connect repository to Vercel
- [ ] Add all environment variables in Vercel dashboard
- [ ] Deploy and verify functionality

### 4.2 Production Verification
- [ ] Test file upload in production
- [ ] Test roast generation in production
- [ ] Verify Supabase Storage bucket is accessible
- [ ] Check database records are being created

---

## ✅ **Step 5: Security Verification**

### 5.1 Environment Variables
- [ ] ✅ OpenAI API key is server-side only
- [ ] ✅ Supabase service role key is server-side only
- [ ] ✅ No sensitive keys exposed in client bundle

### 5.2 Database Security
- [ ] ✅ RLS is enabled on all tables
- [ ] ✅ No public insert policies (writes through API only)
- [ ] ✅ Service role key used for all writes

### 5.3 File Storage Security
- [ ] ✅ Files uploaded through secure API routes
- [ ] ✅ File URLs stored in database
- [ ] ✅ Public bucket allows file access

---

## 🎉 **Success Checklist**

- [ ] ✅ Database schema created and working
- [ ] ✅ Supabase Storage bucket configured
- [ ] ✅ File uploads working
- [ ] ✅ Roast generation working
- [ ] ✅ Email capture working
- [ ] ✅ Production deployment successful
- [ ] ✅ All security measures in place

---

## 🚨 **Troubleshooting**

### Common Issues

#### 1. Build Errors
- [ ] Check all environment variables are set
- [ ] Verify Supabase project URL is correct
- [ ] Ensure service role key has proper permissions

#### 2. File Upload Failures
- [ ] Verify Supabase Storage bucket exists
- [ ] Check bucket is public
- [ ] Verify file size limits
- [ ] Check allowed MIME types

#### 3. Database Errors
- [ ] Verify database schema is created
- [ ] Check RLS policies
- [ ] Ensure service role key has proper permissions

#### 4. Roast Generation Failures
- [ ] Check OpenAI API key is valid
- [ ] Verify API rate limits
- [ ] Check environment variables

---

## 📝 **Final Notes**

- **Security**: All writes go through secure API routes with service role key
- **Scalability**: Supabase Storage handles file storage, database handles data
- **Performance**: Files are served directly from Supabase CDN
- **Monitoring**: Check Supabase dashboard for usage and errors

**Ready for production!** 🚀 