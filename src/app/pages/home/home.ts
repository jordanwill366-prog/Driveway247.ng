import { Component, signal, OnInit, inject, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgClass, CommonModule } from '@angular/common';
import { PlatformStateService, Vehicle, UserAccount, SourcingProposal, SourcingRequest } from '../../services/platform-state';
import { RouterLink, Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';
import { VehicleCardComponent } from '../../components/vehicle-card/vehicle-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, NgClass, CommonModule, RouterLink, HeaderComponent, FooterComponent, VehicleCardComponent],
  templateUrl: './home.html',
  styles: [`
    .scrollbar-hidden::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hidden {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
    }
    @keyframes fadeIn {
      0% { opacity: 0; transform: translateY(10px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideLeft {
      0% { transform: translateX(100%); }
      100% { transform: translateX(0); }
    }
    @keyframes slideUp {
      0% { transform: translateY(100%); }
      100% { transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .animate-slideLeft {
      animation: slideLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .animate-slideUp {
      animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class HomeComponent implements OnInit {
  platformState = inject(PlatformStateService);
  router = inject(Router);

  isLoaded = signal(false);
  activeMockupScreen = signal<'showroom' | 'buyer' | 'seller' | 'broker' | 'inspector' | 'delivery' | 'admin' | 'vehicledetails' | 'negotiations' | 'logistics' | 'loading' | 'auth'>('showroom');
  showSimulatorBar = signal(true);

  // Settings profile editing state signals
  settingsProfileName = signal('');
  settingsProfilePhone = signal('');
  settingsProfileAddress = signal('');
  settingsProfileNotification = signal(true);
  showProfileSaveSuccess = signal(false);

  // Active chat details in Settings tab
  selectedChatVehicleId = signal<string | null>(null);
  activeChatMessageText = signal('');
  isDealerChatTyping = signal(false);
  settingsNegotiationHistory = signal<{sender: string, text: string, isOffer?: boolean, offerAmount?: string, time: string}[]>([]);

  // Active Main UI Toggling Tab Signal
  activeTab = signal<'showroom' | 'buy' | 'concierge' | 'sell' | 'services' | 'ai'>('showroom');
  activeSellerTab = signal<'dashboard' | 'listings' | 'offers' | 'messages' | 'add-car'>('dashboard');

  // Unified Search state filters
  searchQuery = signal('');
  selectedMake = signal('All');
  selectedLocation = signal('All');
  selectedFuel = signal('All');
  minHealthScore = signal(80);
  minTrustScore = signal(80);
  maxPrice = signal(300000000);
  onlyVerifiedSellers = signal(false);
  onlyVerifiedBrokers = signal(false);

  // Selected Overlay references
  selectedVehicle = signal<Vehicle | null>(null);
  activeVehicleTab = signal<'dna' | 'score' | 'specs'>('dna');
  calculatingOfferVehicle = signal<Vehicle | null>(null);

  // Compare matrices tracking
  comparedVehicleIds = signal<string[]>([]);

  // Sourcing services launch context
  customSourcingMake = signal('');
  customSourcingModel = signal('');
  customSourcingYear = signal('');
  customSourcingBudget = signal('');
  customSourcingComments = signal('');
  activeServicesSubTab = signal<'sourcing' | 'escrow'>('sourcing');

  // Proposals draft state
  draftingProposalForRequestId = signal<string | null>(null);
  activeSourcingProposalVehicleDetails = signal('');
  activeSourcingProposalPrice = signal('');
  activeSourcingProposalCommission = signal('2.5%');

  // Escrow logistic status updater fields
  logisticsStatusText = signal('');
  logisticsProofNotes = signal('');

  // Seller onboarding CAC step pipeline details
  onboardingStep = signal(1);
  dealerCompanyName = signal('');
  dealerCAC = signal('');
  dealerYears = signal(3);
  dealerInventory = signal('10-50 cars');
  dealerBankName = signal('');
  dealerBankNumber = signal('');
  uploadedDocuments = signal<{ name: string; type: string }[]>([]);

  // AI chat advisor vectors
  aiQueryText = signal('');
  aiConversations = signal<{ sender: 'User' | 'AI'; text: string }[]>([
    { sender: 'AI', text: 'Welcome to the Carvello AI Deep-Research System. I can analyze diagnostic SOH scores, provide market valuations, or check physical mechanical specs. Try querying or clicking a prompt below.' }
  ]);
  aiThinking = signal(false);

  // Active rotate viewpoint showcasing
  currentShowcaseAngleIndex = signal(0);
  showcaseAngles = signal<string[]>([
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop'
  ]);

  // Carvello Concierge™ Signals
  conciergePrompt = signal<string>('');
  isAnalyzingConcierge = signal<boolean>(false);
  extractedMake = signal<string>('');
  extractedModel = signal<string>('');
  extractedYear = signal<string>('');
  extractedBudget = signal<string>('');
  extractedLocation = signal<string>('');
  extractedColor = signal<string>('');
  showExtractedReview = signal<boolean>(false);
  selectedRequestForOffers = signal<SourcingRequest | null>(null);
  conciergeStatusLogs = signal<string[]>([]);

  // Sourcing Request preloaded mock list
  mockSourcingRequests = computed(() => this.platformState.getSourcingRequests());

  activeProposalsForSelectedRequest = computed(() => {
    const req = this.selectedRequestForOffers();
    if (!req) return [];
    return this.platformState.getSourcingProposals().filter(p => p.requestId === req.id);
  });

  ngOnInit() {
    this.isLoaded.set(true);

    // Initialize the settings fields from active session
    const userObj = this.platformState.getSession();
    this.settingsProfileName.set(userObj?.fullName || 'Jordan Williams');
    this.settingsProfilePhone.set(userObj?.phone || '+234 81 0522 9384');
    this.settingsProfileAddress.set(userObj?.address || 'Plot 104, Lekki Phase 1, Lagos');
    
    // Seed default concierge order if none exists, so the UI is immediately glorious on first load
    if (this.platformState.getSourcingRequests().length === 0) {
      const defaultId = this.platformState.submitSourcingRequest({
        buyerName: 'Jordan Williams',
        buyerEmail: 'jordanwill366@gmail.com',
        vehicleMake: 'Lexus',
        vehicleModel: 'RX 350',
        yearRange: '2021',
        budgetNaira: '45,000,000',
        comments: 'Bespoke Concierge placement: Immaculate Silver paint configuration specified for Lekki delivery channels.'
      });
      
      const found = this.platformState.getSourcingRequests().find(r => r.id === defaultId);
      if (found) {
        this.selectedRequestForOffers.set(found);
      }
    } else {
      // Set the first active request as selected by default to ensure maximum immediate beauty!
      const reqs = this.platformState.getSourcingRequests();
      if (reqs && reqs.length > 0) {
        this.selectedRequestForOffers.set(reqs[0]);
      }
    }
  }

  analyzeConciergePrompt(presetText?: string) {
    const text = presetText || this.conciergePrompt();
    if (!text) return;
    
    if (presetText) {
      this.conciergePrompt.set(presetText);
    }

    this.isAnalyzingConcierge.set(true);
    this.showExtractedReview.set(false);
    this.conciergeStatusLogs.set([]);

    const addLog = (log: string, delay: number) => {
      setTimeout(() => {
        this.conciergeStatusLogs.update(logs => [...logs, log]);
      }, delay);
    };

    addLog("Amara Okanlawon: Securing satellite telemetry and CAC directories...", 300);
    addLog("Analyzing linguistic intents of requirements...", 800);
    addLog("Extracting legal budget limits and vehicle mechanical specs...", 1300);
    addLog("Cross-referencing verified dealer stock indices...", 1800);
    addLog("Personal Sourcing Brief details parsed successfully.", 2200);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let make = 'Toyota';
      if (lower.includes('lexus')) make = 'Lexus';
      else if (lower.includes('benz') || lower.includes('mercedes')) make = 'Mercedes-Benz';
      else if (lower.includes('range') || lower.includes('rover')) make = 'Range Rover';
      else if (lower.includes('honda')) make = 'Honda';

      let model = 'Camry';
      if (lower.includes('rx350') || lower.includes('rx 350') || lower.includes('rx')) model = 'RX 350';
      else if (lower.includes('gle')) model = 'GLE 450';
      else if (lower.includes('autobiography')) model = 'Autobiography LWB';
      else if (lower.includes('accord')) model = 'Accord';
      else if (lower.includes('land cruiser') || lower.includes('lc300')) model = 'Land Cruiser';

      let year = '2022';
      const yearMatch = text.match(/\b(201\d|202\d)\b/);
      if (yearMatch) year = yearMatch[0];

      let budget = '18,500,000';
      if (lower.includes('18 million') || lower.includes('18m') || lower.includes('18,000,000')) budget = '18,000,000';
      else if (lower.includes('45 million') || lower.includes('45m') || lower.includes('45,000,000')) budget = '45,000,000';
      else if (lower.includes('300 million') || lower.includes('300m') || lower.includes('300,000,000')) budget = '300,000,000';
      else {
        const numMatch = text.match(/[\d,]+(?=\s*(?:million|m|₦))/);
        if (numMatch) {
          const parsedNum = parseFloat(numMatch[0].replace(/,/g, ''));
          if (parsedNum < 1000) budget = (parsedNum * 1000000).toLocaleString();
        }
      }

      let location = 'Lagos';
      if (lower.includes('abuja') || lower.includes('maitama') || lower.includes('gwarinpa')) location = 'Abuja';
      else if (lower.includes('lekki')) location = 'Lagos (Lekki)';
      else if (lower.includes('port') || lower.includes('harcourt')) location = 'Port Harcourt';

      let color = 'Black';
      if (lower.includes('silver')) color = 'Silver';
      else if (lower.includes('white')) color = 'White';
      else if (lower.includes('grey') || lower.includes('gray')) color = 'Grey';
      else if (lower.includes('blue')) color = 'Blue';

      this.extractedMake.set(make);
      this.extractedModel.set(model);
      this.extractedYear.set(year);
      this.extractedBudget.set(budget);
      this.extractedLocation.set(location);
      this.extractedColor.set(color);

      this.isAnalyzingConcierge.set(false);
      this.showExtractedReview.set(true);
    }, 2400);
  }

  submitConciergeRequest() {
    const make = this.extractedMake();
    const model = this.extractedModel();
    const year = this.extractedYear();
    const budget = this.extractedBudget();
    const col = this.extractedColor();
    const loc = this.extractedLocation();

    const reqId = this.platformState.submitSourcingRequest({
      buyerName: this.activeUser()?.fullName || 'Jordan Williams',
      buyerEmail: this.activeUser()?.email || 'jordanwill366@gmail.com',
      vehicleMake: make,
      vehicleModel: model,
      yearRange: year,
      budgetNaira: parseFloat(budget.replace(/,/g, '')).toLocaleString(),
      comments: `Bespoke Concierge placement: Immaculate ${col} exterior paint configuration specified for ${loc} delivery channels.`
    });

    this.conciergePrompt.set('');
    this.showExtractedReview.set(false);
    
    setTimeout(() => {
      const updatedReqs = this.platformState.getSourcingRequests();
      const found = updatedReqs.find(r => r.id === reqId);
      if (found) {
        this.selectedRequestForOffers.set(found);
      }
    }, 100);
  }

  // Approved vehicles listing getters
  approvedListings = computed(() => {
    return this.platformState.getListings().filter(x => x.status === 'Approved' || x.isVerified);
  });

  availableMakes = computed(() => {
    const brands = this.approvedListings().map(x => x.make);
    return Array.from(new Set(brands)).sort();
  });

  availableLocations = computed(() => {
    const locs = this.approvedListings().map(x => x.location);
    return Array.from(new Set(locs)).sort();
  });

  isSearchActive = computed(() => {
    return this.searchQuery().trim().length > 0 ||
           this.selectedMake() !== 'All' ||
           this.selectedLocation() !== 'All' ||
           this.selectedFuel() !== 'All' ||
           this.minHealthScore() > 80 ||
           this.minTrustScore() > 80 ||
           this.maxPrice() < 300000000 ||
           this.onlyVerifiedSellers() ||
           this.onlyVerifiedBrokers();
  });

  // Filter listings based on criteria
  filteredListings = computed(() => {
    return this.approvedListings().filter(car => {
      if (this.searchQuery().trim().length > 0) {
        const term = this.searchQuery().toLowerCase();
        const text = `${car.make} ${car.model} ${car.year} ${car.dealer}`.toLowerCase();
        if (!text.includes(term)) return false;
      }
      if (this.selectedMake() !== 'All' && car.make !== this.selectedMake()) return false;
      if (this.selectedLocation() !== 'All' && car.location !== this.selectedLocation()) return false;
      if (this.selectedFuel() !== 'All' && car.fuel !== this.selectedFuel()) return false;
      
      const rawPrice = parseInt(car.price.replace(/,/g, ''), 10);
      if (!isNaN(rawPrice) && rawPrice > this.maxPrice()) return false;

      const details = car.inspectionDetails;
      if (details) {
        const health = Math.round((details.engineRating + details.transmissionRating + details.bodyRating) / 3);
        if (health < this.minHealthScore()) return false;
      }
      const scoreNum = parseInt(car.score, 10);
      if (!isNaN(scoreNum) && scoreNum < this.minTrustScore()) return false;

      if (this.onlyVerifiedSellers() && !car.isVerified) return false;
      if (this.onlyVerifiedBrokers()) {
        const hasBrokerBacking = ['porsche', 'lexus', 'land rover', 'mercedes'].some(m => car.make.toLowerCase().includes(m));
        if (!hasBrokerBacking) return false;
      }
      return true;
    });
  });

  curatedShelves = computed(() => {
    const list = this.approvedListings();
    return [
      {
        id: 'for_you',
        title: 'Deep AI Recommended Matches',
        desc: 'Precision mechanical clearances and low-depreciation assets handpicked for your profile.',
        items: list.filter(v => parseInt(v.score) >= 94)
      },
      {
        id: 'luxury_room',
        title: 'Luxury Collector Suite',
        desc: 'Exquisite elite tiers of performance Engineering and heritage prestige brands.',
        items: list.filter(v => parseInt(v.price.replace(/,/g, ''), 10) >= 80000000)
      },
      {
        id: 'suv_explorers',
        title: 'Prestige SUV & SOH Explorers',
        desc: 'High-clearance road trip tranquility matched with dual-powertrain hybrid synergy.',
        items: list.filter(v => ['suv', 'awd', 'rx', 'cruiser', 'rover', 'gle'].some(k => v.model.toLowerCase().includes(k) || v.make.toLowerCase().includes(k)))
      }
    ];
  });

  // Favorite managers
  isSaved(id: string): boolean {
    return this.platformState.savedVehicleIds().includes(id);
  }

  saveVehicle(id: string) {
    this.platformState.toggleFavorite(id);
  }

  isCompared(id: string): boolean {
    return this.comparedVehicleIds().includes(id);
  }

  toggleCompareVehicle(id: string) {
    this.comparedVehicleIds.update(ids =>
      ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]
    );
  }

  comparedListings = computed(() => {
    return this.platformState.getListings().filter(x => this.comparedVehicleIds().includes(x.id));
  });

  activeUser = computed(() => this.platformState.getSession());

  hasRole(role: UserAccount['role']): boolean {
    const s = this.activeUser();
    return !!(s && s.unlockedRoles?.includes(role));
  }

  // Swipers rotates indicators
  onRotateShowcase(dir: number) {
    let nextIdx = this.currentShowcaseAngleIndex() + dir;
    if (nextIdx < 0) nextIdx = this.showcaseAngles().length - 1;
    if (nextIdx >= this.showcaseAngles().length) nextIdx = 0;
    this.currentShowcaseAngleIndex.set(nextIdx);
  }

  // Settings State Managers and Simulation Methods
  saveSettingsProfile() {
    const active = this.platformState.getSession();
    if (active) {
      active.fullName = this.settingsProfileName();
      active.phone = this.settingsProfilePhone();
      active.address = this.settingsProfileAddress();
      this.platformState.setSession(active);
    }
    this.showProfileSaveSuccess.set(true);
    setTimeout(() => {
      this.showProfileSaveSuccess.set(false);
    }, 3000);
  }

  getSavedVehiclesList = computed(() => {
    const list = this.platformState.getListings();
    const savedIds = this.platformState.savedVehicleIds();
    return list.filter(v => savedIds.includes(v.id));
  });

  removeSavedVehicle(id: string, event: Event) {
    event.stopPropagation();
    this.platformState.toggleFavorite(id);
  }

  openSettingsChatForVehicle(carId: string) {
    this.selectedChatVehicleId.set(carId);
    
    // Seed preloaded realistic negotiation history based on vehicle
    const car = this.platformState.getListings().find(v => v.id === carId);
    const title = car ? `${car.make} ${car.model}` : 'Vehicle';
    const dealerName = car ? car.dealer : 'Verified Dealer Representative';
    
    // Check if there is an existing counteroffer recorded in state
    const relatedOffer = this.platformState.getStructuredOffers().find(o => o.vehicleId === carId);
    const offerAmountText = relatedOffer ? relatedOffer.buyerOffer : '38,000,000';

    this.settingsNegotiationHistory.set([
      {
        sender: dealerName,
        text: `Greetings from the showroom. I represent ${dealerName}. We noticed your interest in the certified ${title}. Let me know if you would like me to dispatch the 150-Point Physical Inspection sheet for your review.`,
        time: 'Yesterday, 4:15 PM'
      },
      {
        sender: 'You',
        text: `Hi! Yes, I want to verify the engine health score and ensure there is a clear dual-approval escrow pipeline in place before proceeding.`,
        time: 'Yesterday, 4:30 PM'
      },
      {
        sender: dealerName,
        text: `Absolutely. Our inspection reports are certified permanent logs on the Carvello DNA™ blockchain ledger. We are willing to negotiate. What is your competitive counterproposal?`,
        time: 'Yesterday, 4:45 PM'
      },
      {
        sender: 'You',
        text: `I would like to offer ₦${offerAmountText} with logistics flatbed transport delivery options to my address.`,
        isOffer: true,
        offerAmount: `₦${offerAmountText}`,
        time: 'Today, 10:11 AM'
      },
      {
        sender: dealerName,
        text: `Understood. Your counteroffer of ₦${offerAmountText} is queued. Awaiting structural validation from our sourcing floor. We will respond shortly with administrative feedback.`,
        time: 'Today, 10:15 AM'
      }
    ]);
  }

  sendChatMessageInput() {
    const text = this.activeChatMessageText().trim();
    if (!text) return;

    // Add User message
    this.settingsNegotiationHistory.update(list => [...list, {
      sender: 'You',
      text: text,
      time: 'Just now'
    }]);

    this.activeChatMessageText.set('');
    this.isDealerChatTyping.set(true);

    // Simulate dealer typing delay
    setTimeout(() => {
      this.isDealerChatTyping.set(false);
      
      this.settingsNegotiationHistory.update(list => [...list, {
        sender: 'Dealer Representative',
        text: `Carvello Escrow Matrix Sync: Received. Our logistics floor has acknowledged your premium inquiry. We are preparing to dispatch flatbed transport options depending on physical location confirmation. Click "Accept & Start Transport" above to lock the deal!`,
        time: 'Just now'
      }]);
    }, 1800);
  }

  getVehicleById(id: string): Vehicle | undefined {
    return this.platformState.getListings().find(v => v.id === id);
  }

  acceptEscrowDeal(carId: string) {
    const car = this.platformState.getListings().find(v => v.id === carId);
    if (!car) return;
    this.instantBuy(car);
    this.platformState.showSettings.set(true);
    this.platformState.activeSettingsTab.set('Activity');
    alert(`Ecosystem Protection: Escrow allocated and secured. Your deal for certified ${car.make} ${car.model} is finalized! Check the Activity Log to monitor physical progress.`);
  }

  // Active operations
  openVehicleDeets(car: Vehicle) {
    // Dynamically query 360 images based on the car image to make it realistic!
    this.showcaseAngles.set([
      car.image,
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop'
    ]);
    this.currentShowcaseAngleIndex.set(0);
    this.selectedVehicle.set(car);
  }

  closeVehicleDeets() {
    this.selectedVehicle.set(null);
  }

  openOfferCalculator(v: Vehicle) {
    this.selectedVehicle.set(null);
    this.calculatingOfferVehicle.set(v);
  }

  closeOfferCalculator() {
    this.calculatingOfferVehicle.set(null);
  }

  submitOfferProposal(v: Vehicle, valInput: HTMLInputElement) {
    const val = valInput.value.trim().replace(/,/g, '');
    if (!val || isNaN(parseFloat(val))) {
      alert('Security Audit: Enter valid counterproposal digits e.g. 42000000.');
      return;
    }
    const formatted = parseFloat(val).toLocaleString();
    this.platformState.submitStructuredOffer({
      vehicleId: v.id,
      buyerEmail: this.activeUser()?.email || 'jordanwill366@gmail.com',
      buyerName: this.activeUser()?.fullName || 'Jordan Williams',
      sellerPrice: v.price,
      buyerOffer: formatted
    });

    alert(`Carvello Escrow Matrix: Counter-offer of ₦${formatted} dispatched autonomously to seller system.`);
    this.closeOfferCalculator();
    
    // Switch to Negotiations sub tab settings
    this.platformState.showSettings.set(true);
    this.platformState.activeSettingsTab.set('Negotiations');
  }

  instantBuy(v: Vehicle) {
    const txId = this.platformState.purchaseVehicle(v);
    alert(`Collateral Vault: Escrow allocations secured for Transaction ${txId} holding ₦${v.price}. logistics flatbed tracking log dispatch is configured.`);
    this.selectedVehicle.set(null);
    
    this.platformState.showSettings.set(true);
    this.platformState.activeSettingsTab.set('Activity');
    
    this.activeTab.set('services');
    this.activeServicesSubTab.set('escrow');
  }

  activeTransactions = computed(() => this.platformState.getTransactions());
  structuredOffers = computed(() => this.platformState.getStructuredOffers());

  // Input bindings
  onBusinessInput(ev: Event) { this.dealerCompanyName.set((ev.target as HTMLInputElement).value); }
  onCACInput(ev: Event) { this.dealerCAC.set((ev.target as HTMLInputElement).value); }
  onYearsInput(ev: Event) { this.dealerYears.set(parseInt((ev.target as HTMLInputElement).value, 10) || 1); }
  onInventorySelect(ev: Event) { this.dealerInventory.set((ev.target as HTMLSelectElement).value); }
  onBankNameInput(ev: Event) { this.dealerBankName.set((ev.target as HTMLInputElement).value); }
  onBankNoInput(ev: Event) { this.dealerBankNumber.set((ev.target as HTMLInputElement).value); }

  resetFilters() {
    this.searchQuery.set('');
    this.selectedMake.set('All');
    this.selectedLocation.set('All');
    this.selectedFuel.set('All');
    this.minHealthScore.set(80);
    this.minTrustScore.set(80);
    this.maxPrice.set(300000000);
    this.onlyVerifiedSellers.set(false);
    this.onlyVerifiedBrokers.set(false);
  }

  onMakeSelect(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.selectedMake.set(val);
  }

  onLocationSelect(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.selectedLocation.set(val);
  }

  onFuelSelect(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.selectedFuel.set(val);
  }

  onPriceInput(event: Event) {
    const val = parseInt((event.target as HTMLInputElement).value, 10) || 300000000;
    this.maxPrice.set(val);
  }

  onHealthScoreInput(event: Event) {
    const val = parseInt((event.target as HTMLInputElement).value, 10) || 80;
    this.minHealthScore.set(val);
  }

  onTrustScoreInput(event: Event) {
    const val = parseInt((event.target as HTMLInputElement).value, 10) || 80;
    this.minTrustScore.set(val);
  }

  onSearchInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchQuery.set(val);
  }

  simulateFileUpload() {
    this.uploadedDocuments.set([
      { name: 'CAC_Form_CO2_Certified.pdf', type: 'application/pdf' }
    ]);
    alert('Security Gate: Certificate physical CAC scan successfully uploaded and linked to unified profile identity.');
  }

  submitOnboardingForAudit() {
    this.onboardingStep.set(4);
  }

  finalClickApproveSellerRole() {
    this.platformState.unlockRole('Seller');
    this.platformState.switchRole('Seller');
    this.onboardingStep.set(1);
    alert('Compliance Success: Certified Dealer Office successfully activated inside your active workspaces profile.');
  }

  onRegisterNewCar(
    mk: HTMLInputElement, md: HTMLInputElement, yr: HTMLInputElement,
    pr: HTMLInputElement, ml: HTMLInputElement, loc: HTMLSelectElement,
    fl: HTMLSelectElement, tr: HTMLSelectElement, img: HTMLInputElement
  ) {
    if (!mk.value || !md.value || !yr.value || !pr.value) {
      alert('Review forms: Submitting prestige listings require complete narrative parameters.');
      return;
    }
    const formattedPrice = parseFloat(pr.value).toLocaleString() || '45,000,000';
    this.platformState.addListing({
      year: yr.value,
      make: mk.value,
      model: md.value,
      price: formattedPrice,
      mileage: ml.value || '15,000 mi',
      location: loc.value,
      fuel: fl.value,
      transmission: tr.value,
      financeAvailable: true,
      dealer: this.dealerCompanyName() || 'Prestige Partner Group',
      image: img.value || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1000&auto=format&fit=crop'
    });
    alert(`Success: ${mk.value} ${md.value} listed successfully. Field Inspectors scheduled for immediate diagnostics bays.`);
    this.activeSellerTab.set('dashboard');
  }

  // Proposals Draft operations
  openProposalDraft(id: string) {
    this.draftingProposalForRequestId.set(id);
    this.activeSourcingProposalVehicleDetails.set('');
    this.activeSourcingProposalPrice.set('');
  }

  submitBrokerProposal(reqId: string) {
    const details = this.activeSourcingProposalVehicleDetails().trim();
    const priceText = this.activeSourcingProposalPrice().trim();
    if (!details || !priceText) {
      alert('Sourcing Audit: Fill in description and proposal settle price.');
      return;
    }
    const fmt = parseFloat(priceText).toLocaleString();
    this.platformState.submitSourcingProposal({
      requestId: reqId,
      brokerId: this.activeUser()?.id || 'usr-jordan-brk',
      brokerName: this.activeUser()?.fullName || 'Jordan (Broker Sourced)',
      vehicleDetails: details,
      priceNaira: fmt,
      proposedCommission: '₦' + (parseFloat(priceText) * 0.025).toLocaleString(),
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1000&auto=format&fit=crop'
    });
    alert('Broker Success: Allocations proposition logged in buyer workspace.');
    this.draftingProposalForRequestId.set(null);
  }

  onLaunchSourcingRequest() {
    const make = this.customSourcingMake().trim();
    const model = this.customSourcingModel().trim();
    const budget = this.customSourcingBudget().trim();
    if (!make || !model || !budget) {
      alert('Mandatory Parameters: Sourcing blueprints require make, model, and budget.');
      return;
    }
    const fmt = parseFloat(budget).toLocaleString();
    this.platformState.submitSourcingRequest({
      buyerName: this.activeUser()?.fullName || 'Jordan Williams',
      buyerEmail: this.activeUser()?.email || 'jordanwill366@gmail.com',
      vehicleMake: make,
      vehicleModel: model,
      yearRange: this.customSourcingYear() || '2020+',
      budgetNaira: fmt,
      comments: this.customSourcingComments() || 'Required pristine mechanics, single executive status.'
    });
    alert(`Pipeline Fired:Sourcing SOH Request for ${make} ${model} broadcast to licensed regional Brokers.`);
    this.customSourcingMake.set('');
    this.customSourcingModel.set('');
    this.customSourcingBudget.set('');
    this.customSourcingComments.set('');
  }

  getSourcingProposalsForRequest(rqId: string) {
    return this.platformState.getSourcingProposalsForRequest(rqId)();
  }

  acceptSourcingProposal(prop: SourcingProposal) {
    this.platformState.updateSourcingProposalStatus(prop.id, 'Accepted');
    
    // Automatically purchase Sourced item
    const txId = this.platformState.purchaseVehicle({
      id: 'sourced_' + prop.id,
      image: prop.image,
      year: '2021',
      make: 'Prestige',
      model: prop.vehicleDetails,
      price: prop.priceNaira,
      mileage: '12,000 mi',
      location: 'Lagos Hub Port',
      dealer: prop.brokerName,
      isVerified: true,
      hasEscrow: true,
      score: '98',
      fuel: 'Petrol',
      transmission: 'Auto',
      financeAvailable: false,
      status: 'Approved',
      ownerId: prop.brokerId
    });

    alert(`Escrow Collateral Setup: Sourcing proposal accepted! Initiating direct transaction holds for ₦${prop.priceNaira}. Transaction established: ${txId}`);
    this.activeServicesSubTab.set('escrow');
  }

  declineSourcingProposal(id: string) {
    this.platformState.updateSourcingProposalStatus(id, 'Declined');
  }

  activateBrokerAccountDirectBypass() {
    this.platformState.unlockRole('Broker');
    this.platformState.switchRole('Broker');
    alert('Security Success: Certified Sourcing Broker status unlocked. Accessing commission boards.');
  }

  onLaunchCompareMatrix() {
    let text = 'Carvello Matrix Comparison specs of bookmarked blueprints:\n\n';
    this.comparedListings().forEach(v => {
      text += `• ${v.year} ${v.make} ${v.model}: Price: ₦${v.price} | Fuel: ${v.fuel} | SOH rating: ${v.score}/100\n`;
    });
    alert(text);
  }

  // Logistics tracking tools
  submitDispatchLog(txId: string) {
    const text = this.logisticsStatusText().trim();
    if (!text) return;
    this.platformState.addTrackingLog(txId, text);
    this.logisticsStatusText.set('');
    alert('Dispatch logs tracker updated.');
  }

  releaseHandoverComplete(txId: string) {
    this.platformState.submitHandover(txId, this.logisticsProofNotes() || "Delivered at client pre-inspection destination, certified spotless.");
    this.platformState.advanceTransaction(txId, 'Completed');
    this.logisticsProofNotes.set('');
    alert('Escrow Gateway Status: Handover proof uploaded! Escrow holds released and transferred to seller profile.');
  }

  // AI Conversational engines
  aiInteractChip(text: string) {
    this.aiQueryText.set(text);
    this.postAIQuery();
  }

  setFilterMake(brand: string) {
    if (brand === 'All') {
      this.resetFilters();
    } else {
      this.resetFilters();
      this.selectedMake.set(brand);
    }
    this.activeTab.set('buy');
    this.scrollToElement('sticky-filters');
  }

  postAIQuery() {
    const q = this.aiQueryText().trim();
    if (!q) return;

    this.aiConversations.update(arr => [...arr, { sender: 'User', text: q }]);
    this.aiQueryText.set('');
    this.aiThinking.set(true);

    setTimeout(() => {
      let r = '';
      const lq = q.toLowerCase();
      if (lq.includes('compare') || lq.includes('versus') || lq.includes('vs')) {
        r = `<strong>Carvello Deep-Research Diagnostics Spec sheet comparison matrix:</strong><br><br>
        1. <strong>Lexus RX350 (2021) F-Sport:</strong> Price ₦42.5M. V6 3.5L powertrain. Transmission: Auto 8-speed. Fuel Efficiency: 22 mpg. Comfort Index: 98/100. Diagnostic Clearance: Spotless.<br>
        2. <strong>Mercedes Benz GLE 450 (2022):</strong> Price ₦72M. Inline-6 Turbo with mild-hybrid synergy. Transmission: Auto 9-Speed. Fuel Efficiency: 24 mpg. Performance Index: 99/100. Residual Valuation: 94% retention.<br><br>
        <em>Diagnostics Verdict:</em> Lexus delivers unparalleled maintenance cost-to-reliability ratio, while Mercedes GLE delivers superior technology and speed dynamics.`;
      } else if (lq.includes('efficiency') || lq.includes('fuel') || lq.includes('hybrid')) {
        r = `<strong>Hybrid & Electric Synergy Diagnostics Clearances:</strong><br><br>
        - <strong>Optimal SOH Powertrains:</strong> Lexus hybrid synergy systems or Honda Accord Accord touring powertrain alignments consistently report maintenance indices below 3.5% over 5-year cycles.<br>
        - <strong>Sourced Choice:</strong> Cayenne E-Hybrid utilizes 8-speed automatic with liquid lithium power matrixes, offering maximum zero-emission local commute clearance.`;
      } else {
        r = `Administrative audit completed for queries matching: <em>"${q}"</em>.<br><br>
        Carvello regional registries hold <strong>12 Active Prestige assets</strong> matching those parameters. Escrow Collateral and 150-Point diagnostic certificates are cleared for instant physical फ्लैटबेड़ logistics scheduling.`;
      }

      this.aiConversations.update(arr => [...arr, { sender: 'AI', text: r }]);
      this.aiThinking.set(false);
    }, 1200);
  }

  // Navigation shortcuts
  scrollToElement(id: string) {
    if (typeof window === 'undefined') return;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  formatPrice(num: number): string {
    return num.toLocaleString();
  }
}
