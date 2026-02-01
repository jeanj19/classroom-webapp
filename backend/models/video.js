const db = require('../config/database');

class Video {
    // Get all videos
    static async findAll() {
        try {
            const [videos] = await db.query(`
                SELECT v.*, u.full_name as uploaded_by_name 
                FROM videos v 
                JOIN users u ON v.uploaded_by = u.id 
                ORDER BY v.created_at DESC
            `);
            return videos;
        } catch (error) {
            throw error;
        }
    }

    // Get video by ID
    static async findById(id) {
        try {
            const [videos] = await db.query(`
                SELECT v.*, u.full_name as uploaded_by_name 
                FROM videos v 
                JOIN users u ON v.uploaded_by = u.id 
                WHERE v.id = ?
            `, [id]);
            return videos;
        } catch (error) {
            throw error;
        }
    }

    // Create new video
    static async create(videoData) {
        try {
            const { title, description, video_url, uploaded_by } = videoData;
            const [result] = await db.query(
                'INSERT INTO videos (title, description, video_url, uploaded_by) VALUES (?, ?, ?, ?)',
                [title, description, video_url, uploaded_by]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    // Update video
    static async update(id, videoData) {
        try {
            const { title, description, video_url } = videoData;
            const [result] = await db.query(
                'UPDATE videos SET title = ?, description = ?, video_url = ? WHERE id = ?',
                [title, description, video_url, id]
            );
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    // Delete video
    static async delete(id) {
        try {
            const [result] = await db.query('DELETE FROM videos WHERE id = ?', [id]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    // Get videos by uploader
    static async findByUploader(uploaderId) {
        try {
            const [videos] = await db.query(`
                SELECT v.*, u.full_name as uploaded_by_name 
                FROM videos v 
                JOIN users u ON v.uploaded_by = u.id 
                WHERE v.uploaded_by = ?
                ORDER BY v.created_at DESC
            `, [uploaderId]);
            return videos;
        } catch (error) {
            throw error;
        }
    }

    // Count all videos
    static async count() {
        try {
            const [result] = await db.query('SELECT COUNT(*) as count FROM videos');
            return result.count;
        } catch (error) {
            throw error;
        }
    }

    // Search videos by title or description
    static async search(searchTerm) {
        try {
            const [videos] = await db.query(`
                SELECT v.*, u.full_name as uploaded_by_name 
                FROM videos v 
                JOIN users u ON v.uploaded_by = u.id 
                WHERE v.title LIKE ? OR v.description LIKE ?
                ORDER BY v.created_at DESC
            `, [`%${searchTerm}%`, `%${searchTerm}%`]);
            return videos;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Video;