# Amardharani Photography - Production-Ready Website

A complete, production-ready luxury wedding photography website with cinematic video hero, responsive design, enquiry management, and Google Sheet integration.

## 🚀 Quick Start

### 1. Extract ZIP
Extract `amardharani-photography-final.zip` to your desired location.

### 2. Open in VS Code
```bash
cd amardharani-photography
code .
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```

Opens at `http://localhost:3000`

### 5. Build for Production
```bash
npm run build
```

Output in `dist/` folder - ready to deploy!

---

## 📋 Complete Setup Guide

### Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create new spreadsheet: "Amardharani Photography - Enquiries"
3. Add these column headers in row 1:
   - A: Timestamp
   - B: Name
   - C: Phone
   - D: Email
   - E: Event Type
   - F: Event Date
   - G: Location
   - H: Message
   - I: Source

4. Copy Sheet ID from URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

### Step 2: Setup Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Create new project
3. Open `google-apps-script/Code.gs` in this project
4. Copy all the code
5. Paste it into the Apps Script editor
6. Find this line:
   ```javascript
   const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE'
   ```
7. Replace with your Sheet ID from Step 1
8. Click **Save**

### Step 3: Deploy Google Apps Script

1. Click **Deploy** button (top right)
2. Select **New Deployment**
3. Choose type: **Web app**
4. Execute as: **Your email**
5. Who has access: **Anyone**
6. Click **Deploy**
7. Copy the "Web app URL" from the success dialog

Example URL:
```
https://script.google.com/macros/d/ABC123xyz/usercache
```

### Step 4: Configure Frontend

1. Create file `.env.local` in project root (copy from `.env.example`)
2. Add your Apps Script URL:
   ```
   VITE_APPS_SCRIPT_URL=https://script.google.com/macros/d/ABC123xyz/usercache
   ```
3. Save file
4. Restart dev server if running

### Step 5: Test Enquiry Form

1. Open website at `http://localhost:3000`
2. Click "Enquire Now" button
3. Fill form with test data:
   - Name: Test User
   - Phone: +91 9976655036
   - Email: test@example.com
   - Event Type: Wedding Photography
   - Event Date: Select a future date
   - Location: Test City
4. Click "SEND ENQUIRY"
5. Check your Google Sheet - new row should appear!

---

## 🎬 Adding Hero Video

### Video Requirements

- **Duration**: 8-20 seconds
- **Format**: MP4 (H.264 codec)
- **Resolution**: 1920x1080px minimum
- **File Size**: 3-8 MB (optimized for web)
- **Frame Rate**: 24-30 fps
- **Audio**: Muted (no audio track)

### Optimize Video (FFmpeg)

