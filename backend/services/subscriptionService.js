const subscriptionDao = require('../dao/subscriptionDao');

class SubscriptionService {
  static async getUserLocationCount(userId) {
    const [result] = await subscriptionDao.getUserLocations(userId);
    return result.length;
  }

  static async selectPlan(userId, planId, locationCount) {
    const [plans] = await subscriptionDao.getPlans();
    const plan = plans.find(p => p.plan_id === planId);
    if (!plan) throw new Error('Invalid plan ID');

    const [user] = await subscriptionDao.getUserPlan(userId);
    if (planId === 1 && user[0].plan_id === 1 && user[0].end_date) {
      throw new Error('Already on Free Demo trial.');
    }
    if (planId === 1 && locationCount > 1000) {
      throw new Error('Free demo limited to 1000 locations.');
    }
    if (planId === 1 && !user[0].store_id) {
      throw new Error('Free demo available only during initial registration with locations.');
    }

    const totalPrice = plan.price * locationCount;
    const startsAt = new Date();
    const endsAt = new Date(startsAt);
    endsAt.setDate(startsAt.getDate() + plan.location_limit); // Assuming location_limit is days

    await subscriptionDao.createSubscription(userId, planId, startsAt, endsAt, totalPrice);

    if (planId === 1) {
      await subscriptionDao.updateUserPlanTrial(userId, planId, endsAt);
    } else {
      await subscriptionDao.updateUserPlan(userId, planId);
    }

    const storeSlug = await subscriptionDao.getUserStoreSlug(userId);
    const redirectTo = planId === 1 ? `/dashboard/${storeSlug}/location-01` : '/checkout';
    return { message: `Plan selected successfully! Total: $${totalPrice.toFixed(2)}`, redirectTo };
  }

  static async updateSubscriptionEnd(userId, endsAt) {
    await subscriptionDao.updateSubscriptionEnd(userId, endsAt);
    return { message: 'Subscription end updated' };
  }
}

module.exports = SubscriptionService;