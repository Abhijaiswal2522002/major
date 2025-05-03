import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PythonShell } from 'python-shell';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import axios from 'axios';
import { body, validationResult } from 'express-validator';
import fs from 'fs';

dotenv.config();
const app = express();
const __dirname = path.resolve();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO)
  .then(() => console.log('✅ Connected to MongoDB!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// --- AI route ---
app.post('/api/ai', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: message }] }],
    });

    const responseText =
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI.';

    res.json({ reply: responseText });
  } catch (error) {
    console.error('❌ Gemini AI Error:', error);
    res.status(500).json({ error: 'Failed to generate AI response', details: error.message });
  }
});

// --- Price Prediction ---
app.post('/api/price-predict', async (req, res) => {
  const { Area, Locality, BHK, Bathroom, Furnishing, Parking } = req.body;

  try {
    const response = await axios.post('http://localhost:5001/predict', {
      Area,
      Locality,
      BHK,
      Bathroom,
      Furnishing,
      Parking
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error calling Python API:", error);
    res.status(500).json({ success: false, message: "Prediction failed" });
  }
});

// --- Get Model Options (Locality, Furnishing, Parking) ---
app.get('/api/model-options', (req, res) => {
  PythonShell.run('api/get_model_options.py', null, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Failed to load options' });

    try {
      const options = JSON.parse(result[0]);
      res.json({ success: true, options });
    } catch {
      res.status(500).json({ success: false, message: 'Failed to parse model options' });
    }
  });
});

// Other routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ success: false, statusCode, message: err.message || 'Internal Error' });
});

// Start Server
app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));
