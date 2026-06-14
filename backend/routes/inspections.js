// =======================================================================
// CAR INSPECTIONS ROUTER (Express + pg Pool)
// Filename: backend/routes/inspections.js
// =======================================================================

const express = require('express');
const router = express.Router();
const pool = require('../db'); // Safe resolution pointing to backend/db/index.js

// --- SECURE CONTROL MIDDLEWARES ---

// Verify active user payload in session
function requireAuth(req, res, next) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Authorization error: Login session is invalid.' });
  }
  next();
}

// Restrict to authorized system personnel roles
function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authorization error: Login session missing.' });
    }
    const userRole = (req.user.role || '').toLowerCase();
    const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());
    
    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({ error: `Forbidden access: Restricted to dynamic roles: [${allowedRoles.join(', ')}]` });
    }
    next();
  };
}

// --- EXPRESS ROUTE PIPELINE ---

/**
 * @route   POST /api/inspections
 * @desc    Submit a new inspection request request on a specific active vehicle listing
 * @access  Buyer Only
 */
router.post('/', requireAuth, requireRole(['buyer']), async (req, res) => {
  try {
    const { listing_id } = req.body;
    const buyerId = req.user.id;

    if (!listing_id) {
      return res.status(400).json({ error: 'Validation error: The target listing_id was not provided.' });
    }

    // Is the vehicle listing valid?
    const checkListing = await pool.query('SELECT * FROM listings WHERE id = $1', [listing_id]);
    if (checkListing.rows.length === 0) {
      return res.status(404).json({ error: 'Inspection target not found: Specified vehicle listing is not registered.' });
    }

    // Prevent duplicate pending requests for the same buyer and car
    const checkDupe = await pool.query(
      'SELECT id FROM inspections WHERE listing_id = $1 AND buyer_id = $2 AND status IN ($3, $4)',
      [listing_id, buyerId, 'pending', 'assigned']
    );
    if (checkDupe.rows.length > 0) {
      return res.status(400).json({ error: 'Duplicate action denied: You already have an active inspection request open for this vehicle.' });
    }

    // Insert pending request state
    const insertQuery = `
      INSERT INTO inspections (listing_id, buyer_id, status)
      VALUES ($1, $2, 'pending')
      RETURNING *;
    `;
    const result = await pool.query(insertQuery, [listing_id, buyerId]);
    return res.status(201).json({ success: true, inspection: result.rows[0] });
  } catch (error) {
    console.error('Error submitting car inspection proposals:', error);
    return res.status(500).json({ error: 'Database transaction error registering the requested inspection.' });
  }
});

/**
 * @route   GET /api/inspections/my-requests
 * @desc    List all inspections requested by the currently logged-in buyer
 * @access  Buyer Only
 */
router.get('/my-requests', requireAuth, requireRole(['buyer']), async (req, res) => {
  try {
    const buyerId = req.user.id;
    const query = `
      SELECT i.*, 
             l.title as car_title, 
             l.make as car_make, 
             l.model as car_model, 
             l.year as car_year, 
             l.photos as car_photos, 
             l.price as car_price
      FROM inspections i
      JOIN listings l ON i.listing_id = l.id
      WHERE i.buyer_id = $1
      ORDER BY i.created_at DESC;
    `;
    const result = await pool.query(query, [buyerId]);
    return res.json(result.rows);
  } catch (error) {
    console.error('Error fetching buyer inspection records:', error);
    return res.status(500).json({ error: 'Database retrieve error compiling your requested inspections.' });
  }
});

/**
 * @route   GET /api/inspections/pending
 * @desc    Retrieve all inspections matching unassigned or dynamic statuses for administrator assignment
 * @access  Admin Only
 */
router.get('/pending', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const query = `
      SELECT i.*, 
             l.title as car_title, 
             l.make as car_make, 
             l.model as car_model, 
             l.year as car_year, 
             l.photos as car_photos,
             l.price as car_price
      FROM inspections i
      JOIN listings l ON i.listing_id = l.id
      ORDER BY i.created_at DESC;
    `;
    const result = await pool.query(query);
    return res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving administrator pending inspections loop:', error);
    return res.status(500).json({ error: 'Database compile error parsing pending inspection queries.' });
  }
});

/**
 * @route   PUT /api/inspections/:id/assign
 * @desc    Assign a certified field inspector to the request queue
 * @access  Admin Only
 */
router.put('/:id/assign', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const inspectionId = req.params.id;
    const { inspector_id } = req.body;

    if (!inspector_id) {
      return res.status(400).json({ error: 'Validation error: Expected inspector_id was not provided in request body.' });
    }

    // Confirm inspection exists
    const checkQuery = 'SELECT id, status FROM inspections WHERE id = $1';
    const checkRes = await pool.query(checkQuery, [inspectionId]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ error: 'Update error: The requested inspection trace could not be matched.' });
    }

    // Process updater to assigned stage
    const updateQuery = `
      UPDATE inspections
      SET inspector_id = $1, status = 'assigned', updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const result = await pool.query(updateQuery, [inspector_id, inspectionId]);
    return res.json({ success: true, inspection: result.rows[0] });
  } catch (error) {
    console.error('Error updating inspector assignees:', error);
    return res.status(500).json({ error: 'Database state mismatch registering the assigned inspector.' });
  }
});

/**
 * @route   PUT /api/inspections/:id/complete
 * @desc    Submit professional inspection evaluations and details
 * @access  Inspector (or Admin override)
 */
router.put('/:id/complete', requireAuth, requireRole(['inspector', 'admin']), async (req, res) => {
  try {
    const inspectionId = req.params.id;
    const { report_notes, condition_score, defects, photos } = req.body;

    if (!report_notes || !condition_score) {
      return res.status(400).json({ error: 'Validation requirements failed: Send score (1-10) and report notes.' });
    }

    const scoreNum = parseInt(condition_score);
    if (isNaN(scoreNum) || scoreNum < 1 || scoreNum > 10) {
      return res.status(400).json({ error: 'Boundary error: Vehicle condition score index must run between 1 and 10.' });
    }

    // Authenticate assignment security
    const checkQuery = 'SELECT inspector_id, status FROM inspections WHERE id = $1';
    const checkRes = await pool.query(checkQuery, [inspectionId]);
    
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ error: 'Evaluation target is missing: No inspection matches this identifier.' });
    }

    const record = checkRes.rows[0];
    const userRole = (req.user.role || '').toLowerCase();

    // Secure that the assigned inspector is the one completing it, unless admin overrides
    if (userRole !== 'admin' && record.inspector_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You are not designated as the designated certified officer for this vehicle.' });
    }

    const defectList = Array.isArray(defects) ? defects : [];
    const photoList = Array.isArray(photos) ? photos : [];

    const completeQuery = `
      UPDATE inspections
      SET status = 'completed',
          report_notes = $1,
          condition_score = $2,
          defects = $3,
          photos = $4,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *;
    `;

    const result = await pool.query(completeQuery, [
      report_notes,
      scoreNum,
      defectList,
      photoList,
      inspectionId
    ]);

    return res.json({ success: true, inspection: result.rows[0] });
  } catch (error) {
    console.error('Error compiling inspection report package:', error);
    return res.status(500).json({ error: 'Database execution issue preserving completed inspection logs.' });
  }
});

/**
 * @route   PUT /api/inspections/:id/approve
 * @desc    Approve/Reject submitted inspection report outcomes
 * @access  Admin Only
 */
router.put('/:id/approve', requireAuth, requireRole(['admin']), async (req, res) => {
  try {
    const inspectionId = req.params.id;
    const { status } = req.body; // status must be 'approved' or 'rejected'

    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: "Validation error: Body status must be 'approved' or 'rejected'." });
    }

    const checkRes = await pool.query('SELECT status FROM inspections WHERE id = $1', [inspectionId]);
    if (checkRes.rows.length === 0) {
      return res.status(404).json({ error: 'Approvals targeted record was not isolated in database indexes.' });
    }

    const approveQuery = `
      UPDATE inspections
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;
    const result = await pool.query(approveQuery, [status, inspectionId]);
    return res.json({ success: true, inspection: result.rows[0] });
  } catch (error) {
    console.error('Error finalising inspection approval markers:', error);
    return res.status(500).json({ error: 'Database indexing failure committing vehicle approval statuses.' });
  }
});

/**
 * @route   GET /api/inspections/:id
 * @desc    Load complete properties for an absolute inspection identifier
 * @access  Public / Authenticated
 */
router.get('/:id', async (req, res) => {
  try {
    const inspectionId = req.params.id;

    const query = `
      SELECT i.*, 
             l.title as car_title, 
             l.make as car_make, 
             l.model as car_model, 
             l.year as car_year, 
             l.photos as car_photos, 
             l.price as car_price,
             l.color as car_color,
             l.mileage as car_mileage,
             l.fuel_type as car_fuel,
             l.transmission as car_transmission
      FROM inspections i
      JOIN listings l ON i.listing_id = l.id
      WHERE i.id = $1;
    `;

    const result = await pool.query(query, [inspectionId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Evaluation trace lookup failed: Absolute ID not found.' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error('Error resolving single inspection details:', error);
    return res.status(500).json({ error: 'Database parsing error retrieving specified inspection specs.' });
  }
});

module.exports = router;
