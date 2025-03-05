const pool = require('../config/db');

class AuthDao {
  static async findUserByEmail(email) {
    const [userRows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return userRows.length > 0 ? userRows[0] : null;
  }

  static async findUserById(userId) {
    const [userRows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [userId]);
    return userRows.length > 0 ? userRows[0] : null;
  }

  static async findUserByEmailAndToken(email, token) {
    const [userRows] = await pool.query('SELECT * FROM users WHERE email = ? AND verification_token = ?', [email, token]);
    return userRows.length > 0 ? userRows[0] : null;
  }

  static async createUser(email, hashedPassword, verificationToken, role) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [result] = await connection.query(
        'INSERT INTO users (email, password_hash, verification_token, account_status, created_at) VALUES (?, ?, ?, ?, ?)',
        [email, hashedPassword, verificationToken, 'pending', new Date()]
      );
      const userId = result.insertId;

      let roleRows = await connection.query('SELECT role_id FROM roles WHERE role_name = ?', [role]);
      let roleId;
      if (roleRows[0].length === 0) { // Check if no roles found
        const [newRoleResult] = await connection.query('INSERT INTO roles (role_name, description) VALUES (?, ?)', [role, 'Dynamically added role']);
        roleId = newRoleResult.insertId;
      } else {
        roleId = roleRows[0][0].role_id; // Use the first role_id from the query result
      }

      await connection.query('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)', [userId, roleId]);

      await connection.commit();
      return userId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Other methods (verifyEmail, updateAccountStatus, etc.) remain unchanged
}

module.exports = AuthDao;