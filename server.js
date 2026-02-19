
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/messages', (req, res) => {
  const dataPath = path.join(__dirname, 'src', 'mockData.json');
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading mockData.json:', err);
      res.status(500).json({ error: 'Failed to read mock data' });
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.listen(PORT, () => {
  console.log(`Mock API server running at http://localhost:${PORT}`);
});
