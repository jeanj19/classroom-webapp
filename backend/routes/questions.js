const express = require('express');
const db = require('../config/database');
const { verifyToken, isAdmin } = require('./auth');

const router = express.Router();

// Get all questions with answers
router.get('/', verifyToken, async (req, res) => {
    try {
        const [questions] = await db.query(`
            SELECT q.*, u.full_name as posted_by_name 
            FROM questions q 
            JOIN users u ON q.posted_by = u.id 
            ORDER BY q.created_at DESC
        `);
        
        // Get answers for each question
        for (let question of questions) {
            const [answers] = await db.query(`
                SELECT a.*, u.full_name as student_name 
                FROM answers a 
                JOIN users u ON a.student_id = u.id 
                WHERE a.question_id = ? 
                ORDER BY a.created_at DESC
            `, [question.id]);
            question.answers = answers;
        }
        
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Post question (admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const { title, question_text } = req.body;
        
        const [result] = await db.query(
            'INSERT INTO questions (title, question_text, posted_by) VALUES (?, ?, ?)',
            [title, question_text, req.user.id]
        );
        
        res.status(201).json({ message: 'Question posted successfully', questionId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Submit answer (students only)
router.post('/:id/answer', verifyToken, async (req, res) => {
    try {
        const { answer_text } = req.body;
        
        const [result] = await db.query(
            'INSERT INTO answers (question_id, answer_text, student_id) VALUES (?, ?, ?)',
            [req.params.id, answer_text, req.user.id]
        );
        
        res.status(201).json({ message: 'Answer submitted successfully', answerId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete question (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM questions WHERE id = ?', [req.params.id]);
        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;