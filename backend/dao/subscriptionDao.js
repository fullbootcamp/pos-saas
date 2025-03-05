const pool = require('../config/db');

class SubscriptionDao {
  static async getUserPlan(userId) {
    const [result] = await pool.query('SELECT plan_id, end_date, store_id FROM subscriptions WHERE user_id = ? ORDER BY start_date DESC LIMIT 1', [userId]);
    return result;
  }

  static async getUserLocations(userId) {
    const [result] = await pool.query('SELECT location_id FROM user_locations WHERE user_id = ?', [userId]);
    return result;
  }

  static async getPlans() {
    const [result] = await pool.query('SELECT plan_id, plan_name, price, location_limit FROM plans');
    return result;
  }

  static async createSubscription(userId, planId, start_date, end_date, total_price) {
    await pool.query(
      'INSERT INTO subscriptions (user_id, plan_id, start_date, end_date, total_price) VALUES (?, ?, ?, ?, ?)',
      [userId, planId, start_date, end_date, total_price]
    );
  }

  static async updateUserPlanTrial(userId, planId, end_date) {
    await pool.query(
      'UPDATE subscriptions SET plan_id = ?, end_date = ?, status = ? WHERE user_id = ? AND status = ?',
      [planId, end_date, 'active', userId, 'active']
    );
  }

  static async updateUserPlan(userId, planId) {
    await pool.query('UPDATE subscriptions SET plan_id = ?, status = ? WHERE user_id = ? AND status = ?', [planId, 'active', userId, 'active']);
  }

  static async updateSubscriptionEnd(userId, end_date) {
    await pool.query('UPDATE subscriptions SET end_date = ? WHERE user_id = ? AND status = ?', [end_date, userId, 'active']);
  }

  static async getUserStoreSlug(userId) {
    const [result] = await pool.query('SELECT slug FROM stores WHERE owner_id = ?', [userId]);
    return result.length > 0 ? result[0].slug : null;
  }
}

module.exports = SubscriptionDao;