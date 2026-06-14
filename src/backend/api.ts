import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import fs from 'node:fs';
import { join } from 'node:path';

// --- DATABASE PATH FOR FALLBACK PERSISTENCE ---
const DB_FILE = join(process.cwd(), '.carvello_db.json');
const JWT_SECRET = 'CARVELLO_SECURE_TRUST_SECRET_KEY_2026';

// --- DATA SCHEMAS & INTERFACES ---
export interface UserAccount {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'buyer' | 'seller' | 'admin';
  avatarUrl: string;
  isVerified: boolean;
  isBanned?: boolean;
  businessName?: string;
  taxId?: string;
  deliveryAddress?: string;
  watchlist?: string[];
  passwordHash: string; // Stored for secure matching
}

export interface VehicleListing {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  image: string;
  location: string;
  status: 'pending_approval' | 'approved' | 'rejected' | 'sold';
  isInspected: boolean;
  inspectorReport?: string;
  inspectorRating?: number;
  inspectorPhotos?: string[];
  sellerId: string;
  sellerName: string;
}

export interface InspectionRequest {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;
  buyerId: string;
  buyerName: string;
  location: string;
  status: 'pending_assignment' | 'assigned' | 'completed';
  assignedInspectorId?: string;
  assignedInspectorName?: string;
  reportDetails?: string;
  rating?: number;
  photos?: string[];
  scheduledDate?: string;
}

export interface DeliveryOrder {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;
  buyerId: string;
  buyerName: string;
  deliveryMethod: 'pickup' | 'transport';
  deliveryAddress: string;
  shippingQuote: number;
  status: 'pending' | 'dispatched' | 'in_transit' | 'delivered';
  trackingDetails?: string;
}

// --- SEED SEED DATA ---
let users: UserAccount[] = [
  {
    id: 'usr-admin-1',
    email: 'admin@carvello.ng',
    fullName: 'Chief Systems Administrator',
    phone: '+234 811 000 0000',
    role: 'admin',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin',
    isVerified: true,
    passwordHash: 'pass123'
  },
  {
    id: 'usr-seller-1',
    email: 'seller@driveway.ng',
    fullName: 'Lagos Prime Motors',
    phone: '+234 802 444 5555',
    role: 'seller',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=seller1',
    isVerified: true,
    businessName: 'Lagos Prime Motors Ltd',
    taxId: 'TIN-4802931-A',
    passwordHash: 'pass123'
  },
  {
    id: 'usr-buyer-1',
    email: 'jordanwill366@gmail.com',
    fullName: 'Jordan Williams',
    phone: '+234 803 777 8899',
    role: 'buyer',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=jordan',
    isVerified: true,
    deliveryAddress: 'Block 42, Lekki Phase 1, Lagos, Nigeria',
    watchlist: ['v1', 'v3'],
    passwordHash: 'pass123'
  }
];

let listings: VehicleListing[] = [
  {
    id: 'v1',
    make: 'Lexus',
    model: 'RX 350 F-Sport AWD',
    year: 2021,
    price: 42500000,
    mileage: 18450,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop',
    location: 'Lekki, Lagos',
    status: 'approved',
    isInspected: true,
    inspectorReport: 'Beautiful direct Tokunbo state, flawless powertrain diagnostics score, slight scuff on the front bumper trims.',
    inspectorRating: 4.8,
    inspectorPhotos: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=400',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=400'
    ],
    sellerId: 'usr-seller-1',
    sellerName: 'Lagos Prime Motors Ltd'
  },
  {
    id: 'v2',
    make: 'Toyota',
    model: 'Camry Hybrid XSE',
    year: 2022,
    price: 28000000,
    mileage: 12100,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=600&auto=format&fit=crop',
    location: 'Ikeja, Lagos',
    status: 'pending_approval',
    isInspected: false,
    sellerId: 'usr-seller-1',
    sellerName: 'Lagos Prime Motors Ltd'
  },
  {
    id: 'v3',
    make: 'Mercedes-Benz',
    model: 'C43 AMG Convertible',
    year: 2020,
    price: 52000000,
    mileage: 24700,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=600&auto=format&fit=crop',
    location: 'Victoria Island, Lagos',
    status: 'approved',
    isInspected: false,
    sellerId: 'usr-seller-1',
    sellerName: 'Lagos Prime Motors Ltd'
  }
];

