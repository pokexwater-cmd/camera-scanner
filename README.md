# Scan & Identify

Point your phone camera at anything, tap the shutter, and get an AI-generated description of what it sees — powered by Google Gemini.

## How it works
- `public/index.html` — opens your phone's camera in the browser, captures a photo, sends it to the backend.
- `server.js` — a small Express server that forwards the photo to Gemini's vision API and returns the description.

## 1. Get a Gemini API key (free)
1. Go to https://aistudio.google.com/apikey
2. Sign in with a Google account
3. Click "Create API key"
4. Copy it

## 2. Run it locally (optional, to test first)
```bash
npm install
cp .env.example .env
# paste your key into .env
npm start
```
Open `http://localhost:3000` in your browser. On desktop, your browser will ask for webcam permission.

## 3. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
```
Then create a new repo on https://github.com/new, and push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```
Your `.env` file will NOT be pushed (it's in `.gitignore`) — your API key stays private.

## 4. Deploy on Render.com
1. Go to https://render.com and sign in (can use your GitHub account)
2. Click **New +** → **Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - Key: `GEMINI_API_KEY`
   - Value: (paste your key)
6. Click **Create Web Service**

Render will give you a live URL like `https://your-app.onrender.com`. Open that on your phone — it works like a normal website with camera access (HTTPS is required for camera access, which Render provides automatically).

## Notes
- Free Render web services "sleep" after inactivity — the first request after a while can take ~30 seconds to wake up.
- Free Gemini API tier has generous but limited daily quota — fine for personal use/testing.
- To change what the AI focuses on, edit the prompt text inside `server.js` (the `text:` field in the request body).
