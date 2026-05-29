import { Component } from '@angular/core';

@Component({
  selector: 'app-quick-filters',
  standalone: true,
  template: `
    <div class="w-full border-y border-white/5 bg-driveway-black/80 backdrop-blur-xl sticky top-20 z-40">
       <div class="max-w-[1400px] mx-auto px-6 py-4 overflow-x-auto hide-scrollbar">
          <div class="flex items-center gap-3 w-max">
             @for(filter of filters; track filter.label) {
                <button class="px-5 py-2.5 rounded-full border border-white/10 bg-driveway-charcoal/40 text-sm font-medium text-gray-300 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-300 flex items-center gap-2" [class.!bg-driveway-gold]="filter.active" [class.!text-black]="filter.active" [class.!border-driveway-gold]="filter.active">
                   @if(filter.icon) {
                     <span class="text-lg opacity-80" [class.!opacity-100]="filter.active">{{ filter.icon }}</span>
                   }
                   {{ filter.label }}
                </button>
             }
          </div>
       </div>
    </div>
  `,
  styles: [`
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `]
})
export class QuickFiltersComponent {
   filters = [
      { label: 'All Vehicles', active: true },
      { label: 'Verified Only', icon: '✨' },
      { label: 'Luxury Offers', icon: '💎' },
      { label: 'SUVs', icon: '⛰️' },
      { label: 'Electric', icon: '⚡' },
      { label: 'Under ₦5M', icon: '💰' },
      { label: 'Family Cars', icon: '👨‍👩‍👧‍👦' },
      { label: 'Sedans', icon: '🛣️' },
      { label: 'First-Time Buyers', icon: '🔰' }
   ];
}
