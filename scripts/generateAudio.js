import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice Voice (Educator)

if (!API_KEY || API_KEY === 'your_api_key_here') {
  console.error("ERROR: Please set ELEVENLABS_API_KEY in your .env file!");
  process.exit(1);
}

const audioLinesPath = path.join(__dirname, '../src/data/audioLines.json');
const audioLines = JSON.parse(fs.readFileSync(audioLinesPath, 'utf8'));

const outDir = path.join(__dirname, '../public/assets/audio');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function generateAudio(id, text) {
  const filePath = path.join(outDir, `${id}.mp3`);
  
  if (fs.existsSync(filePath)) {
    console.log(`Skipping ${id}, already exists.`);
    return;
  }

  console.log(`Generating audio for: ${id}...`);
  
  const payload = JSON.stringify({
    text: text,
    model_id: "eleven_multilingual_v2",
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75,
      style: 0.0,
      use_speaker_boost: true
    }
  });

  const options = {
    hostname: 'api.elevenlabs.io',
    path: `/v1/text-to-speech/${VOICE_ID}`,
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        console.error(`Failed to generate ${id}. Status: ${res.statusCode}`);
        res.on('data', d => console.error(d.toString()));
        reject(new Error(`Status Code: ${res.statusCode}`));
        return;
      }
      
      const fileStream = fs.createWriteStream(filePath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Saved: ${id}.mp3`);
        resolve();
      });
    });

    req.on('error', (e) => reject(e));
    req.write(payload);
    req.end();
  });
}

async function run() {
  const keys = Object.keys(audioLines);
  for (const key of keys) {
    if (key === 'tap') continue; // We'll just copy a generic UI pop sound for tap, but Alice doesn't need to say "tap"
    try {
      await generateAudio(key, audioLines[key]);
    } catch (err) {
      console.error(`Error generating ${key}:`, err);
    }
    // Small delay to respect API limits
    await new Promise(r => setTimeout(r, 500));
  }
  console.log("All audio generated successfully!");
}

run();
