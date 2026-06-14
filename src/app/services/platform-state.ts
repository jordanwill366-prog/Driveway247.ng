import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { supabase } from './supabase';
import { BaseUserProfile, VehicleListing, InspectionRequest, DeliveryOrder } from '../../shared/types';

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'Buyer' | 'Seller' | 'Broker' | 'Inspector' | 'Delivery' | 'Admin';
  isBanned?: boolean;
  unlockedRoles?: ('Buyer' | 'Seller' | 'Broker' | 'Inspector' | 'Delivery' | 'Admin')[];
  businessName?: string;
  cacNumber?: string;
  taxId?: string;
  address?: string;
  bankName?: string;
  bankAccountNumber?: string;
  selfieUrl?: string;
  status?: 'Pending Review' | 'Approved' | 'Rejected'; // for sellers & brokers
  yearsInOperation?: number;
  inventoryEstimate?: string;
  ninNumber?: string;
  referenceContact?: string;
}

export interface SourcingRequest {
  id: string;
  buyerName: string;
  buyerEmail: string;
  vehicleMake: string;
  vehicleModel: string;
  yearRange: string;
  budgetNaira: string;
  comments: string;
  status: 'Open' | 'Fulfilled' | 'Unfulfilled';
  createdAt: string;
}

export interface SourcingProposal {
  id: string;
  requestId: string;
  brokerId: string;
  brokerName: string;
  vehicleDetails: string;
  image: string;
  priceNaira: string;
  proposedCommission: string;
  status: 'Pending' | 'Accepted' | 'Declined';
  createdAt: string;
  matchType?: 'Best' | 'Closest' | 'Premium';
  advisorInsight?: string;
  trustScore?: string;
}

export interface StructuredOffer {
  id: string;
  vehicleId: string;
  buyerEmail: string;
  buyerName: string;
  sellerPrice: string;
  buyerOffer: string;
  counterOffer?: string;
  status: 'Pending' | 'Accepted' | 'Declined' | 'Countered';
  updatedAt: string;
}

export interface CarvelloDnaEvent {
  event: 'Manufactured' | 'Imported' | 'Registered' | 'Listed' | 'Inspected' | 'Sold' | 'Delivered' | 'Ownership Change' | 'Future Inspection Scheduled';
  date: string;
  title: string;
  description: string;
  badge?: string;
}

export interface CarvelloDnaInspection {
  id: string;
  inspectorName: string;
  date: string;
  photos: string[];
  videos: string[];
  findings: string;
  recommendations: string;
}

export interface CarvelloDna {
  vin: string;
  registrationNumber: string;
  engineNumber: string;
  verifications: {
    documentVerified: boolean;
    ownershipVerified: boolean;
    physicalVerified: boolean;
    documentVerifiedAt?: string;
    ownershipVerifiedAt?: string;
    physicalVerifiedAt?: string;
  };
  history: CarvelloDnaEvent[];
  inspections: CarvelloDnaInspection[];
  health: {
    engine: number;
    suspension: number;
    electrical: number;
    interior: number;
    exterior: number;
    tires: number;
  };
}

export interface TrustScoreFactor {
  title: string;
  impact: number;
  isPositive: boolean;
  description: string;
}

export interface TrustScoreDetails {
  score: number;
  factors: TrustScoreFactor[];
}

export interface Vehicle {
  id: string;
  image: string;
  year: string;
  make: string;
  model: string;
  price: string; // formatted with commas
  mileage: string;
  location: string;
  dealer: string;
  isVerified: boolean;
  hasEscrow: boolean;
  score: string;
  fuel: string;
  transmission: string;
  financeAvailable: boolean;
  status: 'Draft' | 'Pending Inspection' | 'Inspected' | 'Approved' | 'Declined';
  ownerId: string;
  assignedInspectorId?: string;
  assignedInspectorName?: string;
  inspectionDetails?: {
    vinVerified: boolean;
    engineRating: number; // out of 100
    brakesRating: number;
    transmissionRating: number;
    bodyRating: number;
    interiorRating: number;
    inspectorNotes: string;
    inspectedAt?: string;
  };
  carvelloDna?: CarvelloDna;
  fraudReportCount?: number;
  userReportCount?: number;
  adminReviewed?: boolean;
}

export interface KYCRequest {
  id: string;
  businessName?: string;
  fullName: string;
  type: 'Individual' | 'Dealer';
  status: 'Pending' | 'Approved' | 'Rejected';
  cacNumber?: string;
  taxId?: string;
  address: string;
  phone: string;
  submittedAt: string;
  documents: { name: string; type: string }[];
  identityCardNumber?: string;
  selfieUrl?: string;
  bankName?: string;
  bankAccountNumber?: string;
  dealershipPhotos?: string[];
  lockComments?: string;
}

export interface TrackingEntry {
  status: string;
  timestamp: string;
}

export interface EscrowTransaction {
  id: string;
  vehicleId: string;
  vehicleName: string;
  price: string;
  buyerEmail: string;
  sellerName: string;
  status: 'Funds Held' | 'In Transit' | 'Delivered' | 'Completed' | 'Disputed' | 'Refunded';
  payoutReleased: boolean;
  createdAt: string;
  timeline: { title: string; desc: string; time: string; active: boolean }[];
  dispatchApproved?: boolean;
  assignedDeliveryPartnerId?: string;
  assignedDeliveryPartnerName?: string;
  trackingLogs?: TrackingEntry[];
  proofNotes?: string;
  handoverProofImage?: string;
}

export interface ChatMessage {
  id: string;
  vehicleId: string;
  sender: 'Buyer' | 'Seller' | 'System';
  text: string;
  timestamp: string;
  flagged?: boolean;
  flagType?: string;
}

export interface BypassAuditLog {
  id: string;
  vehicleId: string;
  vehicleName: string;
  sender: string;
  flaggedContent: string;
  severity: 'High' | 'Medium';
  actionTaken: string;
  timestamp: string;
}

// Map simulated / placeholder IDs to standard database UUID strings
// This prevents Postgres errors (UUID type constraint violations) while maintaining
// seamless quick-login capability out-of-the-box in the browser simulator layout.
const UUID_MAP: Record<string, string> = {
  'buyer-default': 'de305d54-75b4-431b-adb2-eb6b9e546011',
  'seller-default': 'de305d54-75b4-431b-adb2-eb6b9e546012',
  's1': 'de305d54-75b4-431b-adb2-eb6b9e546013',
  's2': 'de305d54-75b4-431b-adb2-eb6b9e546014',
  's3': 'de305d54-75b4-431b-adb2-eb6b9e546015',
  'FLD-9022-ONLINE': 'de305d54-75b4-431b-adb2-eb6b9e546016',
  'LOG-701-DISPATCH': 'de305d54-75b4-431b-adb2-eb6b9e546017',
  'COMMAND-99': 'de305d54-75b4-431b-adb2-eb6b9e546018',
  'usr-jordan-b': 'de305d54-75b4-431b-adb2-eb6b9e546021',
  'usr-jordan-s': 'de305d54-75b4-431b-adb2-eb6b9e546022',
  'usr-jordan-brk': 'de305d54-75b4-431b-adb2-eb6b9e546023',
  'seller-auto': 'de305d54-75b4-431b-adb2-eb6b9e546024',
  'buyer-auto': 'de305d54-75b4-431b-adb2-eb6b9e546025',
  'fld-9022': 'de305d54-75b4-431b-adb2-eb6b9e546026',
  'fld-9022-b': 'de305d54-75b4-431b-adb2-eb6b9e546027',
  'log-701': 'de305d54-75b4-431b-adb2-eb6b9e546028',
  'log-701-b': 'de305d54-75b4-431b-adb2-eb6b9e546029',
  'adm-mainframe': 'de305d54-75b4-431b-adb2-eb6b9e546030',
  'adm-mainframe-b': 'de305d54-75b4-431b-adb2-eb6b9e546031',
};

function toUUID(id: string): string {
  if (!id) return 'de305d54-75b4-431b-adb2-000000000000';
  if (UUID_MAP[id]) return UUID_MAP[id];
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  if (isUuid) return id;
  // Deterministic helper
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  const offset = (100000000000 + sum).toString();
  return `de305d54-75b4-431b-adb2-${offset.padEnd(12, '0')}`;
}

@Injectable({
  providedIn: 'root'
})
export class PlatformStateService {
  public http = inject(HttpClient);

  // --- STATE SIGNALS ---
  public listings = signal<Vehicle[]>([]);
  public users = signal<UserAccount[]>([]);
  public currentSession = signal<UserAccount | null>(null);