Install FFmpeg from [ffmpeg.org](https://ffmpeg.org)

```bash
# Optimize your wedding video
ffmpeg -i your-video.mp4 \
  -vcodec libx264 \
  -preset slow \
  -crf 24 \
  -vf "scale=1920:-1" \
  -an \
  hero-wedding.mp4
```

### Create Poster Image

```bash
# Extract first frame as poster
ffmpeg -i hero-wedding.mp4 -ss 00:00:03 -vframes 1 hero-poster.jpg
```

### Place Files

```
src/assets/
├── videos/
│   └── hero-wedding.mp4 (REQUIRED)
└── hero-poster.jpg (REQUIRED)
```

### Test

Run `npm run dev` and verify video plays behind hero content.

---

## 🏞️ Adding Your Photos

### Replace Logo

1. Find: `src/assets/logo-nav.svg` and `src/assets/logo-footer.svg`
2. Replace with your Amardharani Photography logo
3. Can be SVG or PNG format
4. No code changes needed

### Replace Featured Stories

1. Add photos to `src/assets/stories/`
2. In `App.jsx`, find: `src={`/placeholder-story-${story.id}.jpg`}`
3. Change to: `src={`/stories/story-${story.id}.jpg`}`

### Replace Service Images

1. Add photos to `src/assets/services/`
2. In `App.jsx`, find: `src={`/placeholder-service-${idx + 1}.jpg`}`
3. Change to: `src={`/services/service-${idx + 1}.jpg`}`

### Replace Team Photos

1. Add photos to `src/assets/team/`
2. In `App.jsx`, find: `src={`/placeholder-team-${idx + 1}.jpg`}`
3. Change to: `src={`/team/team-${idx + 1}.jpg`}`

### Replace Gallery Images

1. Add photos to `src/assets/gallery/`
2. In `App.jsx`, find: `src={`/placeholder-gallery-${idx}.jpg`}`
3. Change to: `src={`/gallery/gallery-${idx}.jpg`}`

### Replace Background Images

Replace these in `App.jsx`:
- `placeholder-about.jpg` → Your about/team image
- `placeholder-quote-bg.jpg` → Your cinematic background
- `placeholder-cta-bg.jpg` → Your final CTA background

---

## 📞 Update Contact Information

Search `App.jsx` for these values and replace:

- **Primary Phone**: `99766 55036` → Your phone
- **Secondary Phone**: `94422 36843` → Your secondary phone
- **Email**: `amardharaniphotography@gmail.com` → Your email

All contact links will continue to work with new values.

---

## ✨ Features

✅ **Cinematic Video Hero** - Full-screen background video  
✅ **Responsive Design** - Mobile, tablet, desktop  
✅ **Enquiry Form** - Full validation with Google Apps Script  
✅ **Google Sheet Storage** - Enquiries saved automatically  
✅ **Phone Calls** - Real tel: links for calling  
✅ **WhatsApp** - Click-to-chat functionality  
✅ **Email** - Mailto links  
✅ **Smooth Navigation** - Scroll-to sections  
✅ **Premium Design** - Luxury editorial aesthetic  
✅ **SEO Optimized** - Meta tags, semantic HTML  
✅ **Accessibility** - WCAG compliant  
✅ **Performance** - Optimized loading  

---

## 📱 Project Structure

```
amardharani-photography/
├── src/
│   ├── App.jsx (Main application)
│   ├── main.jsx (React entry)
│   ├── index.css (Global styles)
│   └── assets/
│       ├── logo-nav.svg
│       ├── logo-footer.svg
│       ├── hero-poster.jpg
│       ├── videos/
│       │   └── hero-wedding.mp4
│       ├── stories/
│       ├── services/
│       ├── team/
│       └── gallery/
├── google-apps-script/
│   └── Code.gs (Backend)
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── .gitignore
└── README.md
```

---

## 🌐 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
# Follow prompts
# Add VITE_APPS_SCRIPT_URL in dashboard
```

### Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
# Add environment variables in dashboard
```

### Traditional Hosting

1. Build: `npm run build`
2. Upload `dist/` folder to server
3. Configure web server for SPA (serve index.html for all routes)
4. Add environment variable: `VITE_APPS_SCRIPT_URL`

---

## 🆘 Troubleshooting

### Video Not Playing
- Check file at `src/assets/videos/hero-wedding.mp4`
- Verify MP4 format with H.264 codec
- Poster should display as fallback

### Form Not Submitting
- Check `.env.local` has `VITE_APPS_SCRIPT_URL`
- Verify Apps Script is deployed
- Check browser console for errors

### Images Not Showing
- Verify files exist in correct directories
- Check file paths (case-sensitive)
- Clear browser cache

### Dev Server Won't Start
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Try `npm run dev` again

---

## 📚 File Locations

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main React application |
| `src/main.jsx` | React entry point |
| `src/index.css` | Global styles |
| `google-apps-script/Code.gs` | Backend (deploy separately) |
| `.env.local` | Configuration (create from .env.example) |
| `index.html` | HTML entry point |
| `package.json` | Dependencies |

---

## 🔒 Security

✅ **Google Sheet credentials NEVER in frontend**  
✅ **Only public Apps Script URL in code**  
✅ **Server-side form validation**  
✅ **.env.local in .gitignore**  
✅ **No API keys exposed**  

---

## ✅ Testing Checklist

Before deploying:

- [ ] `npm run dev` works
- [ ] Website loads at http://localhost:3000
- [ ] Navigation works
- [ ] Hero video plays
- [ ] Enquire form opens
- [ ] Form validation works
- [ ] Form submits successfully
- [ ] Data appears in Google Sheet
- [ ] Phone buttons work
- [ ] WhatsApp works
- [ ] Email works
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] `npm run build` succeeds

---

## 🎉 You're Ready!

Your complete Amardharani Photography website is ready to use.

**Next Steps:**
1. Setup Google Sheet + Apps Script (25 minutes)
2. Add your video + images (varies)
3. Deploy to production (5 minutes)

**Total Time: 30-60 minutes**

---

## 📞 Support

**Setup questions**: See this README  
**Google Apps Script help**: See `google-apps-script/Code.gs`  
**Video optimization**: See "Adding Hero Video" section above  
**Deployment**: See "Deployment" section above  

---

**Questions? Start with the Quick Start section above, then refer to the Complete Setup Guide.**

---

© 2024 Amardharani Photography. All Rights Reserved.
