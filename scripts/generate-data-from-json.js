import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This script allows you to use a local data.json file OR generate from env vars
// Priority: Local data.json (if exists) > Environment Variables > Example file

const dataPath = path.join(__dirname, '..', 'data.json');
const examplePath = path.join(__dirname, '..', 'data.json.example');

// Vercel/CI always regenerates from env vars. Locally, keep data.json when developing.
const isRemoteBuild =
  process.env.VERCEL === '1' ||
  process.env.CI === 'true' ||
  process.env.NODE_ENV === 'production';

const useLocalData = fs.existsSync(dataPath) && !isRemoteBuild;

if (useLocalData) {
  console.log('📝 Using existing data.json for local development');
  process.exit(0);
}

console.log('🔧 Generating data.json from environment variables...');
console.log(`   (VERCEL=${process.env.VERCEL ?? 'unset'}, NODE_ENV=${process.env.NODE_ENV ?? 'unset'})`);

let portfolioData;

// Start with example data as base
portfolioData = JSON.parse(fs.readFileSync(examplePath, 'utf-8'));

// Helper function to safely parse JSON from env
const parseEnvJson = (key, defaultValue) => {
  const value = process.env[key];
  if (!value) return defaultValue;
  try {
    return JSON.parse(value);
  } catch {
    console.warn(`⚠️  Invalid JSON for ${key}, using default`);
    return defaultValue;
  }
};

// Override with environment variables
if (process.env.VITE_PERSONAL_NAME) {
  portfolioData.personal.name = process.env.VITE_PERSONAL_NAME;
}
if (process.env.VITE_PERSONAL_TITLE) {
  portfolioData.personal.title = process.env.VITE_PERSONAL_TITLE;
}
if (process.env.VITE_PERSONAL_BADGE) {
  portfolioData.personal.badge = process.env.VITE_PERSONAL_BADGE;
}
if (process.env.VITE_PERSONAL_DESCRIPTION) {
  portfolioData.personal.description = process.env.VITE_PERSONAL_DESCRIPTION;
}
if (process.env.VITE_PERSONAL_LOCATION) {
  portfolioData.personal.location = process.env.VITE_PERSONAL_LOCATION;
}
if (process.env.VITE_PERSONAL_EMAIL) {
  portfolioData.personal.email = process.env.VITE_PERSONAL_EMAIL;
}
if (process.env.VITE_PERSONAL_PHONE) {
  portfolioData.personal.phone = process.env.VITE_PERSONAL_PHONE;
}

if (process.env.VITE_SOCIAL_LINKS) {
  portfolioData.socialLinks = parseEnvJson('VITE_SOCIAL_LINKS', portfolioData.socialLinks);
}

if (process.env.VITE_STATS_PROJECTS) {
  portfolioData.stats.projects = parseInt(process.env.VITE_STATS_PROJECTS) || portfolioData.stats.projects;
}
if (process.env.VITE_STATS_EXPERIENCE) {
  portfolioData.stats.experience = parseInt(process.env.VITE_STATS_EXPERIENCE) || portfolioData.stats.experience;
}
if (process.env.VITE_STATS_SATISFACTION) {
  portfolioData.stats.satisfaction = parseInt(process.env.VITE_STATS_SATISFACTION) || portfolioData.stats.satisfaction;
}

if (process.env.VITE_ABOUT_DESCRIPTION) {
  portfolioData.about.description = parseEnvJson('VITE_ABOUT_DESCRIPTION', portfolioData.about.description);
}

if (process.env.VITE_ABOUT_FEATURES) {
  portfolioData.about.features = parseEnvJson('VITE_ABOUT_FEATURES', portfolioData.about.features);
}

if (process.env.VITE_SKILLS) {
  portfolioData.skills = parseEnvJson('VITE_SKILLS', portfolioData.skills);
}

if (process.env.VITE_EXPERIENCE) {
  portfolioData.experience = parseEnvJson('VITE_EXPERIENCE', portfolioData.experience);
}

if (process.env.VITE_PROJECTS) {
  portfolioData.projects = parseEnvJson('VITE_PROJECTS', portfolioData.projects);
}

if (process.env.VITE_EDUCATION) {
  portfolioData.education = parseEnvJson('VITE_EDUCATION', portfolioData.education);
}

if (process.env.VITE_CERTIFICATIONS) {
  portfolioData.certifications = parseEnvJson('VITE_CERTIFICATIONS', portfolioData.certifications);
}

if (process.env.VITE_LANGUAGES) {
  portfolioData.languages = parseEnvJson('VITE_LANGUAGES', portfolioData.languages);
}

// Write the generated data.json
fs.writeFileSync(dataPath, JSON.stringify(portfolioData, null, 2), 'utf-8');
console.log('✅ data.json generated successfully');
