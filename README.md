# LinkedIn Roast AI 🔥

A brutally honest AI-powered LinkedIn profile roasting application that provides savage feedback with constructive suggestions.

## 🚀 MVP Features (Ready for Deployment)

- **Real PDF Processing**: Upload LinkedIn profile PDFs and extract actual text content
- **AI-Powered Roasting**: Get brutally honest feedback using OpenAI GPT-4
- **File Storage**: Secure file upload and storage system
- **Data Persistence**: All roast results and email leads are stored locally
- **Score System**: Get a 0-100 score with detailed breakdown
- **Constructive Feedback**: Receive specific improvement suggestions
- **Vibe Tags**: Get categorized tags that describe your profile's energy
- **Email Capture**: Collect leads for full profile makeovers
- **Social Sharing**: Share your roast results on Twitter and LinkedIn
- **Beautiful UI**: Modern, dark-themed interface with smooth animations

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **UI Components**: Custom component library with Radix UI primitives
- **Backend**: Next.js API routes
- **File Processing**: pdf-parse for PDF text extraction
- **Storage**: Local file system (uploads/ and data/ directories)
- **AI**: OpenAI GPT-4 API

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd linkedin-roast-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

Edit `.env.local` and add your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=2000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` (optional, defaults to gpt-4)
   - `OPENAI_MAX_TOKENS` (optional, defaults to 2000)
4. Deploy automatically

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

**Note**: For production deployments, consider:
- Using a proper database (PostgreSQL, MongoDB) instead of local JSON files
- Implementing cloud storage (AWS S3, Cloudinary) for file uploads
- Adding rate limiting and security measures

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── roast/route.ts          # AI roast generation
│   │   ├── upload/route.ts         # File upload handling
│   │   ├── extract-text/route.ts   # PDF text extraction
│   │   ├── email/route.ts          # Email capture
│   │   └── uploads/[...path]/      # Static file serving
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Main page
├── components/
│   ├── ui/                         # Reusable UI components
│   ├── roast/                      # Roast-specific components
│   └── RoastPage.tsx              # Main page component
├── lib/
│   └── db.ts                      # Database operations (JSON files)
├── ai/
│   └── systemPrompt.ts            # AI system prompt
├── uploads/                        # Uploaded files (gitignored)
├── data/                          # Database files (gitignored)
└── package.json
```

## API Endpoints

- `POST /api/upload` - Upload files (PDF, DOC, DOCX)
- `POST /api/extract-text` - Extract text from uploaded PDFs
- `POST /api/roast` - Generate AI roast from profile text
- `POST /api/email` - Save email leads
- `GET /api/uploads/[filename]` - Serve uploaded files

## Data Storage

The MVP uses local JSON files for data persistence:
- `data/roasts.json` - All roast results
- `data/emails.json` - Email leads
- `uploads/` - Uploaded files

## Security Notes

- Environment variables are properly handled
- File uploads are validated for type and size
- No sensitive data is exposed to the client
- Uploaded files and data are gitignored

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please open an issue on GitHub or contact the development team.

---

**Ready for deployment!** This MVP includes all essential features for a working LinkedIn roast application with real file processing, AI integration, and data persistence. 