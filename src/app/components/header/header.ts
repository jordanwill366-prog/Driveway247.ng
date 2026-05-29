import { Component, HostListener, signal, inject, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PlatformStateService } from '../../services/platform-state';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, NgClass, RouterLink, RouterLinkActive],
  template: `
    <header class="fixed top-0 inset-x-0 z-50 transition-all duration-[600ms] cubic-bezier(0.16,1,0.3,1)" 
            [ngClass]="isScrolled() ? 'bg-driveway-black/85 backdrop-blur-2xl py-3 border-b border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.45)]' : 'bg-transparent py-5.5 border-b border-transparent'">
      <div class="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
         
         <!-- Left: Branding & Core Navigation Links -->
         <div class="flex items-center gap-10 select-none">
            <!-- Logo with luxury scale bounce and glow -->
            <a routerLink="/" class="flex items-center gap-3 group">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-driveway-gold to-amber-700 flex items-center justify-center shadow-[0_0_20px_rgba(235,177,91,0.25)] group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(235,177,91,0.4)] transition-all duration-500">
                 <mat-icon class="text-white text-base w-5 h-5">directions_car</mat-icon>
              </div>
              <span class="font-display font-bold text-2xl tracking-tight text-white group-hover:drop-shadow-[0_0_12px_rgba(235,177,91,0.25)] transition-all duration-500">Driveway247<span class="text-driveway-gold font-light">.ng</span></span>
            </a>
            
            <!-- Buyer Luxury Navigation Bar -->
            <nav class="hidden xl:flex items-center gap-8">
               <button (click)="scrollToShowroom()" class="luxury-link text-sm font-medium text-gray-400 hover:text-white transition-colors pb-1.5 tracking-wide relative cursor-pointer bg-transparent border-none outline-none">
                  Browse
               </button>

               <button (click)="scrollToCategories()" class="luxury-link text-sm font-medium text-gray-400 hover:text-white transition-colors pb-1.5 tracking-wide relative cursor-pointer bg-transparent border-none outline-none">
                  Categories
               </button>

               <button (click)="scrollToShowroom()" class="luxury-link text-sm font-medium text-gray-400 hover:text-white transition-colors pb-1.5 flex items-center gap-1.5 tracking-wide cursor-pointer bg-transparent border-none outline-none">
                  Saved Vehicles
                  @if (favoritesCount() > 0) {
                     <span class="px-1.5 py-0.5 bg-driveway-gold/25 text-driveway-gold text-[9px] font-bold rounded shadow-[0_0_10px_rgba(235,177,91,0.3)]">{{ favoritesCount() }}</span>
                  }
               </button>

               <button (click)="showOffersPlaceholder()" class="luxury-link text-sm font-medium text-gray-400 hover:text-white transition-colors pb-1.5 flex items-center gap-1.5 tracking-wide cursor-pointer bg-transparent border-none outline-none">
                  Offers
               </button>

               <a href="mailto:concierge@driveway247.ng" class="luxury-link text-sm font-medium text-gray-400 hover:text-white transition-colors pb-1.5 flex items-center gap-1.5 tracking-wide cursor-pointer">
                  Support
               </a>

               <button (click)="toggleAccount()" class="luxury-link text-sm font-medium text-gray-400 hover:text-white transition-colors pb-1.5 flex items-center gap-1.5 tracking-wide cursor-pointer bg-transparent border-none outline-none">
                  Account
               </button>
            </nav>
         </div>

         <!-- Right: Action Icons & Custom Account Dropdoors -->
         <div class="flex items-center gap-3 md:gap-4 select-none">
            <!-- Smart Notification Tray Trigger -->
            <div class="relative">
               <button (click)="toggleNotifications()" class="button-magnetic w-11 h-11 rounded-full border border-white/10 flex items-center justify-center bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/15 transition-all duration-300 relative cursor-pointer">
                  <mat-icon class="text-[20px] w-5 h-5">notifications</mat-icon>
                  @if (favoritesCount() > 0) {
                     <span class="absolute top-1 text-[8px] right-1 h-2 w-2 rounded-full bg-driveway-gold shadow-[0_0_12px_#ebb15b] animate-ping"></span>
                     <span class="absolute top-1 right-1 h-2 w-2 rounded-full bg-driveway-gold shadow-[0_0_10px_#ebb15b]"></span>
                  }
               </button>

               @if (showNotifications()) {
                  <div class="absolute right-0 mt-3.5 w-80 rounded-2xl border border-white/10 bg-driveway-charcoal/95 backdrop-blur-3xl p-4 shadow-[0_30px_60px_rgba(0,0,0,0.85)] z-50 animate-luxury-reveal text-xs space-y-3">
                     <div class="flex items-center justify-between border-b border-white/5 pb-2">
                        <span class="font-bold text-white uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                           <mat-icon class="text-driveway-gold text-xs">radio_button_checked</mat-icon> Verified Activity Row
                        </span>
                        <span class="text-driveway-gold font-mono text-[9px]">CONCIERGE PLATFORM</span>
                     </div>
                     
                     <div class="space-y-3 max-h-[220px] overflow-y-auto">
                        <div class="bg-white/[0.03] p-2.5 rounded-lg flex items-start gap-2.5 border border-white/5 hover:bg-white/5 transition-colors">
                           <span class="text-driveway-cyan text-sm">✨</span>
                           <div>
                              <p class="text-white font-medium text-[11px]">Lexus RX350 certified</p>
                              <p class="text-[9.5px] text-gray-400">150-Point physical inspection report completed</p>
                           </div>
                        </div>
                        <div class="bg-white/[0.03] p-2.5 rounded-lg flex items-start gap-2.5 border border-white/5 hover:bg-white/5 transition-colors">
                           <span class="text-driveway-gold text-sm">🔒</span>
                           <div>
                              <p class="text-white font-medium text-[11px]">Escrow protection configured</p>
                              <p class="text-[9.5px] text-gray-400">Escrow funds fully protected until handover validation</p>
                           </div>
                        </div>
                        <div class="bg-white/[0.03] p-2.5 rounded-lg flex items-start gap-2.5 border border-white/5 hover:bg-white/5 transition-colors">
                           <span class="text-driveway-gold text-sm">✉️</span>
                           <div>
                              <p class="text-white font-medium text-[11px]">Dealer counteroffer prepared</p>
                              <p class="text-[9.5px] text-gray-400">Your custom contract terms were cleared</p>
                           </div>
                        </div>
                     </div>
                  </div>
               }
            </div>

            <!-- Favorites Counter Badge with spring hover bounce -->
            <button (click)="scrollToShowroom()" class="button-magnetic w-11 h-11 rounded-full border border-white/10 flex items-center justify-center bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/15 transition-all duration-300 relative cursor-pointer">
               <mat-icon class="text-[20px] w-5 h-5">favorite</mat-icon>
               @if (favoritesCount() > 0) {
                  <span class="absolute -top-1.5 -right-1.5 bg-driveway-gold text-black font-display font-extrabold text-[10px] h-5 w-5 rounded-full flex items-center justify-center border border-driveway-black shadow-lg scale-90 transition-all duration-300 animate-luxury-reveal">{{ favoritesCount() }}</span>
               }
            </button>

            <!-- Account Button with Workspace selector -->
            <div class="relative">
                @if (activeSession(); as session) {
                   <button (click)="toggleAccount()" class="button-magnetic flex items-center gap-2.5 px-4.5 py-2.5 bg-gradient-to-r from-driveway-charcoal to-black border border-white/10 hover:border-driveway-gold/50 rounded-full transition-all text-xs font-semibold uppercase text-white tracking-widest cursor-pointer">
                      <div class="w-6 h-6 rounded-full bg-driveway-gold text-black font-bold flex items-center justify-center text-[10px] shadow">{{ session.fullName[0] }}</div>
                      <span class="hidden sm:inline text-[10.5px] mr-1">{{ session.fullName }}</span>
                      <mat-icon class="text-gray-400 text-sm w-4 h-4">keyboard_arrow_down</mat-icon>
                   </button>

                   @if (showAccountMenu()) {
                      <div class="absolute right-0 mt-3.5 w-64 rounded-2xl border border-white/10 bg-driveway-charcoal/90 backdrop-blur-3xl p-3 shadow-[0_30px_60px_rgba(0,0,0,0.85)] z-50 animate-luxury-reveal text-xs space-y-1">
                         <p class="text-gray-400 font-bold text-[9px] uppercase tracking-wider px-3 py-2.5 border-b border-white/5 mb-2.5 text-center">{{ session.role }} Terminal</p>
                         @if (session.role === 'Buyer') {
                            <button (click)="scrollToShowroom()" class="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-white/5 rounded-xl text-gray-200 hover:text-white transition-all duration-300 text-left cursor-pointer bg-transparent border-none">
                               <mat-icon class="text-driveway-cyan text-sm">explore</mat-icon>
                               <span class="font-medium">Browse Showroom</span>
                            </button>
                            <button (click)="scrollToShowroom()" class="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-white/5 rounded-xl text-gray-200 hover:text-white transition-all duration-300 text-left cursor-pointer bg-transparent border-none">
                               <mat-icon class="text-driveway-gold text-sm">favorite</mat-icon>
                               <span class="font-medium">My Watchlist</span>
                            </button>
                            <button (click)="showOffersPlaceholder()" class="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-white/5 rounded-xl text-gray-200 hover:text-white transition-all duration-300 text-left cursor-pointer bg-transparent border-none">
                               <mat-icon class="text-driveway-cyan text-sm">gavel</mat-icon>
                               <span class="font-medium">My Offer Folders</span>
                            </button>
                         } @else if (session.role === 'Seller') {
                            <a routerLink="/seller/dashboard" class="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-white/5 rounded-xl text-gray-200 hover:text-white transition-all text-left block">
                               <mat-icon class="text-driveway-gold text-sm">storefront</mat-icon>
                               <span class="font-medium">Dealer Workspace</span>
                            </a>
                         } @else if (session.role === 'Admin') {
                            <a routerLink="/admin/dashboard" class="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-white/5 rounded-xl text-gray-200 hover:text-white transition-all text-left block">
                               <mat-icon class="text-red-400 text-sm">security</mat-icon>
                               <span class="font-medium">Admin Console</span>
                            </a>
                         }
                         <div class="h-px bg-white/5 my-2"></div>
                         <button (click)="onSignOut()" class="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-white/5 rounded-xl text-gray-400 hover:text-red-400 transition-all duration-300 text-left cursor-pointer bg-transparent border-none">
                            <mat-icon class="text-sm">logout</mat-icon>
                            <span class="font-medium">Sign Out</span>
                         </button>
                      </div>
                   }
                } @else {
                   <!-- Sleek authentication link for showroom buyers -->
                   <a routerLink="/auth" class="button-magnetic flex items-center gap-2 px-4.5 py-2 bg-driveway-gold text-black rounded-full hover:bg-amber-400 transition-all text-xs font-semibold uppercase tracking-wider cursor-pointer font-sans">
                      <mat-icon class="text-sm">lock_open</mat-icon> Sign In
                   </a>
                }
            </div>
            
            <!-- Mobile drawer button -->
            <button (click)="toggleMobileMenu()" class="xl:hidden w-11 h-11 rounded-full border border-white/10 flex items-center justify-center bg-white/5 text-white hover:bg-white/10 transition-colors">
               <mat-icon>{{ showMobileMenu() ? 'close' : 'menu' }}</mat-icon>
            </button>
         </div>
      </div>

      <!-- Mobile navigation sliding menu for Buyers -->
      @if (showMobileMenu()) {
        <div class="xl:hidden w-full bg-driveway-black border-t border-white/10 py-6 px-6 space-y-4 animate-luxury-reveal relative z-50">
           <button (click)="scrollToShowroom()" class="w-full text-left text-sm font-semibold text-white py-2 flex items-center gap-2 bg-transparent border-none outline-none"><mat-icon>explore</mat-icon> Browse Showroom</button>
           <button (click)="scrollToCategories()" class="w-full text-left text-sm font-semibold text-white py-2 flex items-center justify-between bg-transparent border-none outline-none"><span class="flex items-center gap-2"><mat-icon>category</mat-icon> Grid Categories</span></button>
           <button (click)="scrollToShowroom()" class="w-full text-left text-sm font-semibold text-white py-2 flex items-center justify-between bg-transparent border-none outline-none"><span class="flex items-center gap-2"><mat-icon>favorite</mat-icon> Watchlist</span> <span class="px-1.5 py-0.5 bg-driveway-gold/20 text-driveway-gold text-[10px] rounded font-bold">{{ favoritesCount() }}</span></button>
           <button (click)="showOffersPlaceholder()" class="w-full text-left text-sm font-semibold text-white py-2 flex items-center justify-between bg-transparent border-none outline-none"><span class="flex items-center gap-2"><mat-icon>gavel</mat-icon> Live Offers</span></button>
        </div>
      }
    </header>
  `
})
export class HeaderComponent {
  isScrolled = signal(false);
  showMobileMenu = signal(false);
  
