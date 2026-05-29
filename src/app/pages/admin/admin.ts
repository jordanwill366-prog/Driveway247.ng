import { Component, signal, inject, computed, effect } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PlatformStateService } from '../../services/platform-state';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [MatIconModule, NgClass],
  template: `
    @if (!isLoggedIn()) {
       <div class="min-h-screen bg-driveway-black flex flex-col justify-center items-center py-20 px-6 font-sans">
          <div class="max-w-md w-full glass-panel bg-driveway-charcoal border border-red-500/10 rounded-3xl p-8 shadow-[0_40px_80px_rgba(255,0,0,0.15)] relative overflow-hidden text-left animate-luxury-reveal border-t-2 border-t-[#ef4444]">
             <div class="absolute -top-10 -left-10 w-40 h-40 bg-[#ef4444]/5 rounded-full blur-3xl pointer-events-none"></div>
             <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-red-700/[0.04] rounded-full blur-3xl pointer-events-none"></div>

             <div class="flex items-center gap-3.5 mb-8">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ef4444] to-red-900 flex items-center justify-center shadow-lg shadow-[#ef4444]/10">
                   <mat-icon class="text-white">security</mat-icon>
                </div>
                <div>
                   <span class="text-[9px] font-mono font-bold tracking-widest text-[#ef4444] uppercase block">Admin Workspace Console</span>
                   <h2 class="text-lg font-display font-bold text-white tracking-tight">OPERATIONAL BACKBONE</h2>
                </div>
             </div>

             <h3 class="text-base font-semibold text-white mb-2">Biometric Passcode Override</h3>
             <p class="text-xs text-gray-400 mb-6 font-light leading-relaxed">
                Connect your secure hardware ledger or insert administrative master access tokens. All manual state actions will instantly dispatch across regional live systems.
             </p>

             <div class="space-y-4 font-sans text-left">
                <div>
                   <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Administrative Token Signature</label>
                   <input #adminId type="text" value="ADM-SECURE-ADMIN-BYPASS" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#ef4444] font-sans" />
                </div>
                <div>
                   <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Administrator Security Key</label>
                   <input type="password" value="••••••••••••••••" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#ef4444] font-sans" />
                </div>

                <div class="bg-black/40 border border-white/5 rounded-xl p-3.5 text-[10px] text-gray-500 space-y-1.5 font-mono">
                   <div class="flex items-center gap-1.5 text-[#ef4444]">
                      <mat-icon class="text-xs w-3.5 h-3.5 text-[#ef4444]">gavel</mat-icon> System Audit Level: High-Trust Secure Operations
                   </div>
                </div>

                <button (click)="onAdminSubmitLogin(adminId.value)" class="w-full h-12 bg-[#ef4444] hover:bg-red-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mt-4 shadow-lg shadow-[#ef4444]/20">
                   <mat-icon class="text-sm">gavel</mat-icon> Verify Administrative Access
                </button>
             </div>
          </div>
       </div>
    } @else {
       <div class="min-h-screen pt-28 px-6 max-w-7xl mx-auto pb-24">
       <!-- Operations center main heading -->
       <div class="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
             <span class="text-xs font-semibold tracking-widest text-[#ef4444] uppercase mb-2 block font-mono">Operations Control Panel</span>
             <h1 class="text-4xl font-display font-medium text-white">Platform Command Center</h1>
          </div>
          <div class="flex items-center gap-3">
             <div class="px-4 py-2 bg-[#ef4444]/15 border border-[#ef4444]/30 text-[#ef4444] text-xs font-mono font-medium rounded-full flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                Threat Level Monitor: Secured
             </div>
          </div>
       </div>

       <!-- QUICK ANALYTICAL SUMMARY CARDS -->
       <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 text-left">
          <div class="glass-panel p-6 rounded-xl border-l-[3px] border-l-driveway-cyan">
             <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 block">Held Escrows Pool</span>
             <span class="text-3xl font-display font-medium text-white">{{ heldEscrowTotal() }}M</span>
             <p class="text-[10px] text-gray-500 mt-2">Held securely under active contracts</p>
          </div>
          <div class="glass-panel p-6 rounded-xl border-l-[3px] border-l-amber-500">
             <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 block">Pending KYC reviews</span>
             <span class="text-3xl font-display font-medium text-white">{{ pendingKYCCount() }}</span>
             <p class="text-[10px] text-gray-500 mt-2">CAC corporation records awaiting verification</p>
          </div>
          <div class="glass-panel p-6 rounded-xl border-l-[3px] border-l-driveway-gold">
             <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 block">Unlisted Approved Cars</span>
             <span class="text-3xl font-display font-medium text-white">{{ pendingModerationCount() }}</span>
             <p class="text-[10px] text-gray-500 mt-2">Inspected cars awaiting public release</p>
          </div>
          <div class="glass-panel p-6 rounded-xl border-l-[3px] border-l-[#ef4444] bg-[#ef4444]/[0.01]">
             <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 block">Contact Bypass Flagged</span>
             <span class="text-3xl font-display font-medium text-[#ef4444]">{{ bypassCount() }}</span>
             <p class="text-[10px] text-[#ef4444]">Offsite communication threats targeted</p>
          </div>
       </div>

       <!-- CONTROL TABS BAR -->
       <div class="flex gap-4 border-b border-white/10 mb-8 overflow-x-auto pb-4">
          <button (click)="activeTab.set('kyc')" [ngClass]="activeTab() === 'kyc' ? 'border-b-2 border-driveway-cyan text-driveway-cyan' : 'text-gray-400 hover:text-white border-b-2 border-transparent'" class="px-4 py-2 font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2">
             <mat-icon class="text-base">assignment_ind</mat-icon> Dealer KYC & CAC Approvals ({{ pendingKYCCount() }})
          </button>
          <button (click)="activeTab.set('moderation')" [ngClass]="activeTab() === 'moderation' ? 'border-b-2 border-driveway-cyan text-driveway-cyan' : 'text-gray-400 hover:text-white border-b-2 border-transparent'" class="px-4 py-2 font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2">
             <mat-icon class="text-base">gavel</mat-icon> Listing Publication Board ({{ pendingModerationCount() }})
          </button>
          <button (click)="activeTab.set('escrow')" [ngClass]="activeTab() === 'escrow' ? 'border-b-2 border-driveway-cyan text-driveway-cyan' : 'text-gray-400 hover:text-white border-b-2 border-transparent'" class="px-4 py-2 font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2">
             <mat-icon class="text-base">payments</mat-icon> Escrow Payout Console
          </button>
          <button (click)="activeTab.set('bypass')" [ngClass]="activeTab() === 'bypass' ? 'border-b-2 border-[#ef4444] text-[#ef4444]' : 'text-gray-400 hover:text-white border-b-2 border-transparent'" class="px-4 py-2 font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2">
             <mat-icon class="text-base text-inherit">report_problem</mat-icon> Bypass Threat Monitor Feed ({{ bypassCount() }})
          </button>
       </div>

       <!-- DYNAMIC TAB PANELS -->
       <div class="glass-panel p-8 rounded-2xl border border-white/5 bg-driveway-black/40 text-left relative z-20">
          
          <!-- TAB 1: KYC APPROVED/PENDING BOARD -->
          @if (activeTab() === 'kyc') {
             <div class="space-y-6">
                <div>
                   <h3 class="text-lg font-display font-semibold text-white">Dealer Registration & CAC Clearances</h3>
                   <p class="text-xs text-gray-400 mt-1">Review government slips, certificate of incorporation and physical business premises validation documents.</p>
                </div>

                <div class="divide-y divide-white/5">
                   @for (req of getKYCRequests(); track req.id) {
                      <div class="py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 first:pt-0 pb-5">
                         <div>
                            <div class="flex items-center gap-2.5">
                               <h4 class="font-display font-medium text-white text-base">{{ req.businessName || req.fullName }}</h4>
                               <span [ngClass]="req.type === 'Dealer' ? 'bg-driveway-cyan/15 text-driveway-cyan border-driveway-cyan/35' : 'bg-white/10 text-white border-white/10'" class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border">
                                  {{ req.type }}
                               </span>
                            </div>
                            <p class="text-xs text-gray-400 mt-2 font-mono">Location: {{ req.address }} &middot; Phone: {{ req.phone }} &middot; Submitted: {{ req.submittedAt }}</p>
                            @if (req.cacNumber) {
                               <p class="text-xs text-driveway-gold font-mono mt-1.5 font-medium">CAC Incorporation: {{ req.cacNumber }} &middot; TIN: {{ req.taxId }}</p>
                            }
                            @if (req.identityCardNumber || req.bankName) {
                               <div class="mt-3.5 p-4 rounded-xl bg-white/[0.02] border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                  <div class="space-y-1">
                                     <span class="text-gray-500 font-bold uppercase tracking-wide text-[8px] block">Representative Identity</span>
                                     <p class="text-gray-300">Name: <span class="text-white font-medium">{{ req.fullName }}</span></p>
                                     <p class="text-gray-400 font-mono">Government ID: {{ req.identityCardNumber || 'N/A' }}</p>
                                  </div>
                                  <div class="space-y-1 border-t md:border-t-0 md:border-l border-white/5 pt-2.5 md:pt-0 md:pl-4">
                                     <span class="text-gray-500 font-bold uppercase tracking-wide text-[8px] block">Settlement routing details</span>
                                     <p class="text-gray-300">Bank: <span class="text-driveway-cyan font-medium">{{ req.bankName }}</span></p>
                                     <p class="text-gray-400 font-mono">Naira Account: {{ req.bankAccountNumber || 'N/A' }}</p>
                                  </div>
                               </div>
                            }

                            <!-- Attachment PDF lists -->
                            <div class="flex flex-wrap gap-2 mt-3.5">
                               @for (doc of req.documents; track doc.name) {
                                  <span class="px-2.5 py-1 bg-white/[0.03] border border-white/10 rounded-lg text-[10px] text-gray-300 flex items-center gap-1.5 cursor-pointer hover:bg-white/5 transition-all">
                                     <mat-icon class="text-gray-400 text-[14px] w-3.5 h-3.5">attachment</mat-icon>
                                     {{ doc.name }} ({{ doc.type }})
                                  </span>
                               }
                            </div>
                         </div>

                         <div class="shrink-0">
                            @if (req.status === 'Pending') {
                               <div class="flex items-center gap-2.5">
                                  <button (click)="declineKYC(req.id)" class="px-4 py-2 border border-[#ef4444]/30 text-[#ef4444] rounded-lg text-xs font-semibold hover:bg-[#ef4444]/10 transition-colors">Decline Credentials</button>
                                  <button id="approve-kyc-btn" (click)="approveKYC(req.id)" class="px-5 py-2 bg-emerald-500 text-black rounded-lg text-xs font-bold hover:bg-emerald-400 transition-colors">Clear Dealership CAC ✓</button>
                               </div>
                            } @else if (req.status === 'Approved') {
                               <span class="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase rounded tracking-wider flex items-center gap-1">
                                  <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> Corporate Cleared
                               </span>
                            } @else {
                               <span class="px-3 py-1.5 bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold uppercase rounded tracking-wider">
                                  Rejected Onboarding
                               </span>
                            }
                         </div>
                      </div>
                   } @empty {
                      <div class="py-12 text-center text-gray-500">
                         No active dealership registration records in system directory.
                      </div>
                   }
                </div>
             </div>
          }

          <!-- TAB 2: INSPECTED MODERATION APPROVALS -->
          @if (activeTab() === 'moderation') {
             <div class="space-y-6">
                <div>
                   <h3 class="text-lg font-display font-semibold text-white">Inspected Listing Moderation Queue</h3>
                   <p class="text-xs text-gray-400 mt-1">Inspected vehicles with logged mechanic findings scorecard awaiting admin publication clearances.</p>
                </div>

                <div class="divide-y divide-white/5">
                   @for (car of pendingInspectedListings(); track car.id) {
                      <div class="py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 first:pt-0 pb-5">
                         <div class="flex items-start gap-4">
                            <div class="w-16 h-12 rounded overflow-hidden bg-driveway-black shrink-0">
                               <img [src]="car.image" alt="Inspected Car Image" class="w-full h-full object-cover" />
                            </div>
                            <div>
                               <h4 class="font-display font-medium text-white text-base">{{ car.year }} {{ car.make }} {{ car.model }}</h4>
                               <p class="text-xs text-gray-400 mt-1 font-mono">Dealer: {{ car.dealer }} &middot; Price: ₦{{ car.price }} &middot; Location: {{ car.location }}</p>
                               <div class="mt-2.5 flex items-center gap-2 flex-wrap">
                                  <span class="px-2 py-0.5 bg-driveway-cyan/15 border border-driveway-cyan/35 text-[9px] text-driveway-cyan rounded font-bold font-mono">
                                     AUTHENTICITY MATCH: {{ car.score }}% Perfect Score
                                  </span>
                                  <span class="text-[10px] text-gray-500 italic">Report Checklist notes: "{{ car.inspectionDetails?.inspectorNotes }}"</span>
                               </div>
                            </div>
                         </div>

                         <div class="shrink-0">
                            <button id="publish-listing-btn" (click)="approveListing(car.id)" class="px-5 py-2 bg-driveway-gold text-black rounded-lg text-xs font-bold hover:bg-amber-400 transition-colors flex items-center gap-1.5">
                               <mat-icon class="text-[14px] w-3.5 h-3.5">publish</mat-icon> Approve & Publish to discovery
                            </button>
                         </div>
                      </div>
                   } @empty {
                      <div class="py-12 text-center text-gray-500">
                         <mat-icon class="text-4xl mb-2">dashboard_customize</mat-icon>
                         <p class="text-sm">No Inspected listings awaiting authorization. When inspectors submit a report scorecard, they appear directly in this approval room!</p>
                      </div>
                   }
                </div>

                <!-- Secondary Operations Panel: Outbound Assignments Queue -->
                <div class="mt-12 pt-8 border-t border-white/5 space-y-4 animate-fade-in">
                   <div class="text-left">
                      <h3 class="text-base font-display font-medium text-white flex items-center gap-2">
                         <mat-icon class="text-driveway-cyan font-semibold">build_circle</mat-icon> Physical Inspector Dispatch Office
                      </h3>
                      <p class="text-xs text-gray-400 mt-0.5 font-sans">Assign certified field inspection officers to run the 150-point physical checkup on recently added cars.</p>
                   </div>

                   <div class="divide-y divide-white/5 font-sans text-left">
                      @for (car of listingsAwaitingInspection(); track car.id) {
                         <div class="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/[0.02] last:border-0 animate-fade-in">
                            <div class="flex items-center gap-3">
                               <div class="w-12 h-9 rounded overflow-hidden bg-driveway-black text-xs shrink-0 font-sans font-medium">
                                  <img [src]="car.image" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
                               </div>
                               <div class="text-left font-sans">
                                  <h4 class="font-display font-semibold text-white text-sm block leading-none mb-1">{{ car.year }} {{ car.make }} {{ car.model }}</h4>
                                  <span class="text-[11px] text-gray-500 block">Location: {{ car.location }} &middot; Price: ₦{{ car.price }}</span>
                               </div>
                            </div>

                            <div class="flex items-center gap-3.5 w-full md:w-auto font-sans">
                               @if (car.assignedInspectorName) {
                                  <div class="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] flex items-center gap-1 font-mono font-bold">
                                     <mat-icon class="text-xs text-emerald-400">task_alt</mat-icon> Assigned: {{ car.assignedInspectorName }}
                                  </div>
                               } @else {
                                  <div class="flex items-center gap-2 font-sans text-xs">
                                     <span class="text-[10px] text-gray-400 uppercase font-bold pr-1">Select Agency Officer</span>
                                     <select #officerSelect class="h-9 px-2 bg-driveway-charcoal border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-driveway-cyan">
                                        <option value="Frank Adebayo">Frank Adebayo (FLD-9022)</option>
                                        <option value="Sola Williams">Sola Williams (FLD-1044)</option>
                                        <option value="Ibrahim Bello">Ibrahim Bello (Abuja Field Hub)</option>
                                     </select>
                                     <button id="assign-officer-btn" (click)="assignInspector(car.id, 'ins-12', officerSelect.value)" class="h-9 px-4 bg-driveway-cyan hover:bg-cyan-400 transition-colors text-black rounded-lg text-xs font-bold font-sans">
                                        Assign Officer ✓
                                     </button>
                                  </div>
                               }
                            </div>
                         </div>
                      } @empty {
                         <div class="p-4 bg-white/[0.02] border border-white/5 text-center text-gray-400 text-xs rounded-xl italic font-light w-full">
                            All registered marketplace listings have active inspector officer assignments.
                         </div>
                      }
                   </div>
                </div>
             </div>
          }

          <!-- TAB 3: ESCROW ACTIVE TRANSITS & PAYOUTS -->
          @if (activeTab() === 'escrow') {
             <div class="space-y-6">
                <div>
                   <h3 class="text-lg font-display font-semibold text-white">Active Escrows & Payout Clearances</h3>
                   <p class="text-xs text-gray-400 mt-1">Escrow payment pool locks money during seller dispatch. Funds released once buyers receive shipment.</p>
                </div>

                <div class="divide-y divide-white/5">
                   @for (tx of getTransactions(); track tx.id) {
                      <div class="py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 first:pt-0 pb-5">
                         <div>
                            <div class="flex items-center gap-2.5">
                               <span class="text-xs font-mono text-gray-500">ID: {{ tx.id }}</span>
                               <h4 class="font-display font-medium text-white text-base">{{ tx.vehicleName }}</h4>
                            </div>
                            <p class="text-xs text-gray-400 mt-2 font-mono">Buyer: {{ tx.buyerEmail }} &middot; Dealer/Seller: {{ tx.sellerName }}</p>
                            <p class="text-xs text-driveway-gold font-mono tracking-wide mt-1 font-semibold flex items-center gap-1">
                               <mat-icon class="text-[14px] w-3.5 h-3.5">payments</mat-icon> Locked Escrow Pool Contract Value: ₦{{ tx.price }}
                            </p>
                         </div>

                         <div class="shrink-0 flex items-center gap-4">
                            <div class="text-right">
                               <span class="px-3 py-1 bg-white/5 border border-white/10 text-[10px] text-gray-300 font-bold uppercase rounded mr-2">
                                  State: {{ tx.status }}
                               </span>
                            </div>

                            @if (tx.status === 'Delivered') {
                               <button id="payout-release-btn" (click)="releasePayout(tx.id)" class="px-5 py-2.5 bg-emerald-500 text-black rounded-lg text-xs font-bold hover:bg-emerald-400 transition-all flex items-center gap-1 shadow-[0_4px_15px_rgba(16,185,129,0.3)]">
                                  <mat-icon class="text-[14px] w-3.5 h-3.5">autorenew</mat-icon> Release Escrow Payout (₦{{ tx.price }})
                               </button>
                            } @else if (tx.payoutReleased || tx.status === 'Completed') {
                               <span class="px-3 py-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 rounded text-xs font-bold uppercase flex items-center gap-1">
                                  <mat-icon class="text-[16px] w-4 h-4">task_alt</mat-icon> Payout Released
                               </span>
                            } @else if (tx.status === 'Funds Held') {
                               <div class="flex items-center gap-2 font-sans">
                                  <select #partnerSelect class="h-9 px-2 bg-driveway-black border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-driveway-gold">
                                     <option value="Chisco Express">Chisco Express Delivery</option>
                                     <option value="GIG Logistics">GIG Logistics Premium</option>
                                     <option value="Driveway Elite Carriers">Driveway Elite Carriers</option>
                                  </select>
                                  <button id="dispatch-approve-btn" (click)="approveDispatch(tx.id, 'partner-2', partnerSelect.value)" class="h-9 px-4 bg-driveway-gold hover:bg-amber-400 transition-colors text-black rounded-lg text-xs font-bold whitespace-nowrap">
                                     Approve Dispatch ✓
                                  </button>
                               </div>
                            } @else {
                               <span class="text-xs text-gray-400 font-medium whitespace-nowrap bg-white/[0.02] px-3 py-2 border border-white/5 rounded font-mono">
                                  Transit: {{ tx.status }}
                                </span>
                            }
                         </div>
                      </div>
                   } @empty {
                      <div class="py-12 text-center text-gray-500">
                         No escrow transactions found.
                      </div>
                   }
                </div>
             </div>
          }

          <!-- TAB 4: COMPLIANCE INTEGRATION & OFFSITE BYPASS LOGS -->
          @if (activeTab() === 'bypass') {
             <div class="space-y-6">
                <div>
                   <h3 class="text-lg font-display font-semibold text-white">Suspicious Bypass & Offsite Contact Threats</h3>
                   <p class="text-xs text-gray-400 mt-1">Automatic real-time monitor catching private numbers, WhatsApp prompts or emails attempting translation bypass.</p>
                </div>

                <div class="divide-y divide-white/5">
                   @for (log of getBypassLogs(); track log.id) {
                      <div class="py-5 flex flex-col md:flex-row items-start justify-between gap-6 first:pt-0 pb-5">
                         <div class="flex-1">
                            <div class="flex items-center gap-2">
                               <span class="px-2 py-0.5 bg-red-500/10 text-red-500 border border-red-500/30 font-mono text-[9px] font-bold rounded">LEVEL: {{ log.severity }}</span>
                               <span class="text-xs text-gray-500 font-mono">Log ID: {{ log.id }} &middot; {{ log.timestamp }}</span>
                            </div>
                            <h4 class="font-display font-medium text-white text-base mt-2">Attempt on listing: {{ log.vehicleName }}</h4>
                            
                            <div class="mt-3 bg-red-500/[0.03] border border-red-500/20 p-4 rounded-xl max-w-2xl font-mono text-xs">
                               <p class="text-gray-400 mb-1 font-bold text-[10px] text-red-400 uppercase tracking-widest">Flagged Content Intercepted:</p>
                               <span class="text-[#ef4444] font-medium font-sans">"{{ log.flaggedContent }}"</span>
                            </div>
                            
                            <p class="text-xs text-gray-400 mt-2 font-mono flex items-center gap-1.5 text-gray-300">
                               <mat-icon class="text-driveway-cyan text-[14px] w-3.5 h-3.5">shield</mat-icon> Action Conducted: {{ log.actionTaken }}
                            </p>
                         </div>

                         <div class="shrink-0 flex gap-2">
                            <span class="px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded font-bold text-[10px] uppercase tracking-wider">Warning Sent</span>
                         </div>
                      </div>
                   } @empty {
                      <div class="py-12 text-center text-gray-500">
                         <mat-icon class="text-5xl text-emerald-400 mb-3 animate-pulse">check</mat-icon>
                         <h4 class="font-display font-medium text-white text-base">Perfect Integrity Standing</h4>
                         <p class="text-xs text-gray-500 mt-1 max-w-sm mx-auto">Zero bypass attempts logged today. When users try typing WhatsApp numbers or contacts inside the dialog chats, they trigger immediate live compliance flags here.</p>
                      </div>
                   }
                </div>
             </div>
          }

       </div>
    </div>
    }
  `
})
export class AdminDashboardComponent {
  platformState = inject(PlatformStateService);

