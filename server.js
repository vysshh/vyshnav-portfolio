const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Force absolute pathing for static files (Fixes Render pathing issues)
app.use(express.static(path.join(__dirname)));

// --- ISOLATED DATABASE CONNECTION ---
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    console.warn('⚠️ WARNING: MONGO_URI missing in environment variables!');
} else {
    mongoose.connect(mongoURI)
      .then(() => console.log('✅ Connected to VYSHNAV\'s Secure MongoDB Atlas Account'))
      .catch(err => console.error('❌ Database connection error:', err.message));
}

// --- DATABASE SCHEMA ---
const MessageSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    date: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', MessageSchema);

// --- ROUTES ---
app.post('/api/contact', async (req, res) => {
    try {
        const newMessage = new Message(req.body);
        await newMessage.save();
        res.status(201).json({ success: true, message: 'Transmission securely logged!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Catch-all route guarantees the HTML loads (Updated for Express 5 compatibility)
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Vyshnav Premium Portfolio running on port ${PORT}`));