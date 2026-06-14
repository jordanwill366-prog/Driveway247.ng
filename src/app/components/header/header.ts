import { Component, HostListener, signal, inject, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { PlatformStateService, UserAccount } from '../../services/platform-state';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, NgClass, RouterLink, RouterLinkActive],
  template: `
    <header class="fixed top-0 inset-x-0 z-50 transition-all duration-500 cubic-bezier(0.16,1,0.3,1)" 
            [ngClass]="isScrolled() ? 'bg-driveway-black/90 backdrop-blur-2xl py-3 border-b border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.4)]' : 'bg-transparent py-5 border-b border-transparent'">
      <div class="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
         
         <!-- Left: Branding & Core Navigation Links -->
         <div class="flex items-center gap-10 select-none">
            <!-- Logo with luxury scale bounce and glow -->
            <a routerLink="/" class="flex items-center gap-3 group">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-driveway-gold to-amber-600 flex items-center justify-center shadow-[0_0_20px_rgba(235,177,91,0.2)] group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(235,177,91,0.35)] transition-all duration-500 border border-white/10">
                 <mat-icon class="text-white text-base w-5 h-5">hive</mat-icon>
              </div>
              <div class="flex flex-col">
                <span class="font-display font-medium text-xl tracking-widest text-white uppercase group-hover:tracking-[0.16em] transition-all duration-500">
                  CARVELLO
                </span>
                <span class="text-[8px] font-mono tracking-[0.3em] text-driveway-gold uppercase font-bold leading-none -mt-0.5">
                  DNA ECOSYSTEM™
                </span>
              </div>
            </a>
            
            <!-- Buyer Luxury Navigation Bar -->
            <nav class="hidden xl:flex items-center gap-8">
               <button (click)="scrollToShowroom()" class="luxury-link text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-white transition-colors pb-1 cursor-pointer bg-transparent border-none outline-none">
                  Collection Showrooms
               </button>

               <button (click)="scrollToCategories()" class="luxury-link text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-white transition-colors pb-1 cursor-pointer bg-transparent border-none outline-none">
                  Curated Categories
               </button>

               <button (click)="openSavedGarage()" class="luxury-link text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-white transition-colors pb-1 flex items-center gap-1.5 cursor-pointer bg-transparent border-none outline-none">
                  Saved Garage
                  @if (favoritesCount() > 0) {
                     <span class="px-1.5 py-0.5 bg-driveway-gold/20 text-driveway-gold text-[8px] font-bold rounded-md border border-driveway-gold/30">{{ favoritesCount() }}</span>
                  }
               </button>

               <button (click)="showOffersPlaceholder()" class="luxury-link text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-white transition-colors pb-1 flex items-center gap-1.5 cursor-pointer bg-transparent border-none outline-none">
                  Negotiation Hub
               </button>

               <button (click)="scrollToConcierge()" class="luxury-link text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-white transition-colors pb-1 flex items-center gap-1.5 cursor-pointer bg-transparent border-none outline-none">
                  Concierge Desk
               </button>
            </nav>
         </div>

         <!-- Right: Theme Switcher, Action Icons & Custom Account Dropdoors -->
         <div class="flex items-center gap-3 md:gap-4 select-none">
            
            <!-- Dynamic Theme Selector Dropdown -->
            <div class="relative">
               <button (click)="toggleThemeMenu()" class="button-magnetic w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/15 transition-all duration-300 cursor-pointer" title="Select Appearance Theme">
                  <mat-icon class="text-[18px] w-5 h-5 leading-none">palette</mat-icon>
               </button>
               
               @if (showThemeMenu()) {
                  <div class="absolute right-0 mt-3 w-56 rounded-2xl border border-white/10 bg-[#121212]/95 backdrop-blur-2xl p-2.5 shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-50 animate-luxury-reveal space-y-1">
                     <p class="text-gray-500 font-bold text-[8px] uppercase tracking-widest px-2.5 py-1.5 border-b border-white/5 mb-1 text-center">Appearance Palette</p>
                     
                     <button (click)="onSelectTheme('Executive Black')" class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all hover:bg-white/5" [ngClass]="activeTheme() === 'Executive Black' ? 'text-driveway-gold bg-white/[0.03]' : 'text-gray-300 hover:text-white'">
                        <div class="flex items-center gap-2">
                           <span class="w-2.5 h-2.5 rounded-full bg-[#ebb15b] border border-white/10"></span>
                           <span class="text-xs font-medium">Executive Black</span>
                        </div>
                        @if (activeTheme() === 'Executive Black') { <mat-icon class="text-xs text-driveway-gold">check</mat-icon> }
                     </button>

                     <button (click)="onSelectTheme('Midnight Drive')" class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all hover:bg-white/5" [ngClass]="activeTheme() === 'Midnight Drive' ? 'text-emerald-400 bg-white/[0.03]' : 'text-gray-300 hover:text-white'">
                        <div class="flex items-center gap-2">
                           <span class="w-2.5 h-2.5 rounded-full bg-[#10b981] border border-white/10"></span>
                           <span class="text-xs font-medium">Midnight Drive</span>
                        </div>
                        @if (activeTheme() === 'Midnight Drive') { <mat-icon class="text-xs text-emerald-400">check</mat-icon> }
                     </button>

                     <button (click)="onSelectTheme('Showroom Light')" class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all hover:bg-white/5" [ngClass]="activeTheme() === 'Showroom Light' ? 'text-neutral-900 bg-white/[0.03]' : 'text-gray-300 hover:text-white'">
                        <div class="flex items-center gap-2">
                           <span class="w-2.5 h-2.5 rounded-full bg-[#0f172a] border border-gray-300"></span>
                           <span class="text-xs font-medium">Showroom Light</span>
                        </div>
                        @if (activeTheme() === 'Showroom Light') { <mat-icon class="text-xs text-neutral-900">check</mat-icon> }
                     </button>

                     <button (click)="onSelectTheme('Ocean Blue')" class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all hover:bg-white/5" [ngClass]="activeTheme() === 'Ocean Blue' ? 'text-sky-400 bg-white/[0.03]' : 'text-gray-300 hover:text-white'">
                        <div class="flex items-center gap-2">
                           <span class="w-2.5 h-2.5 rounded-full bg-[#38bdf8] border border-white/10"></span>
                           <span class="text-xs font-medium">Ocean Blue</span>
                        </div>
                        @if (activeTheme() === 'Ocean Blue') { <mat-icon class="text-xs text-sky-400">check</mat-icon> }
                     </button>
                  </div>
               }
            </div>

            <!-- Smart Activity/Notification Tray -->
            <div class="relative">
               <button (click)="toggleNotifications()" class="button-magnetic w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/15 transition-all duration-300 cursor-pointer">
                  <mat-icon class="text-[18px] w-5 h-5">notifications</mat-icon>
                  @if (favoritesCount() > 0) {
                     <span class="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-driveway-gold shadow-[0_0_8px_var(--color-driveway-gold)] animate-pulse"></span>
                  }
               </button>

               @if (showNotifications()) {
                  <div class="absolute right-0 mt-3 w-80 rounded-2xl border border-white/10 bg-driveway-charcoal/95 backdrop-blur-3xl p-4 shadow-[0_30px_60px_rgba(0,0,0,0.85)] z-50 animate-luxury-reveal text-xs space-y-3 font-sans">
                     <div class="flex items-center justify-between border-b border-white/5 pb-2">
                        <span class="font-bold text-white uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                           <mat-icon class="text-driveway-gold text-xs">radio_button_checked</mat-icon> Activity Monitor
                        </span>
                        <span class="text-driveway-gold font-mono text-[8px] uppercase tracking-widest font-semibold">CARVELLO DNA™</span>
                     </div>
                     
                     <div class="space-y-3 max-h-[220px] overflow-y-auto font-sans">
                        <div class="bg-white/[0.02] p-2.5 rounded-xl flex items-start gap-2.5 border border-white/5 hover:bg-white/5 transition-colors">
                           <span class="text-driveway-cyan text-sm">✨</span>
                           <div>
                              <p class="text-white font-medium text-[11px]">Showroom Status Cleared</p>
                              <p class="text-[9.5px] text-gray-400">150-Point physical diagnostic completed on Lexus RX350.</p>
                           </div>
                        </div>
                        <div class="bg-white/[0.02] p-2.5 rounded-xl flex items-start gap-2.5 border border-white/5 hover:bg-white/5 transition-colors">
                           <span class="text-driveway-gold text-sm font-bold">🔒</span>
                           <div>
                              <p class="text-white font-medium text-[11px]">Escrow Channel Configured</p>
                              <p class="text-[9.5px] text-gray-400">Transactions are protected by modern escrow. Safeguarded until physical delivery.</p>
                           </div>
                        </div>
                     </div>
                  </div>
               }
            </div>

            <!-- Profile/Workspace Menu with Role Switcher -->
            <div class="relative">
                @if (activeSession(); as session) {
                   <button (click)="toggleAccount()" class="button-magnetic flex items-center gap-2.5 px-4 py-2 bg-white/5 border border-white/10 hover:border-driveway-gold/40 rounded-xl transition-all text-xs font-semibold text-white tracking-widest cursor-pointer">
                      <div class="w-6 h-6 rounded-lg bg-gradient-to-br from-driveway-gold to-amber-600 text-white font-bold flex items-center justify-center text-[10px] shadow border border-white/10">{{ session.fullName[0] }}</div>
                      <span class="hidden sm:inline text-[10px] uppercase font-bold">{{ session.fullName }}</span>
                      <mat-icon class="text-gray-400 text-sm w-4 h-4 leading-none">keyboard_arrow_down</mat-icon>
                   </button>

                   @if (showAccountMenu()) {
                      <div class="absolute right-0 mt-3 w-72 rounded-2xl border border-white/10 bg-[#121212]/95 backdrop-blur-2xl p-3.5 shadow-[0_30px_60px_rgba(0,0,0,0.85)] z-50 animate-luxury-reveal text-xs space-y-3 font-sans">
                         <!-- User Profile Card -->
                         <div class="pb-3 border-b border-white/5">
                            <span class="text-[9px] font-mono tracking-widest uppercase text-driveway-gold font-bold">Unified Identity</span>
                            <h4 class="text-sm font-display font-medium text-white mt-1">{{ session.fullName }}</h4>
                            <p class="text-[10px] text-gray-400 font-mono mt-0.5">{{ session.email }}</p>
                            <span class="inline-flex mt-2 px-2 py-0.5 bg-exclude-theme-glow bg-driveway-gold/15 text-driveway-gold border border-driveway-gold/25 rounded font-mono text-[9px] uppercase tracking-wider font-bold">
                               Active Workspace: {{ session.role === 'Seller' ? 'Dealer' : session.role === 'Broker' ? 'Verified Broker' : session.role }}
                            </span>
                         </div>

                         <!-- Native Role Switcher Panel (One Identity. Multiple Roles) -->
                         @if (session.unlockedRoles && session.unlockedRoles.length > 1) {
                            <div class="bg-white/[0.02] p-2.5 rounded-xl border border-white/5 space-y-2">
                               <p class="text-[8px] font-mono font-bold tracking-widest uppercase text-gray-500 mb-1 leading-none">Switch Workspace</p>
                               <div class="grid grid-cols-1 gap-1.5">
                                  @for (unlockedRole of session.unlockedRoles; track unlockedRole) {
                                     <button (click)="onSwitchActiveRole(unlockedRole)" 
                                             class="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all"
                                             [ngClass]="session.role === unlockedRole ? 'bg-driveway-gold/15 text-driveway-gold border border-driveway-gold/25' : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'">
                                        <div class="flex items-center gap-2">
                                           @if (unlockedRole === 'Buyer') { <mat-icon class="text-sm leading-none">shopping_bag</mat-icon> }
                                           @else if (unlockedRole === 'Seller') { <mat-icon class="text-sm leading-none">storefront</mat-icon> }
                                           @else if (unlockedRole === 'Broker') { <mat-icon class="text-sm leading-none">handshake</mat-icon> }
                                           @else if (unlockedRole === 'Inspector') { <mat-icon class="text-sm leading-none">analytics</mat-icon> }
                                           @else if (unlockedRole === 'Delivery') { <mat-icon class="text-sm leading-none">local_shipping</mat-icon> }
                                           @else if (unlockedRole === 'Admin') { <mat-icon class="text-sm leading-none">security</mat-icon> }
                                           <span class="text-[11px] font-semibold">
                                               {{ unlockedRole === 'Buyer' ? 'Buyer Showroom' : unlockedRole === 'Seller' ? 'Dealer Office' : unlockedRole === 'Broker' ? 'Sourcing Broker' : unlockedRole }}
                                           </span>
                                        </div>
                                        @if (session.role === unlockedRole) {
                                           <span class="text-[8px] text-driveway-gold uppercase font-mono tracking-widest font-bold">Active</span>
                                        }
                                     </button>
                                  }
                               </div>
                            </div>
                         }

                         <!-- Action Navigation Links based on active role -->
                         <div class="space-y-1">
                            @if (session.role === 'Buyer') {
                               <button (click)="scrollToShowroom()" class="w-full flex items-center gap-3.5 px-3 py-2 hover:bg-white/5 rounded-xl text-gray-300 hover:text-white transition-all text-left bg-transparent border-none cursor-pointer">
                                  <mat-icon class="text-sm text-driveway-cyan">explore</mat-icon>
                                  <span class="font-medium text-xs">Browse Collection</span>
                               </button>
                               <button (click)="scrollToShowroom()" class="w-full flex items-center gap-3.5 px-3 py-2 hover:bg-white/5 rounded-xl text-gray-300 hover:text-white transition-all text-left bg-transparent border-none cursor-pointer">
                                  <mat-icon class="text-sm text-driveway-gold">favorite</mat-icon>
                                  <span class="font-medium text-xs">Saved Vehicles</span>
                               </button>
                               <button (click)="showOffersPlaceholder()" class="w-full flex items-center gap-3.5 px-3 py-2 hover:bg-white/5 rounded-xl text-gray-300 hover:text-white transition-all text-left bg-transparent border-none cursor-pointer">
                                  <mat-icon class="text-sm text-driveway-cyan">gavel</mat-icon>
                                  <span class="font-medium text-xs">Negotiations Console</span>
                               </button>
                            } @else if (session.role === 'Seller') {
                               <a routerLink="/seller/dashboard" (click)="closeDropdowns()" class="w-full flex items-center gap-3.5 px-3 py-2 hover:bg-white/5 rounded-xl text-gray-300 hover:text-white transition-all text-left block">
                                  <mat-icon class="text-sm text-driveway-gold">storefront</mat-icon>
                                  <span class="font-medium text-xs">Dealer Inventory Software</span>
                               </a>
                            } @else if (session.role === 'Broker') {
                               <a routerLink="/broker/dashboard" (click)="closeDropdowns()" class="w-full flex items-center gap-3.5 px-3 py-2 hover:bg-white/5 rounded-xl text-gray-300 hover:text-white transition-all text-left block">
                                  <mat-icon class="text-sm text-driveway-gold font-bold">handshake</mat-icon>
                                  <span class="font-medium text-xs">Broker Commission Terminal</span>
                               </a>
                            } @else if (session.role === 'Inspector') {
                               <a routerLink="/inspector/dashboard" (click)="closeDropdowns()" class="w-full flex items-center gap-3.5 px-3 py-2 hover:bg-white/5 rounded-xl text-gray-300 hover:text-white transition-all text-left block">
                                  <mat-icon class="text-sm text-driveway-cyan">analytics</mat-icon>
                                  <span class="font-medium text-xs">Inspection Desk</span>
                               </a>
                            } @else if (session.role === 'Delivery') {
                               <a routerLink="/delivery/dashboard" (click)="closeDropdowns()" class="w-full flex items-center gap-3.5 px-3 py-2 hover:bg-white/5 rounded-xl text-gray-300 hover:text-white transition-all text-left block">
                                  <mat-icon class="text-sm text-driveway-cyan">local_shipping</mat-icon>
                                  <span class="font-medium text-xs">Fulfillment Desk</span>
                               </a>
                            } @else if (session.role === 'Admin') {
                               <a routerLink="/admin/dashboard" (click)="closeDropdowns()" class="w-full flex items-center gap-3.5 px-3 py-2 hover:bg-white/5 rounded-xl text-gray-300 hover:text-white transition-all text-left block">
                                  <mat-icon class="text-sm text-red-400">security</mat-icon>
                                  <span class="font-medium text-xs">Admin Central Mainframe</span>
                               </a>
                            }
                         </div>

                         <!-- Access Settings Tab (Credentials, role unlocks & verification) -->
                         <button (click)="scrollToCredentials()" class="w-full flex items-center gap-3.5 px-3 py-2.5 bg-white/[0.02] border border-white/5 hover:border-driveway-gold/30 rounded-xl text-gray-300 hover:text-white transition-all text-left cursor-pointer">
                            <mat-icon class="text-xs text-driveway-gold">workspace_premium</mat-icon>
                            <span class="font-bold text-xs uppercase tracking-widest text-[10px]">Professional settings</span>
                         </button>

                         <div class="h-px bg-white/5"></div>
                         
                         <button (click)="onSignOut()" class="w-full flex items-center gap-3.5 px-3 py-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-red-400 transition-all text-left bg-transparent border-none cursor-pointer">
                            <mat-icon class="text-sm">logout</mat-icon>
                            <span class="font-bold text-xs uppercase tracking-wider">Sign Out Identity</span>
                         </button>
                      </div>
                   }
                } @else {
                   <!-- Sleek authentication link for Carvello exploration -->
                   <a routerLink="/auth" class="button-magnetic flex items-center gap-2 px-5 py-2.5 bg-driveway-gold text-black rounded-xl hover:bg-amber-400 transition-all text-xs font-semibold uppercase tracking-wider cursor-pointer font-sans shadow-lg shadow-driveway-gold/15">
                      <mat-icon class="text-sm uppercase leading-none font-bold">lock_open</mat-icon> Authenticate
                   </a>
                }
            </div>
            
            <!-- Mobile drawer button -->
            <button (click)="toggleMobileMenu()" class="xl:hidden w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center bg-white/5 text-white hover:bg-white/10 transition-colors">
               <mat-icon>{{ showMobileMenu() ? 'close' : 'menu' }}</mat-icon>
            </button>
         </div>
      </div>

      <!-- Mobile navigation sliding menu for CARVELLO -->
      @if (showMobileMenu()) {
        <div class="xl:hidden w-full bg-driveway-black border-t border-white/10 py-6 px-6 space-y-4 animate-luxury-reveal relative z-50">
           <button (click)="scrollToShowroom()" class="w-full text-left text-xs font-bold uppercase tracking-wider text-white py-2 flex items-center gap-3 bg-transparent border-none outline-none"><mat-icon>explore</mat-icon> Collection Showroom</button>
           <button (click)="scrollToCategories()" class="w-full text-left text-xs font-bold uppercase tracking-wider text-white py-2 flex items-center justify-between bg-transparent border-none outline-none"><span class="flex items-center gap-3"><mat-icon>category</mat-icon> Curated Categories</span></button>
           <button (click)="openSavedGarage()" class="w-full text-left text-xs font-bold uppercase tracking-wider text-white py-2 flex items-center justify-between bg-transparent border-none outline-none"><span class="flex items-center gap-3"><mat-icon>favorite</mat-icon> Saved Garage</span> <span class="px-1.5 py-0.5 bg-driveway-gold/20 text-driveway-gold text-[10px] rounded font-bold">{{ favoritesCount() }}</span></button>
           <button (click)="showOffersPlaceholder()" class="w-full text-left text-xs font-bold uppercase tracking-wider text-white py-2 flex items-center justify-between bg-transparent border-none outline-none"><span class="flex items-center gap-3"><mat-icon>gavel</mat-icon> Negotiation Hub</span></button>
        </div>
      }
    </header>
  `,
  styles: [`
    .bg-exclude-theme-glow {
      box-shadow: none !important;
    }
  `]
})
export class HeaderComponent {
  isScrolled = signal(false);
  showMobileMenu = signal(false);
  
