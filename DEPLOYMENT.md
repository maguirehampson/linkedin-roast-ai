# 🚀 LinkedIn Roast AI - Deployment Guide

## ✅ Pre-Deployment Checklist

### Environment Variables
- [ ] `OPENAI_API_KEY` is set in your deployment platform
- [ ] `OPENAI_MODEL` is set (optional, defaults to gpt-4)
- [ ] `OPENAI_MAX_TOKENS` is set (optional, defaults to 2000)

### File Structure
- [ ] All API routes are in place (`/api/upload`, `/api/extract-text`, `/api/roast`, `/api/email`)
- [ ] Database layer is implemented (`lib/db.ts`)
- [ ] File serving route is configured (`/api/uploads/[...path]`)
- [ ] `.gitignore` excludes `/uploads/` and `/data/` directories

### Dependencies
- [ ] `pdf-parse` is installed for PDF text extraction
- [ ] `@types/pdf-parse` is installed for TypeScript support
- [ ] All other dependencies are properly installed

## 🎯 Deployment Options

### Option 1: Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "MVP ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Set Environment Variables**
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add:
     - `OPENAI_API_KEY` = your OpenAI API key
     - `OPENAI_MODEL` = gpt-4 (optional)
     - `OPENAI_MAX_TOKENS` = 2000 (optional)

4. **Deploy**
   - Vercel will automatically deploy on every push
   - Your app will be available at `https://your-project.vercel.app`

### Option 2: Railway

1. **Connect to Railway**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository

2. **Set Environment Variables**
   - Add the same environment variables as above

3. **Deploy**
   - Railway will automatically deploy

### Option 3: Netlify

1. **Build Command**
   ```bash
   npm run build
   ```

2. **Publish Directory**
   ```
   .next
   ```

3. **Environment Variables**
   - Add the same environment variables as above

## 🔧 Post-Deployment Verification

### Test These Features:

1. **File Upload**
   - Upload a PDF file
   - Verify it's stored in `/uploads/` directory

2. **PDF Text Extraction**
   - Upload a LinkedIn profile PDF
   - Check that text is extracted properly

3. **AI Roast Generation**
   - Submit a roast request
   - Verify OpenAI API is working
   - Check that results are stored in `/data/roasts.json`

4. **Email Capture**
   - Submit an email
   - Verify it's stored in `/data/emails.json`

5. **File Serving**
   - Access uploaded files via `/api/uploads/[filename]`

## 🛠️ Troubleshooting

### Common Issues:

1. **Environment Variables Not Loading**
   - Ensure variables are set in your deployment platform
   - Check that variable names match exactly
   - Restart the deployment after adding variables

2. **File Upload Fails**
   - Check that `/uploads/` directory exists
   - Verify file size limits (10MB)
   - Check file type validation

3. **PDF Text Extraction Fails**
   - Ensure `pdf-parse` is properly installed
   - Check that PDF files are valid
   - Verify file permissions

4. **OpenAI API Errors**
   - Verify API key is correct
   - Check API usage limits
   - Ensure model name is correct

### Debug Commands:

```bash
# Check if build works locally
npm run build

# Test development server
npm run dev

# Check environment variables
echo $OPENAI_API_KEY

# Verify file structure
ls -la uploads/
ls -la data/
```

## 📊 Monitoring

### What to Monitor:

1. **API Response Times**
   - File upload speed
   - PDF extraction time
   - OpenAI API response time

2. **Error Rates**
   - File upload failures
   - PDF extraction errors
   - OpenAI API errors

3. **Storage Usage**
   - Upload directory size
   - Database file sizes

4. **User Engagement**
   - Number of roasts generated
   - Email capture rate
   - Social shares

## 🔒 Security Considerations

### Current MVP Security:
- ✅ Environment variables are server-side only
- ✅ File uploads are validated
- ✅ No sensitive data in client code
- ✅ Uploaded files are gitignored

### For Production:
- [ ] Add rate limiting
- [ ] Implement user authentication
- [ ] Use cloud storage (S3, Cloudinary)
- [ ] Add proper database (PostgreSQL, MongoDB)
- [ ] Implement CSRF protection
- [ ] Add input sanitization

## 🚀 Next Steps After Deployment

1. **Test the full user flow**
2. **Monitor for errors**
3. **Gather user feedback**
4. **Plan production improvements**

---

**Your MVP is ready to deploy!** 🎉

The application now has:
- ✅ Real PDF processing
- ✅ File upload and storage
- ✅ AI roast generation
- ✅ Data persistence
- ✅ Email capture
- ✅ Social sharing
- ✅ Beautiful UI

Deploy with confidence! 