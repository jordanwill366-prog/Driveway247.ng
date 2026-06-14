// =======================================================================
// CAR LISTINGS ROUTER (Express + pg Pool)
// Filename: backend/routes/listings.js
// =======================================================================

const express = require('express');
const router = express.Router();

// NOTE: We assume 'pool' is initialized elsewhere in your app (e.g., in a DB config script) and exported.
// Here is a typical pool reference or initialization for modular completeness:
const pool = require('../db'); // Adjust target path as necessary in your main config

// --- AUTHENTICATION & ACCESS MIDDLEWARE ---

// Require User Authentication (Must ensure req.user exists)
function requireAuth(req, res, next) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Authentication required. Missing authorization token.' });
  }
  next();
}

// Require Specific User Roles
function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    const userRole = (req.user.role || '').toLowerCase();
    const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());
    
    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({ error: `Forbidden: Restriction scope is locked to [${allowedRoles.join(', ')}] roles.` });
    }
    next();
  };
}

// --- EXPRESS ENDPOINTS ---

/**
 * @route   GET /api/listings
 * @desc    Fetch all public active listings
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { make, maxPrice, transmission, status } = req.query;
    
    let queryText = 'SELECT * FROM listings WHERE status = $1';
    let queryParams = ['active'];
    let counter = 2;

    // Optional Filter: make
    if (make) {
      queryText += ` AND make ILIKE $${counter}`;
      queryParams.push(`%${make}%`);
      counter++;
    }

    // Optional Filter: max price
    if (maxPrice) {
      queryText += ` AND price <= $${counter}`;
      queryParams.push(parseFloat(maxPrice));
      counter++;
    }

    // Optional Filter: transmission style
    if (transmission) {
      queryText += ` AND transmission = $${counter}`;
      queryParams.push(transmission);
      counter++;
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await pool.query(queryText, queryParams);
    return res.json(result.rows);
  } catch (error) {
    console.error('Error fetching active catalog list:', error);
    return res.status(500).json({ error: 'Internal server error while compiling listings catalog.' });
  }
});

/**
 * @route   GET /api/listings/my-listings
 * @desc    Fetch listings belonging to current authenticated seller
 * @access  Protected (Seller Only)
 */
router.get('/my-listings', requireAuth, requireRole(['seller']), async (req, res) => {
  try {
    const queryText = 'SELECT * FROM listings WHERE seller_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(queryText, [req.user.id]);
    return res.json(result.rows);
  } catch (error) {
    console.error('Error fetching seller listings inventory:', error);
    return res.status(500).json({ error: 'Server error retrieving seller ledger.' });
  }
});

/**
 * @route   GET /api/listings/:id
 * @desc    Fetch individual car specifications by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const listingId = req.params.id;
    const queryText = 'SELECT * FROM listings WHERE id = $1';
    const result = await pool.query(queryText, [listingId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vehicle listing specification target not present.' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Error resolving listing item ID:', error);
    return res.status(500).json({ error: 'Server diagnostic error parsing listing record.' });
  }
});

/**
 * @route   POST /api/listings
 * @desc    Create a new vehicle listing
 * @access  Protected (Seller Only)
 */
router.post('/', requireAuth, requireRole(['seller']), async (req, res) => {
  try {
    const {
      title,
      make,
      model,
      year,
      price,
      mileage,
      color,
      fuel_type,
      transmission,
      description,
      photos
    } = req.body;

    // Field Validation Checks
    if (!title || !make || !model || !year || !price || !mileage || !color || !fuel_type || !transmission) {
      return res.status(400).json({ error: 'Missing mandatory registration properties for the listing proposal.' });
    }

    const sellerId = req.user.id;
    const listingPhotos = Array.isArray(photos) ? photos : [];

    const insertText = `
      INSERT INTO listings (
        seller_id, title, make, model, year, price, mileage, color, fuel_type, transmission, description, photos, status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'active'
      ) RETURNING *;
    `;

    const values = [
      sellerId,
      title,
      make,
      model,
      parseInt(year),
      parseFloat(price),
      parseInt(mileage),
      color,
      fuel_type,
      transmission,
      description || '',
      listingPhotos
    ];

    const result = await pool.query(insertText, values);
    return res.status(201).json({ success: true, listing: result.rows[0] });
  } catch (error) {
    console.error('Error publishing vehicle listing proposal:', error);
    return res.status(500).json({ error: 'Server database failure registering proposed car listing.' });
  }
});