  // Custom interactive dropdown signals
  showNotifications = signal(false);
  showAccountMenu = signal(false);

  platformState = inject(PlatformStateService);

  // Computed link to central sessions
  activeSession = computed(() => this.platformState.getSession());

  // Read signals from state service
  favoritesCount = computed(() => {
     return this.platformState.savedVehicleIds().length;
  });

  onSignOut() {
    this.closeDropdowns();
    this.platformState.logout();
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  toggleNotifications() {
     this.showNotifications.set(!this.showNotifications());
     this.showAccountMenu.set(false);
  }

  toggleAccount() {
     this.showAccountMenu.set(!this.showAccountMenu());
     this.showNotifications.set(false);
  }

  closeDropdowns() {
     this.showAccountMenu.set(false);
     this.showNotifications.set(false);
     this.showMobileMenu.set(false);
  }

  toggleMobileMenu() {
     this.showMobileMenu.set(!this.showMobileMenu());
  }

  scrollToShowroom() {
     this.closeDropdowns();
     if (typeof window === 'undefined') return;
     const el = document.getElementById('sticky-filters');
     if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
     }
  }

  scrollToCategories() {
     this.closeDropdowns();
     if (typeof window === 'undefined') return;
     const el = document.getElementById('sticky-filters');
     if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
     }
  }

  showOffersPlaceholder() {
     this.closeDropdowns();
     alert('Offers Console: Current price quotes and negotiation archives are securely managed via the concierge desk. Tap on any vehicle from the showroom list to trigger direct negotiations and secure escrow payments.');
  }
}
