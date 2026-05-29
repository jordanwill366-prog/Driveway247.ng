import { Component, signal, inject, computed, effect } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PlatformStateService } from '../../services/platform-state';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [MatIconModule, NgClass],
  template: `
    @if (!isLoggedIn()) {
       <div class="min-h-screen bg-driveway-black flex flex-col justify-center items-center py-20 px-6 font-sans">
          <!-- Serious, enterprise-looking brand logo -->
          <div class="max-w-md w-full glass-panel bg-driveway-charcoal border border-white/10 rounded-3xl p-8 shadow-[0_40px_80px_rgba(0,0,0,0.8)] relative overflow-hidden text-left animate-luxury-reveal">
             <div class="absolute -top-10 -left-10 w-40 h-40 bg-driveway-gold/10 rounded-full blur-3xl pointer-events-none"></div>
             <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-600/[0.04] rounded-full blur-3xl pointer-events-none"></div>

             <div class="flex items-center gap-3.5 mb-8">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-driveway-gold to-amber-700 flex items-center justify-center shadow-lg shadow-driveway-gold/10">
                   <mat-icon class="text-white">storefront</mat-icon>
                </div>
                <div>
                   <span class="text-[9px] font-mono font-bold tracking-widest text-driveway-gold uppercase block">Verified Ecosystem Node</span>
                   <h2 class="text-lg font-display font-bold text-white tracking-tight">DEALER HARBOR LOGIN</h2>
                </div>
             </div>

             <h3 class="text-base font-semibold text-white mb-2">Dealer Signature Verification</h3>
             <p class="text-xs text-gray-400 mb-6 font-light leading-relaxed">
                Enter registered corporate credentials or secure dealer keys to access inventory dispatch channels and physical inspection archives. All activities are securely tracked.
             </p>

             <div class="space-y-4 font-sans text-left">
                <div>
                   <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Dealer License Token (CAC RC Number)</label>
                   <input #cacKey type="text" value="RC-4903328-AUTH-DEV" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-driveway-gold font-sans" />
                </div>
                <div>
                   <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Agent Security Access Passcode</label>
                   <input type="password" value="••••••••••••••••" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-driveway-gold font-sans" />
                </div>

                <!-- Certificate Verification checklist simulating security -->
                <div class="bg-black/40 border border-white/5 rounded-xl p-3.5 text-[10px] text-gray-500 space-y-1.5 font-mono">
                   <div class="flex items-center gap-1.5 text-emerald-500">
                      <mat-icon class="text-xs w-3.5 h-3.5 text-emerald-400">verified</mat-icon> Secure Escrow Database Connected
                   </div>
                   <div class="flex items-center gap-1.5 text-driveway-cyan">
                      <mat-icon class="text-xs w-3.5 h-3.5 text-driveway-cyan animate-pulse">radio_button_checked</mat-icon> Session State: Partner Sandbox Connected
                   </div>
                </div>

                <button (click)="onDealerSubmitLogin(cacKey.value)" class="w-full h-12 bg-driveway-gold hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mt-4 shadow-lg shadow-driveway-gold/20">
                   <mat-icon class="text-sm">vpn_key</mat-icon> Sign In as Verified Partner
                </button>
             </div>
          </div>
       </div>
    } @else {
       <div class="min-h-screen pt-28 px-6 max-w-7xl mx-auto pb-24">
       <!-- Live state alert banner -->
       <div class="mb-8 p-4 rounded-xl bg-driveway-gold/5 border border-driveway-gold/20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div class="flex items-center gap-2">
             <mat-icon class="text-driveway-gold text-[18px] w-4.5 h-4.5">gavel</mat-icon>
             <span class="text-gray-300">Seller Verification Mandate: All listings require physical checkups by field officers before they are published. Exchanging offline contact parameters is deactivated.</span>
          </div>
          <div class="flex items-center gap-2 text-driveway-cyan font-mono font-medium">
             <span>Active Portal Status: Verified Partner Dealer</span>
          </div>
       </div>

       <!-- Header and Add Button -->
       <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <span class="text-xs font-semibold tracking-widest text-driveway-gold uppercase mb-2 block">Seller Workspace</span>
            <h1 class="text-4xl font-display font-medium text-white">Dealer Center</h1>
          </div>
          <div class="flex items-center gap-3">
             <button id="add-vehicle-trigger" (click)="toggleAddVehicleForm()" class="bg-driveway-gold text-black px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-amber-400 transition-colors">
                <mat-icon>{{ showAddForm() ? 'close' : 'add' }}</mat-icon> 
                {{ showAddForm() ? 'Cancel Form' : 'Register New Vehicle' }}
             </button>
          </div>
       </div>

       <!-- DYNAMIC ADD VEHICLE FORM COMPONENT (Zoneless Friendly, zero dependencies) -->
       @if(showAddForm()) {
          <div class="glass-panel p-8 rounded-2xl border border-white/15 bg-driveway-charcoal/50 mb-12 animate-fade-in relative z-20">
             <h3 class="font-display font-medium text-xl mb-6 text-white text-left flex items-center gap-2">
                <mat-icon class="text-driveway-gold">directions_car</mat-icon> Submit Listing for 150-Point Physical Inspection
             </h3>
             <p class="text-xs text-gray-400 font-light max-w-2xl mb-8">
                Input your vehicle's physical state. Once submitted, our system will assign an inspector to visit your motor premises or dealership for checking. Your listing will publish to the public discoveries feed once approved by administration.
             </p>

             <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                   <label class="text-xs font-semibold uppercase text-gray-400 mb-2 block">Brand/Make</label>
                   <input #carMake type="text" placeholder="e.g. Mercedes-Benz" class="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-driveway-gold" />
                </div>
                <div>
                   <label class="text-xs font-semibold uppercase text-gray-400 mb-2 block">Model Name</label>
                   <input #carModel type="text" placeholder="e.g. GLE 350 Luxury" class="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-driveway-gold" />
                </div>
                <div>
                   <label class="text-xs font-semibold uppercase text-gray-400 mb-2 block">Year of Import</label>
                   <input #carYear type="number" placeholder="e.g. 2022" class="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-driveway-gold" />
                </div>
             </div>

             <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                   <label class="text-xs font-semibold uppercase text-gray-400 mb-2 block">Price (₦ - Naira)</label>
                   <input #carPrice type="text" placeholder="e.g. 35,000,000" class="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-driveway-gold" />
                </div>
                <div>
                   <label class="text-xs font-semibold uppercase text-gray-400 mb-2 block">Odometer Milage</label>
                   <input #carMileage type="text" placeholder="e.g. 15,200 mi" class="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-driveway-gold" />
                </div>
                <div>
                   <label class="text-xs font-semibold uppercase text-gray-400 mb-2 block">Current Physical Location</label>
                   <input #carLocation type="text" placeholder="e.g. Lekki, Lagos" class="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-driveway-gold" />
                </div>
             </div>

             <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                   <label class="text-xs font-semibold uppercase text-gray-400 mb-2 block">Fuel Type</label>
                   <select #carFuel class="w-full h-12 px-4 rounded-xl bg-driveway-charcoal border border-white/10 text-white text-sm focus:outline-none focus:border-driveway-gold">
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Electric">Electric</option>
                   </select>
                </div>
                <div>
                   <label class="text-xs font-semibold uppercase text-gray-400 mb-2 block">Transmission</label>
                   <select #carTrans class="w-full h-12 px-4 rounded-xl bg-driveway-charcoal border border-white/10 text-white text-sm focus:outline-none focus:border-driveway-gold">
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                   </select>
                </div>
                <div>
                   <label class="text-xs font-semibold uppercase text-gray-400 mb-2 block">Cinema Display Image URL</label>
                   <input #carImage type="text" placeholder="Unsplash/Picsum image link..." value="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1000&auto=format&fit=crop" class="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-driveway-gold" />
                </div>
             </div>

             <div class="flex justify-end gap-3">
                <button (click)="showAddForm.set(false)" class="px-6 py-3 border border-white/10 text-white rounded-full text-sm font-semibold hover:bg-white/5 transition-colors">Discard</button>
                <button id="submit-vehicle-btn" (click)="submitNewVehicle(carMake.value, carModel.value, carYear.value, carPrice.value, carMileage.value, carLocation.value, carFuel.value, carTrans.value, carImage.value)" class="px-8 py-3 bg-driveway-cyan text-black rounded-full text-sm font-semibold hover:bg-cyan-400 transition-colors">Dispatch to Field Inspectors</button>
             </div>
          </div>
       }

       <!-- ONBOARDING TRUST CHECK SYSTEM (KYC VERIFICATION) -->
       @if(hasCorporateKYCCompleted()) {
          <div class="mb-12 glass-panel p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between gap-6">
             <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 border border-emerald-400/20">
                   <mat-icon class="text-xl">domain_verification</mat-icon>
                </div>
                <div class="text-left">
                   <h3 class="font-display font-semibold text-white">CAC Dealership Verified</h3>
                   <p class="text-xs text-gray-400 font-light">Your corporate tax identification TIN and incorporation certificates have been cleared by state admin.</p>
                </div>
             </div>
             <span class="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full font-bold uppercase tracking-widest flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Active Dealer</span>
          </div>
       } @else {
          <div class="mb-12 glass-panel p-8 rounded-2xl border border-driveway-cyan/20 bg-driveway-cyan/[0.03] text-left animate-fade-in relative overflow-hidden">
             <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-driveway-cyan/5 rounded-full blur-[80px]"></div>
             <div class="relative z-10">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                   <div class="flex items-start gap-4">
                      <div class="w-14 h-14 rounded-2xl bg-driveway-cyan/10 border border-driveway-cyan/20 flex items-center justify-center text-driveway-cyan shrink-0">
                         <mat-icon>domain</mat-icon>
                      </div>
                      <div>
                         <h3 class="font-display font-medium text-lg text-white">Unlock Professional Dealership Credentials</h3>
                         <p class="text-xs text-gray-400 font-light mt-1 max-w-2xl">
                            Corporate dealerships get prioritized physical inspections, lowered platform commissions, and prominent "Gold Badge Dealer" tags on public car rails. Submit CAC Certificate of Incorporation & Business Premises Proofs.
                         </p>
                      </div>
                   </div>
                   
                   @if (kycSubmitted()) {
                      <div class="shrink-0">
                         <span class="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 font-medium text-xs tracking-wider flex items-center gap-2">
                             <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Corporate KYC Review Pending
                         </span>
                         <span class="text-[10px] text-gray-500 text-center block mt-1.5">Checked real-time on Admin platform</span>
                      </div>
                   } @else {
                      <button id="kyc-submit-trigger" (click)="showKYCForm.set(!showKYCForm())" class="bg-driveway-cyan text-black px-6 py-3 rounded-full font-medium text-sm flex items-center gap-2 hover:bg-cyan-400 transition-colors shrink-0">
                         <mat-icon>verified_user</mat-icon> {{ showKYCForm() ? 'Hide Registration Form' : 'Register Corporate Credentials' }}
                      </button>
                   }
                </div>
                
                <!-- Interrelated Multi-field Verification Inputs Panel -->
                 @if (showKYCForm() && !kycSubmitted()) {
                    <div class="mt-8 p-6 bg-white/[0.02] border border-white/5 rounded-2xl animate-fade-in text-xs space-y-6">
                       <h4 class="font-display font-semibold text-white tracking-wider uppercase text-[10px] text-driveway-gold">Ecosystem Security Profile Application Form</h4>
                       
                       <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                             <label class="text-gray-400 mb-1.5 block font-bold uppercase tracking-wide text-[9px]">Full Legal Representative Name</label>
                             <input #valRepName type="text" value="Jordan Williams" class="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-driveway-cyan font-sans" />
                          </div>
                          <div>
                             <label class="text-gray-400 mb-1.5 block font-bold uppercase tracking-wide text-[9px]">Trade/Dealership Name</label>
                             <input #valRepBiz type="text" value="AutoHub Premium Motors" class="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-driveway-cyan font-sans" />
                          </div>
                          <div>
                             <label class="text-gray-400 mb-1.5 block font-bold uppercase tracking-wide text-[9px]">Representative NIN / PVC Number</label>
                             <input #valRepId type="text" value="NIN-2938485-Y" class="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-driveway-cyan font-sans" />
                          </div>
                       </div>

                       <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                             <label class="text-gray-400 mb-1.5 block font-bold uppercase tracking-wide text-[9px]">Showroom Physical Address</label>
                             <input #valRepAddr type="text" value="Plot 104, Lekki Phase 1, Lagos" class="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-driveway-cyan font-sans" />
                          </div>
                          <div>
                             <label class="text-gray-400 mb-1.5 block font-bold uppercase tracking-wide text-[9px]">CAC Incorporation Number</label>
                             <input #valRepCAC type="text" value="RC-4903328" class="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-driveway-cyan font-sans" />
                          </div>
                          <div>
                             <label class="text-gray-400 mb-1.5 block font-bold uppercase tracking-wide text-[9px]">Federal Tax Code (TIN)</label>
                             <input #valRepTIN type="text" value="TIN-904322-A" class="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-driveway-cyan font-sans" />
                          </div>
                       </div>

                       <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pb-4">
                          <div>
                             <label class="text-gray-400 mb-1.5 block font-bold uppercase tracking-wide text-[9px]">Secure Payout Bank Name</label>
                             <select #valRepBank class="w-full h-10 px-3 rounded-lg bg-driveway-charcoal border border-white/10 text-white font-sans">
                                <option value="Access Bank PLC">Access Bank PLC</option>
                                <option value="Guaranty Trust Bank (GTBank)">Guaranty Trust Bank</option>
                                <option value="Zenith Bank Nigeria">Zenith Bank Nigeria</option>
                             </select>
                          </div>
                          <div>
                             <label class="text-gray-400 mb-1.5 block font-bold uppercase tracking-wide text-[9px]">Naira Bank Account Number</label>
                             <input #valRepAcct type="text" value="0122938485" class="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-driveway-cyan font-sans" />
                          </div>
                          <div>
                             <label class="text-gray-400 mb-1.5 block font-bold uppercase tracking-wide text-[9px]">Upload Verification Documents Slips</label>
                             <div class="h-10 px-3 bg-white/5 border border-dashed border-white/10 rounded-lg flex items-center justify-between text-[11px] text-gray-300 font-mono">
                                <span class="flex items-center gap-1.5"><mat-icon class="text-sm">backup</mat-icon> NIN_Slip & CAC_RC.pdf Attached ✓</span>
                                <span class="text-emerald-400 font-bold uppercase text-[9px]">Ready</span>
                             </div>
                          </div>
                       </div>

                       <div class="pt-4 border-t border-white/5 flex justify-end gap-3.5">
                          <button (click)="showKYCForm.set(false)" class="px-5 py-2.5 border border-white/10 text-white hover:bg-white/5 rounded-full font-semibold">Cancel</button>
                          <button (click)="submitKYCRequest(valRepName.value, valRepBiz.value, valRepId.value, valRepAddr.value, '+234 81 0522 9384', valRepCAC.value, valRepTIN.value, valRepBank.value, valRepAcct.value)" class="px-7 py-2.5 bg-driveway-gold hover:bg-amber-400 transition-colors text-black rounded-full font-bold uppercase tracking-wider">
                             Dispatch Secure Verification Request
                          </button>
                       </div>
                    </div>
                 }

                 <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/5 text-xs text-gray-400 font-light">
                   <div class="flex items-center gap-2">
                      <mat-icon class="text-[16px] w-4 h-4 text-driveway-cyan">check_circle</mat-icon> Automatic CAC incorporation compliance checks
                   </div>
                   <div class="flex items-center gap-2">
                      <mat-icon class="text-[16px] w-4 h-4 text-driveway-cyan">check_circle</mat-icon> Direct payout release routing checks
                   </div>
                   <div class="flex items-center gap-2">
                      <mat-icon class="text-[16px] w-4 h-4 text-driveway-cyan">check_circle</mat-icon> 24-hour physical inspector scheduling
                   </div>
                </div>
             </div>
          </div>
       }

       <!-- ANALYTICAL CARDS -->
       <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 text-left">
          <div class="glass-panel p-6 rounded-2xl border-l-[3px] border-l-amber-500 flex flex-col justify-between h-36">
             <div class="flex items-center gap-3 text-gray-400">
                <mat-icon>pending_actions</mat-icon>
                <span class="text-xs font-semibold uppercase tracking-wider">Awaiting Verification</span>
             </div>
             <div>
                <span class="text-4xl font-light text-white block">{{ pendingInspectionList().length }}</span>
                <span class="text-[10px] text-gray-500">Cars awaiting physical report</span>
             </div>
          </div>
          <div class="glass-panel p-6 rounded-2xl border-l-[3px] border-l-driveway-cyan flex flex-col justify-between h-36">
             <div class="flex items-center gap-3 text-driveway-cyan">
                <mat-icon>policy</mat-icon>
                <span class="text-xs font-semibold uppercase tracking-wider">Approved Listings</span>
             </div>
             <div>
                <span class="text-4xl font-light text-white block">{{ activeApprovedCount() }}</span>
                <span class="text-[10px] text-gray-500">Published to public view</span>
             </div>
          </div>
          <div class="glass-panel p-6 rounded-2xl border-l-[3px] border-l-driveway-gold flex flex-col justify-between h-36 bg-driveway-gold/[0.02]">
             <div class="flex items-center gap-3 text-driveway-gold">
                <mat-icon>account_balance_wallet</mat-icon>
                <span class="text-xs font-semibold uppercase tracking-wider">Escrow Balance</span>
             </div>
             <div>
                <span class="text-3xl font-display font-medium text-white block">₦ {{ activeEscrowBalance() }}M</span>
                <span class="text-[10px] text-driveway-gold">Escrow pool protects buyer</span>
             </div>
          </div>
          <div class="glass-panel p-6 rounded-2xl border-l-[3px] border-l-emerald-500 flex flex-col justify-between h-36">
             <div class="flex items-center gap-3 text-emerald-400">
                <mat-icon>monetization_on</mat-icon>
                <span class="text-xs font-semibold uppercase tracking-wider">Cleared Payouts</span>
             </div>
             <div>
                <span class="text-3xl font-light text-white block">₦ 160.0M</span>
                <span class="text-[10px] text-gray-500">Released to bank</span>
             </div>
          </div>
       </div>

       <!-- LAYOUT CONTAINER OF LISTINGS & ESCROW WORKFLOWS -->
       <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- LEFT/CENTER SECTIONS: LISTING INVENTORY TRACKING -->
          <div class="lg:col-span-2 space-y-8">
             <div class="glass-panel rounded-2xl border border-white/5 overflow-hidden text-left">
                <div class="p-6 border-b border-white/5 flex items-center justify-between bg-white/2">
                   <h3 class="font-display font-medium text-lg text-white">Listing Onboarding Inventory</h3>
                   <span class="text-xs text-gray-400">{{ getSellerScopeListings().length }} total vehicles registered</span>
                </div>
                
                <div class="divide-y divide-white/5">
                   @for(car of getSellerScopeListings(); track car.id) {
                      <div class="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-white/[0.02] transition-colors relative">
                         <div class="flex items-start gap-4">
                            <div class="w-20 h-14 rounded-lg overflow-hidden bg-driveway-black shrink-0 relative">
                               <img [src]="car.image" class="w-full h-full object-cover" />
                            </div>
                            <div>
                               <h4 class="font-display font-medium text-white text-base">{{ car.year }} {{ car.make }} {{ car.model }}</h4>
                               <p class="text-xs text-gray-400 font-mono mt-1">₦{{ car.price }} &middot; {{ car.mileage }} &middot; {{ car.location }}</p>
                               
                               @if (car.inspectionDetails; as details) {
                                  <div class="mt-2.5 flex items-center gap-2">
                                     <span class="px-2 py-0.5 bg-driveway-cyan/15 border border-driveway-cyan/30 text-[9px] text-driveway-cyan rounded font-bold uppercase tracking-widest flex items-center gap-1">
                                        🛡️ SCORE: {{ car.score }}%
                                     </span>
                                     <span class="text-[10px] text-gray-500 line-clamp-1 italic">"{{ details.inspectorNotes }}"</span>
                                  </div>
                               }
                            </div>
                         </div>

                         <div class="flex items-center gap-4 shrink-0 w-full md:w-auto md:justify-end">
                            <!-- Status Badging -->
                            @if (car.status === 'Approved') {
                               <span class="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                  <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Active Showroom
                               </span>
                            } @else if (car.status === 'Inspected') {
                               <div class="text-right">
                                  <span class="px-3 py-1.5 bg-driveway-cyan/15 text-driveway-cyan border border-driveway-cyan/30 rounded text-xs font-semibold uppercase tracking-wider">
                                     Check Completed
                                  </span>
                                  <span class="text-[9px] text-gray-500 block mt-1">Awaiting admin publication approval</span>
                               </div>
                            } @else {
                               <div class="text-right">
                                  <span class="px-3 py-1.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded text-xs font-medium uppercase tracking-wider">
                                     Inspection Scheduled
                                  </span>
                                  <span class="text-[9px] text-gray-500 block mt-1">Visit assigned to field officer</span>
                               </div>
                            }
                         </div>
                      </div>
                   } @empty {
                      <div class="p-12 text-center text-gray-500">
                         <mat-icon class="text-4xl mb-2">car_rental</mat-icon>
                         <p class="text-sm">No vehicles submitted yet. Submit a vehicle above to see physical report logs.</p>
                      </div>
                   }
                </div>
             </div>
          </div>

          <!-- RIGHT SECTION: ACTIVE ESCROW AGREEMENTS (REAL PROTOCOLS SIMULATION) -->
          <div class="space-y-8 text-left">
             <div class="glass-panel rounded-2xl border border-white/5 overflow-hidden">
                <div class="p-6 bg-white/2 border-b border-white/5">
                   <h3 class="font-display font-medium text-lg text-white">Escrow Payment Protection</h3>
                   <p class="text-[11px] text-gray-400 font-light mt-1">Admin released funds directly once matching delivery is completed</p>
                </div>

                <div class="p-6 divide-y divide-white/5 space-y-6">
                   @for (tx of getSellerTransactions(); track tx.id) {
                      <div class="pt-4 first:pt-0 space-y-4">
                         <div class="flex items-start justify-between">
                            <div>
                               <span class="text-[10px] text-gray-500 font-mono">ORDER ID: {{ tx.id }}</span>
                               <h4 class="font-display font-medium text-white text-sm mt-0.5">{{ tx.vehicleName }}</h4>
                               <span class="text-xs text-driveway-gold font-mono font-medium block mt-1">Payout Pool: ₦{{ tx.price }}</span>
                            </div>

                            <span class="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider"
                                  [ngClass]="{
                                    'bg-amber-500/10 text-amber-500 border border-amber-500/20': tx.status === 'Funds Held',
                                    'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20': tx.status === 'In Transit',
                                    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20': tx.status === 'Completed' || tx.status === 'Delivered',
                                    'bg-red-500/10 text-red-500 border border-red-500/20': tx.status === 'Disputed'
                                  }">
                               {{ tx.status }}
                            </span>
                         </div>

                         <!-- Interactive Shipping Simulation Buttons -->
                         @if (tx.status === 'Funds Held') {
                            <button (click)="advanceTx(tx.id, 'In Transit')" class="w-full py-2 bg-driveway-cyan text-black hover:bg-cyan-400 transition-colors rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5">
                               <mat-icon class="text-[16px] w-4 h-4">local_shipping</mat-icon> Dispatch Vehicles for Delivery
                            </button>
                         } @else if (tx.status === 'In Transit') {
                            <button (click)="advanceTx(tx.id, 'Delivered')" class="w-full py-2 bg-emerald-500 text-black hover:bg-emerald-400 transition-colors rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5">
                               <mat-icon class="text-[16px] w-4 h-4">assignment_turned_in</mat-icon> Confirm Delivery at Site Location
                            </button>
                         } @else if (tx.status === 'Delivered') {
                            <div class="p-3 bg-white/5 rounded-xl text-[11px] text-gray-400 italic text-center border border-white/5">
                               Awaiting buyer satisfaction sign-off to release payout.
                            </div>
                         } @else if (tx.status === 'Completed') {
                            <div class="flex gap-2 items-center text-xs text-emerald-400 bg-emerald-500/10 p-3 rounded-xl">
                               <mat-icon class="text-emerald-400 text-[18px]">verified</mat-icon>
                               <span>Ecosystem Cleared: ₦{{ tx.price }} credited to your bank.</span>
                            </div>
                         }
                      </div>
                   } @empty {
                      <div class="p-6 text-center text-gray-500 text-xs">
                         <mat-icon class="text-3xl mb-1">lock_clock</mat-icon>
                         <p>No active escrow security transactions. Once a buyer clicks order on physical card page, transactions list instantly here.</p>
                      </div>
                   }
                </div>
             </div>
          </div>

       </div>
    </div>
    }
  `
})
export class SellerDashboardComponent {
  platformState = inject(PlatformStateService);

