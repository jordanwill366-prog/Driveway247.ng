import { Component, signal, inject, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PlatformStateService, EscrowTransaction } from '../../services/platform-state';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-delivery-dashboard',
  standalone: true,
  imports: [MatIconModule, NgClass],
  template: `
    @if (!isLoggedIn()) {
       <div class="min-h-screen bg-driveway-black flex flex-col justify-center items-center py-20 px-6 font-sans">
          <div class="max-w-md w-full glass-panel bg-driveway-charcoal border border-white/10 rounded-3xl p-8 shadow-[0_40px_80px_rgba(0,0,0,0.8)] relative overflow-hidden text-left animate-luxury-reveal">
             <div class="absolute -top-10 -left-10 w-40 h-40 bg-[#06b6d4]/10 rounded-full blur-3xl pointer-events-none"></div>
             <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-800/[0.04] rounded-full blur-3xl pointer-events-none"></div>

             <div class="flex items-center gap-3.5 mb-8">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#06b6d4] to-cyan-900 flex items-center justify-center shadow-lg shadow-[#06b6d4]/10">
                   <mat-icon class="text-white">local_shipping</mat-icon>
                </div>
                <div>
                   <span class="text-[9px] font-mono font-bold tracking-widest text-[#06b6d4] uppercase block">Logistics & Escrow Fulfillment</span>
                   <h2 class="text-lg font-display font-bold text-white tracking-tight">LOGISTICS PORTAL LOGIN</h2>
                </div>
             </div>

             <h3 class="text-base font-semibold text-white mb-2">Logistics Partner Verification</h3>
             <p class="text-xs text-gray-400 mb-6 font-light leading-relaxed">
                Enter your courier dispatcher ID and secure token pass to access verified vehicle shipping lists and release tracking codes.
             </p>

             <div class="space-y-4 font-sans text-left">
                <div>
                   <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Staff Dispatcher Code</label>
                   <input #dispatchId type="text" value="LOG-701-DISPATCH" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#06b6d4] font-sans" />
                </div>
                <div>
                   <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Secure Fulfillment Token</label>
                   <input type="password" value="••••••••••••••••" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#06b6d4] font-sans" />
                </div>

                <div class="bg-black/40 border border-white/5 rounded-xl p-3.5 text-[10px] text-gray-500 space-y-1.5 font-mono">
                   <div class="flex items-center gap-1.5 text-[#06b6d4]">
                      <mat-icon class="text-xs w-3.5 h-3.5 text-[#06b6d4]">gps_fixed</mat-icon> Transit State Tracking Channel Encrypted
                   </div>
                </div>

                <button (click)="isLoggedIn.set(true)" class="w-full h-12 bg-[#06b6d4] hover:bg-[#22d3ee] text-black text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mt-4 shadow-lg shadow-[#06b6d4]/20">
                   <mat-icon class="text-sm">vpn_key</mat-icon> Access Dispatch Board
                </button>
             </div>
          </div>
       </div>
    } @else {
       <div class="min-h-screen pt-28 px-6 max-w-7xl mx-auto pb-24 text-left">
       <!-- Operational title banner -->
       <div class="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
             <span class="text-xs font-semibold tracking-widest text-[#06b6d4] uppercase mb-2 block font-mono">Fulfillment & Logistics Department</span>
             <h1 class="text-4xl font-display font-medium text-white">Logistics Operations Terminal</h1>
          </div>
          <div class="flex items-center gap-3">
             <div class="px-4 py-2 bg-[#06b6d4]/15 border border-[#06b6d4]/30 text-[#06b6d4] text-xs font-mono font-medium rounded-full flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
                Officer Assigned: James Nwachukwu (ID: LOG-701)
             </div>
          </div>
       </div>

       <!-- DYNAMIC INSIGHT STATS -->
       <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div class="glass-panel p-6 rounded-2xl border-l-[3px] border-l-driveway-cyan bg-driveway-charcoal/30">
             <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 block">Total Shipments Assigned</span>
             <span class="text-3xl font-display font-medium text-white">{{ logisticsAssignments().length }}</span>
             <p class="text-[10px] text-gray-500 mt-2">Active courier tasks</p>
          </div>
          <div class="glass-panel p-6 rounded-2xl border-l-[3px] border-l-amber-500 bg-driveway-charcoal/30">
             <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 block">In Transit</span>
             <span class="text-3xl font-display font-medium text-white">{{ inTransitCount() }}</span>
             <p class="text-[10px] text-gray-500 mt-2">Vehicles currently on the move</p>
          </div>
          <div class="glass-panel p-6 rounded-2xl border-l-[3px] border-l-emerald-500 bg-driveway-charcoal/30">
             <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 block">Delivered Today</span>
             <span class="text-3xl font-display font-medium text-white">{{ deliveredCount() }}</span>
             <p class="text-[10px] text-gray-500 mt-2">Handover confirmations sent to escrow</p>
          </div>
          <div class="glass-panel p-6 rounded-2xl border-l-[3px] border-l-white/20 bg-driveway-charcoal/30">
             <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 block">Logistical SLA Score</span>
             <span class="text-3xl font-display font-medium text-white">99.7%</span>
             <p class="text-[10px] text-gray-500 mt-2">Compliance & speed rating</p>
          </div>
       </div>

       <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- LEFT/CENTER SECTIONS: DISPATCH ASSIGNMENTS LIST -->
          <div class="lg:col-span-2 space-y-6">
             <div class="glass-panel rounded-2xl border border-white/5 overflow-hidden">
                <div class="p-6 border-b border-white/5 flex items-center justify-between bg-white/2">
                   <h3 class="font-display font-medium text-lg text-white">Dispatched Cargo Queue</h3>
                   <span class="text-xs text-gray-400 bg-white/5 px-2.5 py-1 rounded">{{ waitingLogistics().length }} Pending Pickup</span>
                </div>
                
                <div class="divide-y divide-white/5 bg-driveway-black/20">
                   @for(tx of logisticsAssignments(); track tx.id) {
                      <div class="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-white/[0.02] transition-colors relative"
                           (click)="activeTask.set(tx)"
                           [class.bg-driveway-cyan/[0.02]]="activeTask()?.id === tx.id"
                           [class.border-l-2]="activeTask()?.id === tx.id"
                           [class.border-l-driveway-cyan]="activeTask()?.id === tx.id">
                         <div class="flex items-start gap-4">
                            <div class="w-14 h-14 rounded-xl bg-driveway-charcoal border border-white/10 flex items-center justify-center text-driveway-cyan shrink-0">
                               <mat-icon>{{ tx.status === 'Delivered' ? 'local_post_office' : 'local_shipping' }}</mat-icon>
                            </div>
                            <div>
                               <span class="text-[9px] font-bold text-driveway-gold tracking-widest uppercase mb-0.5 block">ESCROW ID: {{ tx.id }}</span>
                               <h4 class="font-display font-medium text-white text-base">{{ tx.vehicleName }}</h4>
                               <p class="text-xs text-gray-400 mt-1">
                                  Seller: <span class="text-gray-300 font-medium">{{ tx.sellerName }}</span> &middot; Buyer: <span class="text-gray-300 font-medium">{{ tx.buyerEmail }}</span>
                               </p>
                            </div>
                         </div>
                         <div class="flex items-center gap-4 shrink-0 w-full md:w-auto justify-end">
                            <span class="px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider"
                                  [ngClass]="{
                                    'bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse': tx.status === 'Funds Held',
                                    'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20': tx.status === 'In Transit',
                                    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20': tx.status === 'Delivered' || tx.status === 'Completed'
                                  }">
                               {{ tx.status }}
                            </span>
                            <button class="bg-white text-black px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1 hover:bg-gray-200 transition-colors">
                               <mat-icon class="text-xs w-4 h-4">edit_note</mat-icon> Manage
                            </button>
                         </div>
                      </div>
                   } @empty {
                      <div class="p-12 text-center text-gray-500">
                         <mat-icon class="text-5xl text-gray-500 mb-3">lock_clock</mat-icon>
                         <h4 class="font-display font-medium text-white text-base">Awaiting Dispatch Approvals</h4>
                         <p class="text-xs text-gray-400 mt-1 max-w-sm mx-auto">No cargo assignments mapped to you. Admin must approve delivery dispatches inside the Admin Console first.</p>
                      </div>
                   }
                </div>
             </div>

             <!-- DETAILS & CONTROLS FOR ACTIVE CARGO TASK -->
             @if (activeTask(); as task) {
                <div class="glass-panel p-8 rounded-3xl border border-driveway-cyan/30 bg-driveway-cyan/[0.015] animate-fade-in relative">
                   <h3 class="font-display font-medium text-xl text-white mb-2 flex items-center gap-2">
                       <mat-icon class="text-driveway-cyan">local_shipping</mat-icon> Interactive Delivery & Verification Manifest
                   </h3>
                   <p class="text-xs text-gray-400 mb-8 font-light">
                      Fulfilling delivery for vehicle: <span class="text-white font-medium">{{ task.vehicleName }}</span>.
                   </p>

                   <!-- TIMELINE TRANSITION PROGRESS CONTROLS -->
                   <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      
                      <!-- Add Live Route Updates -->
                      <div class="p-6 bg-white/5 border border-white/5 rounded-2xl">
                         <h4 class="font-display font-semibold text-white text-sm mb-2 flex items-center gap-1.5">
                            <mat-icon class="text-driveway-cyan text-base">track_changes</mat-icon> Append Live Route log
                         </h4>
                         <p class="text-[11px] text-gray-400 mb-4 font-light">Notify admin and client of exact coordinates and freight progress.</p>
                         
                         <div class="space-y-3.5">
                            <div class="flex gap-2">
                               <button (click)="appendRouteLog(task.id, 'Cargo Pickup completed. Transport departing Lagos.')" class="flex-1 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-[10.5px] rounded transition-all">Departing Lagos</button>
                               <button (click)="appendRouteLog(task.id, 'Freight passing Shagamu Expressway Tollgate.')" class="flex-1 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-[10.5px] rounded transition-all">Shagamu Toll</button>
                            </div>
                            <div class="flex gap-2">
                               <button (click)="appendRouteLog(task.id, 'Shipment cleared transit check at Ore Interchange.')" class="flex-1 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-[10.5px] rounded transition-all">Ore Junction</button>
                               <button (click)="appendRouteLog(task.id, 'Arrived at municipal terminal hub. Slated for door dispatch.')" class="flex-1 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-[10.5px] rounded transition-all">Hub Clearance</button>
                            </div>
                            <div class="pt-2 border-t border-white/5">
                               <label class="text-[10px] text-gray-500 font-bold uppercase mb-1.5 block">Custom Status Log Entry</label>
                               <div class="flex gap-2">
                                  <input #customLog type="text" placeholder="e.g. Cleared at Berger checkpoint..." class="flex-grow h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-driveway-cyan" />
                                  <button (click)="submitCustomRouteLog(task.id, customLog.value); customLog.value = ''" class="h-9 px-3 bg-driveway-cyan text-black text-xs font-semibold rounded-lg hover:bg-cyan-400 transition-colors">Add</button>
                               </div>
                            </div>
                         </div>
                      </div>

                      <!-- Final Handover Proof & Authentication -->
                      <div class="p-6 bg-white/5 border border-white/5 rounded-2xl flex flex-col justify-between">
                         <div>
                            <h4 class="font-display font-semibold text-white text-sm mb-2 flex items-center gap-1.5">
                               <mat-icon class="text-emerald-450 text-base">how_to_reg</mat-icon> Certify Receiver Handover
                            </h4>
                            <p class="text-[11px] text-gray-400 mb-4 font-light">Collect signature name and physical photo of vehicle handover to unlock payout release approval.</p>
                         </div>

                         @if (task.status === 'Funds Held' || task.status === 'In Transit') {
                            <div class="space-y-4 pt-2">
                               <div>
                                  <label class="text-[10px] text-gray-400 font-bold uppercase block mb-1">Verify Recipient Name</label>
                                  <input #rxName type="text" placeholder="e.g. Afolabi Gbolahan (NIN matched)" class="w-full h-9 px-2.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white" />
                               </div>
                               <div>
                                  <label class="text-[10px] text-gray-400 font-bold uppercase block mb-1">Delivery Handover Notes</label>
                                  <input #rxNotes type="text" placeholder="Checked body for scratches, keys & custom paperwork released." class="w-full h-9 px-2.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white" />
                               </div>
                               
                               <button (click)="finalizeHandover(task.id, rxName.value, rxNotes.value)" class="w-full h-11 bg-emerald-500 hover:bg-emerald-400 transition-colors text-black text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5">
                                  <mat-icon class="text-sm">verified</mat-icon> Submit Secured Handover Verification
                               </button>
                            </div>
                         } @else {
                            <div class="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-xs text-emerald-400 leading-normal">
                               <mat-icon class="text-emerald-450 text-xl mb-1.5">task_alt</mat-icon>
                               <span class="block font-bold">Handover Completed</span>
                               <span class="text-[10.5px] text-gray-400 mt-1 block font-light">Proof certified by logistics desk. Funds are cleared for admin releases.</span>
                            </div>
                         }
                      </div>

                   </div>
                </div>
             }
          </div>

          <!-- RIGHT SECTION: TRACKING FEED & LOGISTICS LOGS -->
          <div class="space-y-6">
             <div class="glass-panel p-6 rounded-2xl border border-white/5">
                <h3 class="font-display font-medium text-lg text-white mb-1.5">Live Manifest Trackings</h3>
                <p class="text-xs text-gray-400 mb-6">Real-time status updates associated with active assignments</p>

                @if (activeTask(); as task) {
                   <div class="space-y-4">
                      <div class="pb-3 border-b border-white/5">
                         <span class="text-[9px] text-driveway-gold font-mono tracking-widest block uppercase">Selected Load Tracing</span>
                         <h4 class="font-display font-semibold text-white text-sm mt-1">{{ task.vehicleName }}</h4>
                      </div>

                      <div class="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                         @for(log of task.trackingLogs; track log.timestamp; let first = $first) {
                            <div class="flex gap-3 text-xs">
                               <div class="flex flex-col items-center">
                                  <div [ngClass]="first ? 'bg-driveway-cyan animate-pulse' : 'bg-white/20'" class="h-2.5 w-2.5 rounded-full ring-4 ring-white/5 shrink-0 mt-1"></div>
                                  <div class="h-9 border-l border-white/10"></div>
                               </div>
                               <div>
                                  <p [ngClass]="first ? 'text-white font-medium' : 'text-gray-400'" class="text-[11.5px]">{{ log.status }}</p>
                                  <span class="text-[9.5px] text-gray-500 font-mono">{{ log.timestamp }}</span>
                               </div>
                            </div>
                         } @empty {
                            <div class="text-xs text-gray-500 text-center py-6">
                               <mat-icon class="text-lg">explore_off</mat-icon>
                               <p>No tracking updates found. Use the live updates deck on the left to add tracking progress alerts.</p>
                            </div>
                         }
                      </div>
                   </div>
                } @else {
                   <div class="py-12 text-center text-gray-500 text-xs">
                      <mat-icon class="text-4xl mb-2">find_in_page</mat-icon>
                      <p>Select any active shipment from the dispatch queue to inspect and manage route coordinates.</p>
                   </div>
                }
             </div>
          </div>

       </div>
    </div>
    }
  `,
  styles: [`
    .glass-panel {
      background: rgba(14, 14, 14, 0.65);
      backdrop-filter: blur(25px);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
  `]
})
export class DeliveryDashboardComponent {
  platformState = inject(PlatformStateService);

