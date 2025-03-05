const pool = require('../config/db');

class StoreDao {
  static async checkSlugExists(slug) {
    const [result] = await pool.query('SELECT store_id FROM stores WHERE slug = ?', [slug]);
    return result.length > 0;
  }

  static async createStore({ store_name, slug, store_type, owner_id, createdAt }) {
    const [result] = await pool.query(
      'INSERT INTO stores (store_name, slug, store_type, owner_id, created_at) VALUES (?, ?, ?, ?, ?)',
      [store_name, slug, store_type, owner_id, createdAt]
    );
    return result.insertId;
  }

  static async createLocation(storeId, location_name, address, phone_number, isDefault) {
    const [result] = await pool.query(
      'INSERT INTO locations (store_id, location_name, address, phone_number, is_default, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [storeId, location_name, address, phone_number, isDefault, new Date()]
    );
    return result.insertId;
  }

  static async linkUserLocation(userId, locationId) {
    await pool.query(
      'INSERT INTO user_locations (user_id, location_id) VALUES (?, ?)',
      [userId, locationId]
    );
  }
}

module.exports = StoreDao;