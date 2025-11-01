# Domain Name Availability Checker

A full-stack application for checking domain name availability across multiple TLDs (.com, .ai, .se, .no). Perfect for finding the right name for your AI company in the Nordics!

## Features

- **Bulk Domain Checking**: Paste multiple domain suggestions and check them all at once
- **Multiple TLD Support**: Check availability for .com, .ai, .se, and .no domains
- **Smart Filtering**: Filter by TLD combinations, availability status, or search by name
- **Shortlist Management**: Mark favorites and create a shortlist for the best candidates
- **Re-verification**: Re-check shortlisted domains to ensure they're still available
- **Export to CSV**: Export your domain search results for later reference
- **Shared Team Storage**: All data synced across your team in real-time! ✨
- **Real-time Checking**: Professional domain availability checking via RapidAPI Domainr
- **Deploy Anywhere**: Easy deployment to Railway, Render, or Fly.io (free tiers available)

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development and building
- Axios for API calls
- CSS3 with modern styling

### Backend
- Node.js with Express
- TypeScript
- RapidAPI Domainr integration for accurate domain checking
- JSON file-based shared storage (no database needed!)
- Rate-limited bulk checking

## Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Setup

1. **Clone or navigate to the project directory**
```bash
cd domain
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Configure RapidAPI (Recommended for accurate results)**

The app works without API configuration using DNS fallback, but for best results, set up the free RapidAPI Domainr integration:

a. **Sign up for RapidAPI** (free): https://rapidapi.com/

b. **Subscribe to Domainr API** (free tier - 10,000 requests/month):
   - Go to: https://rapidapi.com/domainr/api/domainr
   - Click "Subscribe to Test"
   - Select the **FREE** plan (Basic - 10k requests/month)
   - No credit card required!

c. **Get your API key**:
   - After subscribing, you'll see your API key in the code snippets
   - Copy the value from `x-rapidapi-key: YOUR_KEY_HERE`

d. **Create `.env` file in backend directory**:
```bash
cd backend
cp .env.example .env
```

e. **Edit the `.env` file** and add your API key:
```
RAPIDAPI_KEY=your_actual_api_key_here
RAPIDAPI_HOST=domainr.p.rapidapi.com
PORT=3001
```

**Note**: The app will work without RapidAPI using DNS checking, but RapidAPI provides much more accurate results!

## Running the Application

You'll need two terminal windows - one for the backend and one for the frontend.

### Terminal 1: Start the Backend
```bash
cd backend
npm run dev
```
The backend will start on http://localhost:3001

### Terminal 2: Start the Frontend
```bash
cd frontend
npm run dev
```
The frontend will start on http://localhost:3000

Open your browser and navigate to **http://localhost:3000**

## Usage Guide

### 1. Add Domain Suggestions
- In the input area, paste your domain name ideas (one per line)
- Don't include the extension (.com, .ai, etc.) - the app will check all of them
- Click "Check Availability" to start the bulk check

Example input:
```
nordicai
aicompany
scandinaviatech
northerndata
vikingai
```

### 2. View Results
- All checked domains appear in the "All Domain Suggestions" table
- Green badge = Available
- Red badge = Taken
- Gray badge = Unknown (verification failed)

### 3. Filter Results
- Check/uncheck TLD boxes to show only specific extensions
- Use "Show only available domains" to filter out taken domains
- Search by domain name in the search box

### 4. Create a Shortlist
- Click the star (☆) icon next to any domain to add it to your shortlist
- Favorited domains show a filled star (★)
- The shortlist appears in a separate table below

### 5. Re-verify Shortlist
- Domain availability can change quickly
- Click "Re-verify All" in the shortlist section to check if your favorites are still available
- The "Last Checked" column shows when each domain was last verified

### 6. Export Results
- Click "Export CSV" to download your domain search results
- The CSV includes all domains and their availability status for each TLD

## Domain Checking Method

The application uses a **two-tier checking system**:

### Primary: RapidAPI Domainr (Recommended)
When configured with your free RapidAPI key:
1. **Professional Domain Status API**: Uses Domainr's `/v2/status` endpoint
2. **Accurate Results**: Checks actual WHOIS and registration data
3. **Multiple Status Types**: Distinguishes between active, inactive, parked, etc.
4. **Rate Limited**: 250ms delay between checks to respect API limits
5. **Free Tier**: 10,000 requests/month (plenty for your needs!)

Status meanings:
- ✅ **Available**: `inactive`, `undelegated`, or `unknown` status
- ❌ **Taken**: `active`, `parked`, `redirect`, etc.

### Fallback: DNS Resolution
If RapidAPI is not configured, the app automatically falls back to:
1. **DNS Lookup**: Queries Google's DNS API to check if domain resolves
2. **Quick Check**: Fast but less accurate than WHOIS data
3. **No API Key Needed**: Works out of the box

**Recommendation**: Set up the free RapidAPI key for production-quality results!

## Shared Team Storage

Domain data is now stored on the **backend server** in a JSON file:
- ✅ **Shared across all team members** - Everyone sees the same data
- ✅ **Real-time sync** - Changes appear for everyone instantly
- ✅ **Persistent** - Data survives server restarts
- ✅ **No database needed** - Simple JSON file storage
- 📁 Stored in: `backend/data/domains.json`

### Testing Shared Storage Locally

1. Add domains in one browser window
2. Open an incognito window to `localhost:3000`
3. You'll see the same domains! 🎉

See **SHARED-STORAGE-SETUP.md** for detailed testing guide.

## Deploying for Team Access

Want your whole team to access this from anywhere? Deploy it!

📖 **See DEPLOYMENT.md for full deployment guide**

### Quick Deploy Options:

1. **Railway.app** (Recommended - 5 minutes)
   - Free $5/month credit
   - Auto-deploy from GitHub
   - Built-in persistent storage

2. **Render.com** (Also easy)
   - Free tier available
   - Auto-deploy from GitHub
   - Add persistent disk

3. **Fly.io** (More control)
   - Free tier with volumes
   - CLI-based deployment

All options include:
- ✅ HTTPS automatic
- ✅ Custom domains supported
- ✅ Auto-scaling
- ✅ Free tiers available

## Building for Production

### Build the frontend
```bash
cd frontend
npm run build
```

### Build the backend
```bash
cd backend
npm run build
npm start
```

## Project Structure

```
domain/
├── backend/
│   ├── src/
│   │   ├── index.ts           # Express server
│   │   └── domainChecker.ts   # Domain availability logic
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DomainInput.tsx    # Input form
│   │   │   ├── Filters.tsx        # Filter controls
│   │   │   ├── DomainTable.tsx    # Main results table
│   │   │   └── Shortlist.tsx      # Shortlist table
│   │   ├── App.tsx               # Main app component
│   │   ├── App.css              # Styles
│   │   ├── types.ts             # TypeScript interfaces
│   │   └── main.tsx             # Entry point
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── README.md
```

## API Endpoints

### POST `/api/check-domain`
Check a single domain with multiple TLDs
```json
{
  "domain": "example",
  "tlds": ["com", "ai", "se", "no"]
}
```

### POST `/api/check-domains-bulk`
Check multiple domains with multiple TLDs
```json
{
  "domains": ["example1", "example2"],
  "tlds": ["com", "ai", "se", "no"]
}
```

### GET `/api/health`
Health check endpoint

## Future Enhancements

- Integration with commercial domain availability APIs
- WHOIS data display (registrar, expiration date, etc.)
- Domain price comparison across registrars
- Domain suggestion/generation based on keywords
- Multi-language support
- Dark mode
- Mobile app version
- Shared shortlists via URL

## License

MIT

## Support

For issues or questions, please check that:
1. Both backend and frontend servers are running
2. You're using Node.js 18 or higher
3. Port 3000 and 3001 are available

Happy domain hunting! 🚀
