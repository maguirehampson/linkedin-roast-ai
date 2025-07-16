// batch_roast.js
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const FormData = require('form-data');

const BATCH_DIR = path.join(__dirname, 'uploads', 'batch');
const OUTPUT_DIR = path.join(__dirname, 'ai-testing', 'outputs');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'batch_results.jsonl');

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function uploadPDF(filePath, fileName) {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath), fileName);
  const res = await fetch('http://localhost:3000/api/upload', {
    method: 'POST',
    body: form,
  });
  if (!res.ok) throw new Error(`Upload failed for ${fileName}`);
  return (await res.json()).file_url;
}

async function extractText(fileUrl) {
  const res = await fetch('http://localhost:3000/api/extract-text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileUrl }),
  });
  if (!res.ok) throw new Error(`Extract text failed for ${fileUrl}`);
  return (await res.json()).text;
}

async function roastProfile(goals, profileText) {
  const res = await fetch('http://localhost:3000/api/roast', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ goals, profileText }),
  });
  if (!res.ok) throw new Error('Roast API failed');
  return await res.json();
}

async function main() {
  await ensureDir(OUTPUT_DIR);
  const files = fs.readdirSync(BATCH_DIR).filter(f => f.endsWith('.pdf'));
  const outputStream = fs.createWriteStream(OUTPUT_FILE, { flags: 'w' });

  for (const file of files) {
    const filePath = path.join(BATCH_DIR, file);
    console.log(`Processing: ${file}`);
    try {
      // 1. Upload PDF
      const fileUrl = await uploadPDF(filePath, file);
      // 2. Extract text
      const inputText = await extractText(fileUrl);
      // 3. Roast (use a generic goal for batch, or customize as needed)
      const goals = 'Roast this LinkedIn profile for career improvement.';
      const roastOutput = await roastProfile(goals, inputText);
      // 4. Write to JSONL
      outputStream.write(JSON.stringify({ filename: file, input_text: inputText, roast_output: roastOutput }) + '\n');
      console.log(`Done: ${file}`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
  outputStream.end();
  console.log('Batch processing complete. Results in', OUTPUT_FILE);
}

main(); 