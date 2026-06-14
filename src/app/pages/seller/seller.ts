import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PlatformStateService } from '../../services/platform-state';
import { NgClass, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VehicleListing } from '../../../shared/types';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [MatIconModule, NgClass, CommonModule],
  template: `
    <div class="min-h-screen bg-neutral-950 text-white font-sans pb-24">
      
      <!-- Top header banner -->
      <div class="bg-neutral-900 border-b border-white/5 py-6 px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
            <mat-icon class="text-black">storefront</mat-icon>
          </div>
          <div>
            <h1 class="text-xl font-display font-bold">Seller Dealership Center</h1>
            <p class="text-xs text-gray-400">Welcome back, <span class="text-white font-medium">{{ activeSellerProfile()?.fullName || 'Verification Node' }}</span>. Register new listings and track physical certifications.</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button (click)="toggleAddVehicleForm()" class="bg-amber-500 hover:bg-amber-400 text-black px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg select-none cursor-pointer">
            <mat-icon class="text-sm">{{ showAddForm() ? 'close' : 'add' }}</mat-icon> 
            {{ showAddForm() ? 'Close Form' : 'Register New Vehicle' }}
          </button>
          <button (click)="logout()" class="px-3 h-9 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg border border-white/5 transition-all text-xs flex items-center gap-1">
            <mat-icon class="text-xs">logout</mat-icon> Sign Out
          </button>
        </div>
      </div>

      <!-- Live State Alert Ribbon -->
      <div class="max-w-[1400px] mx-auto px-6 pt-8">
        <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-left">
          <div class="flex items-center gap-2">
            <mat-icon class="text-amber-500">gavel</mat-icon>
            <span class="text-gray-300">Listing Approvals: All vehicles must undergo mechanical checking before publishing to buyers.</span>
          </div>
          <div class="flex items-center gap-2 text-amber-500 font-mono font-medium whitespace-nowrap">
            <span>Corporate Account Status: Approved Platform Node</span>
          </div>
        </div>
      </div>

      <!-- Main Layout Deck -->
      <div class="max-w-[1400px] mx-auto px-6 py-8">

        <!-- DYNAMIC REGISTER VEHICLE FORM -->
        @if (showAddForm()) {
          <div class="bg-neutral-900 border border-white/10 p-6 sm:p-8 rounded-3xl mb-8 text-left animate-fadeIn">
            <h3 class="font-display font-medium text-lg mb-2 text-white flex items-center gap-2">
              <mat-icon class="text-amber-500">directions_car</mat-icon> Submit Listing details for Vetting
            </h3>
            <p class="text-xs text-gray-400 max-w-2xl mb-6">
              Provide detail credentials for your vehicle. An administrator will allocate a physical inspector. Once vetting completes, the listing will go live automatically.
            </p>

            <form (submit)="submitNewVehicle($event)" class="space-y-5">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Brand/Make</label>
                  <input type="text" name="make" placeholder="e.g. Mercedes-Benz" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500" required />
                </div>
                <div>
                  <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Model Name</label>
                  <input type="text" name="model" placeholder="e.g. GLE 350 Luxury" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500" required />
                </div>
                <div>
                  <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Year</label>
                  <input type="number" name="year" placeholder="e.g. 2022" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500" required />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Price (₦ - Naira)</label>
                  <input type="number" name="price" placeholder="e.g. 35000000" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500" required />
                </div>
                <div>
                  <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Odometer Mileage (Miles)</label>
                  <input type="number" name="mileage" placeholder="e.g. 15200" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500" required />
                </div>
                <div>
                  <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Location Hub</label>
                  <input type="text" name="location" placeholder="e.g. Lekki, Lagos" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500" required />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Display Stock Image URL</label>
                  <input type="text" name="image" placeholder="Picsum/Unsplash image URL" value="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none" />
                </div>
                <div class="flex items-end gap-3.5 pt-1">
                  <button type="button" (click)="showAddForm.set(false)" class="h-11 px-5 border border-white/10 text-white hover:bg-white/5 rounded-xl text-xs font-semibold">Discard</button>
                  <button type="submit" class="h-11 px-8 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase tracking-wider rounded-xl text-xs transition-colors flex items-center gap-1"> Submit Listing </button>
                </div>
              </div>
            </form>
          </div>
        }

        <!-- METRIC CARDS -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-left font-sans">
          <div class="bg-white/2 border border-white/5 p-5 rounded-2xl">
            <span class="text-xs text-gray-400 block mb-1">Dealer Verification</span>
            <span class="text-sm font-bold text-emerald-400 flex items-center gap-1 mt-1.5"><mat-icon class="text-xs">verified</mat-icon> Approved Dealer Partner</span>
          </div>
          <div class="bg-white/2 border border-white/5 p-5 rounded-2xl">
            <span class="text-xs text-gray-400 block mb-1">Corporate Details TIN</span>
            <span class="text-sm font-mono font-bold text-gray-200 block mt-2">{{ activeSellerProfile()?.taxId || 'TIN-482201' }}</span>
          </div>
          <div class="bg-white/2 border border-white/5 p-5 rounded-2xl">
            <span class="text-xs text-gray-400 block mb-1">Registered Inventory</span>
            <span class="text-2xl font-bold text-white block mt-1">{{ totalSellerListings() }} cars</span>
          </div>
          <div class="bg-white/2 border border-white/5 p-5 rounded-2xl">
            <span class="text-xs text-gray-400 block mb-1">Awaiting Inspection reports</span>
            <span class="text-2xl font-bold text-amber-500 block mt-1">{{ pendingInspectionCount() }} cars</span>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- LEFT/CENTER SECTIONS: LISTINGS INVENTORY -->
          <div class="lg:col-span-2 space-y-6 text-left">
            <div class="bg-neutral-900 border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
              <div class="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 class="font-display font-medium text-lg text-white">Automotive Publication inventory</h3>
                <span class="text-xs text-gray-400">Real-time DB catalog list</span>
              </div>

              <!-- List grid -->
              <div class="divide-y divide-white/5">
                @for (car of sellerListings(); track car.id) {
                  <div class="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 first:pt-0 last:pb-0">
                    <div class="flex items-start gap-4">
                      <div class="w-20 h-14 rounded-xl bg-neutral-800 shrink-0 border border-white/5 overflow-hidden shadow-md">
                        <img [src]="car.image" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
                      </div>
                      <div>
                        <h4 class="font-bold text-sm tracking-tight text-white leading-tight">{{ car.year }} {{ car.make }} {{ car.model }}</h4>
                        <p class="text-xs text-gray-400 mt-1 font-mono">₦{{ car.price.toLocaleString() }} &middot; {{ car.mileage.toLocaleString() }} mi &middot; {{ car.location }}</p>
                        
                        <div class="flex gap-2 items-center mt-2.5 flex-wrap">
                          @if (car.status === 'approved') {
                            <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5 font-mono">
                              <mat-icon class="text-[10px] w-3 h-3 text-emerald-450">verified_user</mat-icon> Published Live
                            </span>
                          } @else if (car.status === 'rejected') {
                            <span class="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/25 text-red-450 text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5 font-mono">
                              <mat-icon class="text-[10px] w-3 h-3 text-red-500">cancel</mat-icon> Declined Publication
                            </span>
                          } @else {
                            <span class="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#ebaf5b] text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5 font-mono">
                              <mat-icon class="text-[10px] w-3 h-3 text-amber-500">hourglass_top</mat-icon> Under review & Vetting
                            </span>
                          }

                          @if (car.isInspected) {
                            <span class="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/20 text-[#22d3ee] text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5 font-mono">
                              <mat-icon class="text-[10px] w-3 h-3 text-cyan-400">check_circle</mat-icon> Passed 150-Point Inspection
                            </span>
                          }
                        </div>
                      </div>
                    </div>

                    <div class="shrink-0 text-xs font-mono font-medium text-gray-400">
                      ID: {{ car.id }}
                    </div>
                  </div>
                } @empty {
                  <div class="py-12 text-center text-gray-500 space-y-2">
                    <mat-icon class="text-4xl">inventory_2</mat-icon>
                    <p class="text-sm font-semibold">Zero registered cars</p>
                    <p class="text-xs">Click "Register New Vehicle" above to submit your first listings card.</p>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN: SELLER TIPS & WORKFLOW INFO -->
          <div class="space-y-6 text-left">
            <div class="bg-neutral-900 border border-white/5 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 class="font-display font-medium text-lg text-white">Dealer Guidelines</h3>
              
              <div class="space-y-4 text-xs text-gray-400 font-light leading-relaxed">
                <div class="flex gap-3 items-start">
                  <mat-icon class="text-amber-500 shrink-0">info</mat-icon>
                  <p>All listings start as <b>pending</b>. Vetting ensures our trust index remains high.</p>
                </div>
                <div class="flex gap-3 items-start">
                  <mat-icon class="text-amber-500 shrink-0">engineering</mat-icon>
                  <p>An inspector will schedule a workshop visit within 24 hours of submission.</p>
                </div>
                <div class="flex gap-3 items-start">
                  <mat-icon class="text-amber-500 shrink-0">verified_user</mat-icon>
                  <p>Verified sellers with proper tax IDs get priority search placements in showroom.</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>

      </div>

    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out forwards;
    }
  `]
})
export class SellerDashboardComponent implements OnInit {
  platformState = inject(PlatformStateService);
  router = inject(Router);

