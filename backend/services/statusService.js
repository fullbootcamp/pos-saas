const statusDao = require('../dao/statusDao');

class StatusService {
  static async getStatus(userId, user) {
    console.log('📊 Fetching status for user:', userId);

    const subscription = await statusDao.getUserSubscription(userId, user.plan_id);
    const status = {
      userName: user.name || 'User',
      registration: true,
      emailVerified: !!user.email_verified_at,
      storeSetup: !!user.store_id,
      planSelected: !!user.plan_id,
      dashboardCreated: !!user.store_id, // Assuming store_id indicates dashboard setup
      subscription,
      planId: user.plan_id,
      trialEndsAt: user.trial_ends_at || null,
      subscriptionEndsAt: user.subscription_ends_at || null,
    };

    console.log('✅ Status fetched:', status);
    return status;
  }
}

module.exports = StatusService;