  // Custom interactive dropdown signals
  showNotifications = signal(false);
  showAccountMenu = signal(signal(false)());
  showThemeMenu = signal(false);

  platformState = inject(PlatformStateService);
  router = inject(Router);

  // Computed link to central sessions
  activeSession = computed(() => this.platformState.getSession());
  activeTheme = computed(() => this.platformState.activeTheme());

  openSavedGarage() {
     this.closeDropdowns();
     this.platformState.showSettings.set(true);
     this.platformState.activeSettingsTab.set('Saved');
  }

  // Read signals from state service
  favoritesCount = computed(() => {
     return this.platformState.savedVehicleIds().length;
  });

  onSignOut() {
    this.closeDropdowns();
    this.platformState.logout();
    this.router.navigate(['/auth']);
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  toggleNotifications() {
     this.showNotifications.set(!this.showNotifications());
     this.showAccountMenu.set(false);
     this.showThemeMenu.set(false);
  }

  toggleAccount() {
     this.showAccountMenu.set(!this.showAccountMenu());
     this.showNotifications.set(false);
     this.showThemeMenu.set(false);
  }

  toggleThemeMenu() {
     this.showThemeMenu.set(!this.showThemeMenu());
     this.showNotifications.set(false);
     this.showAccountMenu.set(false);
  }

  onSelectTheme(theme: 'Midnight Drive' | 'Showroom Light' | 'Executive Black' | 'Ocean Blue') {
     this.platformState.setTheme(theme);
     this.showThemeMenu.set(false);
  }

  onSwitchActiveRole(role: UserAccount['role']) {
     this.platformState.switchRole(role);
     this.closeDropdowns();
     
     // Direct elegant role routing based on switch
     if (role === 'Buyer') {
        this.router.navigate(['/']);
     } else if (role === 'Seller') {
        this.router.navigate(['/seller/dashboard']);
     } else if (role === 'Broker') {
        this.router.navigate(['/broker/dashboard']);
     } else if (role === 'Inspector') {
        this.router.navigate(['/inspector/dashboard']);
     } else if (role === 'Delivery') {
        this.router.navigate(['/delivery/dashboard']);
     } else if (role === 'Admin') {
        this.router.navigate(['/admin/dashboard']);
     }
  }

  closeDropdowns() {
     this.showAccountMenu.set(false);
     this.showNotifications.set(false);
     this.showThemeMenu.set(false);
     this.showMobileMenu.set(false);
  }

  toggleMobileMenu() {
     this.showMobileMenu.set(!this.showMobileMenu());
  }

  scrollToShowroom() {
     this.closeDropdowns();
     if (typeof window === 'undefined') return;
     const el = document.getElementById('discovery-deck') || document.getElementById('sticky-filters');
     if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
     }
  }

  scrollToCategories() {
     this.closeDropdowns();
     if (typeof window === 'undefined') return;
     const el = document.getElementById('curated-shelves') || document.getElementById('sticky-filters');
     if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
     }
  }

  scrollToCredentials() {
     this.closeDropdowns();
     this.platformState.showSettings.set(true);
     this.platformState.activeSettingsTab.set('Professional');
  }

  scrollToConcierge() {
     this.closeDropdowns();
     if (typeof window === 'undefined') return;
     const el = document.getElementById('concierge-vip-section');
     if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
     }
  }

  showOffersPlaceholder() {
     this.closeDropdowns();
     this.platformState.showSettings.set(true);
     this.platformState.activeSettingsTab.set('Offers');
  }
}