  isLoggedIn = signal<boolean>(false);
  activeTask = signal<EscrowTransaction | null>(null);

  // Read transactions that are approved for dispatch or already in delivery flows
  logisticsAssignments = computed(() => {
    return this.platformState.getTransactions().filter(tx => tx.dispatchApproved === true || tx.status === 'In Transit' || tx.status === 'Delivered' || tx.status === 'Completed');
  });

  // Filters computed
  waitingLogistics = computed(() => {
     return this.logisticsAssignments().filter(tx => tx.status === 'Funds Held');
  });

  inTransitCount = computed(() => {
     return this.logisticsAssignments().filter(tx => tx.status === 'In Transit').length;
  });

  deliveredCount = computed(() => {
     return this.logisticsAssignments().filter(tx => tx.status === 'Delivered' || tx.status === 'Completed').length;
  });

  appendRouteLog(txId: string, statusText: string) {
     this.platformState.addTrackingLog(txId, statusText);
     this.syncActiveTask(txId);
  }

  submitCustomRouteLog(txId: string, text: string) {
     if (!text) return;
     this.platformState.addTrackingLog(txId, text);
     this.syncActiveTask(txId);
  }

  finalizeHandover(txId: string, name: string, notes: string) {
     const formattedNotes = `Verified Recipient: ${name || 'Buyer ID authenticated'}. Handover parameters: ${notes || 'Condition matches scorecard perfectly.'}`;
     this.platformState.submitHandover(txId, formattedNotes);
     
     // Set status and advance order status tracking in simulated logistics flow
     this.platformState.advanceTransaction(txId, 'Delivered');
     this.syncActiveTask(txId);
  }

  private syncActiveTask(txId: string) {
     // Re-fetch object from changed signal in PlatformStateService to reflect updates instantly
     const list = this.platformState.getTransactions();
     const match = list.find(tx => tx.id === txId);
     if (match) {
        this.activeTask.set(match);
     }
  }
}
