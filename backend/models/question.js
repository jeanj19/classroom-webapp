const db = require('../config/database');

class Question {
    // Get all questions with answers
    static async findAll() {
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
            
            return questions;
        } catch (error) {
            throw error;
        }
    }

    // Get question by ID
    static async findById(id) {
        try {
            const [questions] = await db.query(`
                SELECT q.*, u.full_name as posted_by_name 
                FROM questions q 
                JOIN users u ON q.posted_by = u.id 
                WHERE q.id = ?
            `, [id]);
            
            if (questions.length > 0) {
                const [answers] = await db.query(`
                    SELECT a.*, u.full_name as student_name 
                    FROM answers a 
                    JOIN users u ON a.student_id = u.id 
                    WHERE a.question_id = ? 
                    ORDER BY a.created_at DESC
                `, [id]);
                questions.answers = answers;
            }
            
            return questions;
        } catch (error) {
            throw error;
        }
    }

    // Create new question
    static async create(questionData) {
        try {
            const { title, question_text, posted_by } = questionData;
            const [result] = await db.query(
                'INSERT INTO questions (title, question_text, posted_by) VALUES (?, ?, ?)',
                [title, question_text, posted_by]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    // Update question
    static async update(id, questionData) {
        try {
            const { title, question_text } = questionData;
            const [result] = await db.query(
                'UPDATE questions SET title = ?, question_text = ? WHERE id = ?',
                [title, question_text, id]
            );
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    // Delete question
    static async delete(id) {
        try {
            const [result] = await db.query('DELETE FROM questions WHERE id = ?', [id]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    // Get questions by poster
    static async findByPoster(posterId) {
        try {
            const [questions] = await db.query(`
                SELECT q.*, u.full_name as posted_by_name 
                FROM questions q 
                JOIN users u ON q.posted_by = u.id 
                WHERE q.posted_by = ?
                ORDER BY q.created_at DESC
            `, [posterId]);
            return questions;
        } catch (error) {
            throw error;
        }
    }

    // Count all questions
    static async count() {
        try {
            const [result] = await db.query('SELECT COUNT(*) as count FROM questions');
            return result.count;
        } catch (error) {
            throw error;
        }
    }

    // Add answer to question
    static async addAnswer(questionId, answerData) {
        try {
            const { answer_text, student_id } = answerData;
            const [result] = await db.query(
                'INSERT INTO answers (question_id, answer_text, student_id) VALUES (?, ?, ?)',
                [questionId, answer_text, student_id]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    // Get answers for a question
    static async getAnswers(questionId) {
        try {
            const [answers] = await db.query(`
                SELECT a.*, u.full_name as student_name 
                FROM answers a 
                JOIN users u ON a.student_id = u.id 
                WHERE a.question_id = ? 
                ORDER BY a.created_at DESC
            `, [questionId]);
            return answers;
        } catch (error) {
            throw error;
        }
    }

    // Delete answer
    static async deleteAnswer(answerId) {
        try {
            const [result] = await db.query('DELETE FROM answers WHERE id = ?', [answerId]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Question;