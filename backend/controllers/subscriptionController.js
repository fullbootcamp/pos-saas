const subscriptionService = require('../services/subscriptionService');

class SubscriptionController {
  static async selectPlan(req, res) {
    const userId = req.user.user_id;
    const { planId } = req.body;
    try {
      const locationCount = await subscriptionService.getUserLocationCount(userId);
      const result = await subscriptionService.selectPlan(userId, planId, locationCount);
      res.status(201).json(result);
    } catch (error) {
      console.error('Subscription error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async updateSubscriptionEnd(req, res) {
    const userId = req.user.user_id;
    const { endsAt } = req.body;
    try {
      const result = await subscriptionService.updateSubscriptionEnd(userId, endsAt);
      res.status(200).json(result);
    } catch (error) {
      console.error('Update subscription end error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = SubscriptionController;