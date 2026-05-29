import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';

@Component({
   selector: 'app-vehicle-card',
   standalone: true,
   imports: [MatIconModule, NgClass],
   template: `
    <div (click)="selectCard()" class="group relative rounded-2xl overflow-hidden glass-panel border border-white/5 bg-driveway-charcoal/30 cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.85)] hover:border-white/15 hover:bg-driveway-charcoal/45 flex flex-col shrink-0" [style.width.px]="width()">
       
       <!-- Premium cinematic metallic sheen reflection sweep across vehicle card on hover -->
       <div class="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          <div class="w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -skew-x-[25deg] -translate-x-[110%] group-hover:translate-x-[150%] transition-transform duration-[1250ms] ease-[cubic-bezier(0.16,1,0.3,1)]"></div>
       </div>

       <div class="relative w-full h-[220px] overflow-hidden bg-driveway-black/50">
          <!-- Image with slow luxury scale animation -->
          <img [src]="image()" alt="Vehicle" class="w-full h-full object-cover transition-transform duration-[2.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-108" referrerpolicy="no-referrer" />
          
          <!-- Badges -->
          <div class="absolute top-4 left-4 flex flex-col gap-2 z-10 transition-all duration-500 group-hover:translate-x-1">
             @if(isVerified()) {
                <div class="px-2.5 py-1 bg-driveway-black/80 backdrop-blur-md rounded border border-driveway-cyan/40 flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.35)]">
                   <mat-icon class="text-driveway-cyan text-[14px] w-[14px] h-[14px]">verified</mat-icon>
                   <span class="text-[10px] font-bold tracking-widest text-driveway-cyan uppercase">Verified</span>
                </div>
             }
             @if(hasEscrow()) {
                   <div class="px-2.5 py-1 bg-driveway-black/80 backdrop-blur-md rounded border border-driveway-gold/40 flex items-center gap-1.5 shadow-[0_0_15px_rgba(235,177,91,0.25)]">
                     <mat-icon class="text-driveway-gold text-[14px] w-[14px] h-[14px]">lock</mat-icon>
                     <span class="text-[10px] font-bold tracking-widest text-driveway-gold uppercase">Escrow</span>
                  </div>
             }
          </div>

          <!-- Save Button with highly tactile spring scale feedback -->
          <button (click)="$event.stopPropagation(); onSaveToggle()" class="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-driveway-black/70 backdrop-blur-md flex items-center justify-center border border-white/10 transition-all duration-500 opacity-100 xl:opacity-0 group-hover:opacity-100 xl:translate-y-2 group-hover:translate-y-0 active:scale-90" [ngClass]="isSaved() ? 'text-[#ef4444] border-red-500/25 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.35)]' : 'text-white/70 hover:text-white hover:bg-white/20'">
             <mat-icon class="text-[18px] w-[18px] h-[18px]" [ngClass]="{'scale-110 active:scale-90': isSaved()}">{{ isSaved() ? 'favorite' : 'favorite_border' }}</mat-icon>
          </button>
          
          <div class="absolute inset-0 bg-gradient-to-t from-driveway-charcoal via-transparent to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-75"></div>
          
          <!-- Inspection Score with circular shadow pulse -->
          <div class="absolute bottom-4 left-4 flex items-center gap-1.5 z-10">
             <div class="w-8 h-8 rounded-full border-2 border-driveway-cyan flex items-center justify-center bg-driveway-black/95 text-xs font-bold text-driveway-cyan shadow-[0_0_12px_rgba(6,182,212,0.4)]">{{ score() }}</div>
             <span class="text-[10px] font-medium tracking-wide text-gray-300 drop-shadow-md transition-transform duration-500 group-hover:translate-x-1">Inspection<br>Score</span>
          </div>
       </div>

       <!-- Content -->
       <div class="p-5 relative flex flex-col flex-grow">
          <!-- Price tag with dynamic depth lift on hover -->
          <div class="absolute -top-6 right-5 px-4 py-2 bg-gradient-to-br from-gray-100 to-white text-black font-display font-semibold rounded-lg shadow-[0_10px_20px_rgba(0,0,0,0.4)] text-lg border border-white/20 group-hover:-translate-y-1.5 transition-all duration-300 group-hover:shadow-[0_15px_25px_rgba(255,255,255,0.1)]">
             ₦{{ price() }}
          </div>

          <p class="text-driveway-gold text-[10px] font-bold tracking-widest uppercase mb-1 transition-all duration-300 group-hover:translate-x-0.5">{{ year() }} &middot; {{ make() }}</p>
          <h3 class="text-lg font-display font-medium text-white mb-4 leading-tight line-clamp-1 transition-all duration-300 group-hover:text-driveway-gold">{{ model() }}</h3>
          
          <div class="grid grid-cols-2 gap-y-3 gap-x-2 text-xs text-gray-400 mb-5">
             <span class="flex items-center gap-1.5 transition-all duration-300 group-hover:text-gray-300"><mat-icon class="text-[14px] w-[14px] h-[14px] text-gray-500">speed</mat-icon> {{ mileage() }}</span>
             <span class="flex items-center gap-1.5 transition-all duration-300 group-hover:text-gray-300"><mat-icon class="text-[14px] w-[14px] h-[14px] text-gray-500">local_gas_station</mat-icon> {{ fuel() }}</span>
             <span class="flex items-center gap-1.5 transition-all duration-300 group-hover:text-gray-300"><mat-icon class="text-[14px] w-[14px] h-[14px] text-gray-500">settings</mat-icon> {{ transmission() }}</span>
             <span class="flex items-center gap-1.5 line-clamp-1 transition-all duration-300 group-hover:text-gray-300"><mat-icon class="text-[14px] w-[14px] h-[14px] text-gray-500">location_on</mat-icon> {{ location() }}</span>
          </div>

          <div class="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
             <div class="flex items-center gap-2 group/dealer select-none">
                <div class="w-6 h-6 rounded-full bg-driveway-charcoal-light flex items-center justify-center border border-white/10 transition-all duration-300 group-hover/dealer:border-driveway-gold/30">
                   <mat-icon class="text-[12px] w-[12px] h-[12px] text-gray-400">storefront</mat-icon>
                </div>
                <span class="text-xs text-gray-300 font-medium truncate max-w-[120px] transition-all duration-350 group-hover/dealer:text-white">{{ dealer() }}</span>
             </div>
             
             <!-- Finance Tag with high-glow accent -->
             @if(financeAvailable()) {
                <span class="text-[10px] font-semibold text-driveway-gold tracking-widest uppercase animate-pulse select-none bg-driveway-gold/10 px-2 py-0.5 rounded-full border border-driveway-gold/15">FINANCE</span>
             }
          </div>
       </div>
    </div>
   `
})
export class VehicleCardComponent {
   image = input.required<string>();
   year = input.required<string>();
   make = input.required<string>();
   model = input.required<string>();
   price = input.required<string>();
   mileage = input.required<string>();
   location = input.required<string>();
   dealer = input.required<string>();
   isVerified = input<boolean>(true);
   hasEscrow = input<boolean>(true);
   
   // New inputs
   fuel = input<string>('Petrol');
   transmission = input<string>('Automatic');
   score = input<string>('95');
   financeAvailable = input<boolean>(false);
   width = input<number>(320); // Default width for rail presentation
   isSaved = input<boolean>(false);

   // Event emitter
   cardClick = output<void>();
   saveClick = output<void>();

   selectCard() {
      this.cardClick.emit();
   }

   onSaveToggle() {
      this.saveClick.emit();
   }
}
