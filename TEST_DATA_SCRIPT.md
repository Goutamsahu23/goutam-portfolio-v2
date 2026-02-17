# Testing the data.json Generation Script Locally

This guide will help you test the `generate-data-from-json.js` script to ensure it works correctly before deployment.

## How the Script Works

The script follows this priority order:
1. **Local Development**: If `data.json` exists and `NODE_ENV !== 'production'`, it uses the existing file (skips generation)
2. **Production/No Local File**: Generates `data.json` from:
   - `data.json.example` as the base template
   - Environment variables (if set) override the example values

## Testing Steps

### Test 1: Generate from Example File (No Environment Variables)

1. **Backup your current data.json**:
   ```bash
   cp data.json data.json.backup
   ```

2. **Remove data.json** (or rename it):
   ```bash
   mv data.json data.json.original
   ```

3. **Run the generation script**:
   ```bash
   npm run generate-data
   ```
   OR
   ```bash
   node scripts/generate-data-from-json.js
   ```

4. **Verify the output**:
   - Check that `data.json` was created
   - It should contain the placeholder data from `data.json.example`
   - Check the console output - it should say "✅ data.json generated successfully"

5. **Restore your original data**:
   ```bash
   mv data.json.original data.json
   ```

### Test 2: Generate with Environment Variables

1. **Create a test .env file** (or set environment variables):
   ```bash
   # Create .env.test file
   VITE_PERSONAL_NAME="Test Name"
   VITE_PERSONAL_TITLE="Test Developer"
   VITE_PERSONAL_EMAIL="test@example.com"
   VITE_STATS_PROJECTS=50
   VITE_STATS_EXPERIENCE=5
   ```

2. **Backup and remove data.json**:
   ```bash
   cp data.json data.json.backup
   rm data.json
   ```

3. **Set NODE_ENV to production** (to force generation):
   ```bash
   # On Windows (PowerShell)
   $env:NODE_ENV="production"; node scripts/generate-data-from-json.js
   
   # On Windows (CMD)
   set NODE_ENV=production && node scripts/generate-data-from-json.js
   
   # On Linux/Mac
   NODE_ENV=production node scripts/generate-data-from-json.js
   ```

4. **Or set environment variables and run**:
   ```bash
   # Windows PowerShell
   $env:VITE_PERSONAL_NAME="Test Name"
   $env:VITE_PERSONAL_EMAIL="test@example.com"
   $env:NODE_ENV="production"
   node scripts/generate-data-from-json.js
   
   # Linux/Mac
   VITE_PERSONAL_NAME="Test Name" VITE_PERSONAL_EMAIL="test@example.com" NODE_ENV=production node scripts/generate-data-from-json.js
   ```

5. **Verify the generated data.json**:
   - Check that your environment variable values are in the generated file
   - Values not set via env vars should come from `data.json.example`

6. **Restore your original data**:
   ```bash
   mv data.json.backup data.json
   ```

### Test 3: Test with Complex JSON Environment Variables

For arrays and objects (like `socialLinks`, `skills`, `projects`), you need to pass them as JSON strings:

```bash
# Windows PowerShell
$env:VITE_SOCIAL_LINKS='[{"name":"GitHub","icon":"FaGithub","href":"https://github.com/test"}]'
$env:VITE_SKILLS='[{"category":"Frontend","skills":[{"name":"React","icon":"FaReact","level":90}]}]'
$env:NODE_ENV="production"
node scripts/generate-data-from-json.js

# Linux/Mac
VITE_SOCIAL_LINKS='[{"name":"GitHub","icon":"FaGithub","href":"https://github.com/test"}]' \
VITE_SKILLS='[{"category":"Frontend","skills":[{"name":"React","icon":"FaReact","level":90}]}]' \
NODE_ENV=production \
node scripts/generate-data-from-json.js
```

## Quick Test Script

You can also use the provided test script (see below) for automated testing.

## Expected Console Output

When the script runs successfully, you should see:
- `🔧 Generating data.json from environment variables...`
- `✅ data.json generated successfully`

If `data.json` exists in development mode:
- `📝 Using existing data.json for local development`

## Troubleshooting

- **Script doesn't generate file**: Make sure `NODE_ENV=production` is set, or `data.json` doesn't exist
- **Invalid JSON error**: Check that your environment variables with JSON are properly escaped
- **File not found**: Ensure `data.json.example` exists in the root directory
