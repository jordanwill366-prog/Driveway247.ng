import { Component, signal, inject, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PlatformStateService, Vehicle } from '../../services/platform-state';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-inspector-dashboard',
  standalone: true,
  imports: [MatIconModule, NgClass],
  template: `
    @if (!isLoggedIn()) {
       <div class="min-h-screen bg-driveway-black flex flex-col justify-center items-center py-20 px-6 font-sans">
          <div class="max-w-md w-full glass-panel bg-driveway-charcoal border border-white/10 rounded-3xl p-8 shadow-[0_40px_80px_rgba(0,0,0,0.8)] relative overflow-hidden text-left animate-luxury-reveal">
             <div class="absolute -top-10 -left-10 w-40 h-40 bg-driveway-cyan/10 rounded-full blur-3xl pointer-events-none"></div>
             <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-600/[0.04] rounded-full blur-3xl pointer-events-none"></div>

             <div class="flex items-center gap-3.5 mb-8">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-driveway-cyan to-cyan-800 flex items-center justify-center shadow-lg shadow-driveway-cyan/10">
                   <mat-icon class="text-white">verified_user</mat-icon>
                </div>
                <div>
                   <span class="text-[9px] font-mono font-bold tracking-widest text-driveway-cyan uppercase block">Verification & Diagnostics Node</span>
                   <h2 class="text-lg font-display font-bold text-white tracking-tight">INSPECTION PORTAL LOGIN</h2>
                </div>
             </div>

             <h3 class="text-base font-semibold text-white mb-2">Field Officer Verification</h3>
             <p class="text-xs text-gray-400 mb-6 font-light leading-relaxed">
                Connect your physical diagnostics scanner or insert your officer access key to fetch today's assigned vehicle inspections.
             </p>

             <div class="space-y-4 font-sans text-left">
                <div>
                   <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Staff Field ID Badge</label>
                   <input #fieldId type="text" value="FLD-9022-ONLINE" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-driveway-cyan font-sans" />
                </div>
                <div>
                   <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Security Authorization Key</label>
                   <input type="password" value="••••••••••••••••" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-driveway-cyan font-sans" />
                </div>

                <div class="bg-black/40 border border-white/5 rounded-xl p-3.5 text-[10px] text-gray-500 space-y-1.5 font-mono">
                   <div class="flex items-center gap-1.5 text-driveway-cyan">
                      <mat-icon class="text-xs w-3.5 h-3.5 text-driveway-cyan">security</mat-icon> Encrypted Field Operations Active
                   </div>
                </div>

                <button (click)="isLoggedIn.set(true)" class="w-full h-12 bg-driveway-cyan hover:bg-cyan-400 text-black text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mt-4 shadow-lg shadow-driveway-cyan/20">
                   <mat-icon class="text-sm">verified</mat-icon> Load Field Assignments
                </button>
             </div>
          </div>
       </div>
    } @else {
       <div class="min-h-screen pt-28 px-6 max-w-7xl mx-auto pb-24">
       <!-- Verification officer top status -->
       <div class="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
             <span class="text-xs font-semibold tracking-widest text-driveway-cyan uppercase mb-2 block">Field Officer Portal</span>
             <h1 class="text-4xl font-display font-medium text-white">Assigned Inspections</h1>
          </div>
          <div class="flex items-center gap-3">
             <div class="px-4 py-2 bg-driveway-cyan/10 border border-driveway-cyan/20 text-driveway-cyan text-xs font-mono font-medium rounded-full">
                Officer: Frank Adebayo (ID: FLD-9022)
             </div>
          </div>
       </div>

       <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- LEFT/CENTER SECTIONS: LIST OF ASSIGNED WORKFLOWS -->
          <div class="lg:col-span-2 space-y-6 text-left">
             <div class="glass-panel rounded-2xl border border-white/5 overflow-hidden">
                <div class="p-6 border-b border-white/5 flex items-center justify-between">
                   <h3 class="font-display font-medium text-lg text-white">Daily Field Assignments</h3>
                   <span class="text-xs text-gray-400 bg-white/5 px-2.5 py-1 rounded">{{ pendingAssignments().length }} Assignments Pending Check</span>
                </div>
                
                <div class="divide-y divide-white/5 bg-driveway-black/20">
                   @for(car of pendingAssignments(); track car.id) {
                      <div class="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-white/[0.02] transition-colors relative">
                         <div class="flex items-start gap-4">
                            <div class="w-16 h-12 rounded-lg bg-driveway-charcoal border border-white/10 shrink-0 overflow-hidden relative">
                               <img [src]="car.image" class="w-full h-full object-cover" />
                            </div>
                            <div>
                               <span class="text-[9px] font-bold text-driveway-gold tracking-widest uppercase mb-0.5 block">DEALER: {{ car.dealer }}</span>
                               <h4 class="font-display font-medium text-white text-base">{{ car.year }} {{ car.make }} {{ car.model }}</h4>
                               <p class="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
                                  <mat-icon class="text-[14px] w-3.5 h-3.5 text-driveway-cyan">location_on</mat-icon> {{ car.location }}
                               </p>
                            </div>
                         </div>
                         <div class="flex items-center gap-4 shrink-0 w-full md:w-auto">
                            <span class="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded text-xs font-medium uppercase tracking-wider">Awaiting Check</span>
                            <button id="start-report-btn" (click)="beginInspectionForm(car)" class="bg-white text-black px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-gray-200 transition-colors">Start Report</button>
                         </div>
                      </div>
                   } @empty {
                      <!-- Fully verified notice -->
                      <div class="p-12 text-center text-gray-400">
                         <mat-icon class="text-5xl text-driveway-cyan mb-3 animate-pulse">check_circle</mat-icon>
                         <h4 class="font-display font-medium text-white text-base">All Daily Checks Verified</h4>
                         <p class="text-xs text-gray-500 mt-1 max-w-sm mx-auto">No pending inspections assigned to you. When sellers create a listing on their dashboard, it automatically maps to your queue!</p>
                      </div>
                   }
                </div>
             </div>

             <!-- SUBSECTION: CURRENT ACTIVE WORK / REPORTING FORM -->
             @if (activeInspectionCar(); as car) {
                <div class="glass-panel p-8 rounded-3xl border border-driveway-cyan/30 bg-driveway-cyan/[0.02] animate-fade-in relative z-20">
                   <h3 class="font-display font-medium text-xl text-white mb-2 flex items-center gap-2">
                       <mat-icon class="text-driveway-cyan">analytics</mat-icon> 150-Point Structural Verification & Scorecard
                   </h3>
                   <p class="text-xs text-gray-400 mb-8 font-light">
                      Grading: <span class="text-white">{{ car.year }} {{ car.make }} {{ car.model }}</span> at premises location: {{ car.location }}. Perform mechanical Diagnostics and log score indexes.
                   </p>

                   <!-- VIN CONFIRMATION SLIDER -->
                   <div class="mb-6 p-4 rounded-xl bg-driveway-cyan/5 border border-driveway-cyan/20 flex items-center justify-between gap-4">
                      <div class="text-left">
                         <span class="font-semibold text-xs text-white block">VIN Chassis Authentication Check</span>
                         <p class="text-[11px] text-gray-400">Match physical windscreen plates and door pillar tags with custom vehicle customs cleared logs.</p>
                      </div>
                      <button (click)="toggleVINMatched()" [ngClass]="vinMatched() ? 'bg-driveway-cyan text-black' : 'border border-white/20 text-gray-400'" class="px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1">
                         <mat-icon class="text-[16px] w-4 h-4">{{ vinMatched() ? 'verified' : 'hourglass_empty' }}</mat-icon>
                         {{ vinMatched() ? 'VIN Matched ✓' : 'Not Clicked' }}
                      </button>
                   </div>

                   <!-- DYNAMIC METRIC SLIDERS -->
                   <span class="text-[11px] font-bold uppercase text-driveway-cyan tracking-widest block mb-4">Diagnostics Performance Scale</span>
                   <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <!-- 1. Engine & Transmission -->
                      <div class="p-4 rounded-xl bg-white/5">
                         <div class="flex justify-between text-xs font-semibold uppercase text-gray-400 mb-2">
                            <span>Engine Compression ({{ engineScore() }}%)</span>
                            <span class="text-emerald-400">Grade A</span>
                         </div>
                         <input type="range" min="30" max="100" [value]="engineScore()" (input)="engineScore.set(getSliderValue($event))" class="w-full accent-driveway-cyan bg-white/10" />
                         <span class="text-[9px] text-gray-500 mt-1 block">Inspects leaks, smoke indices, piston noise</span>
                      </div>

                      <!-- 2. Brakes system -->
                      <div class="p-4 rounded-xl bg-white/5">
                         <div class="flex justify-between text-xs font-semibold uppercase text-gray-400 mb-2">
                            <span>Discs & Brakes Pad Wear ({{ brakesScore() }}%)</span>
                            <span class="text-emerald-400">Grade A</span>
                         </div>
                         <input type="range" min="30" max="100" [value]="brakesScore()" (input)="brakesScore.set(getSliderValue($event))" class="w-full accent-driveway-cyan bg-white/10" />
                         <span class="text-[9px] text-gray-500 mt-1 block">Measures pad thickness, fluid pressure</span>
                      </div>

                      <!-- 3. Interior condition -->
                      <div class="p-4 rounded-xl bg-white/5">
                         <div class="flex justify-between text-xs font-semibold uppercase text-gray-400 mb-2">
                            <span>Dashboard & Upholstery ({{ interiorScore() }}%)</span>
                            <span class="text-emerald-400">Grade B+</span>
                         </div>
                         <input type="range" min="30" max="100" [value]="interiorScore()" (input)="interiorScore.set(getSliderValue($event))" class="w-full accent-driveway-cyan bg-white/10" />
                         <span class="text-[9px] text-gray-500 mt-1 block">Checks air condition cooling, seat stitching</span>
                      </div>

                      <!-- 4. Body Shell & Paint -->
                      <div class="p-4 rounded-xl bg-white/5">
                         <div class="flex justify-between text-xs font-semibold uppercase text-gray-400 mb-2">
                            <span>Exterior Panels & Rust ({{ bodyScore() }}%)</span>
                            <span class="text-emerald-400">Grade A</span>
                         </div>
                         <input type="range" min="30" max="100" [value]="bodyScore()" (input)="bodyScore.set(getSliderValue($event))" class="w-full accent-driveway-cyan bg-white/10" />
                         <span class="text-[9px] text-gray-500 mt-1 block">Inspects paint thicknesses, chassis alignment</span>
                      </div>
                   </div>

                   <!-- PROFESSIONAL SUMMARY WRITING AREA -->
                   <div class="mb-8">
                      <label class="text-xs font-semibold uppercase text-gray-400 mb-2 block text-left">Professional Field Findings & Notes</label>
                      <textarea #inspectorNotes 
                                rows="3" 
                                placeholder="Log detailed observations e.g. Battery health checked out fine, slight scratches on mirror panel, engine runs like clockwork..." 
                                class="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-driveway-cyan transition-all"></textarea>
                   </div>

                   <div class="flex justify-end gap-3 border-t border-white/5 pt-6">
                      <button (click)="activeInspectionCar.set(null)" class="px-5 py-2.5 border border-white/10 text-white rounded-full text-xs font-semibold hover:bg-white/5 transition-colors">Discard Draft</button>
                      <button id="submit-inspection-btn" (click)="submitInspection(inspectorNotes.value)" class="px-6 py-2.5 bg-driveway-cyan text-black rounded-full text-xs font-bold hover:bg-cyan-400 transition-colors">Submit Report Findings to Admin</button>
                   </div>
                </div>
             }
          </div>

          <!-- RIGHT SECTION: COMPLETED INSPECTOR LOGS -->
          <div class="space-y-6 text-left">
             <div class="glass-panel p-6 rounded-2xl border border-white/5">
                <h3 class="font-display font-medium text-lg text-white mb-2">My Verified Logs</h3>
                <p class="text-xs text-gray-400 mb-6">Historical record of inspections submitted today</p>

                <div class="space-y-4">
                   @for (checked of historicalInspections(); track checked.id) {
                      <div class="p-4 bg-white/5 border border-emerald-500/10 rounded-xl relative overflow-hidden">
                         <span class="absolute top-0 right-0 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] font-bold uppercase rounded-bl">Inspected</span>
                         
                         <span class="text-[9px] text-driveway-cyan uppercase tracking-widest font-bold">SCORE: {{ checked.score }}% OVERALL</span>
                         <h4 class="font-display font-medium text-white text-sm mt-1">{{ checked.year }} {{ checked.make }} {{ checked.model }}</h4>
                         <p class="text-xs text-gray-400 mt-2 italic font-light">"{{ checked.inspectionDetails?.inspectorNotes }}"</p>
                      </div>
                   } @empty {
                      <div class="text-xs text-gray-500 py-6 text-center">
                         No logs uploaded yet. Grade a pending inspection on the left.
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
export class InspectorDashboardComponent {
  platformState = inject(PlatformStateService);

  isLoggedIn = signal<boolean>(false);
  activeInspectionCar = signal<Vehicle | null>(null);

  // Form signal states
  vinMatched = signal<boolean>(false);
  engineScore = signal<number>(92);
  brakesScore = signal<number>(90);
  interiorScore = signal<number>(94);
  bodyScore = signal<number>(88);

  // Computed checks
  pendingAssignments = computed(() => {
    return this.platformState.getListings().filter(v => v.status === 'Pending Inspection');
  });

  historicalInspections = computed(() => {
    return this.platformState.getListings().filter(v => v.status === 'Inspected' || (v.status === 'Approved' && v.isVerified));
  });

  beginInspectionForm(car: Vehicle) {
     this.activeInspectionCar.set(car);
     this.vinMatched.set(false);
     
     // default rating seeds
     this.engineScore.set(90 + Math.floor(Math.random() * 9));
     this.brakesScore.set(88 + Math.floor(Math.random() * 11));
     this.interiorScore.set(92 + Math.floor(Math.random() * 8));
     this.bodyScore.set(85 + Math.floor(Math.random() * 13));
  }

  toggleVINMatched() {
     this.vinMatched.set(!this.vinMatched());
  }

  getSliderValue(event: Event): number {
    const input = event.target as HTMLInputElement;
    return parseInt(input.value);
  }

  // Update inspection status on central state
  submitInspection(notesText: string) {
     const car = this.activeInspectionCar();
     if (!car) return;

     this.platformState.updateInspection(car.id, notesText || 'Powell mechanical checkups completed successfully. VIN codes matched physical plates and window plates.', {
        engine: this.engineScore(),
        brakes: this.brakesScore(),
        interior: this.interiorScore(),
        body: this.bodyScore(),
        transmission: Math.round((this.engineScore() + this.brakesScore()) / 2)
     });

     // Reset
     this.activeInspectionCar.set(null);
  }
}
