# LinkedIn Roast AI - Test Mode

🔥 **Currently in TEST MODE** - No database storage, perfect for rapid testing and feedback.

## 🎯 Current Status

- ✅ **Working**: Core roast generation with OpenAI
- ✅ **Working**: All new v2.5 features (vibe tags, share quotes, diagnostics)
- ✅ **Working**: Simple text input interface
- ⏸️ **Paused**: File uploads and database storage
- ⏸️ **Paused**: Email capture and sharing features

## 🧪 How to Test

1. **Enter your career goals** (e.g., "I want to switch from marketing to data science")
2. **Paste your LinkedIn profile text** (About section, bio, etc.)
3. **Click "🔥 Roast Me!"** to get savage feedback
4. **Review all the new features**:
   - Vibe tags
   - Share quotes
   - Diagnostics
   - Hashtags to avoid
   - Skills to highlight

## 🚀 Features to Test

### Core Roasting
- [ ] Roast quality and savagery
- [ ] Constructive feedback usefulness
- [ ] Score accuracy

### New v2.5 Features
- [ ] Vibe tags relevance
- [ ] Share quotes viral potential
- [ ] Diagnostics precision
- [ ] Hashtag suggestions
- [ ] Skill highlighting

### UI/UX
- [ ] Form usability
- [ ] Results display
- [ ] Copy functionality
- [ ] Mobile responsiveness

## 📝 Feedback Areas

Please test and provide feedback on:

1. **Roast Quality**: Is it savage enough? Too savage? Just right?
2. **Usefulness**: Does the feedback actually help improve profiles?
3. **Viral Potential**: Would you share these results?
4. **UI/UX**: What would make it better?
5. **Missing Features**: What else would you want?

## 🔄 Next Steps (After Testing)

1. **Re-integrate file uploads** (PDF processing)
2. **Add database storage** (Supabase)
3. **Add email capture**
4. **Add social sharing**
5. **Deploy to production**

## 🛠️ Technical Notes

- **No database dependencies** - everything is in-memory
- **No file storage** - text input only
- **OpenAI API only** - no other external services
- **Simple deployment** - just needs OpenAI key

## ⚙️ Test Mode Flag

This project uses a `TEST_MODE` environment variable to control which features are enabled:

- When `TEST_MODE=true` (default for local testing):
  - File upload, PDF extraction, and AI roast generation are **enabled** for local iteration and prompt tuning
  - Database, email capture, and sharing features are **paused** (disabled in both backend and frontend)
  - All data is ephemeral/local, nothing is persisted to a DB or sent to external storage
- When `TEST_MODE=false` (for production):
  - All features are enabled (if environment variables are set)

**To enable/disable Test Mode:**
- Set `TEST_MODE=true` in your `.env.local` for local development/testing
- Set `TEST_MODE=false` in your deployment environment to enable all features

---

**Ready for testing!** 🎉 