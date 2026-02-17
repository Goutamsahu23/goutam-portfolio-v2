import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');
const dataPath = path.join(rootDir, 'data.json');
const backupPath = path.join(rootDir, 'data.json.backup');
const examplePath = path.join(rootDir, 'data.json.example');

console.log('🧪 Testing data.json generation script...\n');

// Test 1: Backup existing data.json if it exists
if (fs.existsSync(dataPath)) {
  console.log('📦 Test 1: Backing up existing data.json...');
  fs.copyFileSync(dataPath, backupPath);
  console.log('✅ Backup created: data.json.backup\n');
} else {
  console.log('ℹ️  No existing data.json found, skipping backup\n');
}

// Test 2: Remove data.json to force generation
if (fs.existsSync(dataPath)) {
  console.log('📦 Test 2: Removing data.json to test generation...');
  fs.unlinkSync(dataPath);
  console.log('✅ data.json removed\n');
}

// Test 3: Run the generation script
console.log('🔧 Test 3: Running generation script...');
try {
  // Set NODE_ENV to production to force generation
  process.env.NODE_ENV = 'production';
  execSync('node scripts/generate-data-from-json.js', { 
    cwd: rootDir,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
  console.log('\n✅ Generation script executed successfully\n');
} catch (error) {
  console.error('\n❌ Generation script failed:', error.message);
  process.exit(1);
}

// Test 4: Verify data.json was created
if (fs.existsSync(dataPath)) {
  console.log('✅ Test 4: data.json was created successfully');
  const generatedData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  console.log('📄 Generated data structure:');
  console.log(`   - Personal name: ${generatedData.personal?.name || 'N/A'}`);
  console.log(`   - Stats projects: ${generatedData.stats?.projects || 'N/A'}`);
  console.log(`   - Skills categories: ${generatedData.skills?.length || 0}`);
  console.log(`   - Projects count: ${generatedData.projects?.length || 0}\n`);
} else {
  console.error('❌ Test 4 FAILED: data.json was not created');
  process.exit(1);
}

// Test 5: Compare with example file
if (fs.existsSync(examplePath)) {
  console.log('🔍 Test 5: Comparing with data.json.example...');
  const exampleData = JSON.parse(fs.readFileSync(examplePath, 'utf-8'));
  const generatedData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  
  // Check if structure matches
  const keysMatch = 
    Object.keys(exampleData).every(key => key in generatedData);
  
  if (keysMatch) {
    console.log('✅ Structure matches data.json.example\n');
  } else {
    console.log('⚠️  Structure differs from data.json.example\n');
  }
}

// Test 6: Restore backup
if (fs.existsSync(backupPath)) {
  console.log('📦 Test 6: Restoring original data.json...');
  fs.copyFileSync(backupPath, dataPath);
  fs.unlinkSync(backupPath);
  console.log('✅ Original data.json restored\n');
}

console.log('🎉 All tests completed!');
console.log('\n💡 To test with environment variables, run:');
console.log('   NODE_ENV=production VITE_PERSONAL_NAME="Test" node scripts/generate-data-from-json.js');