  isLoggedIn = signal<boolean>(false);
  showAddForm = signal<boolean>(false);
  kycSubmitted = signal<boolean>(false);
  showKYCForm = signal<boolean>(false);

  constructor() {
    effect(() => {
      const session = this.platformState.getSession();
      if (session && session.role === 'Seller' && session.status === 'Approved') {
        this.isLoggedIn.set(true);
      } else {
        this.isLoggedIn.set(false);
      }
    });
  }

  onDealerSubmitLogin(cacValue: string) {
    // If they supplied a specific registered CAC in the text box
    const foundUserInRoster = this.platformState.getUsers().find(u => 
      u.role === 'Seller' && (u.cacNumber === cacValue || u.cacNumber?.includes(cacValue))
    );
    if (foundUserInRoster) {
      if (foundUserInRoster.status === 'Approved') {
        this.platformState.setSession(foundUserInRoster);
        this.isLoggedIn.set(true);
      } else {
        alert('This dealership registration is currently pending manual vetting. Use the central Auth channel at /auth to view review status!');
      }
    } else {
      // Direct login to approved preloaded seller (Chidi Okafor)
      const session = this.platformState.loginAs('seller@driveway.ng', 'Seller');
      if (session) {
        this.isLoggedIn.set(true);
      }
    }
  }