  showAddForm = signal<boolean>(false);
  sellerListings = signal<VehicleListing[]>([]);

  activeSellerProfile = computed(() => {
    return this.platformState.activeUser();
  });

  totalSellerListings = computed(() => {
    return this.sellerListings().length;
  });

  pendingInspectionCount = computed(() => {
    return this.sellerListings().filter(l => !l.isInspected).length;
  });

  ngOnInit() {
    this.loadSellerInventory();
  }

  loadSellerInventory() {
    this.platformState.http.get<VehicleListing[]>('/api/listings').subscribe({
      next: (res) => {
        // Filter listings owned by this seller
        const currUser = this.platformState.activeUser();
        if (currUser) {
          const sellerId = currUser.id;
          this.sellerListings.set(res.filter(r => r.sellerId === sellerId));
        } else {
          this.sellerListings.set(res);
        }
      },
      error: (err) => console.error('Error fetching inventory listings:', err)
    });
  }

  toggleAddVehicleForm() {
    this.showAddForm.set(!this.showAddForm());
  }

  submitNewVehicle(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    
    const make = (form.querySelector('input[name="make"]') as HTMLInputElement).value;
    const model = (form.querySelector('input[name="model"]') as HTMLInputElement).value;
    const year = +(form.querySelector('input[name="year"]') as HTMLInputElement).value;
    const price = +(form.querySelector('input[name="price"]') as HTMLInputElement).value;
    const mileage = +(form.querySelector('input[name="mileage"]') as HTMLInputElement).value;
    const location = (form.querySelector('input[name="location"]') as HTMLInputElement).value;
    const image = (form.querySelector('input[name="image"]') as HTMLInputElement)?.value || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop';

    this.platformState.submitListingBack({
      make, model, year, price, mileage, location, image
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.showAddForm.set(false);
          this.loadSellerInventory();
        }
      },
      error: (err) => alert(err.error?.error || 'Failed to submit vehicle card.')
    });
  }

  logout() {
    this.platformState.logoutWithBackend().subscribe(() => {
      this.platformState.setSession(null);
      this.router.navigate(['/auth']);
    });
  }
}
