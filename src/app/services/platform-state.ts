import { Injectable, signal, computed } from '@angular/core';

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'Buyer' | 'Seller' | 'Inspector' | 'Delivery' | 'Admin';
  businessName?: string;
  cacNumber?: string;
  taxId?: string;
  address?: string;
  bankName?: string;
  bankAccountNumber?: string;
  selfieUrl?: string;
  status?: 'Pending Review' | 'Approved' | 'Rejected'; // for sellers
  yearsInOperation?: number;
  inventoryEstimate?: string;
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

@Injectable({
  providedIn: 'root'
})
export class PlatformStateService {
  // --- STATE SIGNALS ---
  
  // Listings (combined initial and dynamically added ones)
  private listings = signal<Vehicle[]>([
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
    },
    {
      id: 'v6',
      image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1000&auto=format&fit=crop",
      year: "2023",
      make: "Tesla",
      model: "Model S Plaid Tri-Motor",
      price: "135,000,000",
      mileage: "3,400 mi",
      location: "Admiralty, Lagos",
      dealer: "Future Gears",
      isVerified: true,
      hasEscrow: true,
      score: "100",
      fuel: "Electric",
      transmission: "Auto",
      financeAvailable: true,
      status: 'Approved',
      ownerId: 's3',
      inspectionDetails: {
        vinVerified: true,
        engineRating: 100, // Battery pack health
        brakesRating: 98,
        transmissionRating: 100,
        bodyRating: 99,
        interiorRating: 100,
        inspectorNotes: "Immaculate Plaid. Battery cycles sit at 99.4% health state. Active pilot hardware is 100% functional for Lekki highways."
      }
    },
    {
      id: 'v7',
      image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1000&auto=format&fit=crop",
      year: "2018",
      make: "Toyota",
      model: "Camry XLE V6 Duo",
      price: "14,500,000",
      mileage: "45,000 mi",
      location: "Ikeja, Lagos",
      dealer: "Ikeja Swift Motors",
      isVerified: true,
      hasEscrow: true,
      score: "93",
      fuel: "Petrol",
      transmission: "Auto",
      financeAvailable: true,
      status: 'Approved',
      ownerId: 's2',
      inspectionDetails: {
        vinVerified: true,
        engineRating: 92,
        brakesRating: 94,
        transmissionRating: 94,
        bodyRating: 91,
        interiorRating: 93,
        inspectorNotes: "Solid commuter choice. Perfect Lagos road compatibility. Suspension rubbers replaced original parts during physical inspection."
      }
    },
    {
      id: 'v8',
      image: "https://images.unsplash.com/photo-1611016186353-9af58c69a533?q=80&w=1000&auto=format&fit=crop",
      year: "2021",
      make: "Porsche",
      model: "911 Carrera S (992)",
      price: "185,000,000",
      mileage: "6,700 mi",
      location: "Ikoyi, Lagos",
      dealer: "Continental Luxury",
      isVerified: true,
      hasEscrow: true,
      score: "99",
      fuel: "Petrol",
      transmission: "Auto",
      financeAvailable: false,
      status: 'Approved',
      ownerId: 's1',
      inspectionDetails: {
        vinVerified: true,
        engineRating: 99,
        brakesRating: 100,
        transmissionRating: 99,
        bodyRating: 99,
        interiorRating: 99,
        inspectorNotes: "Pristine rear-engined masterpiece. Ceramic brakes are basically active at 98% life. Custom Porsche exhaust is entirely stock."
      }
    },
    {
      id: 'v9',
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop",
      year: "2020",
      make: "Hyundai",
      model: "Palisade Limited AWD",
      price: "38,000,000",
      mileage: "34,200 mi",
      location: "Wuse II, Abuja",
      dealer: "Capital Motors",
      isVerified: true,
      hasEscrow: true,
      score: "96",
      fuel: "Petrol",
      transmission: "Auto",
      financeAvailable: true,
      status: 'Approved',
      ownerId: 's2',
      inspectionDetails: {
        vinVerified: true,
        engineRating: 96,
        brakesRating: 95,
        transmissionRating: 97,
        bodyRating: 95,
        interiorRating: 97,
        inspectorNotes: "Massive 3-row family SUV in pristine state. Active blind-spot monitors and panoramic cameras are 100% operational."
      }
    },
    {
      id: 'v10',
      image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1000&auto=format&fit=crop",
      year: "2022",
      make: "Audi",
      model: "e-tron GT Quattro",
      price: "145,000,000",
      mileage: "1,900 mi",
      location: "Banana Island",
      dealer: "Signature Motors",
      isVerified: true,
      hasEscrow: true,
      score: "98",
      fuel: "Electric",
      transmission: "Auto",
      financeAvailable: false,
      status: 'Approved',
      ownerId: 's3',
      inspectionDetails: {
        vinVerified: true,
        engineRating: 98,
        brakesRating: 99,
        transmissionRating: 98,
        bodyRating: 97,
        interiorRating: 99,
        inspectorNotes: "Stunning carbon architecture. Multi-source charging verified. Audi laser light alignment is fully calibrated."
      }
    }
  ]);

  // Corporate and Buyer Identities Database
  private users = signal<UserAccount[]>([
    {
      id: 'buyer-default',
      fullName: 'Jordan Williams',
      email: 'jordanwill366@gmail.com',
      phone: '+234 812 445 6677',
      role: 'Buyer'
    },
    {
      id: 'seller-default',
      fullName: 'Chidi Okafor',
      email: 'seller@driveway.ng',
      phone: '+234 803 777 8899',
      role: 'Seller',
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
      email: 'frank@driveway.ng',
      phone: '+234 810 555 4422',
      role: 'Inspector'
    },
    {
      id: 'LOG-701-DISPATCH',
      fullName: 'James Nwachukwu (Delivery)',
      email: 'james@driveway.ng',
      phone: '+234 805 321 0987',
      role: 'Delivery'
    },
    {
      id: 'COMMAND-99',
      fullName: 'Chief Commander Node',
      email: 'command@driveway247.ng',
      phone: '+234 700 TRUST SECURE',
      role: 'Admin'
    }
  ]);

  // Current logged in user profile (defaults to Jordan Williams for the live preview showroom)
  private currentSession = signal<UserAccount | null>({
    id: 'buyer-default',
    fullName: 'Jordan Williams',
    email: 'jordanwill366@gmail.com',
    phone: '+234 812 445 6677',
    role: 'Buyer'
  });

  // Onboarding / KYC Requests
  private kycRequests = signal<KYCRequest[]>([
    {
      id: 'kyc-1',
      businessName: 'Matrix Auto Venture',
      fullName: 'Afolabi Gbolahan',
      type: 'Dealer',
      status: 'Pending',
      cacNumber: 'RC-9988442',
      taxId: 'TIN-48892120-X',
      address: '22 Admiralty Way, Lekki, Lagos',
      phone: '+234 812 345 6789',
      submittedAt: '2026-05-28 14:22',
      documents: [
        { name: 'CAC_incorporation.pdf', type: 'Certificate of Incorporation' },
        { name: 'Dealership_premises_lease.pdf', type: 'Lease Agreement' },
        { name: 'Tax_Clearance_2025.pdf', type: 'Tax Identification' }
      ]
    },
    {
      id: 'kyc-2',
      fullName: 'Emeka Obi',
      type: 'Individual',
      status: 'Pending',
      address: 'Plot 42, Gwarinpa, Abuja',
      phone: '+234 905 555 1234',
      submittedAt: '2026-05-28 11:05',
      documents: [
        { name: 'NIN_slip_verified.pdf', type: 'National Identification Slip' },
        { name: 'Utility_Bill_Aco.pdf', type: 'Proof of Address' }
      ]
    }
  ]);

  // Escrow Transactions
  private transactions = signal<EscrowTransaction[]>([
    {
      id: 'tx-1042',
      vehicleId: 'v1',
      vehicleName: '2021 Lexus RX 350 F-Sport AWD',
      price: '42,500,000',
      buyerEmail: 'jordanwill366@gmail.com',
      sellerName: 'AutoHub Prime',
      status: 'Funds Held',
      payoutReleased: false,
      createdAt: '2026-05-28 09:30',
      timeline: [
        { title: 'Buyer Secure Escrow Payment', desc: '₦42.5M successfully credited to Driveway247 escrow pool', time: 'May 28, 09:30 AM', active: true },
        { title: 'Payment Confirmed by Admin', desc: 'Compliance parameters verified, funds held securely', time: 'May 28, 10:15 AM', active: true },
        { title: 'Delivery Dispatch', desc: 'Dealer shipping vehicle via transit partner', time: 'Awaiting dispatch', active: false },
        { title: 'Buyer Delivery Signing', desc: '14-Day dissatisfaction returns protection active', time: 'Pending delivery', active: false }
      ]
    }
  ]);

  // Chat Feed (and flags)
  private chats = signal<ChatMessage[]>([
    { id: 'm1', vehicleId: 'v1', sender: 'System', text: 'Secure Escrow chat initialized. Please do NOT exchange phone numbers, bank details, or WhatsApp links. System will block unauthorized external transactions.', timestamp: 'May 28, 09:31 AM' },
    { id: 'm2', vehicleId: 'v1', sender: 'Buyer', text: 'Hello, is the minor front lip repainting noticeable under daylight? I want to make sure it matches perfectly.', timestamp: 'May 28, 09:35 AM' },
    { id: 'm3', vehicleId: 'v1', sender: 'Seller', text: 'Hi! Not at all. It was sprayed inside our climatic oven using OEM Lexus liquid paint. You have my absolute word.', timestamp: 'May 28, 09:37 AM' }
  ]);

  private bypassLogs = signal<BypassAuditLog[]>([
    {
      id: 'log-1',
      vehicleId: 'v3',
      vehicleName: '2019 Mercedes-Benz GLE 450',
      sender: 'Dealer: Elite Cars Ltd',
      flaggedContent: 'Let us coordinate on WhatsApp: 08129995544, it is safer than typing here',
      severity: 'High',
      actionTaken: 'Message automuted, alert raised to Admin Control Panel, seller issued warning strike.',
      timestamp: '2026-05-28 15:40'
    }
  ]);

  // --- COMPUTED / SELECTORS ---
  public getSession = computed(() => this.currentSession());
  public getUsers = computed(() => this.users());
  public getListings = computed(() => this.listings());
  public approvedListings = computed(() => this.listings().filter(l => l.status === 'Approved'));
  public getKYCRequests = computed(() => this.kycRequests());
  public getTransactions = computed(() => this.transactions());
  public getChatForVehicle = (vehicleId: string) => computed(() => this.chats().filter(c => c.vehicleId === vehicleId));
  public getBypassLogs = computed(() => this.bypassLogs());

  // --- STATE MUTATIONS ---
  public logout() {
    this.currentSession.set(null);
  }

  public setSession(user: UserAccount | null) {
    this.currentSession.set(user);
  }

  public loginAs(emailOrId: string, role: UserAccount['role']): UserAccount | null {
    // Search by email or staff/field ID directly
    const matchedUser = this.users().find(u => 
      (u.email.toLowerCase() === emailOrId.toLowerCase() || u.id.toLowerCase() === emailOrId.toLowerCase()) && 
      u.role === role
    );
    if (matchedUser) {
      this.currentSession.set(matchedUser);
      return matchedUser;
    }
    
    // Auto-onboard new Buyers instantly!
    if (role === 'Buyer') {
      const id = 'buyer-' + (this.users().length + 1);
      const newUser: UserAccount = {
        id,
        fullName: emailOrId.includes('@') ? emailOrId.split('@')[0].toUpperCase() : 'USER_' + emailOrId,
        email: emailOrId.includes('@') ? emailOrId : emailOrId + '@driveway247.ng',
        phone: '+234 812 000 0000',
        role: 'Buyer'
      };
      this.users.update(current => [...current, newUser]);
      this.currentSession.set(newUser);
      return newUser;
    }

    return null;
  }

  public registerSeller(seller: Omit<UserAccount, 'id' | 'role' | 'status'>) {
    const id = 'seller-' + (this.users().length + 1);
    const newSeller: UserAccount = {
      ...seller,
      id,
      role: 'Seller',
      status: 'Pending Review'
    };

    this.users.update(current => [...current, newSeller]);

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

    return newSeller;
  }

  // Add Listing (Starts in Draft or Pending Inspection)
  public addListing(vehicle: Omit<Vehicle, 'id' | 'status' | 'ownerId' | 'isVerified' | 'score' | 'hasEscrow'>) {
    const id = 'v' + (this.listings().length + 1);
    const newVehicle: Vehicle = {
      ...vehicle,
      id,
      status: 'Pending Inspection',
      ownerId: 's_current',
      isVerified: false,
      score: 'Awaiting',
      hasEscrow: true
    };
    
    this.listings.update(current => [newVehicle, ...current]);
    return id;
  }

  // Update specific inspection details (Inspector Platform)
  public updateInspection(id: string, notes: string, scores: { engine: number; body: number; interior: number; brakes: number; transmission: number }) {
    this.listings.update(current => 
      current.map(item => {
        if (item.id === id) {
          const avgScore = Math.round((scores.engine + scores.body + scores.interior + scores.brakes + scores.transmission) / 5);
          return {
            ...item,
            score: avgScore.toString(),
            status: 'Inspected',
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
          return { ...item, status: 'Approved', isVerified: true };
        }
        return item;
      })
    );
  }

  // Add or update KYC Request
  public addKYCRequest(req: KYCRequest) {
    this.kycRequests.update(current => {
      const exists = current.findIndex(c => c.id === req.id);
      if (exists !== -1) {
        return current.map(item => item.id === req.id ? req : item);
      }
      return [req, ...current];
    });
  }

  // Approve KYC Onboarding Request (Admin)
  public approveKYC(id: string) {
    let bizName: string | undefined;
    let fallbackName: string | undefined;

    this.kycRequests.update(current => 
      current.map(req => {
        if (req.id === id) {
          bizName = req.businessName;
          fallbackName = req.fullName;
          return { ...req, status: 'Approved' };
        }
        return req;
      })
    );

    // Dynamic link to seller profiles
    if (bizName || fallbackName) {
      this.users.update(current => 
        current.map(u => {
          if (u.role === 'Seller' && (
            (bizName && u.businessName?.toLowerCase() === bizName.toLowerCase()) || 
            (fallbackName && u.fullName.toLowerCase() === fallbackName.toLowerCase())
          )) {
            return { ...u, status: 'Approved' };
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

    this.kycRequests.update(current => 
      current.map(req => {
        if (req.id === id) {
          bizName = req.businessName;
          fallbackName = req.fullName;
          return { ...req, status: 'Rejected' };
        }
        return req;
      })
    );

    if (bizName || fallbackName) {
      this.users.update(current => 
        current.map(u => {
          if (u.role === 'Seller' && (
            (bizName && u.businessName?.toLowerCase() === bizName.toLowerCase()) || 
            (fallbackName && u.fullName.toLowerCase() === fallbackName.toLowerCase())
          )) {
            return { ...u, status: 'Rejected' };
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
        { title: 'Buyer Secure Escrow Payment', desc: `₦${vehicle.price} credited to Driveway247 escrow pool`, time: 'Just now', active: true },
        { title: 'Payment Confirmed by Admin', desc: 'Secure payment protocol fully backed, logistics initiated', time: 'Just now', active: true },
        { title: 'Delivery Dispatch', desc: 'Dealer shipping vehicle via transit partner', time: 'Pending dealer dispatch', active: false },
        { title: 'Buyer Delivery Signing', desc: 'Dissatisfaction return guarantee activated on delivery receipt', time: 'Pending delivery', active: false }
      ]
    };

    this.transactions.update(current => [newTx, ...current]);
    return nextTxId;
  }

  // Transition transaction status (For simulated logistics/Escrow flows)
  public advanceTransaction(txId: string, nextStatus: 'In Transit' | 'Delivered' | 'Completed' | 'Disputed' | 'Refunded') {
    this.transactions.update(current => 
      current.map(tx => {
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
      })
    );
  }

  // Interactive bypassed contact validation & chat posting
  public postMessage(vehicleId: string, sender: 'Buyer' | 'Seller', text: string) {
    // Advanced anti-bypass detection matching:
    // Phone numbers (e.g. 080..., 090..., +234..., 070...)
    // WhatsApp references, telegram @handles, email addresses, "direct pay", "bypass details"
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

    this.chats.update(current => [...current, message]);

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

      this.bypassLogs.update(currLog => [auditLog, ...currLog]);
    }
  }

  // --- FAVORITES TRACKING ---
  public savedVehicleIds = signal<string[]>(['v1', 'v4']);

  public toggleFavorite(id: string) {
    this.savedVehicleIds.update(ids => 
      ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]
    );
  }

  public isFavorited(id: string) {
    return computed(() => this.savedVehicleIds().includes(id));
  }

  // --- NEW ASSIGNMENTS / LOGISTICS STRATEGY FLOWS ---

  // Assign inspector to vehicle
  public assignInspector(vehicleId: string, inspectorId: string, inspectorName: string) {
    this.listings.update(current => 
      current.map(item => {
        if (item.id === vehicleId) {
          return {
            ...item,
            assignedInspectorId: inspectorId,
            assignedInspectorName: inspectorName,
            status: 'Pending Inspection' // keep pending but with assigned personnel
          };
        }
        return item;
      })
    );
  }

  // Admin release dispatch
  public approveDispatch(txId: string, deliveryPartnerId: string, deliveryPartnerName: string) {
    this.transactions.update(current => 
      current.map(tx => {
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
            status: 'In Transit',
            assignedDeliveryPartnerId: deliveryPartnerId,
            assignedDeliveryPartnerName: deliveryPartnerName,
            trackingLogs: [
              { status: 'Cargo Loaded & Manifest Checked', timestamp: new Date().toLocaleString() }
            ],
            timeline: updatedTimeline
          };
        }
        return tx;
      })
    );
  }

  // Delivery crew adding progress updates
  public addTrackingLog(txId: string, statusText: string) {
    this.transactions.update(current => 
      current.map(tx => {
        if (tx.id === txId) {
          const logs = tx.trackingLogs ? [...tx.trackingLogs] : [];
          return {
            ...tx,
            trackingLogs: [{ status: statusText, timestamp: new Date().toLocaleString() }, ...logs]
          };
        }
        return tx;
      })
    );
  }

  // Delivery crew handover submit
  public submitHandover(txId: string, notes: string, imageUrl?: string) {
    this.transactions.update(current => 
      current.map(tx => {
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
            status: 'Delivered',
            proofNotes: notes,
            handoverProofImage: imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1000&auto=format&fit=crop',
            trackingLogs: [{ status: 'Fulfillment Completed at Location. Handover certified.', timestamp: new Date().toLocaleString() }, ...logs],
            timeline: updatedTimeline
          };
        }
        return tx;
      })
    );
  }
}
