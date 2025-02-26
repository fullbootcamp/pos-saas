// File: backend/routes/storeRoutes.js
const express = require('express');
const db = require('../config/db');
const authenticate = require('../middleware/authMiddleware'); // Updated to match our structure

const router = express.Router();

// Unified store creation endpoint
router.post('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const { name, type } = req.body;

    console.log('📦 Store creation attempt:', { userId, name, type }); // Your logging style

    if (!name || !type) {
      return res.status(400).json({ message: 'Name and type are required' });
    }

    // Generate unique slug (using your regex approach)
    let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    let counter = 1;
    let uniqueSlug = slug;

    while (true) {
      const [existing] = await db.query('SELECT id FROM stores WHERE slug = ?', [uniqueSlug]);
      if (existing.length === 0) break;
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    // Create store with created_at (merging with current logic)
    const createdAt = new Date().toISOString();
    const [storeResult] = await db.query(
      `INSERT INTO stores (name, slug, type, user_id, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [name, uniqueSlug, type, userId, createdAt]
    );

    // Update user's store_id
    await db.query('UPDATE users SET store_id = ? WHERE id = ?', [storeResult.insertId, userId]);

    console.log('✅ Store created:', storeResult.insertId);

    res.status(201).json({
      id: storeResult.insertId,
      slug: uniqueSlug,
      message: 'Store created successfully',
    });
  } catch (error) {
    console.error('❌ Store creation error:', error);
    res.status(500).json({ 
      message: 'Error creating store',
      error: process.env.NODE_ENV === 'development' ? error : undefined, // Your conditional error detail
    });
  }
});

module.exports = router;