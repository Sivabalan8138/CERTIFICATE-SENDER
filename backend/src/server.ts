import app from './app';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Ensure upload directories exist
const dirs = ['../uploads', '../uploads/templates', '../generated'];
dirs.forEach(dir => {
  const p = path.join(__dirname, dir);
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
