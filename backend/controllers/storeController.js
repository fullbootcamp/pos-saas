const storeService = require('../services/storeService');

class StoreController {
  static async createStore(req, res) {
    const userId = req.user.user_id;
    const { store_name, store_type, locationCount, locations } = req.body;
    try {
      if (!store_name || !store_type || !locationCount || locationCount < 1) {
        return res.status(400).json({ message: 'Store name, type, and valid location count are required' });
      }

      const result = await storeService.createStore(userId, store_name, store_type, locationCount, locations);
      res.status(201).json({ ...result, redirectTo: '/subscription' });
    } catch (error) {
      console.error('❌ Store creation error:', error);
      res.status(500).json({
        message: 'Error creating store',
        error: process.env.NODE_ENV === 'development' ? error : undefined,
      });
    }
  }
}

module.exports = StoreController;