  isLoggedIn = signal<boolean>(false);
  activeTab = signal<'kyc' | 'moderation' | 'escrow' | 'bypass'>('kyc');

  constructor() {
    effect(() => {
      const session = this.platformState.getSession();
      if (session && session.role === 'Admin') {
        this.isLoggedIn.set(true);
      } else {
        this.isLoggedIn.set(false);
      }
    });
  }

  onAdminSubmitLogin(emailOrId: string) {
    const session = this.platformState.loginAs(emailOrId || 'command@driveway247.ng', 'Admin');
    if (session) {
      this.isLoggedIn.set(true);
    } else {
      alert('Administrative credentials not recognized. Try "command@driveway247.ng" for sandbox bypass.');
    }
  }

  // Multi-platform state streams reading directly from reactive PlatformStateService
  allListings = this.platformState.getListings;
  getKYCRequests = this.platformState.getKYCRequests;
  getTransactions = this.platformState.getTransactions;
  getBypassLogs = this.platformState.getBypassLogs;

  // Computed counters
  pendingKYCCount = computed(() => {
     return this.getKYCRequests().filter(req => req.status === 'Pending').length;
  });

  pendingInspectedListings = computed(() => {
     return this.allListings().filter(car => car.status === 'Inspected');
  });

  listingsAwaitingInspection = computed(() => {
     return this.allListings().filter(car => car.status === 'Pending Inspection');
  });

