# Quick Start Guide

## Optional: Set Up RapidAPI (Recommended - Takes 2 minutes!)

For the most accurate domain availability results, set up the **free** RapidAPI integration:

1. Sign up at https://rapidapi.com/ (free, no credit card)
2. Subscribe to Domainr API (free tier): https://rapidapi.com/domainr/api/domainr
3. Copy your API key from the code snippets
4. Create `backend/.env` file:
   ```bash
   cd backend
   cp .env.example .env
   ```
5. Edit `.env` and add your key:
   ```
   RAPIDAPI_KEY=your_key_here
   ```

**Note**: The app works without this using DNS fallback, but RapidAPI gives production-quality results!

## Running the Application

You need **TWO terminal windows** to run this application.

### Terminal 1: Backend Server
```bash
cd backend
npm run dev
```
✅ Backend will start on **http://localhost:3001**

### Terminal 2: Frontend Server
```bash
cd frontend
npm run dev
```
✅ Frontend will start on **http://localhost:3000**

### Open Your Browser
Navigate to **http://localhost:3000**

## Quick Test

1. **Add some domain names** in the input box (one per line):
   ```
   nordicai
   aicompany
   scandinaviatech
   ```

2. **Click "Check Availability"**

3. **View results** in the table showing availability for .com, .ai, .se, .no

4. **Star your favorites** (☆) to add them to shortlist

5. **Re-verify** shortlisted domains anytime

6. **Export to CSV** for sharing or backup

## Features Overview

- ✅ Bulk domain checking
- ✅ Filter by TLD (.com, .ai, .se, .no)
- ✅ Search domains by name
- ✅ Shortlist your favorites
- ✅ Re-verify availability
- ✅ Export to CSV
- ✅ Auto-save to browser storage

## Troubleshooting

**Backend won't start?**
- Make sure port 3001 is available
- Check that you ran `npm install` in the backend folder

**Frontend won't start?**
- Make sure port 3000 is available
- Check that you ran `npm install` in the frontend folder

**Domain checks failing?**
- Ensure backend is running first
- Check browser console for errors
- Verify internet connection (needed for DNS lookups)

## Need Help?

See the full [README.md](README.md) for detailed documentation.
