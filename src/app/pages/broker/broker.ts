import { Component, signal, inject, computed, effect } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PlatformStateService, SourcingRequest } from '../../services/platform-state';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-broker-dashboard',
  standalone: true,
  imports: [MatIconModule, NgClass],
  template: `
    @if (!isLoggedIn()) {
       <div class="min-h-screen bg-driveway-black flex flex-col justify-center items-center py-20 px-6 font-sans">
          <!-- Premium visual lock credentials screen -->
          <div class="max-w-md w-full glass-panel bg-driveway-charcoal border border-emerald-500/10 rounded-3xl p-8 shadow-[0_40px_80px_rgba(16,185,129,0.15)] relative overflow-hidden text-left animate-luxury-reveal border-t-2 border-t-[#10b981]">
             <div class="absolute -top-10 -left-10 w-40 h-40 bg-[#10b981]/5 rounded-full blur-3xl pointer-events-none"></div>
             
             <div class="flex items-center gap-3.5 mb-8">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10b981] to-emerald-950 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                   <mat-icon class="text-white text-base">connect_without_contact</mat-icon>
                </div>
                <div>
                   <span class="text-[9px] font-mono font-bold tracking-widest text-[#10b981] uppercase block">African Sourcing Alliance</span>
                   <h2 class="text-lg font-display font-bold text-white tracking-tight">VERIFIED BROKER NETWORK</h2>
                </div>
             </div>

             <h3 class="text-base font-semibold text-white mb-2">Secure Broker Entrance</h3>
             <p class="text-xs text-gray-400 mb-6 font-light leading-relaxed">
                Unlock buyer sourcing requests, propose vetted automotive findings with dynamic local commissions, and monitor escrow settlement releases.
              </p>

             <div class="space-y-4 font-sans text-left">
                <div>
                   <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Broker Registered Email Signature</label>
                   <input #brokerEmailInput type="text" value="alao.babs.broker@gmail.com" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#10b981] font-sans" />
                </div>
                <div>
                   <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Access Encryption Key</label>
                   <input type="password" value="••••••••••••••••" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#10b981] font-sans" />
                </div>

                <div class="bg-black/40 border border-white/5 rounded-xl p-3.5 text-[10px] text-gray-500 space-y-1.5 font-mono">
                   <div class="flex items-center gap-1.5 text-emerald-400">
                      <mat-icon class="text-xs w-3.5 h-3.5 text-emerald-400">verified</mat-icon> Alliance Standing: Verified Sourcing Agent (Level 2)
                   </div>
                   <p class="text-[9.5px]">Instant Approval Override check enabled for sandbox tests.</p>
                </div>

                <button (click)="onSubmitLogin(brokerEmailInput.value)" class="w-full h-12 bg-[#10b981] hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mt-4 shadow-lg shadow-emerald-500/20">
                   <mat-icon class="text-sm">lock_open</mat-icon> Verify Credentials signature
                </button>
             </div>
          </div>
       </div>
    } @else {
       <div class="min-h-screen pt-28 px-6 max-w-7xl mx-auto pb-24">
          <!-- Main Broker Portal Header -->
          <div class="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div class="text-left">
                <span class="text-xs font-semibold tracking-widest text-emerald-400 uppercase mb-2 block font-mono">Automotive Sourcing Alliance &bull; Lagos</span>
                <h1 class="text-4xl font-display font-medium text-white">Verified Broker Hub</h1>
                <p class="text-xs text-gray-400 mt-1 leading-relaxed">Match found import cars against hot buyer budgets. Earn escrow-protected margins on physical handovers.</p>
             </div>
             
             <div class="flex items-center gap-3">
                <span class="text-xs text-gray-400 font-mono">ID: BRK-ALAO-904</span>
                <div class="px-4 py-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium rounded-full flex items-center gap-2">
                   <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                   Standing: ACTIVE ALLIANCE ✓
                </div>
             </div>
          </div>

          <!-- ANALYTICAL DASHBOARD COUNTERS -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 text-left font-sans">
             <div class="glass-panel p-6 rounded-xl border-l-[3px] border-l-emerald-500">
                <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 block">Accumulated commission</span>
                <span class="text-3xl font-display font-medium text-white">₦{{ (commissionTotal() / 1000000).toFixed(2) }}M</span>
                <p class="text-[10px] text-gray-500 mt-2">Vetted and released payout from escrow</p>
             </div>
             
             <div class="glass-panel p-6 rounded-xl border-l-[3px] border-l-driveway-cyan">
                <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 block">Pending proposals</span>
                <span class="text-3xl font-display font-medium text-white">{{ pendingProposalsCount() }}</span>
                <p class="text-[10px] text-gray-500 mt-2">Offers active inside open buyer rooms</p>
             </div>

             <div class="glass-panel p-6 rounded-xl border-l-[3px] border-l-driveway-gold">
                <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 block">Active Sourcing Pool</span>
                <span class="text-3xl font-display font-medium text-white">{{ openRequestsCount() }}</span>
                <p class="text-[10px] text-gray-500 mt-2">Lagos & Abuja hot budgets looking for matches</p>
             </div>

             <div class="glass-panel p-6 rounded-xl border-l-[3px] border-l-purple-500">
                <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 block">Dissatisfaction Returns</span>
                <span class="text-3xl font-display font-medium text-white">0.0%</span>
                <p class="text-[10px] text-gray-500 mt-2">Faultless physical delivery health score</p>
             </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             <!-- LEFT DECK: Tab controllers & content panels -->
             <div class="lg:col-span-2 space-y-6 text-left">
                <!-- Tabs strip -->
                <div class="flex gap-4 border-b border-white/10 pb-4 overflow-x-auto">
                   <button (click)="activeTab.set('sourcing')" [ngClass]="activeTab() === 'sourcing' ? 'border-b-2 border-emerald-500 text-emerald-400' : 'text-gray-400 hover:text-white border-b-2 border-transparent'" class="px-4 py-2 font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer">
                      <mat-icon class="text-base">search</mat-icon> Sourcing Pool Requests ({{ openRequestsCount() }})
                   </button>
                   <button (click)="activeTab.set('proposals')" [ngClass]="activeTab() === 'proposals' ? 'border-b-2 border-emerald-500 text-emerald-400' : 'text-gray-400 hover:text-white border-b-2 border-transparent'" class="px-4 py-2 font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer">
                      <mat-icon class="text-base">drive_file_rename_outline</mat-icon> Submitted Pitch Offers ({{ myProposals().length }})
                   </button>
                   <button (click)="activeTab.set('checks')" [ngClass]="activeTab() === 'checks' ? 'border-b-2 border-emerald-500 text-emerald-400' : 'text-gray-400 hover:text-white border-b-2 border-transparent'" class="px-4 py-2 font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer">
                      <mat-icon class="text-base">verified_user</mat-icon> Vetting Verification & NIN
                   </button>
                </div>

                <!-- TAB 1: SOURCING REQUESTS LIST -->
                @if (activeTab() === 'sourcing') {
                   <div class="space-y-6">
                      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                         <div>
                            <h3 class="text-lg font-display font-medium text-white">Live Nigeria Sourcing Hot Board</h3>
                            <p class="text-xs text-gray-400 mt-0.5 font-light">Lagos, Abuja, and Port Harcourt verified buyers ready to slide money to secure escrow once a matching unit is proposed.</p>
                         </div>
                      </div>

                      <div class="space-y-4">
                         @for (req of sourcingRequests(); track req.id) {
                            <div class="glass-panel p-6 rounded-2xl border border-white/5 bg-driveway-black/40 hover:border-emerald-500/35 transition-all duration-300">
                               <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
                                  <div>
                                     <div class="flex items-center gap-3">
                                        <span class="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono">
                                           ₦{{ req.budgetNaira }} Budget
                                        </span>
                                        <span class="text-xs font-mono text-gray-500">ID: {{ req.id }}</span>
                                     </div>
                                     <h4 class="text-xl font-display font-medium text-white mt-3">{{ req.yearRange }} {{ req.vehicleMake }} {{ req.vehicleModel }}</h4>
                                     <p class="text-xs text-gray-300 mt-1 italic font-light font-sans">"{{ req.comments }}"</p>
                                     <div class="flex items-center gap-4 mt-4 font-mono text-[10.5px] text-gray-500">
                                        <span>Buyer: {{ req.buyerName }}</span>
                                        <span>&bull;</span>
                                        <span>Posted: {{ req.createdAt }}</span>
                                     </div>
                                  </div>

                                  <div class="shrink-0 w-full sm:w-auto">
                                     @if (req.status === 'Open') {
                                        <button (click)="selectRequestForProposal(req)" class="w-full sm:w-auto h-10 px-5 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 font-sans font-bold text-xs text-white uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-500/15">
                                           Pitch Match Vehicle ✓
                                        </button>
                                     } @else {
                                        <span class="px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-[10px] text-gray-500 font-bold uppercase tracking-wider block text-center font-mono">
                                           FULFILLED VIA PARTNER
                                        </span>
                                     }
                                  </div>
                               </div>

                               <!-- Proposal matching sub-form inside the card -->
                               @if (selectedRequestToPitch()?.id === req.id) {
                                  <div class="mt-6 pt-6 border-t border-white/10 space-y-4 animate-luxury-reveal bg-driveway-black/60 p-5 rounded-2xl border border-white/5">
                                     <div class="flex items-center justify-between">
                                        <h5 class="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                                           <mat-icon class="text-emerald-400 text-sm">assignment</mat-icon> Submit Proposal Sourcing Vetting Sheet
                                        </h5>
                                        <button (click)="selectedRequestToPitch.set(null)" class="text-gray-400 hover:text-white text-[10.5px] uppercase tracking-wider flex items-center gap-1 font-mono">
                                           <mat-icon class="text-xs">close</mat-icon> Dismiss
                                        </button>
                                     </div>

                                     <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                           <label class="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Matching Vehicle Specs & Sourcing Notes</label>
                                           <input #pitchDetails type="text" placeholder="e.g. 2019 Toyota Camry XLE (Graphite Black, 32k mi)" class="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500" />
                                        </div>
                                        <div>
                                           <label class="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Proof Image Link (or leave placeholder)</label>
                                           <input #pitchImage type="text" value="https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=400&auto=format&fit=crop" class="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono" />
                                        </div>
                                        <div>
                                           <label class="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Total Sourced Deal Price (₦)</label>
                                           <input #pitchPrice type="text" placeholder="e.g. 15,900,000" class="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono" />
                                        </div>
                                        <div>
                                           <label class="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Expected Sourcing Commission (₦)</label>
                                           <input #pitchCommission type="text" placeholder="e.g. 450,000" class="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono" />
                                        </div>
                                     </div>

                                     <button (click)="onPublishPitch(req.id, pitchDetails.value, pitchImage.value, pitchPrice.value, pitchCommission.value)" class="w-full h-11 bg-emerald-500 hover:bg-emerald-400 transition-colors text-black text-xs font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-2">
                                        <mat-icon class="text-sm">send</mat-icon> Dispatch Proposal Vetting Sheet
                                     </button>
                                  </div>
                               }
                            </div>
                         } @empty {
                            <div class="py-12 text-center text-gray-500 glass-panel border border-white/5 rounded-2xl bg-white/[0.01]">
                               No active buyers open sourcing parameters logged. Check again.
                            </div>
                         }
                      </div>
                   </div>
                }

                <!-- TAB 2: MY PROPOSALS LIST -->
                @if (activeTab() === 'proposals') {
                   <div class="space-y-6 animate-fade-in text-left">
                      <div>
                         <h3 class="text-lg font-display font-medium text-white">Your Submitted Pitch Proposals</h3>
                         <p class="text-xs text-gray-400 mt-1">Pending and approved pitches matched. Upon buyer acceptance, funds representing price + commission lock immediately into Driveway247 escrow pool.</p>
                      </div>

                      <div class="divide-y divide-white/5">
                         @for (prop of myProposals(); track prop.id) {
                            <div class="py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 first:pt-0 last:pb-0 animate-fade-in border-b border-white/[0.02] pb-5">
                               <div class="flex items-start gap-4">
                                  <div class="w-16 h-12 rounded overflow-hidden bg-driveway-black shrink-0 relative border border-white/10 shadow-md">
                                     <img [src]="prop.image" alt="vehicle" class="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                     <h4 class="font-display font-semibold text-white text-base leading-none mb-1.5">{{ prop.vehicleDetails }}</h4>
                                     <p class="text-xs text-gray-450 font-mono">Matched Sourcing Target ID: {{ prop.requestId }} &middot; Date: {{ prop.createdAt }}</p>
                                     <div class="mt-2.5 flex flex-wrap items-center gap-3.5 text-xs">
                                        <span class="text-driveway-gold font-mono font-medium flex items-center gap-1">
                                           <mat-icon class="text-xs w-3.5 h-3.5">payments</mat-icon> Price Offered: ₦{{ prop.priceNaira }}
                                        </span>
                                        <span class="text-emerald-400 font-mono font-medium flex items-center gap-1">
                                           <mat-icon class="text-xs w-3.5 h-3.5">star_border</mat-icon> Commission: ₦{{ prop.proposedCommission }}
                                        </span>
                                     </div>
                                  </div>
                               </div>

                               <div class="shrink-0">
                                  @if (prop.status === 'Pending') {
                                     <span class="px-3.5 py-1.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded font-mono text-[10px] font-bold uppercase tracking-wider block">
                                        AWAITING BUYER REVIEW
                                     </span>
                                  } @else if (prop.status === 'Accepted') {
                                     <span class="px-3.5 py-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 rounded font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                        <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> ACCEPTED & CASH LOCKED ✓
                                     </span>
                                  } @else {
                                     <span class="px-3.5 py-1.5 bg-red-500/15 text-red-500 border border-red-500/25 rounded font-mono text-[10px] font-bold uppercase tracking-wider block">
                                        DECLINED BY CUSTOMER
                                     </span>
                                  }
                               </div>
                            </div>
                         } @empty {
                            <div class="py-12 text-center text-gray-500 italic">
                               No pitched proposals recorded yet. Visit the Sourcing Pool tab to create a matchmaking pitch.
                            </div>
                         }
                      </div>
                   </div>
                }

                <!-- TAB 3: PHYSICAL CHECKS & ALLIANCE VETTING -->
                @if (activeTab() === 'checks') {
                   <div class="space-y-6 font-sans">
                      <div>
                         <h3 class="text-lg font-display font-medium text-white">Alliance Trust Credentials & Background Verification</h3>
                         <p class="text-xs text-gray-400 mt-1">Sourcing agents do not own dealership premises, but they are fully vetted by Driveway247 local compliance officers.</p>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                         <div class="bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-left space-y-4">
                            <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5"><mat-icon class="text-emerald-400 text-sm">badge</mat-icon> Global NIN Identity Match</h4>
                            <div class="text-xs space-y-2">
                               <p class="text-gray-400">Representative NIN Digit: <span class="text-white font-mono font-bold">NIN-77823391-2</span></p>
                               <p class="text-gray-400">Identity Standing: <span class="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] rounded uppercase font-bold tracking-wider ml-1">CLEARED ✓</span></p>
                               <p class="text-[10.5px] text-gray-500 font-light mt-2 leading-normal">Your National Identification Slip details are fully validated through NIMC live servers on driveway handshake onboarding.</p>
                            </div>
                         </div>

                         <div class="bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-left space-y-4">
                            <h4 class="text-xs font-bold uppercase tracking-wider text-[#10b981] flex items-center gap-1.5"><mat-icon class="text-emerald-400 text-sm">contacts</mat-icon> Professional Character References</h4>
                            <div class="text-xs space-y-2">
                               <p class="text-gray-400">Reference Contact: <span class="text-white">Chief Olufemi (Maitama Legal)</span></p>
                               <p class="text-gray-400">Character Audit: <span class="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] rounded uppercase font-bold tracking-wider ml-1">CONFIRMED✓</span></p>
                               <p class="text-[10.5px] text-gray-500 font-light mt-2 leading-normal">Approved driveway middleman license requires active endorsement by a recognized commercial body or legal advisor in Nigeria.</p>
                            </div>
                         </div>
                      </div>

                      <div class="bg-[#10b981]/[0.02] border border-[#10b981]/15 rounded-2xl p-6 mt-4 text-left">
                         <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">Driveway Sourcing Charter</h4>
                         <p class="text-xs text-gray-300 leading-relaxed font-light">
                            Verified Brokers are sworn to defend the African Sourcing Alliance charter. All proposed units MUST undergo the 150-Point physical checkup by our field inspectors before publication and buyer settlement occurs. Zero bypass attempts, or direct offline bank negotiations are tolerated.
                         </p>
                      </div>
                   </div>
                }

             </div>

             <!-- RIGHT SIDEBAR: Commissions balance details, dynamic timeline -->
             <div class="space-y-6 text-left font-sans">
                <!-- Sourcing program scorecard panel -->
                <div class="glass-panel p-6 rounded-2xl border border-white/15 bg-driveway-black/40">
                   <h3 class="text-xs font-bold uppercase tracking-widest text-[#10b981] mb-4">Commissions Payout Wallet</h3>
                   <div class="p-4 bg-white/[0.01] border border-white/5 rounded-xl text-center space-y-1">
                      <span class="text-[10px] text-gray-400 block uppercase tracking-wider">Verified Balance Pool</span>
                      <span class="text-3xl font-display font-medium text-white">₦{{ (commissionTotal()).toLocaleString() }}</span>
                      <span class="text-[9.5px] text-gray-500 block">Funds are stored safely by Central Bank Authorized escrow trustees</span>
                   </div>

                   <!-- Slicing graphic of payout cycles -->
                   <div class="mt-6 space-y-3 font-sans text-xs">
                      <span class="text-[9.5px] font-bold text-gray-400 uppercase tracking-widest block">Release Progress Timeline</span>
                      <div class="relative pl-6 border-l border-white/10 space-y-4">
                         <div class="relative">
                            <span class="absolute left-[-27px] w-3 h-3 rounded-full bg-emerald-500 border border-driveway-black shadow-lg"></span>
                            <span class="font-medium text-white block">₦500,000 Verified Lock</span>
                            <span class="text-[10px] text-gray-400">Request: Amina Bello [Lexus Matching]</span>
                         </div>
                         <div class="relative text-gray-500">
                            <span class="absolute left-[-27px] w-3 h-3 rounded-full bg-white/20 border border-driveway-black"></span>
                            <span class="font-medium text-gray-400 block">NIN Cleared & Sourced Out</span>
                            <span class="text-[10.5px]">Physical inspect scheduled in Abuja</span>
                         </div>
                      </div>
                   </div>
                </div>

                <!-- Open buyer sourcing sidebar highlights -->
                <div class="glass-panel p-5 rounded-2xl border border-white/10 bg-driveway-black/60 relative overflow-hidden">
                   <div class="absolute top-0 right-0 w-24 h-24 bg-emerald-500/[0.02] rounded-full blur-2xl"></div>
                   <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-1"><mat-icon class="text-sm">star_border</mat-icon> Nigeria Regional Hot Spot</h4>
                   <p class="text-xs text-gray-400 tracking-wide font-light leading-normal">
                      Abuja field operations report a surge in buyers sourcing luxury import Mercedes-Benz and high-spec Lexus RX models. Field inspectors are available at all Lekki, Abuja, and Port Harcourt hubs daily to expedite report clearances.
                   </p>
                </div>
             </div>

          </div>
       </div>
    }
  `
})
export class BrokerDashboardComponent {
  platformState = inject(PlatformStateService);