  pendingModerationCount = computed(() => {
     return this.pendingInspectedListings().length;
  });

  bypassCount = computed(() => {
     return this.getBypassLogs().length;
  });

  heldEscrowTotal = computed(() => {
     const list = this.getTransactions().filter(tx => tx.status !== 'Completed');
     let total = 1.2; // base design index in billions
     
     // add dynamic order prices
     list.forEach(tx => {
       const parsedPrice = parseFloat(tx.price.replace(/,/g, '')) / 100000000;
       if (!isNaN(parsedPrice)) {
          total += parsedPrice;
       }
     });
     return total.toFixed(3);
  });

  // Action dispatches
  approveKYC(id: string) {
     this.platformState.approveKYC(id);
  }

  declineKYC(id: string) {
     this.platformState.declineKYC(id);
  }

  approveListing(id: string) {
     this.platformState.approveListing(id);
  }

  assignInspector(vehicleId: string, inspectorId: string, inspectorName: string) {
     this.platformState.assignInspector(vehicleId, inspectorId, inspectorName);
  }

  approveDispatch(txId: string, partnerId: string, partnerName: string) {
     this.platformState.approveDispatch(txId, partnerId, partnerName);
  }

  releasePayout(id: string) {
     this.platformState.advanceTransaction(id, 'Completed');
  }
}
