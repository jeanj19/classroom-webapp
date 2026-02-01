const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../config/database');
const { verifyToken, isAdmin } = require('./auth');

const router = express.Router();

// Configure multer for video uploads
const storage = multer.diskStorage({
    destination: './uploads/videos/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 100000000 } // 100MB limit
});

// Get all videos
router.get('/', verifyToken, async (req, res) => {
    try {
        const [videos] = await db.query(`
            SELECT v.*, u.full_name as uploaded_by_name 
            FROM videos v 
            JOIN users u ON v.uploaded_by = u.id 
            ORDER BY v.created_at DESC
        `);
        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload video (admin only)
router.post('/', verifyToken, isAdmin, upload.single('video'), async (req, res) => {
    try {
        const { title, description } = req.body;
        const video_url = req.file ? `/uploads/videos/${req.file.filename}` : req.body.video_url;
        
        const [result] = await db.query(
            'INSERT INTO videos (title, description, video_url, uploaded_by) VALUES (?, ?, ?, ?)',
                        [title, description, video_url, req.user.id]
        );
        
        res.status(201).json({ message: 'Video uploaded successfully', videoId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete video (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM videos WHERE id = ?', [req.params.id]);
        res.json({ message: 'Video deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;