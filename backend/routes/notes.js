const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../config/database');
const { verifyToken, isAdmin } = require('./auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: './uploads/notes/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Get all notes
router.get('/', verifyToken, async (req, res) => {
    try {
        const [notes] = await db.query(`
            SELECT n.*, u.full_name as uploaded_by_name 
            FROM notes n 
            JOIN users u ON n.uploaded_by = u.id 
            ORDER BY n.created_at DESC
        `);
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload note (admin only)
router.post('/', verifyToken, isAdmin, upload.single('file'), async (req, res) => {
    try {
        const { title, content } = req.body;
        const file_url = req.file ? `/uploads/notes/${req.file.filename}` : null;
        
        const [result] = await db.query(
            'INSERT INTO notes (title, content, file_url, uploaded_by) VALUES (?, ?, ?, ?)',
            [title, content, file_url, req.user.id]
        );
        
        res.status(201).json({ message: 'Note uploaded successfully', noteId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete note (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM notes WHERE id = ?', [req.params.id]);
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;