  // Computed counts
  getSellerScopeListings = computed(() => {
    // Return listings made by current simulated user
    return this.platformState.getListings().filter(v => v.ownerId === 's_current' || v.ownerId === 's1');
  });

  pendingInspectionList = computed(() => {
    return this.getSellerScopeListings().filter(v => v.status === 'Pending Inspection');
  });

  activeApprovedCount = computed(() => {
    return this.getSellerScopeListings().filter(v => v.status === 'Approved').length;
  });

  // Calculate simulated escrow balance protecting sellers
  activeEscrowBalance = computed(() => {
    const list = this.getSellerTransactions().filter(tx => tx.status !== 'Completed');
    let total = 45.2; // default initial mock
    list.forEach(tx => {
      const parsedPrice = parseFloat(tx.price.replace(/,/g, '')) / 1000000;
      if (!isNaN(parsedPrice)) {
         total += parsedPrice;
      }
    });
    return total.toFixed(1);
  });

  // Active corporate onboarding state sync matching Admin actions
  hasCorporateKYCCompleted = computed(() => {
    const requests = this.platformState.getKYCRequests();
    // Pre-seed search: See if matrix dealership is approved
    const match = requests.find(req => req.id === 'kyc-1');
    return match ? match.status === 'Approved' : false;
  });

