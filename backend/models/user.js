const db = require('../config/database');

class User {
    // Get user by ID
    static async findById(id) {
        try {
            const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
            return users;
        } catch (error) {
            throw error;
        }
    }

    // Get user by username
    static async findByUsername(username) {
        try {
            const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
            return users;
        } catch (error) {
            throw error;
        }
    }

    // Get user by email
    static async findByEmail(email) {
        try {
            const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
            return users;
        } catch (error) {
            throw error;
        }
    }

    // Create new user
    static async create(userData) {
        try {
            const { username, email, password, role, full_name } = userData;
            const [result] = await db.query(
                'INSERT INTO users (username, email, password, role, full_name) VALUES (?, ?, ?, ?, ?)',
                [username, email, password, role, full_name]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    // Get all users
    static async findAll() {
        try {
            const [users] = await db.query('SELECT id, username, email, role, full_name, created_at FROM users');
            return users;
        } catch (error) {
            throw error;
        }
    }

    // Get all students
    static async findAllStudents() {
        try {
            const [students] = await db.query(
                'SELECT id, username, email, full_name, created_at FROM users WHERE role = ?',
                ['student']
            );
            return students;
        } catch (error) {
            throw error;
        }
    }

    // Update user
    static async update(id, userData) {
        try {
            const { username, email, full_name } = userData;
            const [result] = await db.query(
                'UPDATE users SET username = ?, email = ?, full_name = ? WHERE id = ?',
                [username, email, full_name, id]
            );
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    // Delete user
    static async delete(id) {
        try {
            const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        }
    }

    // Count users by role
    static async countByRole(role) {
        try {
            const [result] = await db.query('SELECT COUNT(*) as count FROM users WHERE role = ?', [role]);
            return result.count;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;