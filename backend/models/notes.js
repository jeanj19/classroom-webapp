const db = require('../config/database');

class Note {
    // Get all notes
    static async findAll() {
        try {
            const [notes] = await db.query(`
                SELECT n.*, u.full_name as uploaded_by_name 
                FROM notes n 
                JOIN users u ON n.uploaded_by = u.id 
                ORDER BY n.created_at DESC
            `);
            return notes;
        } catch (error) {
            throw error;
        }
    }

    // Get note by ID
    static async findById(id) {
        try {
            const [notes] = await db.query(`
                SELECT n.*, u.full_name as uploaded_by_name 
                FROM notes n 
                JOIN users u ON n.uploaded_by = u.id 
                WHERE n.id = ?
            `, [id]);
            return notes;
        } catch (error) {
            throw error;
        }
    }

    // Create new note
    static async create(noteData) {
        try {
            const { title, content, file_url, uploaded_by } = noteData;
            const [result] = await db.query(
                'INSERT INTO notes (title, content, file_url, uploaded_by) VALUES (?, ?, ?, ?)',
                [title, content, file_url, uploaded_by]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    // Update note
    static async update(id, noteData) {
        try {
            const { title, content, file_url } = noteData;
            const [result] = await db.query(
                'UPDATE notes SET title = ?, content = ?, file_url = ? WHERE id = ?',
                [title, content, file_url, id]
            );
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    // Delete note
    static async delete(id) {
        try {
            const [result] = await db.query('DELETE FROM notes WHERE id = ?', [id]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    // Get notes by uploader
    static async findByUploader(uploaderId) {
        try {
            const [notes] = await db.query(`
                SELECT n.*, u.full_name as uploaded_by_name 
                FROM notes n 
                JOIN users u ON n.uploaded_by = u.id 
                WHERE n.uploaded_by = ?
                ORDER BY n.created_at DESC
            `, [uploaderId]);
            return notes;
        } catch (error) {
            throw error;
        }
    }

    // Count all notes
    static async count() {
        try {
            const [result] = await db.query('SELECT COUNT(*) as count FROM notes');
            return result.count;
        } catch (error) {
            throw error;
        }
    }

    // Search notes by title or content
    static async search(searchTerm) {
        try {
            const [notes] = await db.query(`
                SELECT n.*, u.full_name as uploaded_by_name 
                FROM notes n 
                JOIN users u ON n.uploaded_by = u.id 
                WHERE n.title LIKE ? OR n.content LIKE ?
                ORDER BY n.created_at DESC
            `, [`%${searchTerm}%`, `%${searchTerm}%`]);
            return notes;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Note;