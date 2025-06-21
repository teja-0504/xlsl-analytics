import express from 'express';
import multer from 'multer';
import XLSX from 'xlsx';
import OpenAI from 'openai';
import { authenticateJWT, authorizeRoles } from '../middleware/auth.js';
import Upload from '../models/Upload.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/upload - upload Excel file, parse, store, generate AI summary
router.post('/', authenticateJWT, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Parse Excel file buffer to JSON
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Generate AI summary using OpenAI
    const prompt = `Summarize the following dataset:\n${JSON.stringify(jsonData).slice(0, 2000)}`;
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 150,
    });
    const summary = completion.data.choices[0].text.trim();

    // Save upload to DB
    const newUpload = new Upload({
      userId: req.user.id,
      filename: req.file.originalname,
      data: jsonData,
      summary,
    });
    await newUpload.save();

    res.status(201).json({ upload: newUpload });
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ message: 'Server error during file upload' });
  }
});

// GET /api/upload/history - get uploads for user or all uploads for admin
router.get('/history', authenticateJWT, async (req, res) => {
  try {
    let uploads;
    if (req.user.role === 'admin') {
      uploads = await Upload.find().populate('userId', 'username email').sort({ createdAt: -1 });
    } else {
      uploads = await Upload.find({ userId: req.user.id }).sort({ createdAt: -1 });
    }
    res.json(uploads);
  } catch (err) {
    console.error('Error fetching upload history:', err);
    res.status(500).json({ message: 'Server error fetching upload history' });
  }
});

export default router;
