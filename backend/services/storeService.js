const storeDao = require('../dao/storeDao');

class StoreService {
  static async createStore(userId, store_name, store_type, locationCount, locations = []) {
    let slug = store_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    let counter = 1;
    let uniqueSlug = slug;

    while (true) {
      const exists = await storeDao.checkSlugExists(uniqueSlug);
      if (!exists) break;
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const createdAt = new Date().toISOString();
    const storeId = await storeDao.createStore({ store_name, slug: uniqueSlug, store_type, owner_id: userId, createdAt });

    // Create default location
    const defaultLocation = locations[0] || { location_name: 'Location 01', address: 'Default Address', phone_number: '555-0123' };
    const defaultLocationId = await storeDao.createLocation(storeId, defaultLocation.location_name, defaultLocation.address, defaultLocation.phone_number, true);
    await storeDao.linkUserLocation(userId, defaultLocationId);

    // Create additional locations
    if (locationCount > 1) {
      for (let i = 1; i < locationCount && i < locations.length; i++) {
        const loc = locations[i] || { location_name: `Location ${i + 1}`, address: `Location ${i + 1} Address`, phone_number: `555-0${i + 1}23` };
        const locId = await storeDao.createLocation(storeId, loc.location_name, loc.address, loc.phone_number, false);
        await storeDao.linkUserLocation(userId, locId);
      }
      for (let i = locations.length; i < locationCount; i++) {
        const locId = await storeDao.createLocation(storeId, `Location ${i + 1}`, `Location ${i + 1} Address`, `555-0${i + 1}23`, false);
        await storeDao.linkUserLocation(userId, locId);
      }
    }

    console.log('✅ Store and locations created:', storeId);
    return {
      store_id: storeId,
      slug: uniqueSlug,
      message: 'Store created successfully',
    };
  }
}

module.exports = StoreService;