import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Prints the VITE_* environment variables that reproduce your local data.json,
// ready to paste into Vercel/Netlify project settings.
// Usage: npm run export-env          (human-readable, one block per variable)
//        npm run export-env -- --env (dotenv format, single line per variable)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '..', 'data.json');

if (!fs.existsSync(dataPath)) {
  console.error('❌ data.json not found. Create it first (see data.json.example).');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
const dotenvFormat = process.argv.includes('--env');

const vars = [
  ['VITE_PERSONAL_NAME', data.personal?.name],
  ['VITE_PERSONAL_TITLE', data.personal?.title],
  ['VITE_PERSONAL_BADGE', data.personal?.badge],
  ['VITE_PERSONAL_DESCRIPTION', data.personal?.description],
  ['VITE_PERSONAL_LOCATION', data.personal?.location],
  ['VITE_PERSONAL_EMAIL', data.personal?.email],
  ['VITE_PERSONAL_PHONE', data.personal?.phone],
  ['VITE_STATS_PROJECTS', data.stats?.projects],
  ['VITE_STATS_EXPERIENCE', data.stats?.experience],
  ['VITE_STATS_SATISFACTION', data.stats?.satisfaction],
  ['VITE_SOCIAL_LINKS', data.socialLinks],
  ['VITE_ABOUT_DESCRIPTION', data.about?.description],
  ['VITE_ABOUT_FEATURES', data.about?.features],
  ['VITE_SKILLS', data.skills],
  ['VITE_EXPERIENCE', data.experience],
  ['VITE_PROJECTS', data.projects],
  ['VITE_EDUCATION', data.education],
  ['VITE_CERTIFICATIONS', data.certifications],
  ['VITE_LANGUAGES', data.languages],
];

const serialize = (value) =>
  typeof value === 'object' ? JSON.stringify(value) : String(value);

for (const [key, value] of vars) {
  if (value === undefined || value === null) continue;

  if (dotenvFormat) {
    console.log(`${key}=${JSON.stringify(serialize(value))}`);
  } else {
    console.log(`\n──────── ${key} ────────`);
    console.log(serialize(value));
  }
}

if (!dotenvFormat) {
  console.log('\n✅ Paste each value into your hosting platform\'s environment variables.');
  console.log('   Run with --env for dotenv-style output.');
}