  isLoggedIn = signal<boolean>(false);
  activeTab = signal<'sourcing' | 'proposals' | 'checks'>('sourcing');
  selectedRequestToPitch = signal<SourcingRequest | null>(null);

  constructor() {
    effect(() => {
      const session = this.platformState.getSession();
      if (session && session.role === 'Broker') {
        this.isLoggedIn.set(true);
      } else {
        this.isLoggedIn.set(false);
      }
    });
  }

  onSubmitLogin(emailOrId: string) {
    const session = this.platformState.loginAs(emailOrId || 'alao.babs.broker@gmail.com', 'Broker');
    if (session) {
      if (session.status === 'Pending Review' || session.status === 'Rejected') {
         alert('Your Sourcing middleman credentials are still awaiting background checks (NIN identity and reference confirm validation). Please use Admin Dashboard to clearance approve instantly!');
      } else {
         this.isLoggedIn.set(true);
      }
    } else {
      // Auto register for testing purposes!
      const payload = {
        fullName: 'Babatunde Alao',
        email: emailOrId || 'alao.babs.broker@gmail.com',
        phone: '+234 812 904 9022',
        address: 'Plot 10, Admiralty Way, Lekki',
        ninNumber: 'NIN-77823391-2',
        referenceContact: 'Chief Olufemi (Maitama Legal)'
      };
      
      const newB = this.platformState.registerBroker(payload);
      alert(`Vetted Broker Application created for Babatunde Alao (Email: ${newB.email}). Admin vetting is pending review. Check Admin Console tab to clear NIN approval!`);
    }
  }

