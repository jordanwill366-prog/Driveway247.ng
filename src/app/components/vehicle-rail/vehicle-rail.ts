import { Component, input, output, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { VehicleCardComponent } from '../vehicle-card/vehicle-card';
import { Vehicle, PlatformStateService } from '../../services/platform-state';

@Component({
  selector: 'app-vehicle-rail',
  standalone: true,
  imports: [MatIconModule, VehicleCardComponent],
  template: `
    <section class="py-12 relative group/rail overflow-hidden select-none">
       <!-- Lateral cinematic fade masks for infinite discovery feeling on desktop -->
       <div class="absolute top-[80px] bottom-[20px] left-0 w-[8%] pointer-events-none z-20 rail-fade-mask-left hidden lg:block opacity-0 group-hover/rail:opacity-100 transition-opacity duration-700"></div>
       <div class="absolute top-[80px] bottom-[20px] right-0 w-[8%] pointer-events-none z-20 rail-fade-mask-right hidden lg:block opacity-0 group-hover/rail:opacity-100 transition-opacity duration-700"></div>

       <div class="max-w-[1400px] mx-auto px-6">
          <div class="flex items-end justify-between mb-8">
             <div class="transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
                <span class="text-driveway-gold/80 font-bold uppercase tracking-[0.25em] text-[10px] mb-2 block animate-pulse">Ecosystem discoveries</span>
                <h2 class="text-3xl font-display font-medium text-white tracking-tight">{{ title() }}</h2>
                @if(subtitle()) {
                   <p class="text-gray-400 mt-1.5 font-light text-xs leading-relaxed max-w-xl">{{ subtitle() }}</p>
                }
             </div>
             
             <div class="hidden md:flex items-center gap-3">
                <a href="#" class="luxury-link text-driveway-gold hover:text-white transition-all text-xs font-bold uppercase tracking-[0.2em] mr-6 flex items-center gap-1.5 group/all">
                   View All <mat-icon class="text-[16px] w-[16px] h-[16px] group-hover/all:translate-x-1.5 transition-transform duration-300">arrow_forward</mat-icon>
                </a>
                
                <button (click)="scrollLeft(railContainer)" class="button-magnetic w-11 h-11 rounded-full border border-white/10 bg-driveway-charcoal/45 hover:bg-white/5 active:scale-95 flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.08)]">
                   <mat-icon class="text-white/85">chevron_left</mat-icon>
                </button>
                <button (click)="scrollRight(railContainer)" class="button-magnetic w-11 h-11 rounded-full border border-white/10 bg-driveway-charcoal/45 hover:bg-white/5 active:scale-95 flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.08)]">
                   <mat-icon class="text-white/85">chevron_right</mat-icon>
                </button>
             </div>
          </div>
       </div>

       <!-- Horizontal Scroll Container with custom inertia behavior -->
       <div #railContainer class="w-full overflow-x-auto pb-4 hide-scrollbar pl-6 md:pl-[calc(50vw-700px+24px)] pr-6 scroll-smooth snap-x snap-mandatory">
          <div class="flex gap-6 w-max py-4">
             @for(vehicle of vehicles(); track vehicle.id || vehicle.model; let idx = $index) {
                  <div class="snap-start animate-luxury-reveal opacity-0" [style.animation-delay.ms]="idx * 120">
                     <app-vehicle-card
                        [width]="340"
                        [image]="vehicle.image"
                        [year]="vehicle.year"
                        [make]="vehicle.make"
                        [model]="vehicle.model"
                        [price]="vehicle.price"
                        [mileage]="vehicle.mileage"
                        [location]="vehicle.location"
                        [dealer]="vehicle.dealer"
                        [isVerified]="vehicle.isVerified"
                        [hasEscrow]="vehicle.hasEscrow"
                        [score]="vehicle.score || '95'"
                        [fuel]="vehicle.fuel || 'Petrol'"
                        [transmission]="vehicle.transmission || 'Automatic'"
                        [financeAvailable]="vehicle.financeAvailable || false"
                        [isSaved]="platformState.savedVehicleIds().includes(vehicle.id)"
                        (saveClick)="platformState.toggleFavorite(vehicle.id)"
                        (cardClick)="onVehicleSelect(vehicle)">
                     </app-vehicle-card>
                  </div>
             }
             
             <div class="w-[100px] shrink-0"></div> <!-- Padding end -->
          </div>
       </div>
    </section>
  `,
  styles: [`
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
    }
  `]
})
export class VehicleRailComponent {
   title = input.required<string>();
   subtitle = input<string>();
   vehicles = input.required<Vehicle[]>();

   platformState = inject(PlatformStateService);

   // Relays click
   vehicleClick = output<Vehicle>();

   onVehicleSelect(vehicle: Vehicle) {
     this.vehicleClick.emit(vehicle);
   }

   // Weighted, responsive scrolling momentum simulation with luxury easing
   scrollLeft(el: HTMLDivElement) {
      this.animateScroll(el, -740);
   }

   scrollRight(el: HTMLDivElement) {
      this.animateScroll(el, 740);
   }

   private animateScroll(el: HTMLDivElement, offset: number) {
      const startTime = performance.now();
      const startScroll = el.scrollLeft;
      const duration = 850; // slow luxury glide duration

      // Easing function: Cubic Out (smooth deceleration)
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

      const step = (currentTime: number) => {
         const elapsed = currentTime - startTime;
         const progress = Math.min(elapsed / duration, 1);
         const easedProgress = easeOutCubic(progress);
         
         el.scrollLeft = startScroll + (offset * easedProgress);

         if (progress < 1) {
            requestAnimationFrame(step);
         }
      };

      requestAnimationFrame(step);
   }
}
