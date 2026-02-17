# Deployment Guide

This portfolio uses environment variables to protect your personal data while allowing deployment from GitHub.

## How It Works

- **Local Development**: Uses your local `data.json` file (gitignored, stays private)
- **Production Build**: Generates `data.json` from environment variables during build
- **GitHub**: Only contains `data.json.example` (template with placeholder data)

## Setup for Local Development

1. **Keep your real `data.json` locally** - It's already in `.gitignore`, so it won't be committed.

2. **For development**, just run:
   ```bash
   npm run dev
   ```
   The script will detect your local `data.json` and use it automatically.

## Setup for Production Deployment

### Step 1: Prepare Your Data

Copy your real `data.json` content and prepare it for environment variables.

### Step 2: Set Environment Variables in Hosting Platform

**For Vercel/Netlify**, go to your project settings → Environment Variables and add:

#### Simple Variables (Strings/Numbers):
- `VITE_PERSONAL_NAME` = `Goutam`
- `VITE_PERSONAL_TITLE` = `Full Stack Developer`
- `VITE_PERSONAL_BADGE` = `👋 Welcome`
- `VITE_PERSONAL_DESCRIPTION` = `Your description text`
- `VITE_PERSONAL_LOCATION` = `Bhubaneswar, India`
- `VITE_PERSONAL_EMAIL` = `goutamsahu602@gmail.com`
- `VITE_PERSONAL_PHONE` = `+91 9078774040`
- `VITE_STATS_PROJECTS` = `20`
- `VITE_STATS_EXPERIENCE` = `2`
- `VITE_STATS_SATISFACTION` = `100`

#### Complex Variables (JSON Arrays/Objects):

**VITE_SOCIAL_LINKS** (copy your socialLinks array as JSON string):
```json
[{"name":"GitHub","icon":"FaGithub","href":"https://github.com/Goutamsahu23/"},{"name":"LinkedIn","icon":"FaLinkedin","href":"linkedin.com/in/goutamsahu23/"},{"name":"Email","icon":"FaEnvelope","href":"mailto:goutamsahu602@gmail.com"}]
```

**VITE_ABOUT_DESCRIPTION** (copy your description array):
```json
["With a passion for creating beautiful and functional web experiences, I specialize in building modern, responsive applications that not only look great but also perform exceptionally well.","My journey in web development started with curiosity and has evolved into a career where I get to solve complex problems and bring ideas to life. I'm always learning and staying up-to-date with the latest technologies and best practices."]
```

**VITE_ABOUT_FEATURES** (copy your features array):
```json
[{"title":"Clean Code","icon":"FaCode","description":"Writing maintainable and scalable code following best practices."},{"title":"Fast Performance","icon":"FaRocket","description":"Optimized applications that load quickly and run smoothly."},{"title":"Passionate","icon":"FaHeart","description":"Love what I do and always eager to learn new technologies."}]
```

**VITE_SKILLS** (copy your entire skills array from data.json)

**VITE_EXPERIENCE** (copy your entire experience array from data.json)

**VITE_PROJECTS** (copy your entire projects array from data.json)

### Step 3: Deploy

When you deploy:
1. The build script runs automatically
2. It reads environment variables
3. Generates `data.json` from them
4. Build continues with your real data

## Quick Setup Checklist

1. ✅ Commit to GitHub:
   - `data.json.example` (template)
   - `scripts/generate-data-from-json.js` (build script)
   - `.env.example` (reference)
   - `.gitignore` (with data.json)

2. ✅ Keep private (already gitignored):
   - `data.json` (your real data)

3. ✅ Set environment variables in hosting platform

4. ✅ Deploy - Script generates `data.json` automatically!

## Tips

- **For complex JSON**: Use a JSON formatter to ensure valid JSON strings
- **Testing**: Set `NODE_ENV=production` locally to test the generation
- **Fallback**: If env vars are missing, it uses `data.json.example` as fallback
