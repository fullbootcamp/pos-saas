const statusService = require('../services/statusService');

class StatusController {
  static async getStatus(req, res) {
    try {
      const result = await statusService.getStatus(req.user.id, req.user);
      res.json({ status: result });
    } catch (error) {
      console.error('❌ Error fetching status:', error);
      res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error : undefined,
      });
    }
  }
}

module.exports = StatusController;