  getSellerTransactions = computed(() => {
    return this.platformState.getTransactions().filter(t => t.sellerName === 'AutoHub Prime' || t.sellerName === 's_current');
  });

  toggleAddVehicleForm() {
    this.showAddForm.set(!this.showAddForm());
  }

  // CAC File upload initiation simulated trigger
  submitKYCRequest(fullName: string, bizName: string, idNum: string, address: string, phone: string, cac: string, tin: string, bank: string, acct: string) {
     this.kycSubmitted.set(true);
     this.platformState.addKYCRequest({
        id: 'kyc-1',
        fullName: fullName || 'Jordan Williams',
        businessName: bizName || 'AutoHub Premium Motors',
        type: cac ? 'Dealer' : 'Individual',
        status: 'Pending',
        cacNumber: cac || 'RC-4903328',
        taxId: tin || 'TIN-904322-A',
        address: address || 'Plot 104, Lekki Phase 1, Lagos',
        phone: phone || '+234 81 0522 9384',
        submittedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        documents: [
           { name: 'NIN_Identity_Card_Slip.png', type: 'Identity Verification' },
           cac ? { name: 'CAC_Incorporation_RC.pdf', type: 'Incorporation Document' } : { name: 'Utility_Bill.pdf', type: 'Utility Slip' }
        ],
        identityCardNumber: idNum || 'NIN-2938485-Y',
        bankName: bank || 'Access Bank PLC',
        bankAccountNumber: acct || '0122938485'
     });
  }

  // Add listing
  submitNewVehicle(make: string, model: string, year: string, price: string, mileage: string, location: string, fuel: string, transmission: string, imageUrl: string) {
     if (!make || !model || !price) {
        alert('Please fill out Brand/Make, Model, and Price fields.');
        return;
     }

     this.platformState.addListing({
        image: imageUrl || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1000&auto=format&fit=crop',
        year: year || '2021',
        make,
        model,
        price,
        mileage: mileage || '10,000 mi',
        location: location || 'Lekki, Lagos',
        dealer: 'AutoHub Prime',
        fuel: fuel || 'Petrol',
        transmission: transmission || 'Automatic',
        financeAvailable: true
     });

     this.showAddForm.set(false);
  }

  // Admin escrow states transition dispatch
  advanceTx(id: string, nextStatus: 'In Transit' | 'Delivered' | 'Completed' | 'Disputed' | 'Refunded') {
     this.platformState.advanceTransaction(id, nextStatus);
  }
}