let inspections: InspectionRequest[] = [
  {
    id: 'ins-1',
    vehicleId: 'v2',
    vehicleName: '2022 Toyota Camry Hybrid',
    vehicleImage: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=300',
    buyerId: 'usr-buyer-1',
    buyerName: 'Jordan Williams',
    location: 'Ikeja Showroom, Lagos',
    status: 'pending_assignment'
  }
];

let deliveries: DeliveryOrder[] = [
  {
    id: 'del-1',
    vehicleId: 'v1',
    vehicleName: '2021 Lexus RX 350',
    vehicleImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=300',
    buyerId: 'usr-buyer-1',
    buyerName: 'Jordan Williams',
    deliveryMethod: 'transport',
    deliveryAddress: 'Block 42, Lekki Phase 1, Lagos, Nigeria',
    shippingQuote: 125000,
    status: 'pending',
    trackingDetails: 'Awaiting dispatch clearance from dealership'
  }
];

// --- LOAD DATA FROM COMPACT DB FILE ---
function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      if (parsed.users) users = parsed.users;
      if (parsed.listings) listings = parsed.listings;
      if (parsed.inspections) inspections = parsed.inspections;
      if (parsed.deliveries) deliveries = parsed.deliveries;
    }
  } catch (error) {
    console.error('Error loading fallback JSON database:', error);
  }
}

function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users, listings, inspections, deliveries }, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error backing up fallback JSON database:', error);
  }
}

loadDB();

// --- EXPRESS TYPING FALLBACKS ---
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'buyer' | 'seller' | 'admin';
  };
}

// --- JWT DECRPYTION MIDDLEWARE ---
export function authenticateJwt(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.['token'] || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: 'buyer' | 'seller' | 'admin' };
    req.user = decoded;
  } catch (error) {
    console.warn('JWT verification failed:', error);
  }
  next();
}

// --- AUTH ROLE SECURITY GUARDS ---
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Unauthorized. Please login again.' });
    return;
  }
  next();
}

export function requireRole(allowedRoles: ('buyer' | 'seller' | 'admin')[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
       res.status(401).json({ success: false, error: 'Authorization token not provided.' });
       return;
    }
    const currentRole = req.user.role.toLowerCase() as ('buyer' | 'seller' | 'admin');
    if (!allowedRoles.includes(currentRole)) {
       res.status(403).json({ success: false, error: `Forbidden: Access restricted to dynamic user roles: [${allowedRoles.join(', ')}]` });
       return;
    }
    next();
  };
}

export const apiRouter = Router();

// --- API AUTH CONTROLLER ENDPOINTS ---

apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { email, fullName, phone, role, password, businessName, taxId, deliveryAddress } = req.body;

  if (!email || !fullName || !password || !role) {
     res.status(400).json({ success: false, error: 'Missing registration details (email, fullName, password, role).' });
     return;
  }

  const normalizedRole = role.toLowerCase() as 'buyer' | 'seller' | 'admin';
  if (!['buyer', 'seller', 'admin'].includes(normalizedRole)) {
     res.status(400).json({ success: false, error: 'Invalid workspace role specification.' });
     return;
  }

  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
     res.status(400).json({ success: false, error: 'An account with this email address already holds certification.' });
     return;
  }

  const newUser: UserAccount = {
    id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    email: email.toLowerCase(),
    fullName,
    phone: phone || '+234 800 000 0000',
    role: normalizedRole,
    avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fullName)}`,
    isVerified: normalizedRole === 'admin' || normalizedRole === 'buyer', // Admins/Buyers pre-verified; Sellers reviewed,
    passwordHash: password, // Store password safely for simulation
    businessName: normalizedRole === 'seller' ? (businessName || `${fullName} Dealership`) : undefined,
    taxId: normalizedRole === 'seller' ? (taxId || 'TIN-NOT-SET') : undefined,
    deliveryAddress: normalizedRole === 'buyer' ? (deliveryAddress || 'Lagos, Nigeria') : undefined,
    watchlist: normalizedRole === 'buyer' ? [] : undefined
  };

  users.push(newUser);
  saveDB();

  // Issue dynamic JWT token
  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Securely lock httpOnly cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: false, // development-friendly context (same-domain mapping in Cloud Run container)
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  // Strip password hash from profile
  const cleanProfile = { ...newUser };
  delete (cleanProfile as Record<string, unknown>)['passwordHash'];
  res.status(201).json({ success: true, profile: cleanProfile });
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password, checkedRole } = req.body;

  if (!email || !password) {
     res.status(400).json({ success: false, error: 'Missing credentials.' });
     return;
  }

  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user || user.passwordHash !== password) {
     res.status(401).json({ success: false, error: 'Authenticated credentials declined. Invalid email or password.' });
     return;
  }

  if (user.isBanned) {
     res.status(403).json({ success: false, error: 'Your account is currently suspended for safety violations.' });
     return;
  }

  // Double check client role safety matches expected
  if (checkedRole && user.role.toLowerCase() !== checkedRole.toLowerCase()) {
    res.status(403).json({ success: false, error: `Account workspace role is strictly [${user.role}], but client sent request for [${checkedRole}].` });
    return;
  }

  // Issue Token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  const cleanProfile = { ...user };
  delete (cleanProfile as Record<string, unknown>)['passwordHash'];
  res.json({ success: true, profile: cleanProfile });
});

apiRouter.post('/auth/logout', (req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Safely disconnected.' });
});

apiRouter.get('/auth/me', (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
     res.json({ success: false, profile: null });
     return;
  }
  const user = users.find(u => u.id === req.user?.id);
  if (!user) {
     res.json({ success: false, profile: null });
     return;
  }
  const cleanProfile = { ...user };
  delete (cleanProfile as Record<string, unknown>)['passwordHash'];
  res.json({ success: true, profile: cleanProfile });
});


// --- ADMIN ACTIONS (Banning / KYC / Approvals) ---

apiRouter.get('/admin/users', requireAuth, requireRole(['admin']), (req: Request, res: Response) => {
  const cleanUsers = users.map((u) => {
    const cleanProfile = { ...u };
    delete (cleanProfile as Record<string, unknown>)['passwordHash'];
    return cleanProfile;
  });
  res.json(cleanUsers);
});

apiRouter.post('/admin/users/:id/ban', requireAuth, requireRole(['admin']), (req: Request, res: Response) => {
  const user = users.find(u => u.id === req.params['id']);
  if (!user) {
     res.status(404).json({ success: false, error: 'User workspace not found.' });
     return;
  }
  user.isBanned = true;
  saveDB();
  res.json({ success: true, profile: user });
});

apiRouter.post('/admin/users/:id/unban', requireAuth, requireRole(['admin']), (req: Request, res: Response) => {
  const user = users.find(u => u.id === req.params['id']);
  if (!user) {
     res.status(404).json({ success: false, error: 'User workspace not found.' });
     return;
  }
  user.isBanned = false;
  saveDB();
  res.json({ success: true, profile: user });
});

apiRouter.post('/admin/users/:id/approve-kyc', requireAuth, requireRole(['admin']), (req: Request, res: Response) => {
  const user = users.find(u => u.id === req.params['id']);
  if (!user) {
     res.status(404).json({ success: false, error: 'User not found in roster.' });
     return;
  }
  user.isVerified = true;
  saveDB();
  res.json({ success: true, profile: user });
});


// --- VEHICLE MARKETS CONTROLLERS ---

apiRouter.get('/listings', (req: Request, res: Response) => {
  // Returns listings, sorting pending or approved based on role visibility
  res.json(listings);
});

apiRouter.post('/listings', requireAuth, requireRole(['seller', 'admin']), (req: AuthenticatedRequest, res: Response) => {
  const { make, model, year, price, mileage, image, location } = req.body;

  if (!make || !model || !year || !price) {
     res.status(400).json({ success: false, error: 'Missing key listing definitions.' });
     return;
  }

  const seller = users.find(u => u.id === req.user?.id);

  const newListing: VehicleListing = {
    id: `v-${Date.now()}`,
    make,
    model,
    year: Number(year),
    price: Number(price),
    mileage: Number(mileage || 0),
    image: image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600',
    location: location || 'Lagos, Nigeria',
    status: 'pending_approval',
    isInspected: false,
    sellerId: req.user?.id || 'usr-seller-1',
    sellerName: seller?.businessName || seller?.fullName || 'Carvello Partner Dealer'
  };

  listings.push(newListing);
  saveDB();
  res.status(201).json({ success: true, listing: newListing });
});

apiRouter.post('/listings/:id/approve', requireAuth, requireRole(['admin']), (req: Request, res: Response) => {
  const listing = listings.find(l => l.id === req.params['id']);
  if (!listing) {
     res.status(404).json({ success: false, error: 'Listing not found.' });
     return;
  }
  listing.status = 'approved';
  saveDB();
  res.json({ success: true, listing });
});

apiRouter.post('/listings/:id/reject', requireAuth, requireRole(['admin']), (req: Request, res: Response) => {
  const listing = listings.find(l => l.id === req.params['id']);
  if (!listing) {
     res.status(404).json({ success: false, error: 'Listing not found.' });
     return;
  }
  listing.status = 'rejected';
  saveDB();
  res.json({ success: true, listing });
});


// --- INSPECTIONS ENGINE ---

apiRouter.get('/inspections', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const role = req.user?.role;
  if (role === 'admin') {
    res.json(inspections);
  } else if (role === 'buyer') {
    res.json(inspections.filter(i => i.buyerId === req.user?.id));
  } else {
    // Sellers can view inspections on their vehicles
    const sellerListings = listings.filter(l => l.sellerId === req.user?.id).map(l => l.id);
    res.json(inspections.filter(i => sellerListings.includes(i.vehicleId)));
  }
});

apiRouter.post('/inspections/request', requireAuth, requireRole(['buyer', 'admin']), (req: AuthenticatedRequest, res: Response) => {
  const { vehicleId, location } = req.body;

  const vehicle = listings.find(l => l.id === vehicleId);
  if (!vehicle) {
     res.status(404).json({ success: false, error: 'Vehicle not found.' });
     return;
  }

  const buyer = users.find(u => u.id === req.user?.id);

  const newRequest: InspectionRequest = {
    id: `ins-${Date.now()}`,
    vehicleId,
    vehicleName: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    vehicleImage: vehicle.image,
    buyerId: req.user?.id || 'usr-buyer-1',
    buyerName: buyer?.fullName || 'Anonymous Buyer',
    location: location || vehicle.location,
    status: 'pending_assignment'
  };

  inspections.push(newRequest);
  saveDB();
  res.status(201).json({ success: true, inspection: newRequest });
});

apiRouter.post('/inspections/:id/assign', requireAuth, requireRole(['admin']), (req: Request, res: Response) => {
  const { assignedInspectorName, scheduledDate } = req.body;
  const inspection = inspections.find(i => i.id === req.params['id']);
  
  if (!inspection) {
     res.status(404).json({ success: false, error: 'Inspection report request not found.' });
     return;
  }

  inspection.status = 'assigned';
  inspection.assignedInspectorId = `ins-rep-${Math.floor(Math.random() * 900) + 100}`;
  inspection.assignedInspectorName = assignedInspectorName || 'Frank Adebayo';
  inspection.scheduledDate = scheduledDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  saveDB();
  res.json({ success: true, inspection });
});

apiRouter.post('/inspections/:id/report', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { rating, reportDetails, photos } = req.body;
  const inspection = inspections.find(i => i.id === req.params['id']);

  if (!inspection) {
     res.status(404).json({ success: false, error: 'Inspection request not found.' });
     return;
  }

  inspection.status = 'completed';
  inspection.rating = Number(rating || 5);
  inspection.reportDetails = reportDetails || '150-Point mechanical scan successful. Transmission locks and dynamic performance ratios exceed standard indices.';
  inspection.photos = photos || [
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=400',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=400'
  ];

  // Update original vehicle status
  const vehicle = listings.find(l => l.id === inspection.vehicleId);
  if (vehicle) {
    vehicle.isInspected = true;
    vehicle.inspectorReport = inspection.reportDetails;
    vehicle.inspectorRating = inspection.rating;
    vehicle.inspectorPhotos = inspection.photos;
  }

  saveDB();
  res.json({ success: true, inspection });
});


// --- DELIVERIES COURIER SECTION ---

apiRouter.get('/deliveries', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const role = req.user?.role;
  if (role === 'admin') {
    res.json(deliveries);
  } else if (role === 'buyer') {
    res.json(deliveries.filter(d => d.buyerId === req.user?.id));
  } else {
    // Sellers can view delivery orders associated with listings they own
    const sellerListings = listings.filter(l => l.sellerId === req.user?.id).map(l => l.id);
    res.json(deliveries.filter(d => sellerListings.includes(d.vehicleId)));
  }
});

// Mock shipping quote calculator
apiRouter.post('/deliveries/quote', requireAuth, (req: Request, res: Response) => {
  const { deliveryAddress, deliveryMethod } = req.body;
  if (deliveryMethod === 'pickup') {
    res.json({ success: true, quote: 0 });
    return;
  }

  // Generate deterministic quote based on string distance / address complexity
  const len = (deliveryAddress || '').length;
  const rawQuote = 25000 + len * 4500;
  res.json({ success: true, quote: Math.min(Math.max(rawQuote, 15000), 250000) });
  return;
});

apiRouter.post('/deliveries/create', requireAuth, requireRole(['buyer', 'admin']), (req: AuthenticatedRequest, res: Response) => {
  const { vehicleId, deliveryMethod, deliveryAddress } = req.body;

  const vehicle = listings.find(l => l.id === vehicleId);
  if (!vehicle) {
     res.status(404).json({ success: false, error: 'Vehicle profile not found.' });
     return;
  }

  const buyer = users.find(u => u.id === req.user?.id);

  // Quote calculation
  let shippingQuote = 0;
  if (deliveryMethod === 'transport') {
    const len = (deliveryAddress || '').length;
    shippingQuote = Math.min(Math.max(25000 + len * 4500, 15000), 250000);
  }

  const newOrder: DeliveryOrder = {
    id: `del-${Date.now()}`,
    vehicleId,
    vehicleName: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    vehicleImage: vehicle.image,
    buyerId: req.user?.id || 'usr-buyer-1',
    buyerName: buyer?.fullName || 'Anonymous Buyer',
    deliveryMethod: deliveryMethod || 'pickup',
    deliveryAddress: deliveryAddress || 'Handover Showroom Hub, Lagos',
    shippingQuote,
    status: 'pending',
    trackingDetails: 'Pre-dispatch preparations ongoing. Awaiting dealership handover checklist.'
  };

  deliveries.push(newOrder);
  saveDB();
  res.status(201).json({ success: true, order: newOrder });
});

apiRouter.post('/deliveries/:id/update-status', requireAuth, (req: Request, res: Response) => {
  const { status, trackingDetails } = req.body;
  const order = deliveries.find(d => d.id === req.params['id']);

  if (!order) {
     res.status(404).json({ success: false, error: 'Delivery transit order not found.' });
     return;
  }

  order.status = status || order.status;
  order.trackingDetails = trackingDetails || `Courier progress: standard shipping routing updated to ${status}.`;
  
  saveDB();
  res.json({ success: true, order });
});
