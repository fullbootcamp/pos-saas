const pool = require('../config/db');

class StatusDao {
  static async getUserSubscription(userId, planId) {
    if (!planId) return [];
    const [result] = await pool.query(
      `SELECT s.*, p.name AS plan_name, p.price, p.interval 
       FROM subscriptions s
       JOIN plans p ON s.plan_id = p.id
       WHERE s.user_id = ? ORDER BY s.created_at DESC LIMIT 1`,
      [userId]
    );
    return result.length > 0 ? [{
      planId: result[0].plan_id,
      planName: result[0].plan_name,
      price: result[0].price,
      interval: result[0].interval,
      startsAt: result[0].starts_at,
      endsAt: result[0].ends_at,
      isAutoRenew: result[0].is_auto_renew || false,
    }] : [];
  }
}

module.exports = StatusDao;