/**
 * @route   PUT /api/listings/:id
 * @desc    Update editable properties of an existing seller-owned listing
 * @access  Protected (Seller Only)
 */
router.put('/:id', requireAuth, requireRole(['seller']), async (req, res) => {
  try {
    const listingId = req.params.id;
    const sellerId = req.user.id;

    // 1. Confirm listing status and seller ownership
    const resolveQuery = 'SELECT seller_id FROM listings WHERE id = $1';
    const resolveRes = await pool.query(resolveQuery, [listingId]);

    if (resolveRes.rows.length === 0) {
      return res.status(404).json({ error: 'Target car listing configuration does not exist.' });
    }

    if (resolveRes.rows[0].seller_id !== sellerId) {
      return res.status(403).json({ error: 'Unauthorized: You are restricted from editing listings registered under secondary dealers.' });
    }

    // 2. Extract properties for modification
    const {
      title,
      make,
      model,
      year,
      price,
      mileage,
      color,
      fuel_type,
      transmission,
      description,
      photos,
      status
    } = req.body;

    const originalQuery = 'SELECT * FROM listings WHERE id = $1';
    const originalRes = await pool.query(originalQuery, [listingId]);
    const currentData = originalRes.rows[0];

    const updateText = `
      UPDATE listings
      SET 
        title = $1, make = $2, model = $3, year = $4, price = $5, 
        mileage = $6, color = $7, fuel_type = $8, transmission = $9, 
        description = $10, photos = $11, status = $12
      WHERE id = $13 AND seller_id = $14
      RETURNING *;
    `;

    const values = [
      title || currentData.title,
      make || currentData.make,
      model || currentData.model,
      year ? parseInt(year) : currentData.year,
      price ? parseFloat(price) : currentData.price,
      mileage !== undefined ? parseInt(mileage) : currentData.mileage,
      color || currentData.color,
      fuel_type || currentData.fuel_type,
      transmission || currentData.transmission,
      description !== undefined ? description : currentData.description,
      Array.isArray(photos) ? photos : currentData.photos,
      status || currentData.status,
      listingId,
      sellerId
    ];

    const result = await pool.query(updateText, values);
    return res.json({ success: true, listing: result.rows[0] });
  } catch (error) {
    console.error('Error applying updates to car parameters:', error);
    return res.status(500).json({ error: 'Server indexing failure applying vehicle status adjustment.' });
  }
});

/**
 * @route   DELETE /api/listings/:id
 * @desc    Remove a listing item from the broker ledger
 * @access  Protected (Seller or Admin)
 */
router.delete('/:id', requireAuth, requireRole(['seller', 'admin']), async (req, res) => {
  try {
    const listingId = req.params.id;
    const { role, id: userId } = req.user;

    // 1. Resolve targeted listing representation
    const recordQuery = 'SELECT seller_id FROM listings WHERE id = $1';
    const recordRes = await pool.query(recordQuery, [listingId]);

    if (recordRes.rows.length === 0) {
      return res.status(404).json({ error: 'Car listing trace not recognized in catalogs.' });
    }

    const listingOwnerId = recordRes.rows[0].seller_id;

    // Sellers must own the listing to delete it; admins can override and delete anything
    if (role.toLowerCase() !== 'admin' && listingOwnerId !== userId) {
      return res.status(403).json({ error: 'Access denied: You are unauthorized to purge foreign dealer inventories.' });
    }

    // 2. Purge record from state
    const deleteQuery = 'DELETE FROM listings WHERE id = $1 RETURNING id';
    await pool.query(deleteQuery, [listingId]);

    return res.json({ success: true, message: 'Listing has been archived and purged successfully.', id: listingId });
  } catch (error) {
    console.error('Error deleting specific catalog listing:', error);
    return res.status(500).json({ error: 'Server transaction failure deleting the requested vehicle listing.' });
  }
});

module.exports = router;