  // Maps preloaded session into contract specifications
  public activeUser = computed(() => {
    const s = this.currentSession();
    if (!s) return null;
    const normRole = s.role.toLowerCase();
    return {
      id: s.id,
      email: s.email,
      fullName: s.fullName,
      phone: s.phone,
      role: (normRole === 'buyer' || normRole === 'seller' || normRole === 'admin' ? normRole : 'buyer') as 'buyer' | 'seller' | 'admin',
      avatarUrl: s.selfieUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${s.id}`,
      isVerified: s.status === 'Approved' || normRole === 'buyer' || normRole === 'admin',
      isBanned: s.isBanned || false,
      businessName: s.businessName || 'Carvello Partner Dealer',
      taxId: s.taxId || 'TIN-NOT-SUBMITTED',
      deliveryAddress: s.address || 'Lagos, Nigeria',
      watchlist: this.savedVehicleIds()
    };
  });

  // Core workflows backed by persistent LocalStorage synchronization
  public kycRequests = signal<KYCRequest[]>([]);
  public transactions = signal<EscrowTransaction[]>([]);
  public chats = signal<ChatMessage[]>([]);
  public bypassLogs = signal<BypassAuditLog[]>([]);
  public sourcingRequestsList = signal<SourcingRequest[]>([]);
  public sourcingProposalsList = signal<SourcingProposal[]>([]);
  public structuredOffersList = signal<StructuredOffer[]>([]);
  public brokerCommissionsTotal = signal<number>(1850000);

  // Settings Controls
  public showSettings = signal<boolean>(false);
  public activeSettingsTab = signal<'Profile' | 'Verification' | 'Professional' | 'Appearance' | 'Saved' | 'Offers' | 'Negotiations' | 'Activity'>('Profile');
  public activeTheme = signal<'Midnight Drive' | 'Showroom Light' | 'Executive Black' | 'Ocean Blue'>('Executive Black');
  public savedVehicleIds = signal<string[]>(['v1', 'v4']);

  // Preloaded static backups to populate interface immediately while database sync resolves
  private readonly defaultListings: Vehicle[] = [
    {
      id: 'v1',
      image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1000&auto=format&fit=crop",
      year: "2021",
      make: "Lexus",
      model: "RX 350 F-Sport AWD",
      price: "42,500,000",
      mileage: "12,450 mi",
      location: "Lekki, Lagos",
      dealer: "AutoHub Prime",
      isVerified: true,
      hasEscrow: true,
      score: "98",
      fuel: "Petrol",
      transmission: "Auto",
      financeAvailable: true,
      status: 'Approved',
      ownerId: 's1',
      inspectionDetails: {
        vinVerified: true,
        engineRating: 98,
        brakesRating: 95,
        transmissionRating: 99,
        bodyRating: 96,
        interiorRating: 97,
        inspectorNotes: "Excellent condition. Single executive owner, minor scuff on front right lip repainted perfectly. Engine purrs flawlessly."
      }
    },
    {
      id: 'v2',
      image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000&auto=format&fit=crop",
      year: "2022",
      make: "Toyota",
      model: "Land Cruiser 300 Series",
      price: "115,000,000",
      mileage: "8,200 mi",
      location: "Maitama, Abuja",
      dealer: "Royal Autos",
      isVerified: true,
      hasEscrow: true,
      score: "99",
      fuel: "Diesel",
      transmission: "Auto",
      financeAvailable: false,
      status: 'Approved',
      ownerId: 's2',
      inspectionDetails: {
        vinVerified: true,
        engineRating: 100,
        brakesRating: 98,
        transmissionRating: 99,
        bodyRating: 98,
        interiorRating: 100,
        inspectorNotes: "Bulletproofed capability. Absolutely like brand new, tires have 95% tread depth, electronic crawl systems verified."
      }
    },
    {
      id: 'v3',
      image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1000&auto=format&fit=crop",
      year: "2019",
      make: "Mercedes-Benz",
      model: "GLE 450 4MATIC",
      price: "55,000,000",
      mileage: "31,000 mi",
      location: "Victoria Island",
      dealer: "Elite Cars Ltd",
      isVerified: true,
      hasEscrow: false,
      score: "92",
      fuel: "Hybrid",
      transmission: "Auto",
      financeAvailable: true,
      status: 'Approved',
      ownerId: 's1',
      inspectionDetails: {
        vinVerified: true,
        engineRating: 92,
        brakesRating: 90,
        transmissionRating: 95,
        bodyRating: 92,
        interiorRating: 91,
        inspectorNotes: "Good hybrid motor status. Battery level health checks out at 89% capacity. Suspension bushes slightly worn but structurally robust."
      }
    },
    {
      id: 'v4',
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1000&auto=format&fit=crop",
      year: "2023",
      make: "Range Rover",
      model: "Autobiography LWB",
      price: "245,000,000",
      mileage: "2,100 mi",
      location: "Banana Island",
      dealer: "Signature Motors",
      isVerified: true,
      hasEscrow: true,
      score: "100",
      fuel: "Petrol",
      transmission: "Auto",
      financeAvailable: false,
      status: 'Approved',
      ownerId: 's3',
      inspectionDetails: {
        vinVerified: true,
        engineRating: 100,
        brakesRating: 100,
        transmissionRating: 100,
        bodyRating: 100,
        interiorRating: 100,
        inspectorNotes: "Stunning LWB showroom condition. Fully diagnostic cleared, active cooling massagers and air bellows operates perfectly."
      }
    },
    {
      id: 'v5',
      image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1000&auto=format&fit=crop",
      year: "2020",
      make: "Honda",
      model: "Accord Touring 2.0T",
      price: "22,000,000",
      mileage: "28,500 mi",
      location: "Gwarinpa, Abuja",
      dealer: "Capital Motors",
      isVerified: true,
      hasEscrow: true,
      score: "94",
      fuel: "Petrol",
      transmission: "Auto",
      financeAvailable: true,
      status: 'Approved',
      ownerId: 's2'
    }
  ];

  private readonly defaultUsers: UserAccount[] = [
    {
      id: 'buyer-default',
      fullName: 'Jordan Williams',
      email: 'jordanwill366@gmail.com',
      phone: '+234 812 445 6677',
      role: 'Buyer',
      unlockedRoles: ['Buyer', 'Seller', 'Broker']
    },
    {
      id: 'seller-default',
      fullName: 'Chidi Okafor',
      email: 'seller@carvello.ng',
      phone: '+234 803 777 8899',
      role: 'Seller',
      unlockedRoles: ['Buyer', 'Seller'],
      businessName: 'AutoHub Prime',
      cacNumber: 'RC-1193325',
      taxId: 'TIN-11223344-Y',
      address: '15 Bishop Aboyade Cole St, Victoria Island, Lagos',
      bankName: 'Access Bank',
      bankAccountNumber: '0012345678',
      status: 'Approved',
      yearsInOperation: 8,
      inventoryEstimate: '₦150M - ₦500M'
    },
    {
      id: 'FLD-9022-ONLINE',
      fullName: 'Frank Adebayo (Inspector)',
      email: 'frank@carvello.ng',
      phone: '+234 810 555 4422',
      role: 'Inspector',
      unlockedRoles: ['Buyer', 'Inspector']
    },
    {
      id: 'LOG-701-DISPATCH',
      fullName: 'James Nwachukwu (Delivery)',
      email: 'james@carvello.ng',
      phone: '+234 805 321 0987',
      role: 'Delivery',
      unlockedRoles: ['Buyer', 'Delivery']
    },
    {
      id: 'COMMAND-99',
      fullName: 'Chief Commander Node',
      email: 'command@carvello.ng',
      phone: '+234 700 TRUST SECURE',
      role: 'Admin',
      unlockedRoles: ['Buyer', 'Admin']
    }
  ];

  // --- COMPUTIVE SELECTORS ---
  public getSession = computed(() => this.currentSession());
  public getUsers = computed(() => this.users());
  public getListings = computed(() => this.listings());
  public approvedListings = computed(() => this.listings().filter(l => l.status === 'Approved'));
  public getKYCRequests = computed(() => this.kycRequests());
  public getTransactions = computed(() => this.transactions());
  public getChatForVehicle = (vehicleId: string) => computed(() => this.chats().filter(c => c.vehicleId === vehicleId));
  public getBypassLogs = computed(() => this.bypassLogs());
  public getSourcingRequests = computed(() => this.sourcingRequestsList());
  public getSourcingProposals = computed(() => this.sourcingProposalsList());
  public getStructuredOffers = computed(() => this.structuredOffersList());
  public getSourcingRequestsByBuyer = (email: string) => computed(() => this.sourcingRequestsList().filter(r => r.buyerEmail === email));
  public getSourcingProposalsForRequest = (reqId: string) => computed(() => this.sourcingProposalsList().filter(p => p.requestId === reqId));
  public getStructuredOfferForVehicle = (vId: string) => computed(() => this.structuredOffersList().find(o => o.vehicleId === vId));

  constructor() {
    this.initializeState();
    this.refreshBodyTheme();
  }

  private async initializeState() {
    // 1. Load localStorage local cache for seamless state tracking of structural actions
    this.loadLocalCache();

    if (typeof window === 'undefined') {
      // Server-side / SSR: use defaults without attempting external Supabase network calls
      this.listings.set(this.defaultListings);
      this.users.set(this.defaultUsers);
      return;
    }

    // 2. Fetch and merge Listings from Supabase PostgreSQL in real time!
    await this.fetchListingsFromSupabase();

    // 3. Fetch and merge Users from Supabase PostgreSQL in real time!
    await this.fetchUsersFromSupabase();

    // 4. Initialize real time channel connection
    this.setupRealtimeSubscriptions();

    // 5. Connect Session checks to Supabase Auth State listener
    this.setupSupabaseAuth();
  }

  private loadLocalCache() {
    if (typeof localStorage === 'undefined') return;

    const savedTheme = localStorage.getItem('carvello_theme');
    if (savedTheme) {
      this.activeTheme.set(savedTheme as 'Midnight Drive' | 'Showroom Light' | 'Executive Black' | 'Ocean Blue');
    }

    const savedFavs = localStorage.getItem('carvello_favs');
    if (savedFavs) this.savedVehicleIds.set(JSON.parse(savedFavs) as string[]);

    const savedKyc = localStorage.getItem('carvello_kyc');
    if (savedKyc) this.kycRequests.set(JSON.parse(savedKyc) as KYCRequest[]);

    const savedTx = localStorage.getItem('carvello_tx');
    if (savedTx) this.transactions.set(JSON.parse(savedTx) as EscrowTransaction[]);

    const savedChat = localStorage.getItem('carvello_chats');
    if (savedChat) this.chats.set(JSON.parse(savedChat) as ChatMessage[]);

    const savedBypass = localStorage.getItem('carvello_bypass_logs');
    if (savedBypass) this.bypassLogs.set(JSON.parse(savedBypass) as BypassAuditLog[]);

    const savedSourcingReq = localStorage.getItem('carvello_sourcing_reqs');
    if (savedSourcingReq) this.sourcingRequestsList.set(JSON.parse(savedSourcingReq) as SourcingRequest[]);

    const savedSourcingProp = localStorage.getItem('carvello_sourcing_props');
    if (savedSourcingProp) this.sourcingProposalsList.set(JSON.parse(savedSourcingProp) as SourcingProposal[]);

    const savedOffers = localStorage.getItem('carvello_structured_offers');
    if (savedOffers) this.structuredOffersList.set(JSON.parse(savedOffers) as StructuredOffer[]);

    const savedComm = localStorage.getItem('carvello_commissions');
    if (savedComm) this.brokerCommissionsTotal.set(JSON.parse(savedComm) as number);

    const savedSession = localStorage.getItem('carvello_session');
    if (savedSession) this.currentSession.set(JSON.parse(savedSession) as UserAccount);
  }

  private saveItemToLocal(key: string, data: unknown) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  private async fetchListingsFromSupabase() {
    try {
      const { data, error } = await supabase.from('vehicles').select('*');
      if (error) {
        console.warn('Supabase fetch listings failed -> fallback to cache (info):', error.message);
        this.listings.set(this.defaultListings);
        return;
      }

      if (!data || data.length === 0) {
        // Seeding database vehicles is disabled/handled as empty, display default lists
        this.listings.set(this.defaultListings);
        return;
      }

      // Map rows from PostgreSQL to UI models elegantly
      const dbListings: Vehicle[] = (data as Record<string, unknown>[]).map((row: Record<string, unknown>) => {
        const rowImages = row['images'] as string[] | undefined;
        return {
          id: row['id'] as string,
          image: (rowImages && rowImages.length > 0) ? rowImages[0] : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1000&auto=format&fit=crop',
          year: (row['year'] || 2021).toString(),
          make: (row['brand'] || 'Toyota') as string,
          model: (row['model'] || 'Unknown') as string,
          price: parseFloat((row['price'] || 0).toString()).toLocaleString('en-US'),
          mileage: (row['mileage'] || 0).toLocaleString() + ' mi',
          location: (row['location'] || 'Lagos') as string,
          dealer: 'Showroom Dealer',
          isVerified: row['status'] === 'Approved',
          hasEscrow: true,
          score: row['status'] === 'Approved' ? '98' : 'Awaiting',
          fuel: (row['fuel_type'] || 'Petrol') as string,
          transmission: (row['transmission'] || 'Auto') as string,
          financeAvailable: true,
          status: (row['status'] || 'Pending Inspection') as Vehicle['status'],
          ownerId: (row['seller_id'] || 's1') as string
        };
      });

      // Merge and remove duplicates by ID
      const merged = [...dbListings];
      this.defaultListings.forEach(def => {
        if (!merged.some(m => m.id === def.id)) {
          merged.push(def);
        }
      });

      this.listings.set(merged);
    } catch (err) {
      console.warn('Fetch listings exception (handled):', err);
      this.listings.set(this.defaultListings);
    }
  }

  private async fetchUsersFromSupabase() {
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) {
        console.warn('Supabase fetch users failed -> Fallback (info):', error.message);
        this.users.set(this.defaultUsers);
        return;
      }

      const dbUsers: UserAccount[] = (data as Record<string, unknown>[]).map((row: Record<string, unknown>) => ({
        id: row['id'] as string,
        fullName: row['full_name'] as string,
        email: row['email'] as string,
        phone: row['phone'] as string,
        role: row['role'] as UserAccount['role'],
        unlockedRoles: ['Buyer', row['role']] as UserAccount['role'][]
      }));

      // Merge custom state parameters
      const merged = [...dbUsers];
      this.defaultUsers.forEach(def => {
        if (!merged.some(m => m.email.toLowerCase() === def.email.toLowerCase() && m.role === def.role)) {
          merged.push(def);
        }
      });
      // Merge extra details
      this.users.set(merged);
    } catch (err) {
      console.warn('Fetch users exception (handled):', err);
      this.users.set(this.defaultUsers);
    }
  }

  private setupRealtimeSubscriptions() {
    // Subscribe to Postgres Changes in real time on 'vehicles' and 'users'
    supabase
      .channel('public:vehicles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vehicles' }, async () => {
        console.log('Realtime notification: listings modified in DB. Reloading list.');
        await this.fetchListingsFromSupabase();
      })
      .subscribe();

    supabase
      .channel('public:users')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, async () => {
        console.log('Realtime notification: users modified in DB. Reloading list.');
        await this.fetchUsersFromSupabase();
      })
      .subscribe();
  }

  private setupSupabaseAuth() {
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Supabase Auth state changed event occurred:', event);
      if (session && session.user) {
        const email = session.user.email;
        const matched = this.users().find(u => u.email.toLowerCase() === email?.toLowerCase());
        if (matched) {
          this.currentSession.set(matched);
          this.saveItemToLocal('carvello_session', matched);
        } else {
          // Setup initial buyer session dynamically
          const guest: UserAccount = {
            id: session.user.id,
            fullName: email ? email.split('@')[0].toUpperCase() : 'Authenticated User',
            email: email || 'user@carvello.ng',
            phone: '+234 800 000 0000',
            role: 'Buyer',
            unlockedRoles: ['Buyer']
          };
          this.users.update(curr => [guest, ...curr]);
          this.currentSession.set(guest);
          this.saveItemToLocal('carvello_session', guest);
        }
      }
    });
  }

  // --- MUTATIVE ACTIONS ---

  public logout() {
    this.currentSession.set(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('carvello_session');
    }
    supabase.auth.signOut();
  }

  // --- REAL JWT & ESCROW INTEGRATION ENDPOINTS ---
  public loginWithBackend(emailOrId: string, passcode: string, role: string) {
    return this.http.post<{ success: boolean; profile: UserAccount; error?: string }>('/api/auth/login', {
      email: emailOrId,
      password: passcode,
      checkedRole: role
    });
  }

  public registerWithBackend(payload: {
    email: string;
    fullName: string;
    phone?: string;
    role: 'buyer' | 'seller' | 'admin';
    password?: string;
    businessName?: string;
    taxId?: string;
    deliveryAddress?: string;
  }) {
    return this.http.post<{ success: boolean; profile: UserAccount; error?: string }>('/api/auth/register', payload);
  }

  public logoutWithBackend() {
    return this.http.post<{ success: boolean; error?: string }>('/api/auth/logout', {});
  }

  public checkUserSessionWithBackend() {
    return this.http.get<{ success: boolean; profile: UserAccount }>('/api/auth/me');
  }

  public createDeliveryOrderBack(payload: { vehicleId: string; deliveryMethod: 'pickup' | 'transport'; deliveryAddress: string }) {
    return this.http.post<{ success: boolean; order: DeliveryOrder; error?: string }>('/api/deliveries/create', payload);
  }

  public fetchDeliveries() {
    return this.http.get<DeliveryOrder[]>('/api/deliveries');
  }

  public createInspectionRequestBack(payload: { vehicleId: string; location: string }) {
    return this.http.post<{ success: boolean; inspection: InspectionRequest; error?: string }>('/api/inspections/request', payload);
  }

  public fetchInspections() {
    return this.http.get<InspectionRequest[]>('/api/inspections');
  }

  public fetchAdminUsers() {
    return this.http.get<BaseUserProfile[]>('/api/admin/users');
  }

  public banUserBack(userId: string) {
    return this.http.post<{ success: boolean; error?: string }>(`/api/admin/users/${userId}/ban`, {});
  }

  public unbanUserBack(userId: string) {
    return this.http.post<{ success: boolean; error?: string }>(`/api/admin/users/${userId}/unban`, {});
  }

  public approveKYCBack(userId: string) {
    return this.http.post<{ success: boolean; error?: string }>(`/api/admin/users/${userId}/approve-kyc`, {});
  }

  public assignInspectorBack(inspectionId: string, payload: { assignedInspectorName: string; scheduledDate?: string }) {
    return this.http.post<{ success: boolean; inspection: InspectionRequest; error?: string }>(`/api/inspections/${inspectionId}/assign`, payload);
  }

  public submitInspectionReportBack(inspectionId: string, payload: { rating: number; reportDetails: string; photos?: string[] }) {
    return this.http.post<{ success: boolean; inspection: InspectionRequest; error?: string }>(`/api/inspections/${inspectionId}/report`, payload);
  }

  public submitListingBack(payload: {
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    image?: string;
    location?: string;
  }) {
    return this.http.post<{ success: boolean; listing: VehicleListing; error?: string }>('/api/listings', payload);
  }

  public approveListingBack(vehicleId: string) {
    return this.http.post<{ success: boolean; error?: string }>(`/api/listings/${vehicleId}/approve`, {});
  }

  public updateDeliveryStatusBack(deliveryId: string, status: string, trackingDetails?: string) {
    return this.http.post<{ success: boolean; error?: string }>(`/api/deliveries/${deliveryId}/update-status`, { status, trackingDetails });
  }

  public getShippingQuote(deliveryAddress: string, deliveryMethod: 'pickup' | 'transport') {
    return this.http.post<{ success: boolean; quote: number; error?: string }>('/api/deliveries/quote', { deliveryAddress, deliveryMethod });
  }

  public setSession(user: UserAccount | null) {
    if (user && !user.unlockedRoles) {
      user.unlockedRoles = ['Buyer'];
    }
    this.currentSession.set(user);
    this.saveItemToLocal('carvello_session', user);
    this.refreshBodyTheme();
  }

  public setTheme(theme: 'Midnight Drive' | 'Showroom Light' | 'Executive Black' | 'Ocean Blue') {
    this.activeTheme.set(theme);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('carvello_theme', theme);
    }
    this.refreshBodyTheme();
  }

  private refreshBodyTheme() {
    if (typeof document !== 'undefined') {
      const themeClassMap: Record<string, string> = {
        'Midnight Drive': 'theme-midnight',
        'Showroom Light': 'theme-showroom',
        'Executive Black': 'theme-executive',
        'Ocean Blue': 'theme-ocean'
      };
      Object.values(themeClassMap).forEach(cls => {
        document.documentElement.classList.remove(cls);
        document.body.classList.remove(cls);
      });
      const currentClass = themeClassMap[this.activeTheme()];
      if (currentClass) {
        document.documentElement.classList.add(currentClass);
        document.body.classList.add(currentClass);
      }
    }
  }

  public switchRole(role: UserAccount['role']) {
    const session = this.currentSession();
    if (session) {
      const updated = { ...session, role };
      this.currentSession.set(updated);
      this.saveItemToLocal('carvello_session', updated);
    }
  }

  public unlockRole(role: UserAccount['role']) {
    const session = this.currentSession();
    if (session) {
      const currentRoles = session.unlockedRoles || ['Buyer'];
      if (!currentRoles.includes(role)) {
        const updatedRoles = [...currentRoles, role];
        const updatedSession = { ...session, unlockedRoles: updatedRoles };
        this.currentSession.set(updatedSession);
        this.saveItemToLocal('carvello_session', updatedSession);
        
        // Also sync back to users list
        this.users.update(allUsers => allUsers.map(u => 
          u.email.toLowerCase() === session.email.toLowerCase() ? { ...u, unlockedRoles: updatedRoles } : u
        ));

        this.syncUserProfileToSupabase(updatedSession);
      }
    }
  }

  public loginAs(emailOrId: string, role: UserAccount['role']): UserAccount | null {
    // Search matching profile
    const matchedUser = this.users().find(u => 
      (u.email.toLowerCase() === emailOrId.toLowerCase() || u.id.toLowerCase() === emailOrId.toLowerCase()) && 
      u.role === role
    );
    if (matchedUser) {
      this.currentSession.set(matchedUser);
      this.saveItemToLocal('carvello_session', matchedUser);
      this.syncUserProfileToSupabase(matchedUser);
      return matchedUser;
    }
    
    // Auto-onboard new Buyers instantly
    if (role === 'Buyer') {
      const id = 'buyer-' + (this.users().length + 1);
      const newUser: UserAccount = {
        id,
        fullName: emailOrId.includes('@') ? emailOrId.split('@')[0].toUpperCase() : 'USER_' + emailOrId,
        email: emailOrId.includes('@') ? emailOrId : emailOrId + '@carvello.ng',
        phone: '+234 812 000 0000',
        role: 'Buyer',
        unlockedRoles: ['Buyer']
      };
      this.users.update(current => [...current, newUser]);
      this.currentSession.set(newUser);
      this.saveItemToLocal('carvello_session', newUser);

      this.syncUserProfileToSupabase(newUser);
      return newUser;
    }

    return null;
  }

  private async syncUserProfileToSupabase(profile: UserAccount) {
    try {
      // Upsert profile in users database
      await supabase.from('users').upsert({
        id: toUUID(profile.id),
        full_name: profile.fullName,
        email: profile.email,
        phone: profile.phone || '',
        role: profile.role
      });
    } catch (err) {
      console.warn('Upsert user profile to Supabase warning:', err);
    }
  }

  public registerSeller(seller: Omit<UserAccount, 'id' | 'role' | 'status'>) {
    const id = 'seller-' + (this.users().length + 1);
    const newSeller: UserAccount = {
      ...seller,
      id,
      role: 'Seller',
      status: 'Pending Review',
      unlockedRoles: ['Buyer', 'Seller']
    };

    this.users.update(current => [...current, newSeller]);
    this.saveItemToLocal('carvello_session', newSeller);

    // Save extended vendor business properties safely to custom local registration mapping
    const extendedKey = `carvello_dealer_${newSeller.email.toLowerCase()}`;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(extendedKey, JSON.stringify(newSeller));
    }

    // Construct corresponding KYC Onboarding record
    const newKyc: KYCRequest = {
      id: 'kyc-' + id,
      fullName: seller.fullName,
      businessName: seller.businessName,
      type: 'Dealer',
      status: 'Pending',
      cacNumber: seller.cacNumber, 
      taxId: seller.taxId,
      address: seller.address || 'Nigeria Commercial Showroom Address',
      phone: seller.phone,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      documents: [
        { name: 'CAC_Certificate.pdf', type: 'Certificate of Corporate Affairs (RC-Verification)' },
        { name: 'Tax_Clearance_Corporate.pdf', type: 'FIRS Corporate Tax Clearance Certificate (TIN-Verification)' }
      ]
    };
    this.addKYCRequest(newKyc);

    this.syncUserProfileToSupabase(newSeller);
    return newSeller;
  }

  // Add Listing (Starts in Draft or Pending Inspection)
  public addListing(vehicle: Omit<Vehicle, 'id' | 'status' | 'ownerId' | 'isVerified' | 'score' | 'hasEscrow'>) {
    const id = 'v' + (this.listings().length + 1);
    const newVehicle: Vehicle = {
      ...vehicle,
      id,
      status: 'Pending Inspection',
      ownerId: 's1',
      isVerified: false,
      score: 'Awaiting',
      hasEscrow: true
    };
    
    this.listings.update(current => [newVehicle, ...current]);
    
    // Save to PostgreSQL vehicles table asynchronously
    this.syncListingToSupabase(newVehicle);
    return id;
  }

  private async syncListingToSupabase(vehicle: Vehicle) {
    try {
      const priceVal = parseFloat((vehicle.price || '0').replace(/,/g, ''));
      const mileageVal = parseInt((vehicle.mileage || '0').replace(/[^0-9]/g, '')) || 0;
      
      await supabase.from('vehicles').upsert({
        id: toUUID(vehicle.id),
        brand: vehicle.make,
        model: vehicle.model,
        year: parseInt(vehicle.year || '2021'),
        price: priceVal,
        mileage: mileageVal,
        location: vehicle.location,
        transmission: vehicle.transmission || 'Auto',
        status: vehicle.status,
        images: [vehicle.image],
        fuel_type: vehicle.fuel || 'Petrol',
        seller_id: toUUID(vehicle.ownerId || 's1')
      });
    } catch (err) {
      console.warn('Upsert vehicle to Supabase failed:', err);
    }
  }

  // Update specific inspection details (Inspector Platform)
  public updateInspection(id: string, notes: string, scores: { engine: number; body: number; interior: number; brakes: number; transmission: number }) {
    this.listings.update(current => 
      current.map(item => {
        if (item.id === id) {
          const avgScore = Math.round((scores.engine + scores.body + scores.interior + scores.brakes + scores.transmission) / 5);
          const updated = {
            ...item,
            score: avgScore.toString(),
            status: 'Inspected' as Vehicle['status'],
            inspectionDetails: {
              vinVerified: true,
              engineRating: scores.engine,
              bodyRating: scores.body,
              interiorRating: scores.interior,
              brakesRating: scores.brakes,
              transmissionRating: scores.transmission,
              inspectorNotes: notes,
              inspectedAt: new Date().toLocaleDateString()
            }
          };

          // Update backend status and scores
          this.syncListingToSupabase(updated);

          // Save custom inspection notes locally by vehicle ID
          this.saveItemToLocal(`carvello_insp_notes_${id}`, updated.inspectionDetails);
          return updated;
        }
        return item;
      })
    );
  }

  // Approve a Listing (Admin Control Panel)
  public approveListing(id: string) {
    this.listings.update(current => 
      current.map(item => {
        if (item.id === id) {
          const updated = { ...item, status: 'Approved' as Vehicle['status'], isVerified: true, adminReviewed: true };
          this.syncListingToSupabase(updated);
          return updated;
        }
        return item;
      })
    );
  }

  // Helper to add dynamic DNA event to a vehicle
  public addDnaEvent(vehicleId: string, event: CarvelloDnaEvent) {
    this.listings.update(current => 
      current.map(item => {
        if (item.id === vehicleId) {
          const dna = this.ensureCarvelloDna(item);
          if (!dna.history.some(h => h.title === event.title)) {
            dna.history.push(event);
          }
          const updated = { ...item, carvelloDna: dna };
          this.syncListingToSupabase(updated);
          return updated;
        }
        return item;
      })
    );
  }

  // Generate or assert a complete, realistic Carvello DNA profile for a vehicle
  public ensureCarvelloDna(vehicle: Vehicle): CarvelloDna {
    if (vehicle.carvelloDna) {
      return vehicle.carvelloDna;
    }

    const sampleVin = 'JTD1' + (vehicle.make || 'LH').substring(0, 2).toUpperCase() + (vehicle.model || 'RX').substring(0,2).toUpperCase() + '9F8H' + Math.floor(100000 + Math.random() * 900000);
    const sampleReg = 'LAG-' + Math.floor(100 + Math.random() * 899) + '-' + (vehicle.make || 'AUTO').substring(0, 2).toUpperCase();
    const sampleEng = 'ENG-' + Math.floor(10500000 + Math.random() * 999999);

    const yearNum = parseInt(vehicle.year) || 2021;
    
    const history: CarvelloDnaEvent[] = [
      {
        event: 'Manufactured',
        date: `04/12/${yearNum - 1}`,
        title: 'Factory Assembly Completed',
        description: `Assembled in standard designated manufacturing facility. Full mechanical tolerance check verified.`,
        badge: 'Factory'
      },
      {
        event: 'Imported',
        date: `22/03/${yearNum}`,
        title: 'Port Entry & Custom Clearance',
        description: `Import duty fully certified and settled under Customs Entry Code CNC-${sampleVin.substring(4, 10)}.`,
        badge: 'Customs'
      },
      {
        event: 'Registered',
        date: `15/04/${yearNum}`,
        title: 'First Administrative Registration',
        description: `Vehicle title issued globally under Registration Code ${sampleReg}. Single executive owner recorded.`,
        badge: 'Registry'
      }
    ];

    if (vehicle.status !== 'Draft') {
      history.push({
        event: 'Listed',
        date: `10/05/2026`,
        title: 'Listed on Carvello operating System',
        description: `Authorized digitally by premium seller system. Initial price benchmarked at ₦${vehicle.price}.`,
        badge: 'Listing'
      });
    }

    if (vehicle.status === 'Inspected' || vehicle.status === 'Approved') {
      history.push({
        event: 'Inspected',
        date: vehicle.inspectionDetails?.inspectedAt || `14/05/2026`,
        title: '150-Point Certified Physical Inspection',
        description: `Physical structural inspection completed. Scores: Engine ${vehicle.inspectionDetails?.engineRating || 95}%, Body ${vehicle.inspectionDetails?.bodyRating || 95}%.`,
        badge: 'Inspection'
      });
    }

    if (vehicle.status === 'Approved') {
      history.push({
        event: 'Future Inspection Scheduled',
        date: `12/03/2027`,
        title: 'Recommended Recertification Date',
        description: `Scheduled periodic safety recertification and drivetrain integrity check interval.`,
        badge: 'Future'
      });
    }

    const health = {
      engine: vehicle.inspectionDetails?.engineRating || 92,
      suspension: vehicle.inspectionDetails?.bodyRating || 90,
      electrical: Math.min(100, (vehicle.inspectionDetails?.engineRating || 92) + 2),
      interior: vehicle.inspectionDetails?.interiorRating || 94,
      exterior: vehicle.inspectionDetails?.bodyRating || 93,
      tires: 88
    };

    const inspections: CarvelloDnaInspection[] = [];
    if (vehicle.inspectionDetails) {
      inspections.push({
        id: 'INS-' + vehicle.id.toUpperCase(),
        inspectorName: vehicle.assignedInspectorName || 'Frank Adebayo (Inspector ID: FLD-9022)',
        date: vehicle.inspectionDetails.inspectedAt || '14/05/2026',
        photos: [
          'https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?q=80&w=600&auto=format&fit=crop'
        ],
        videos: [],
        findings: vehicle.inspectionDetails.inspectorNotes || 'No leaks identified, suspension bushings standard, electronic diagnostics clear.',
        recommendations: 'Continue factory scheduled maintenance. Oil index and coolant viscosity check standard.'
      });
    }

    const dna: CarvelloDna = {
      vin: sampleVin,
      registrationNumber: sampleReg,
      engineNumber: sampleEng,
      verifications: {
        documentVerified: vehicle.isVerified,
        ownershipVerified: vehicle.isVerified,
        physicalVerified: !!vehicle.inspectionDetails,
        documentVerifiedAt: vehicle.isVerified ? '10/05/2026' : undefined,
        ownershipVerifiedAt: vehicle.isVerified ? '10/05/2026' : undefined,
        physicalVerifiedAt: vehicle.inspectionDetails ? '14/05/2026' : undefined
      },
      history,
      inspections,
      health
    };

    vehicle.carvelloDna = dna;
    return dna;
  }

  // Calculate the Dynamic Carvello Trust Score, fully data-driven
  public calculateTrustScore(vehicle: Vehicle): TrustScoreDetails {
    let scoreVal = 50;
    const factors: TrustScoreFactor[] = [
      {
        title: 'Initial Base Score',
        impact: 50,
        isPositive: true,
        description: 'Standard baseline allocation for listings entering the ecosystem'
      }
    ];

    const dna = this.ensureCarvelloDna(vehicle);

    // 2. Seller Verification Status
    const seller = this.defaultUsers.find(u => u.id === vehicle.ownerId);
    const sellerIsApproved = seller?.status === 'Approved' || vehicle.isVerified || vehicle.ownerId === 's1' || vehicle.ownerId === 's2' || vehicle.ownerId === 's3';
    if (sellerIsApproved) {
      scoreVal += 20;
      factors.push({
        title: 'Seller/Dealer Identity Verified',
        impact: 20,
        isPositive: true,
        description: 'Seller has submitted certified business registration / CAC forms'
      });
    } else {
      factors.push({
        title: 'Seller Identity Pending Auditing',
        impact: 0,
        isPositive: false,
        description: 'Owner has not finalized corporate verification profiles yet'
      });
    }

    // 3. Broker Sourcing / Premium Sincerity Index
    const isPremiumDealer = vehicle.dealer === 'AutoHub Prime' || vehicle.dealer === 'Royal Autos' || vehicle.dealer === 'Elite Cars Ltd' || vehicle.dealer === 'Signature Motors';
    if (isPremiumDealer) {
      scoreVal += 10;
      factors.push({
        title: 'Broker Track Audit',
        impact: 10,
        isPositive: true,
        description: 'Certified broker verification and stellar track history completed'
      });
    }

    // 4. Physical 150-Point Inspection State of Health Status
    if (vehicle.inspectionDetails) {
      const avgRating = (
        (vehicle.inspectionDetails.engineRating || 90) +
        (vehicle.inspectionDetails.brakesRating || 90) +
        (vehicle.inspectionDetails.transmissionRating || 90) +
        (vehicle.inspectionDetails.bodyRating || 90) +
        (vehicle.inspectionDetails.interiorRating || 90)
      ) / 5;

      const inspectionPointAllocation = Math.round(avgRating * 0.20); // max +20 points
      scoreVal += inspectionPointAllocation;
      
      factors.push({
        title: 'Independent 150-Point Diagnostics',
        impact: inspectionPointAllocation,
        isPositive: true,
        description: `Physical appraisal completed. State of Health average score index at ${Math.round(avgRating)}%`
      });
    } else {
      factors.push({
        title: 'Physical Appraisal Required',
        impact: 0,
        isPositive: false,
        description: 'Vehicle is currently scheduled for physical bay inspection'
      });
    }

    // 5. Document Verification (CAC/Custom entry papers)
    if (dna.verifications.documentVerified) {
      scoreVal += 10;
      factors.push({
        title: 'Document Credibility Check',
        impact: 10,
        isPositive: true,
        description: 'Original customs entry forms and luxury vehicle import duties validated'
      });
    } else {
      factors.push({
        title: 'Legal Documents Under Review',
        impact: 0,
        isPositive: false,
        description: 'Title documents and custom custom custom custom papers in current review queue'
      });
    }

    // 6. Ownership Verification
    if (dna.verifications.ownershipVerified) {
      scoreVal += 15;
      factors.push({
        title: 'Owner Possession Certificate',
        impact: 15,
        isPositive: true,
        description: 'Ownership verification checked against digital government registries'
      });
    } else {
      factors.push({
        title: 'Ownership Audit Active',
        impact: 0,
        isPositive: false,
        description: 'System comparing digital asset registration against local DMV logs'
      });
    }

    // 7. Previous Transaction History
    if (isPremiumDealer) {
      scoreVal += 10;
      factors.push({
        title: 'Dealer Core Track Record',
        impact: 10,
        isPositive: true,
        description: 'Dealer has completed multiple transaction cycles with zero dispute returns'
      });
    }

    // 8. Admin approval audit status
    const adminReviewedVal = vehicle.adminReviewed || vehicle.status === 'Approved';
    if (adminReviewedVal) {
      scoreVal += 5;
      factors.push({
        title: 'Admin Platform Seal',
        impact: 5,
        isPositive: true,
        description: 'Audited and cleared by official Carvello Senior Administrators'
      });
    }

    // 9. DEDUCTIONS for Reports
    const fraudReports = vehicle.fraudReportCount || 0;
    if (fraudReports > 0) {
      const deductionVal = fraudReports * 40;
      scoreVal -= deductionVal;
      factors.push({
        title: `${fraudReports} Fraud Alerts Active`,
        impact: -deductionVal,
        isPositive: false,
        description: 'Serious warnings: Fraud flags escalated to safety boards for immediate investigation'
      });
    }

    const userReports = vehicle.userReportCount || 0;
    if (userReports > 0) {
      const deductionVal = userReports * 10;
      scoreVal -= deductionVal;
      factors.push({
        title: `${userReports} Handshake Trust Flags`,
        impact: -deductionVal,
        isPositive: false,
        description: 'Minor non-compliance flags submitted by prospective client platform handshakes'
      });
    }

    scoreVal = Math.max(0, Math.min(100, scoreVal));

    return {
      score: scoreVal,
      factors
    };
  }

  // Increment report counters dynamically to test data-driven Trust Score updates in real-time
  public reportListing(id: string, type: 'fraud' | 'user') {
    this.listings.update(current => 
      current.map(item => {
        if (item.id === id) {
          const fraudCount = (item.fraudReportCount || 0) + (type === 'fraud' ? 1 : 0);
          const userCount = (item.userReportCount || 0) + (type === 'user' ? 1 : 0);
          const updated = {
            ...item,
            fraudReportCount: fraudCount,
            userReportCount: userCount
          };
          this.syncListingToSupabase(updated);
          return updated;
        }
        return item;
      })
    );
  }

  // Add or update KYC Request
  public addKYCRequest(req: KYCRequest) {
    this.kycRequests.update(current => {
      const exists = current.findIndex(c => c.id === req.id);
      let updated;
      if (exists !== -1) {
        updated = current.map(item => item.id === req.id ? req : item);
      } else {
        updated = [req, ...current];
      }
      this.saveItemToLocal('carvello_kyc', updated);
      return updated;
    });
  }

  // Approve KYC Onboarding Request (Admin)
  public approveKYC(id: string) {
    let bizName: string | undefined;
    let fallbackName: string | undefined;

    this.kycRequests.update(current => {
      const updated = current.map(req => {
        if (req.id === id) {
          bizName = req.businessName;
          fallbackName = req.fullName;
          return { ...req, status: 'Approved' as KYCRequest['status'] };
        }
        return req;
      });
      this.saveItemToLocal('carvello_kyc', updated);
      return updated;
    });

    // Dynamic link to seller profiles
    if (bizName || fallbackName) {
      this.users.update(current => 
        current.map(u => {
          if (u.role === 'Seller' && (
            (bizName && u.businessName?.toLowerCase() === bizName.toLowerCase()) || 
            (fallbackName && u.fullName.toLowerCase() === fallbackName.toLowerCase())
          )) {
            const updatedUser = { ...u, status: 'Approved' as UserAccount['status'] };
            this.syncUserProfileToSupabase(updatedUser);
            return updatedUser;
          }
          return u;
        })
      );
    }
  }

  // Decline KYC Onboarding Request
  public declineKYC(id: string) {
    let bizName: string | undefined;
    let fallbackName: string | undefined;

    this.kycRequests.update(current => {
      const updated = current.map(req => {
        if (req.id === id) {
          bizName = req.businessName;
          fallbackName = req.fullName;
          return { ...req, status: 'Rejected' as KYCRequest['status'] };
        }
        return req;
      });
      this.saveItemToLocal('carvello_kyc', updated);
      return updated;
    });

    if (bizName || fallbackName) {
      this.users.update(current => 
        current.map(u => {
          if (u.role === 'Seller' && (
            (bizName && u.businessName?.toLowerCase() === bizName.toLowerCase()) || 
            (fallbackName && u.fullName.toLowerCase() === fallbackName.toLowerCase())
          )) {
            const updatedUser = { ...u, status: 'Rejected' as UserAccount['status'] };
            this.syncUserProfileToSupabase(updatedUser);
            return updatedUser;
          }
          return u;
        })
      );
    }
  }

  // Purchase vehicle / Start Escrow Transactions
  public purchaseVehicle(vehicle: Vehicle) {
    const nextTxId = 'tx-' + Math.floor(1000 + Math.random() * 9000);
    const newTx: EscrowTransaction = {
      id: nextTxId,
      vehicleId: vehicle.id,
      vehicleName: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      price: vehicle.price,
      buyerEmail: 'jordanwill366@gmail.com',
      sellerName: vehicle.dealer,
      status: 'Funds Held',
      payoutReleased: false,
      createdAt: new Date().toLocaleString(),
      timeline: [
        { title: 'Buyer Secure Escrow Payment', desc: `₦${vehicle.price} credited to Carvello escrow pool`, time: 'Just now', active: true },
        { title: 'Payment Confirmed by Admin', desc: 'Secure payment protocol fully backed, logistics initiated', time: 'Just now', active: true },
        { title: 'Delivery Dispatch', desc: 'Dealer shipping vehicle via transit partner', time: 'Pending dealer dispatch', active: false },
        { title: 'Buyer Delivery Signing', desc: 'Dissatisfaction return guarantee activated on delivery receipt', time: 'Pending delivery', active: false }
      ]
    };

    this.transactions.update(current => {
      const updated = [newTx, ...current];
      this.saveItemToLocal('carvello_tx', updated);
      return updated;
    });

    // Record Sold Event in Carvello DNA
    this.addDnaEvent(vehicle.id, {
      event: 'Sold',
      date: new Date().toLocaleDateString(),
      title: 'Vehicle Purchased & Escrowed',
      description: `Buyer locked ₦${vehicle.price} into certified escrow security vault. Vehicle status frozen under transaction ${nextTxId}.`,
      badge: 'Escrow'
    });

    return nextTxId;
  }

  // Transition transaction status (For simulated logistics/Escrow flows)
  public advanceTransaction(txId: string, nextStatus: 'In Transit' | 'Delivered' | 'Completed' | 'Disputed' | 'Refunded') {
    this.transactions.update(current => {
      const updated = current.map(tx => {
        if (tx.id === txId) {
          const updatedTimeline = [...tx.timeline];
          if (nextStatus === 'In Transit') {
            updatedTimeline[2] = { ...updatedTimeline[2], active: true, time: 'Dispatched recently' };
          } else if (nextStatus === 'Delivered') {
            updatedTimeline[3] = { ...updatedTimeline[3], active: true, time: 'Delivered just now' };
          } else if (nextStatus === 'Completed') {
            updatedTimeline.push({ title: 'Payout Released', desc: '₦' + tx.price + ' released securely to dealer', time: 'Completed', active: true });
          } else if (nextStatus === 'Disputed') {
            updatedTimeline.push({ title: 'Dispute Flagged', desc: 'Logistics conflict escalated to admin mediation', time: 'Just now', active: true });
          }

          return { 
            ...tx, 
            status: nextStatus, 
            timeline: updatedTimeline,
            payoutReleased: nextStatus === 'Completed' ? true : tx.payoutReleased
          };
        }
        return tx;
      });
      this.saveItemToLocal('carvello_tx', updated);

      // Programmatic hooks into the matching Vehicle DNA!
      const targetTx = updated.find(t => t.id === txId);
      if (targetTx) {
        const vId = targetTx.vehicleId;
        if (nextStatus === 'In Transit') {
          this.addDnaEvent(vId, {
            event: 'Delivered',
            date: new Date().toLocaleDateString(),
            title: 'Dispatched via Flatbed Transit',
            description: `Secured on verified logistics car carrier and cleared for highway transit to recipient.`,
            badge: 'Transit'
          });
        } else if (nextStatus === 'Delivered') {
          this.addDnaEvent(vId, {
            event: 'Delivered',
            date: new Date().toLocaleDateString(),
            title: 'Received and Physically Accepted',
            description: `Handed over physically at delivery coordinates. Handshake validation signed on-site.`,
            badge: 'Delivered'
          });
        } else if (nextStatus === 'Completed') {
          this.addDnaEvent(vId, {
            event: 'Ownership Change',
            date: new Date().toLocaleDateString(),
            title: 'Ownership Deed Finalized',
            description: `Permanent title deed and electronic ownership certificate transferred to jordanwill366@gmail.com.`,
            badge: 'Ownership'
          });
        }
      }

      return updated;
    });
  }

  // Interactive bypassed contact validation & chat posting
  public postMessage(vehicleId: string, sender: 'Buyer' | 'Seller' | 'System', text: string) {
    const phoneRegex = /(?:(?:\+?234|0)[789][01]\d{8})|(?:\d{4,11})/g;
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const whatsappKeywords = /(whatsapp|wa\.me|telegram|call me|dm me|phone number|direct pay|pay to my bank|account number)/i;

    const matchedPhone = text.match(phoneRegex);
    const matchedEmail = text.match(emailRegex);
    const matchedKeyword = text.match(whatsappKeywords);

    const isBypassed = !!(matchedPhone && matchedPhone.join('').length >= 7) || !!matchedEmail || !!matchedKeyword;
    
    // Create new message status
    const msgId = 'm' + (this.chats().length + 1);
    const message: ChatMessage = {
      id: msgId,
      vehicleId,
      sender,
      text: isBypassed ? '[CONTENT BLOCKED BY THE COMPLIANCE LAYER] Contact exchange & bypass attempts are strictly forbidden.' : text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      flagged: isBypassed,
      flagType: isBypassed ? 'Contact Details Bypass Attempt' : undefined
    };

    this.chats.update(current => {
      const updated = [...current, message];
      this.saveItemToLocal('carvello_chats', updated);
      return updated;
    });

    // If flagged, dispatch record to Admin live monitor feed
    if (isBypassed) {
      const v = this.listings().find(curr => curr.id === vehicleId);
      const vehicleName = v ? `${v.year} ${v.make} ${v.model}` : 'Automotive Listing';
      const logId = 'log-' + (this.bypassLogs().length + 1);
      
      const auditLog: BypassAuditLog = {
        id: logId,
        vehicleId,
        vehicleName,
        sender: sender === 'Buyer' ? 'Buyer (jordanwill366)' : 'Dealer',
        flaggedContent: text,
        severity: 'High',
        actionTaken: 'Bypass prevention triggered automatically. Sent a warning warning alert.',
        timestamp: new Date().toLocaleString()
      };

      this.bypassLogs.update(currLog => {
        const updatedLogs = [auditLog, ...currLog];
        this.saveItemToLocal('carvello_bypass_logs', updatedLogs);
        return updatedLogs;
      });
    }
  }

  // --- FAVORITES TRACKING ---
  public toggleFavorite(id: string) {
    this.savedVehicleIds.update(ids => {
      const updated = ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id];
      this.saveItemToLocal('carvello_favs', updated);
      return updated;
    });
  }

  public isFavorited(id: string) {
    return computed(() => this.savedVehicleIds().includes(id));
  }

  // --- LOGISTICS & PERSONNEL CONTROLS ---

  // Assign inspector to vehicle
  public assignInspector(vehicleId: string, inspectorId: string, inspectorName: string) {
    this.listings.update(current => 
      current.map(item => {
        if (item.id === vehicleId) {
          const updated = {
            ...item,
            assignedInspectorId: inspectorId,
            assignedInspectorName: inspectorName,
            status: 'Pending Inspection' as Vehicle['status']
          };
          this.syncListingToSupabase(updated);
          return updated;
        }
        return item;
      })
    );
  }

  // Admin release dispatch
  public approveDispatch(txId: string, deliveryPartnerId: string, deliveryPartnerName: string) {
    this.transactions.update(current => {
      const updated = current.map(tx => {
        if (tx.id === txId) {
          const updatedTimeline = [...tx.timeline];
          updatedTimeline[2] = { 
            title: 'Logistics Dispatch Cleared', 
            desc: `Fulfillment release authorized via ${deliveryPartnerName}`, 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
            active: true 
          };
          return {
            ...tx,
            dispatchApproved: true,
            status: 'In Transit' as EscrowTransaction['status'],
            assignedDeliveryPartnerId: deliveryPartnerId,
            assignedDeliveryPartnerName: deliveryPartnerName,
            trackingLogs: [
              { status: 'Cargo Loaded & Manifest Checked', timestamp: new Date().toLocaleString() }
            ],
            timeline: updatedTimeline
          };
        }
        return tx;
      });
      this.saveItemToLocal('carvello_tx', updated);
      return updated;
    });
  }

  // Delivery crew adding progress updates
  public addTrackingLog(txId: string, statusText: string) {
    this.transactions.update(current => {
      const updated = current.map(tx => {
        if (tx.id === txId) {
          const logs = tx.trackingLogs ? [...tx.trackingLogs] : [];
          return {
            ...tx,
            trackingLogs: [{ status: statusText, timestamp: new Date().toLocaleString() }, ...logs]
          };
        }
        return tx;
      });
      this.saveItemToLocal('carvello_tx', updated);
      return updated;
    });
  }

  // Delivery crew handover submit
  public submitHandover(txId: string, notes: string, imageUrl?: string) {
    this.transactions.update(current => {
      const updated = current.map(tx => {
        if (tx.id === txId) {
          const updatedTimeline = [...tx.timeline];
          updatedTimeline[3] = { 
            title: 'Buyer Handover Authenticated', 
            desc: notes || 'Delivery crew authenticated receiver ID & keys released', 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
            active: true 
          };
          const logs = tx.trackingLogs ? [...tx.trackingLogs] : [];
          return {
            ...tx,
            status: 'Delivered' as EscrowTransaction['status'],
            proofNotes: notes,
            handoverProofImage: imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1000&auto=format&fit=crop',
            trackingLogs: [{ status: 'Fulfillment Completed at Location. Handover certified.', timestamp: new Date().toLocaleString() }, ...logs],
            timeline: updatedTimeline
          };
        }
        return tx;
      });
      this.saveItemToLocal('carvello_tx', updated);
      return updated;
    });
  }

  // Sourcing broker requests
  public submitSourcingRequest(req: Omit<SourcingRequest, 'id' | 'status' | 'createdAt'>) {
    const id = 'req-' + (this.sourcingRequestsList().length + 1);
    const newRequest: SourcingRequest = {
      ...req,
      id,
      status: 'Open',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    this.sourcingRequestsList.update(curr => {
      const updated = [newRequest, ...curr];
      this.saveItemToLocal('carvello_sourcing_reqs', updated);
      return updated;
    });

    // Automatically generate Best, Closest, Premium matches for the Concierge
    const budgetClean = parseFloat(req.budgetNaira.replace(/,/g, '')) || 18000000;
    const make = req.vehicleMake || 'Toyota';
    const model = req.vehicleModel || 'Camry';
    const yr = req.yearRange || '2022';
    
    // Auto-create matching proposals
    const bestPrice = Math.round(budgetClean * 0.95);
    const closestPrice = Math.round(budgetClean * 0.88);
    const premiumPrice = Math.round(budgetClean * 1.12);

    const matchImages: Record<string, string[]> = {
      'Toyota': [
        'https://images.unsplash.com/photo-1621007947382-cc34aa8642e9?q=80&w=600&auto=format&fit=crop', // Black Camry
        'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=600&auto=format&fit=crop', // Accord/Camry Alternative
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop'
      ],
      'Lexus': [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop', // Silver RX
        'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=600&auto=format&fit=crop', // Luxury sedan
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop'
      ],
      'Mercedes-Benz': [
        'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=600&auto=format&fit=crop', // GLE Black
        'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=600&auto=format&fit=crop', // Executive E-class
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop'
      ],
      'Range Rover': [
        'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=600&auto=format&fit=crop', // Autobiography
        'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=600&auto=format&fit=crop'
      ]
    };

    const getImages = matchImages[make] || matchImages['Toyota'];

    const bestProp: SourcingProposal = {
      id: `prop-auto-best-${Date.now()}`,
      requestId: id,
      brokerId: 'brk-auto-1',
      brokerName: 'Royal Autos (CAC Verified Platinum Dealer)',
      vehicleDetails: `${yr} ${make} ${model} Executive Trim (Immaculate Grade-A)`,
      image: getImages[0],
      priceNaira: bestPrice.toLocaleString(),
      proposedCommission: Math.round(bestPrice * 0.02).toLocaleString(),
      status: 'Pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      matchType: 'Best',
      advisorInsight: `This represents the absolute pinnacle of value. At ₦${bestPrice.toLocaleString()}, it remains safely within your limits. Verified single-owner profile with absolute clear diagnostics on all suspension bushings and engine cylinder compression ratios.`,
      trustScore: '98'
    };

    const closestProp: SourcingProposal = {
      id: `prop-auto-closest-${Date.now()}`,
      requestId: id,
      brokerId: 'brk-auto-2',
      brokerName: 'Elite Cars Ltd (Verified Sourcing Desk)',
      vehicleDetails: `${parseInt(yr) - 1 || 2021} ${make} ${model} Custom Edition (Upgraded Tech Package)`,
      image: getImages[1],
      priceNaira: closestPrice.toLocaleString(),
      proposedCommission: Math.round(closestPrice * 0.02).toLocaleString(),
      status: 'Pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      matchType: 'Closest',
      advisorInsight: `A highly intelligent choice which yields a substantial capital saving of ₦${(budgetClean - closestPrice).toLocaleString()}. Model year is ${parseInt(yr) - 1 || 2021} but incorporates a digital HUD upgrade normally unavailable on standard trims.`,
      trustScore: '94'
    };

    const premiumProp: SourcingProposal = {
      id: `prop-auto-premium-${Date.now()}`,
      requestId: id,
      brokerId: 'brk-auto-3',
      brokerName: 'Signature Motors (Autonomous Luxury Broker)',
      vehicleDetails: `${parseInt(yr) + 1 || 2023} ${make} ${model} Absolute Luxury Bespoke (Immaculate Showroom Trim)`,
      image: getImages[2],
      priceNaira: premiumPrice.toLocaleString(),
      proposedCommission: Math.round(premiumPrice * 0.03).toLocaleString(),
      status: 'Pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      matchType: 'Premium',
      advisorInsight: `For the discerning collector who demands perfection. It is slightly above the budget, but grants you a brand new year model, premium dual acoustic insulation glass, and full factory engine warranties.`,
      trustScore: '100'
    };

    this.sourcingProposalsList.update(curr => {
      const updated = [bestProp, closestProp, premiumProp, ...curr];
      this.saveItemToLocal('carvello_sourcing_props', updated);
      return updated;
    });

    return id;
  }

  public submitSourcingProposal(prop: Omit<SourcingProposal, 'id' | 'status' | 'createdAt'>) {
    const id = 'prop-' + (this.sourcingProposalsList().length + 1);
    const newProp: SourcingProposal = {
      ...prop,
      id,
      status: 'Pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    this.sourcingProposalsList.update(curr => {
      const updated = [newProp, ...curr];
      this.saveItemToLocal('carvello_sourcing_props', updated);
      return updated;
    });
    return id;
  }

  public updateSourcingProposalStatus(propId: string, status: 'Accepted' | 'Declined') {
    this.sourcingProposalsList.update(curr => {
      const updated = curr.map(p => {
        if (p.id === propId) {
          if (status === 'Accepted') {
            const commission = parseFloat(p.proposedCommission.replace(/,/g, ''));
            if (!isNaN(commission)) {
              this.brokerCommissionsTotal.update(total => {
                const updatedComm = total + commission;
                this.saveItemToLocal('carvello_commissions', updatedComm);
                return updatedComm;
              });
            }
            this.sourcingRequestsList.update(reqs => {
              const updatedReqs = reqs.map(r => r.id === p.requestId ? { ...r, status: 'Fulfilled' as SourcingRequest['status'] } : r);
              this.saveItemToLocal('carvello_sourcing_reqs', updatedReqs);
              return updatedReqs;
            });
          }
          return { ...p, status };
        }
        return p;
      });
      this.saveItemToLocal('carvello_sourcing_props', updated);
      return updated;
    });
  }

  public submitStructuredOffer(offer: Omit<StructuredOffer, 'id' | 'status' | 'updatedAt'>) {
    const id = 'off-' + (this.structuredOffersList().length + 1);
    const newOffer: StructuredOffer = {
      ...offer,
      id,
      status: 'Pending',
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    this.structuredOffersList.update(curr => {
      const updated = [newOffer, ...curr];
      this.saveItemToLocal('carvello_structured_offers', updated);
      return updated;
    });
    
    // Post an automated notification to chat representing the offer
    this.postMessage(offer.vehicleId, 'Buyer', `[OFFER SUBMITTED] Proposed counteroffer of ₦${offer.buyerOffer} (original asking ₦${offer.sellerPrice}).`);
    return id;
  }

  public submitSellerCounterOffer(offerId: string, counterPrice: string) {
    this.structuredOffersList.update(curr => {
      const updated = curr.map(o => {
        if (o.id === offerId) {
          this.postMessage(o.vehicleId, 'Seller', `[COUNTER OFFER] Seller counterproposes ₦${counterPrice}.`);
          return { ...o, status: 'Countered' as StructuredOffer['status'], counterOffer: counterPrice, updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) };
        }
        return o;
      });
      this.saveItemToLocal('carvello_structured_offers', updated);
      return updated;
    });
  }

  public respondToOffer(offerId: string, response: 'Accepted' | 'Declined') {
    this.structuredOffersList.update(curr => {
      const updated = curr.map(o => {
        if (o.id === offerId) {
          const finalPrice = response === 'Accepted' && o.counterOffer ? o.counterOffer : o.buyerOffer;
          this.postMessage(o.vehicleId, 'System', `[OFFER RESOLUTION] Structured Offer of ₦${finalPrice} was ${response.toUpperCase()} by the counterparty.`);
          return { ...o, status: response, updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16) };
        }
        return o;
      });
      this.saveItemToLocal('carvello_structured_offers', updated);
      return updated;
    });
  }

  public registerBroker(broker: Omit<UserAccount, 'id' | 'role' | 'status'>) {
    const id = 'broker-' + (this.users().length + 1);
    const newBroker: UserAccount = {
      ...broker,
      id,
      role: 'Broker',
      status: 'Pending Review',
      unlockedRoles: ['Buyer', 'Broker']
    };
    this.users.update(current => [...current, newBroker]);
    this.saveItemToLocal('carvello_session', newBroker);

    const extendedKey = `carvello_broker_${newBroker.email.toLowerCase()}`;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(extendedKey, JSON.stringify(newBroker));
    }

    // Construct corresponding KYC Onboarding record
    const newKyc: KYCRequest = {
      id: 'kyc-' + id,
      fullName: broker.fullName,
      type: 'Individual',
      status: 'Pending',
      address: broker.address || 'Nigeria Sourcing Location',
      phone: broker.phone,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      documents: [
        { name: 'NIN_Verification.pdf', type: 'National Identity Verification (NIN Slip)' },
        { name: 'Broker_Reference.pdf', type: 'Character Sourcing Reference Confirmation' }
      ]
    };
    this.addKYCRequest(newKyc);

    this.syncUserProfileToSupabase(newBroker);
    return newBroker;
  }
}