  // Multi-platform state streams reading directly from reactive PlatformStateService
  sourcingRequests = this.platformState.getSourcingRequests;
  brokerProposals = this.platformState.getSourcingProposals;
  commissionTotal = this.platformState.brokerCommissionsTotal;

  // Computed properties
  openRequestsCount = computed(() => {
     return this.sourcingRequests().filter(r => r.status === 'Open').length;
  });

  myProposals = computed(() => {
     const session = this.platformState.getSession();
     if (!session) return [];
     return this.brokerProposals().filter(p => p.brokerId === session.id || p.brokerId === 'broker-default');
  });

  pendingProposalsCount = computed(() => {
     return this.myProposals().filter(p => p.status === 'Pending').length;
  });

  selectRequestForProposal(req: SourcingRequest) {
     this.selectedRequestToPitch.set(req);
  }

  onPublishPitch(requestId: string, details: string, image: string, price: string, commission: string) {
     const session = this.platformState.getSession();
     if (!session) {
        alert('You must sign in as broker first!');
        return;
     }

     if (!details || !price || !commission) {
        alert('All match pitch properties are required to verify the finding.');
        return;
     }

     const payload = {
        requestId,
        brokerId: session.id,
        brokerName: `${session.fullName} (Verified Broker)`,
        vehicleDetails: details,
        image: image || 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=400&auto=format&fit=crop',
        priceNaira: price,
        proposedCommission: commission
     };

     this.platformState.submitSourcingProposal(payload);
     this.selectedRequestToPitch.set(null);
     this.activeTab.set('proposals');
     alert('Match proposal vetting list successfully posted to the buyer! The buyer will receive a live notification and can accept terms securely.');
  }
}
