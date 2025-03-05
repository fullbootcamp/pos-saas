const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class SuperadminDao {
  static async getUsers() {
    const [result] = await pool.query('SELECT id, name, email, role FROM users WHERE role != "user"');
    return result;
  }

  static async findUserByEmail(email) {
    const [result] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return result;
  }

  static async createUser(name, email, hashedPassword, role) {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role, is_store_setup_complete, is_dashboard_created) VALUES (?, ?, ?, ?, 0, 0)',
      [name, email, hashedPassword, role]
    );
    return result.insertId;
  }

  static async hashPassword(password) {
    return bcrypt.hash(password, 10);
  }

  static async getTasks() {
    const [result] = await pool.query(
      'SELECT tasks.id, tasks.title, tasks.status, tasks.deadline, tasks.notes, tasks.urgent, tasks.created_at AS createdAt FROM tasks'
    );
    return result;
  }

  static async getTaskUserIds(taskId) {
    const [result] = await pool.query('SELECT user_id FROM task_users WHERE task_id = ?', [taskId]);
    return result;
  }

  static async getUsersByIds(userIds) {
    const [result] = await pool.query('SELECT id, name, role FROM users WHERE id IN (?)', [userIds]);
    return result;
  }

  static async createTask(title, deadline, notes, urgent) {
    const [result] = await pool.query(
      'INSERT INTO tasks (title, status, deadline, notes, urgent) VALUES (?, "To Do", ?, ?, ?)',
      [title, deadline, notes, urgent ? 1 : 0]
    );
    return result.insertId;
  }

  static async assignTaskToUser(taskId, userId) {
    await pool.query('INSERT INTO task_users (task_id, user_id) VALUES (?, ?)', [taskId, userId]);
  }

  static async getTaskById(taskId) {
    const [result] = await pool.query(
      'SELECT tasks.id, tasks.title, tasks.status, tasks.deadline, tasks.notes, tasks.urgent, tasks.created_at AS createdAt FROM tasks WHERE id = ?',
      [taskId]
    );
    return result;
  }
}

module.exports = SuperadminDao;