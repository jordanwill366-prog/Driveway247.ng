import { Component, signal, OnInit, inject, computed, HostListener } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { VehicleRailComponent } from '../../components/vehicle-rail/vehicle-rail';
import { ArticleCardComponent } from '../../components/article-card/article-card';
import { NgClass } from '@angular/common';
import { PlatformStateService, Vehicle } from '../../services/platform-state';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, VehicleRailComponent, ArticleCardComponent, NgClass, RouterLink, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <div class="min-h-screen bg-driveway-black overflow-hidden relative pb-10">

      
      <!-- Ultra-Premium Ambient Glowing Backgrounds (Atmospheric glow cycles) -->
      <div class="fixed top-0 inset-x-0 h-screen pointer-events-none z-0 overflow-hidden select-none animate-hero-glow">
          <div class="absolute top-[-25%] left-[-15%] w-[65%] h-[65%] rounded-full bg-driveway-gold/4 blur-[160px] animate-glow-atmosphere pointer-events-none"></div>
          <div class="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-driveway-cyan/3.5 blur-[180px] animate-glow-orbit-right pointer-events-none"></div>
          <div class="absolute top-[35%] left-[25%] w-[45%] h-[45%] rounded-full bg-amber-500/[0.015] blur-[150px] animate-soft-pulse pointer-events-none"></div>
      </div>

      <!-- Luxury Trust Core Brand Ribbon -->
      <div class="relative z-30 bg-gradient-to-r from-driveway-gold/10 via-driveway-black to-driveway-gold/10 border-b border-white/5 py-3.5 px-6 pt-24 text-center text-[11.5px] text-gray-300 backdrop-blur-md vibe-3d-alert">
         <div class="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-center gap-2.5 animate-hero-badge" style="transform: translateZ(15px);">
            <span class="inline-flex h-2 w-2 rounded-full bg-driveway-gold animate-pulse"></span>
            <span class="font-display font-medium text-white tracking-widest uppercase text-[10px]">Escrow Protected & Admin Verified:</span> 
            <span class="font-light text-gray-400">All vehicle inventory has passed an offline 150-Point Inspection. Payouts are safely held until physical handover.</span>
         </div>
      </div>

      <!-- Cinematic Luxury Hero Section -->
      <section class="relative w-full min-h-[90vh] md:h-[85vh] flex flex-col justify-center items-center text-center overflow-hidden z-10 pt-10">
        <!-- Background Imagery and Parallax Gradients -->
        <div class="absolute inset-0 z-0 select-none overflow-hidden">
           <img src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2560&auto=format&fit=crop" 
                 class="w-full h-full object-cover transform origin-center transition-all duration-300 ease-out animate-hero-image" 
                 [style.transform]="heroImgStyle()"
                 alt="Driveway247 Cinematic Vehicle hero" referrerpolicy="no-referrer" />
           <div class="absolute inset-0 bg-gradient-to-b from-driveway-black/70 via-driveway-black/35 to-driveway-black"></div>
           <div class="absolute inset-0 bg-gradient-to-t from-driveway-black via-transparent to-transparent"></div>
           <div class="absolute inset-0 bg-radial-at-c from-transparent via-driveway-black/30 to-driveway-black/90"></div>
        </div>

        <div class="relative z-10 w-full max-w-[1400px] mx-auto px-6 flex flex-col lg:flex-row items-center justify-between text-left gap-12 pt-6">
            <!-- Hero Typography Block with slow reveal parallax -->
            <div class="flex-1 max-w-3xl transform transition-all duration-[1200ms] cubic-bezier(0.16,1,0.3,1) translate-y-0 opacity-100 vibe-3d-card" 
                 [style.transform]="heroTextStyle()"
                 [ngClass]="{'translate-y-12 opacity-0': !isLoaded()}">
               <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-driveway-cyan/35 bg-driveway-cyan/5 text-driveway-cyan text-[10px] font-bold tracking-[0.2em] uppercase mb-8 shadow-[0_0_20px_rgba(6,182,212,0.15)] select-none animate-hero-badge" style="transform: translateZ(20px);">
                  <span class="w-1.5 h-1.5 rounded-full bg-driveway-cyan animate-ping"></span>
                  150-Point Physical Verification Active
               </div>
               
               <h1 class="text-5xl sm:text-7xl lg:text-[76px] font-display font-medium tracking-tight mb-6 leading-[0.94] text-white animate-hero-headline vibe-3d-text">
                  Discover inspected <br class="hidden md:block"/>vehicles with <br/>
                  <span class="gold-gradient-text italic font-light pr-4">confidence.</span>
               </h1>
               
               <p class="text-base sm:text-base text-gray-300 font-light max-w-2xl mb-10 leading-relaxed drop-shadow-md animate-hero-subtext" style="transform: translateZ(15px);">
                  Africa's digital trust authority for verified automotive transactions. Every vehicle undergoes full field diagnostic testing. Every naira is held securely under platform escrow protectorates.
               </p>
               
               <!-- Search & Dynamic Query Controls -->
               <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-hero-cta" style="transform: translateZ(30px);">
                  <div class="relative flex-1 max-w-xl group">
                     <mat-icon class="absolute left-4.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-driveway-gold transition-colors duration-300">search</mat-icon>
                     <input type="text" 
                            [value]="searchQuery()"
                            (input)="onSearchChange($event)"
                            placeholder="Search Lexus RX, Land Cruiser, Model S..." 
                            class="w-full h-14 pl-12 pr-16 bg-white/[0.05] border border-white/10 rounded-full text-white placeholder:text-gray-500 focus:outline-none focus:border-driveway-gold/40 focus:bg-white/[0.08] focus:shadow-[0_0_25px_rgba(235,177,91,0.1)] transition-all duration-500 tracking-wide font-sans text-sm outline-none" />
                     @if (searchQuery()) {
                       <button (click)="clearSearch()" class="absolute right-16 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                          <mat-icon class="text-[18px] w-4.5 h-4.5">close</mat-icon>
                       </button>
                     }
                     <button class="button-magnetic absolute right-1.5 top-1.5 bottom-1.5 px-6 bg-driveway-gold text-black rounded-full text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition-colors shadow-lg shadow-driveway-gold/20">
                        Find
                     </button>
                  </div>
               </div>

               <!-- Floating Core Trust Indicators below Search -->
               <div class="flex flex-wrap items-center gap-6 mt-10 text-xs text-gray-400 font-light border-t border-white/5 pt-6 max-w-xl animate-hero-trust" style="transform: translateZ(12px);">
                  <div class="flex items-center gap-2 transition-transform duration-300 hover:translate-x-1 group/ind cursor-default">
                     <mat-icon class="text-driveway-gold text-[16px] w-4 h-4 group-hover/ind:scale-110 duration-300">shield</mat-icon>
                     <span class="group-hover/ind:text-gray-200 transition-colors">Secure Escrow Protection</span>
                  </div>
                  <div class="flex items-center gap-2 transition-transform duration-300 hover:translate-x-1 group/ind cursor-default">
                     <mat-icon class="text-driveway-cyan text-[16px] w-4 h-4 group-hover/ind:scale-110 duration-300">verified_user</mat-icon>
                     <span class="group-hover/ind:text-gray-200 transition-colors">150-Point Physical Exam</span>
                  </div>
                  <div class="flex items-center gap-2 transition-transform duration-300 hover:translate-x-1 group/ind cursor-default">
                     <mat-icon class="text-emerald-500 text-[16px] w-4 h-4 group-hover/ind:scale-110 duration-300">support_agent</mat-icon>
                     <span class="group-hover/ind:text-gray-200 transition-colors">Arbitration Panel</span>
                  </div>
               </div>
            </div>
            
            <!-- Side Interactive Info Panel -->
            <div class="hidden lg:flex flex-col items-center justify-center transform transition-all duration-[1200ms] delay-100 translate-x-0 opacity-100 select-none pb-4 animate-hero-sidepanel w-[320px] shrink-0" 
                 [style.transform]="sidePanelStyle()"
                 [ngClass]="{'translate-x-12 opacity-0': !isLoaded()}">
               
               <!-- Main Glass Control Terminal -->
               <div class="w-full glass-panel bg-neutral-950/85 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-[0_40px_80px_rgba(0,0,0,0.85)] relative overflow-hidden transition-all duration-500 hover:border-driveway-gold/30 hover:scale-[1.01] group/side">
                  
                  <!-- Corner Glow Effects -->
                  <div class="absolute -top-12 -right-12 w-28 h-28 bg-driveway-gold/25 rounded-full blur-3xl pointer-events-none transition-all duration-700 group-hover/side:bg-driveway-gold/35"></div>
                  <div class="absolute -bottom-12 -left-12 w-28 h-28 bg-driveway-cyan/15 rounded-full blur-3xl pointer-events-none transition-all duration-700 group-hover/side:bg-driveway-cyan/25"></div>

                  <!-- Top Security Header Badge -->
                  <div class="flex items-center justify-between mb-5 select-none pb-3.5 border-b border-white/5 font-sans">
                     <div class="flex items-center gap-2">
                        <span class="flex h-2 w-2 relative">
                           <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-driveway-cyan opacity-80"></span>
                           <span class="relative inline-flex rounded-full h-2 w-2 bg-driveway-cyan"></span>
                        </span>
                        <span class="font-mono text-[9px] uppercase tracking-widest text-driveway-cyan font-bold">Weekly Spotlight</span>
                     </div>
                     <span class="text-[9px] font-mono font-semibold text-gray-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/5 animate-pulse">AES-256</span>
                  </div>

                  <!-- Curated Spotlight Image with floating specs overlay -->
                  <div class="relative rounded-2xl overflow-hidden aspect-[1.4] mb-4 border border-white/5 mx-auto w-full">
                     <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop" 
                          class="w-full h-full object-cover transition-transform duration-700 group-hover/side:scale-110" 
                          alt="Curated Showcase Vehicle" referrerpolicy="no-referrer" />
                     <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                     
                     <!-- Overlay Price and Score -->
                     <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <span class="font-mono text-xs font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">₦145M</span>
                        <span class="font-mono text-[9px] font-bold text-emerald-400 bg-emerald-950/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1">
                           <span class="h-1.5 w-1.5 bg-emerald-400 rounded-full"></span> 99% SCORE
                        </span>
                     </div>
                  </div>                  <!-- Spotlight details and Trust credentials inside the card -->
                  <div class="text-left space-y-3 font-sans mt-2">
                     <div>
                        <h4 class="font-display font-medium text-white text-sm tracking-wide leading-none group-hover/side:text-driveway-gold transition-colors duration-300">Porsche 911 Carrera S</h4>
                        <p class="text-[10.5px] text-gray-400 mt-1">2022 &middot; 8,400 KM &middot; Verified Lagos Dealer</p>
                     </div>

                     <!-- Clean, subtle buyer trust elements -->
                     <div class="space-y-2.5 pt-3 border-t border-white/5 text-xs">
                        <div class="flex items-center gap-2">
                           <mat-icon class="text-driveway-cyan text-base shrink-0">verified_user</mat-icon>
                           <span class="text-[11px] text-gray-300 font-light">150-Point Inspection Passed</span>
                        </div>
                        <div class="flex items-center gap-2">
                           <mat-icon class="text-driveway-gold text-base shrink-0">shield</mat-icon>
                           <span class="text-[11px] text-gray-300 font-light">Escrow Protected Payouts</span>
                        </div>
                        <div class="flex items-center gap-2">
                           <mat-icon class="text-emerald-400 text-base shrink-0">local_shipping</mat-icon>
                           <span class="text-[11px] text-gray-300 font-light">Secure Delivery Available</span>
                        </div>
                     </div>
                  </div>

               </div>

               <!-- Sleek Downward Cinematic Scroll Prompt to entice user to scroll -->
               <div class="mt-6 flex flex-col items-center gap-2 text-center pointer-events-auto cursor-pointer group/scroll bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-driveway-gold/30 px-6 py-4 rounded-2xl shadow-xl transition-all duration-300" (click)="scrollToInventory()">
                  <span class="font-display font-medium text-[10.5px] tracking-[0.25em] lg:tracking-[0.3em] uppercase text-driveway-gold group-hover/scroll:text-white transition-colors duration-300">
                     Discover verified vehicles
                  </span>
                  <div class="w-5 h-8 rounded-full border border-white/20 flex justify-center py-1.5 opacity-60 group-hover/scroll:opacity-100 group-hover/scroll:border-driveway-gold transition-all duration-500">
                     <!-- Interactive floating wheel/bead -->
                     <div class="w-1 h-1.5 rounded-full bg-driveway-gold animate-bounce"></div>
                  </div>
                  <!-- Glowing vertical optical line that points downwards -->
                  <div class="w-[1px] h-8 bg-gradient-to-b from-driveway-gold to-transparent opacity-40 group-hover/scroll:opacity-100 group-hover/scroll:h-10 duration-500 transition-all"></div>
               </div>

            </div>
        </div>
      </section>

      <!-- Quick Platform Filter Sticky Anchor Row (Netflix/Luxury styled) -->
      <div id="sticky-filters" class="w-full border-y border-white/5 bg-driveway-black/85 backdrop-blur-2xl sticky top-16 z-40 shadow-lg">
        <div class="max-w-[1400px] mx-auto px-6 py-4 overflow-x-auto hide-scrollbar">
           <div class="flex items-center justify-between gap-6 min-w-max">
              <div class="flex items-center gap-3">
                 @for(filter of quickFilters; track filter.label) {
                    <button (click)="selectFilter(filter.label)" 
                            class="button-magnetic px-5 py-2.5 rounded-full border border-white/[0.06] bg-driveway-charcoal/55 text-xs font-semibold tracking-wide uppercase text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all duration-300 flex items-center gap-2" 
                            [class.!bg-driveway-gold]="activeFilter() === filter.label" 
                            [class.!text-black]="activeFilter() === filter.label" 
                            [class.!border-driveway-gold]="activeFilter() === filter.label"
                            [class.!shadow-[0_4px_15px_rgba(235,177,91,0.25)]]="activeFilter() === filter.label">
                       @if(filter.icon) {
                          <span class="text-lg opacity-85" [class.!opacity-100]="activeFilter() === filter.label">{{ filter.icon }}</span>
                       }
                       {{ filter.label }}
                    </button>
                 }
              </div>
              <div class="text-[11px] text-gray-500 font-mono flex items-center gap-1.5 bg-white/[0.03] border border-white/5 px-3.5 py-1.5 rounded-full">
                 <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                 <span>Showing {{ filteredVehiclesList().length }} Inspected Cars</span>
              </div>
           </div>
        </div>
      </div>

      <div class="relative z-10 w-full bg-driveway-black">
         
         <!-- DYNAMIC DELAY SKELETON LOADER FOR FILTER EVENT CHANNELS -->
         @if (isFilterLoading()) {
            <div class="max-w-[1400px] mx-auto px-6 py-20 animate-luxury-reveal">
               <div class="flex items-center justify-between mb-8">
                  <div>
                     <div class="h-6 w-60 rounded-md bg-white/5 skeleton-shimmer mb-2.5"></div>
                     <div class="h-4 w-96 rounded-md bg-white/5 skeleton-shimmer"></div>
                  </div>
               </div>
               <div class="flex gap-6 overflow-x-hidden pt-4">
                  @for(shimmer of [1,2,3,4]; track shimmer) {
                     <div class="rounded-2xl border border-white/5 bg-driveway-charcoal/30 p-5 shrink-0 w-[340px] h-[430px] flex flex-col justify-between">
                        <div>
                           <div class="h-48 w-full rounded-xl bg-white/5 skeleton-shimmer mb-6"></div>
                           <div class="h-4 w-28 rounded bg-white/5 skeleton-shimmer mb-3"></div>
                           <div class="h-6 w-full rounded bg-white/5 skeleton-shimmer mb-4"></div>
                           <div class="grid grid-cols-2 gap-3">
                              <div class="h-4 rounded bg-white/5 skeleton-shimmer"></div>
                              <div class="h-4 rounded bg-white/5 skeleton-shimmer"></div>
                              <div class="h-4 rounded bg-white/5 skeleton-shimmer"></div>
                              <div class="h-4 rounded bg-white/5 skeleton-shimmer"></div>
                           </div>
                        </div>
                        <div class="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                           <div class="h-6 w-24 rounded bg-white/5 skeleton-shimmer"></div>
                           <div class="h-6.5 w-16 rounded-full bg-white/5 skeleton-shimmer"></div>
                        </div>
                     </div>
                  }
               </div>
            </div>
         } @else {
            
            <!-- Active Filter and Search Query Header -->
            @if (searchQuery() || activeFilter() !== 'All Vehicles') {
               <div class="max-w-[1400px] mx-auto px-6 pt-12 animate-luxury-reveal">
                  <div class="flex items-center justify-between border-b border-white/5 pb-5">
                     <div class="text-gray-400 text-sm">
                        Search matches for <span class="text-white font-semibold">"{{ searchQuery() || activeFilter() }}"</span> ({{ filteredVehiclesList().length }} assets verified)
                     </div>
                     <button (click)="resetAllFilters()" class="text-xs text-driveway-gold hover:text-white transition-colors flex items-center gap-1.5 uppercase tracking-wider font-semibold group/reset">
                        <mat-icon class="text-[16px] w-4 h-4 group-hover/reset:rotate-180 transition-transform duration-500">refresh</mat-icon> Reset View filters
                     </button>
                  </div>
               </div>
            }

            <!-- PRIMARY OVERLAY RAIL FOR ACTIVE FILTER/SEARCH RESULTS -->
            @if (searchQuery() || activeFilter() !== 'All Vehicles') {
               <div class="max-w-[1400px] mx-auto px-10 pt-4 scroll-reveal active">
                  @if (filteredVehiclesList().length > 0) {
                     <app-vehicle-rail 
                        title="Matches Found" 
                        subtitle="All matching results backed by our robust escrow transaction assurance"
                        [vehicles]="filteredVehiclesList()"
                        (vehicleClick)="openDetailView($event)">
                     </app-vehicle-rail>
                  } @else {
                     <div class="py-20 text-center max-w-md mx-auto bg-driveway-charcoal/20 border border-white/5 rounded-3xl p-8 backdrop-blur shadow-2xl animate-luxury-reveal">
                        <mat-icon class="text-gray-500 text-6xl h-14 w-14 mb-4">search_off</mat-icon>
                        <h3 class="text-2xl font-display font-medium text-white mb-2">Refine Search Parameters</h3>
                        <p class="text-gray-400 text-xs mb-6 leading-relaxed">We could not match any currently inspected listings with these specifications. Reset to navigate the full premium showroom.</p>
                        <button (click)="resetAllFilters()" class="button-magnetic px-7 py-3 bg-gradient-to-r from-driveway-gold to-amber-600 text-black rounded-full font-bold uppercase tracking-wider text-xs shadow-lg shadow-driveway-gold/15">Show Full Showroom</button>
                     </div>
                  }
               </div>
            }

            <!-- MULTIPLE HORIZONTAL DISCOVERY CAROUSEL RAILS (NETFLIX FOR VERIFIED CARS STYLE) -->
            <main class="py-8 transition-opacity duration-700" [ngClass]="{'opacity-55': searchQuery() || activeFilter() !== 'All Vehicles'}">
               
               <!-- Rail 1: Top Picks For You (Personalized luxury recommendations) -->
               <div class="scroll-reveal">
                  <app-vehicle-rail 
                     title="Top Discoveries For You" 
                     subtitle="Engineered with excellent diagnostics and Lagos/Abuja field verification"
                     [vehicles]="topPicksList()"
                     (vehicleClick)="openDetailView($event)">
                  </app-vehicle-rail>
               </div>

               <div class="max-w-[1400px] mx-auto px-6 py-4">
                  <div class="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
               </div>

               <!-- Rail 2: Recently Inspected & Scored -->
               <div class="scroll-reveal">
                  <app-vehicle-rail 
                     title="Recently Physically Inspected" 
                     subtitle="Latest field operations logs matching high physical integrity metric scores"
                     [vehicles]="recentlyInspectedList()"
                     (vehicleClick)="openDetailView($event)">
                  </app-vehicle-rail>
               </div>

               <!-- Decorative Visual Intermission: Premium Parallax Collection Showcase Banner -->
               <section class="max-w-[1400px] mx-auto px-6 my-20 select-none relative rounded-3xl overflow-hidden shadow-2xl border border-white/5 group/banner scroll-reveal">
                  <div class="absolute inset-0 overflow-hidden z-0">
                     <img src="https://images.unsplash.com/photo-1611016186353-9af58c69a533?q=80&w=2560&auto=format&fit=crop" 
                          class="w-full h-full object-cover scale-110 transition-transform duration-300 ease-out" 
                          [style.transform]="bannerParallaxStyle()"
                          alt="Premium background decoration" referrerpolicy="no-referrer" />
                     <div class="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
                  </div>
                  
                  <div class="relative z-10 py-20 px-10 max-w-2xl">
                     <span class="text-driveway-gold font-bold tracking-[0.25em] uppercase text-[10px] mb-3 block animate-pulse">Curated Luxury Tier</span>
                     <h2 class="text-3xl sm:text-5xl font-display font-medium text-white leading-tight mb-4 tracking-tight">The Premium Collection.</h2>
                     <p class="text-gray-300 text-sm font-light leading-relaxed mb-8">
                        Showcasing high-tier masterpieces like Porsche Carrera, Range Rover Autobiography, and Mercedes GLE models. Individually verified mechanics sign off on double-layered powertrain health metrics.
                     </p>
                     <button (click)="selectFilter('Luxury Offers')" class="button-magnetic px-7 py-3.5 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-full hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all">Explore Premium Collection</button>
                  </div>
               </section>

               <!-- Rail 3: Premium Collection (₦100M+ Masterpieces) -->
               <div class="scroll-reveal">
                  <app-vehicle-rail 
                     title="The Premium Collection" 
                     subtitle="Top-tier luxury models backed by multi-point physical diagnostic logs"
                     [vehicles]="premiumCollectionList()"
                     (vehicleClick)="openDetailView($event)">
                  </app-vehicle-rail>
               </div>

               <div class="max-w-[1400px] mx-auto px-6 py-4">
                  <div class="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
               </div>

               <!-- Rail 4: Luxury SUVs Selection -->
               <div class="scroll-reveal">
                  <app-vehicle-rail 
                     title="Luxury SUV Collection" 
                     subtitle="Rugged terrain capabilities with high clearance verified for African motorways"
                     [vehicles]="suvCollectionList()"
                     (vehicleClick)="openDetailView($event)">
                  </app-vehicle-rail>
               </div>

               <div class="max-w-[1400px] mx-auto px-6 py-4">
                  <div class="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
               </div>

               <!-- Rail 5: Budget-friendly Collections (<₦50M) -->
               <div class="scroll-reveal">
                  <app-vehicle-rail 
                     title="Budget-Friendly Showroom" 
                     subtitle="Incredible high-efficiency commuters scored with verified diagnostics under ₦50M"
                     [vehicles]="budgetCollectionList()"
                     (vehicleClick)="openDetailView($event)">
                  </app-vehicle-rail>
               </div>

               <div class="max-w-[1400px] mx-auto px-6 py-4">
                  <div class="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
               </div>

               <!-- Rail 6: Electric & Hybrid Vehicle Innovators -->
               <div class="scroll-reveal">
                  <app-vehicle-rail 
                     title="Electric & Hybrid Autonomy" 
                     subtitle="Battery state-of-health diagnostics and battery cycle verified models"
                     [vehicles]="electricCollectionList()"
                     (vehicleClick)="openDetailView($event)">
                  </app-vehicle-rail>
               </div>

            </main>
         }

         <!-- SECTION 10: Premium Trust & Security Integration with sequential reveal -->
         <section class="py-24 px-6 relative overflow-hidden mt-10 border-t border-b border-white/5 select-none scroll-reveal">
            <div class="absolute inset-0 bg-driveway-charcoal/60"></div>
            <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2560&auto=format&fit=crop')] mix-blend-overlay opacity-[0.035] bg-cover bg-center grayscale pointer-events-none"></div>
            <div class="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-driveway-black via-driveway-black/90 to-transparent z-10"></div>
            
            <div class="max-w-[1400px] mx-auto relative z-20">
               <div class="max-w-3xl">
                  <span class="text-driveway-gold font-bold tracking-[0.25em] uppercase text-[10px] mb-4 block drop-shadow-[0_0_10px_rgba(235,177,91,0.5)] animate-pulse">Uncompromising Trust Guarantee</span>
                  <h2 class="text-4xl md:text-5xl font-display font-medium text-white mb-6 leading-tight tracking-tight">Every transaction is certified,<br/>secured, and fully protected.</h2>
                  <p class="text-gray-400 text-sm font-light mb-12 leading-relaxed">
                     At Driveway247.ng, finding your next car is defined by total peace of mind. By combining rigorous, offline physical inspections with an independent secure escrow process, we ensure a transparent, safe, and friction-free experience from showroom page to vehicle delivery.
                  </p>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                     <div class="flex gap-4 group/trust transition-all duration-300 hover:translate-x-1.5">
                        <button class="w-12 h-12 rounded-full border border-driveway-cyan/35 flex items-center justify-center bg-driveway-black text-driveway-cyan shadow-[0_0_15px_rgba(6,182,212,0.15)] group-hover/trust:bg-driveway-cyan group-hover/trust:text-black hover:scale-105 transition-all duration-300 shrink-0 cursor-default">
                           <mat-icon class="text-base">verified_user</mat-icon>
                        </button>
                        <div>
                           <h4 class="font-display font-medium text-lg mb-1.5 text-white">150-Point Physical Check</h4>
                           <p class="text-xs text-gray-400 leading-relaxed"> certified automotive specialists physically inspect chassis structures, run computer-guided powertrain diagnostics, and verify VIN identities before any vehicle is approved.</p>
                        </div>
                     </div>
                     <div class="flex gap-4 group/trust transition-all duration-300 hover:translate-x-1.5">
                        <button class="w-12 h-12 rounded-full border border-driveway-gold/35 flex items-center justify-center bg-driveway-black text-driveway-gold shadow-[0_0_15px_rgba(235,177,91,0.15)] group-hover/trust:bg-driveway-gold group-hover/trust:text-black hover:scale-105 transition-all duration-300 shrink-0 cursor-default">
                           <mat-icon class="text-base">shield</mat-icon>
                        </button>
                        <div>
                           <h4 class="font-display font-medium text-lg mb-1.5 text-white">Escrow Protected Payouts</h4>
                           <p class="text-xs text-gray-400 leading-relaxed">Your payment is held securely in a protected escrow holding account. Funds are released to the dealership only after your successful handover and condition verification.</p>
                        </div>
                     </div>
                     <div class="flex gap-4 group/trust transition-all duration-300 hover:translate-x-1.5">
                        <button class="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-driveway-charcoal text-white hover:scale-105 group-hover/trust:bg-white group-hover/trust:text-black transition-all duration-300 shrink-0 cursor-default">
                           <mat-icon class="text-base">home_work</mat-icon>
                        </button>
                        <div>
                           <h4 class="font-display font-medium text-lg mb-1.5 text-white">Verified Dealer Network</h4>
                           <p class="text-xs text-gray-400 leading-relaxed">We partner strictly with fully audited, officially licensed dealerships. Direct communications and documents are seamlessly facilitated by our expert concierge desk.</p>
                        </div>
                     </div>
                     <div class="flex gap-4 group/trust transition-all duration-300 hover:translate-x-1.5">
                        <button class="w-12 h-12 rounded-full border border-emerald-500/25 flex items-center justify-center bg-driveway-black text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:bg-emerald-500 hover:text-white hover:scale-105 transition-all duration-300 shrink-0 cursor-default">
                           <mat-icon class="text-base">local_shipping</mat-icon>
                        </button>
                        <div>
                           <h4 class="font-display font-medium text-lg mb-1.5 text-white">Guaranteed Delivery Safety</h4>
                           <p class="text-xs text-gray-400 leading-relaxed">If the vehicle physical condition upon logistics handover does not perfectly match its certificate diagnostics, our admin process coordinates your instant refund release.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <!-- SECTION 11: Premium Testimonials and Social Proof -->
         <section class="py-24 px-6 bg-[#090909] scroll-reveal">
            <div class="max-w-[1400px] mx-auto text-center">
               <span class="text-driveway-cyan font-bold tracking-[0.2em] uppercase text-[10px] mb-3 block animate-pulse">Testimonials & Reviews</span>
               <h2 class="text-4xl font-display font-medium text-white mb-16 tracking-tight">Ecosystem Testaments</h2>
               
               <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                  @for(review of testimonials; track review.name; let idx = $index) {
                     <div class="glass-panel p-8 rounded-3xl border border-white/5 bg-driveway-charcoal/20 text-left relative flex flex-col justify-between hover:border-white/10 hover:bg-driveway-charcoal/25 hover:-translate-y-1.5 transition-all duration-500 shadow-xl">
                        <div>
                           <div class="flex items-center gap-1 text-driveway-gold mb-6 select-none">
                              @for(star of [1,2,3,4,5]; track star) {
                                 <mat-icon class="text-[18px] w-[18px] h-[18px]">star</mat-icon>
                              }
                           </div>
                           <p class="text-gray-300 text-sm font-light leading-relaxed italic mb-8">
                              "{{ review.text }}"
                           </p>
                        </div>
                        <div class="flex items-center gap-4.5 pt-6 border-t border-white/5 mt-auto">
                           <div class="w-10 h-10 rounded-full bg-gradient-to-br from-driveway-gold to-yellow-900 font-display font-bold text-black flex items-center justify-center text-sm shadow select-none">
                              {{ review.initials }}
                           </div>
                           <div>
                              <h4 class="font-display font-medium text-white text-sm">{{ review.name }}</h4>
                              <p class="text-[10.5px] text-gray-500 font-mono select-none">{{ review.role }} &middot; {{ review.location }}</p>
                           </div>
                        </div>
                     </div>
                  }
               </div>

               <!-- Live Metrics Dashboard row with real-time automatic scrolling triggers -->
               <div id="stats-row" class="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 border-t border-white/5 pt-16 select-none">
                  <div>
                     <p class="text-3xl md:text-5xl font-display font-semibold text-white tracking-tight">₦{{ escrowCounter() }}M</p>
                     <p class="text-[10px] text-gray-500 uppercase tracking-widest mt-2 font-semibold">Active Escrow Pool</p>
                  </div>
                  <div>
                     <p class="text-3xl md:text-5xl font-display font-semibold text-driveway-cyan tracking-tight">{{ inspectionCounter() }}%</p>
                     <p class="text-[10px] text-gray-500 uppercase tracking-widest mt-2 font-semibold">Guaranteed Inspection</p>
                  </div>
                  <div>
                     <p class="text-3xl md:text-5xl font-display font-semibold text-white tracking-tight">{{ bypassCounter() }}%</p>
                     <p class="text-[10px] text-gray-500 uppercase tracking-widest mt-2 font-semibold">Bypass Rate</p>
                  </div>
                  <div>
                     <p class="text-3xl md:text-5xl font-display font-semibold text-driveway-gold tracking-tight">{{ arbitrationCounter() }} Days</p>
                     <p class="text-[10px] text-gray-500 uppercase tracking-widest mt-2 font-semibold">Arbitration Window</p>
                  </div>
               </div>
            </div>
         </section>

         <!-- SECTION 9: Driveway Journal & Educational Content -->
         <section class="py-24 px-6 bg-[#040404] border-t border-white/5 select-none scroll-reveal">
            <div class="max-w-[1400px] mx-auto">
               <div class="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
                  <div>
                     <span class="text-driveway-gold font-bold tracking-[0.2em] uppercase text-[10px] mb-2 block animate-pulse">Premium Insights</span>
                     <h2 class="text-4xl font-display font-medium text-white tracking-tight">The Driveway Journal</h2>
                     <p class="text-gray-450 text-xs mt-1 leading-relaxed">Automotive mechanical analysis, transport safety protocols, and purchasing intelligence</p>
                  </div>
                  <a href="#" class="luxury-link flex items-center gap-1.5 text-driveway-gold hover:text-white transition-colors text-xs font-bold uppercase tracking-wider group">
                     Explore Journal <mat-icon class="text-[16px] w-[16px] h-[16px] group-hover:translate-x-1.5 transition-transform duration-300">arrow_forward</mat-icon>
                  </a>
               </div>

               <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                  @for(article of articles; track article.title; let idx = $index) {
                     <div>
                        <app-article-card
                           [image]="article.image"
                           [title]="article.title"
                           [category]="article.category"
                           [readTime]="article.readTime"
                           [excerpt]="article.excerpt">
                        </app-article-card>
                     </div>
                  }
               </div>
            </div>
         </section>

         <!-- SECTION 12: Mobile Pocket App Promotion -->
         <section class="relative py-28 px-6 overflow-hidden bg-gradient-to-t from-[#0a0a0a] to-[#040404] border-t border-white/5 select-none scroll-reveal">
            <div class="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-driveway-charcoal to-transparent z-0"></div>
            <div class="absolute bottom-[-15%] left-1/2 -track-x-1/2 w-[900px] h-[450px] bg-driveway-gold/10 blur-[130px] rounded-full z-0 pointer-events-none animate-soft-pulse"></div>
            
            <div class="max-w-4xl mx-auto text-center relative z-10 select-none">
               <span class="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-8 bg-white/5 shadow-inner transition-transform duration-500 hover:rotate-12">
                  <mat-icon class="text-driveway-gold text-[30px] w-8 h-8">smartphone</mat-icon>
               </span>
               <h2 class="text-5xl md:text-6xl font-display font-medium mb-6 text-white tracking-tight leading-tight">The showroom in<br/>your pocket.</h2>
               <p class="text-gray-400 text-sm md:text-base font-light mb-10 max-w-2xl mx-auto leading-relaxed">Download the certified Driveway247 app for automatic price drop alerts, live photo reports from field mechanics, and fast secure pay releases directly from your device.</p>
               
               <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button class="button-magnetic px-8 py-4 bg-white text-black rounded-full font-bold uppercase text-xs tracking-wider shadow-[0_8px_30px_rgba(255,255,255,0.15)] hover:bg-gray-200 transition-all flex items-center gap-2">
                     <mat-icon class="text-sm">phone_iphone</mat-icon> App Store
                  </button>
                  <button class="button-magnetic px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/10 rounded-full font-bold uppercase text-xs tracking-wider hover:bg-white/15 transition-all flex items-center gap-2">
                     <mat-icon class="text-sm">shop</mat-icon> Google Play
                  </button>
               </div>
            </div>
         </section>
      </div>

      <!-- Floating Mobile App Bottom Navigation Hub with ambient backglow -->
      <div class="md:hidden fixed bottom-6 inset-x-6 z-40 mobile-nav-bar rounded-full px-6 py-3.5 border border-white/10 flex items-center justify-between shadow-[0_22px_50px_rgba(0,0,0,0.85)] max-w-md mx-auto animate-hero-cta">
         <button routerLink="/" class="flex flex-col items-center gap-1 text-driveway-gold scale-105 transition-all outline-none">
            <mat-icon class="text-lg">explore</mat-icon>
            <span class="text-[9px] font-semibold tracking-wide uppercase">Discover</span>
         </button>
         <a routerLink="/seller/dashboard" class="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-all">
            <mat-icon class="text-lg">campaign</mat-icon>
            <span class="text-[9px] font-medium tracking-wide text-gray-400">Sell Car</span>
         </a>
         <a routerLink="/inspector/dashboard" class="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-all">
            <mat-icon class="text-lg">engineering</mat-icon>
            <span class="text-[9px] font-medium tracking-wide text-gray-400">Inspect</span>
         </a>
         <a routerLink="/admin/dashboard" class="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition-all">
            <mat-icon class="text-lg">security</mat-icon>
            <span class="text-[9px] font-medium tracking-wide text-gray-400">Admin</span>
         </a>
      </div>

      <app-footer></app-footer>
    </div>

    <!-- CINEMATIC VEHICLE DYNAMIC DETAIL OVERLAY (Slide and blur in) -->
    @if(selectedVehicle(); as vehicle) {
       <div class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/95 backdrop-blur-2xl animate-luxury-reveal select-none">
          <div class="relative w-full max-w-6xl bg-driveway-charcoal border border-white/10 rounded-3xl overflow-hidden shadow-[0_45px_90px_rgba(0,0,0,0.95)] flex flex-col lg:flex-row max-h-[92vh] mt-4 z-10 animate-luxury-reveal">
             
              <!-- Close absolute button with floating spring bounce -->
              <button id="close-modal-btn" (click)="closeDetailView()" class="button-magnetic absolute top-6 right-6 z-40 bg-black/80 hover:bg-black text-white hover:text-driveway-gold w-11 h-11 rounded-full border border-white/10 flex items-center justify-center shadow-lg transition-all duration-300">
                 <mat-icon>close</mat-icon>
              </button>

              <!-- LEFT DECK: Vehicle media visual & 150-Point inspection metrics results -->
              <div class="flex-1 overflow-y-auto p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-white/10 max-h-[48vh] lg:max-h-none">
                 <div class="relative rounded-2xl overflow-hidden mb-6 h-64 md:h-80 bg-driveway-black shadow-inner">
                    <!-- Loaded reveal animation for detail vehicle images -->
                    <img [src]="vehicle.image" [alt]="vehicle.model" 
                         #detImg
                         (load)="detImg.classList.add('loaded')"
                         class="w-full h-full object-cover cinematic-blur-up" />
                    <div class="absolute inset-0 bg-gradient-to-t from-driveway-charcoal via-transparent to-transparent"></div>
                    <div class="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                       <div>
                          <span class="px-3 py-1 bg-driveway-cyan text-black text-[9px] font-bold tracking-[0.2em] uppercase rounded shadow-lg animate-pulse select-none">PHYSICALLY INSPECTED</span>
                          <h2 class="text-2xl md:text-3xl font-display font-medium text-white mt-2.5 tracking-tight">{{ vehicle.year }} {{ vehicle.make }} {{ vehicle.model }}</h2>
                       </div>
                       <div class="text-right">
                          <span class="text-[10px] text-gray-400 block uppercase tracking-wider select-none">Escrow Price Locked</span>
                          <div class="text-2xl font-display font-semibold text-white">₦{{ vehicle.price }}</div>
                       </div>
                    </div>
                 </div>

                 <!-- 150-POINT OFFICIAL VERIFIED PHYSICAL REPORT PANEL -->
                 <div class="glass-panel p-6 rounded-2xl border-l-[4px] border-l-driveway-cyan bg-driveway-black/45 mb-6 shadow-inner select-none">
                    <div class="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                       <div class="flex items-center gap-2">
                          <mat-icon class="text-driveway-cyan animate-pulse">verified_user</mat-icon>
                          <h4 class="font-display font-bold uppercase tracking-[0.15em] text-[10px] text-white">Certified Physical Verification Report</h4>
                       </div>
                       <span class="text-[9px] text-gray-500 font-mono">VIN CHASSIS MATCHED ✓</span>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4 select-none">
                       <div class="bg-white/[0.03] p-3 rounded-xl text-center border border-white/5 hover:border-driveway-cyan/30 hover:bg-white/5 transition-all">
                          <span class="text-[10px] text-gray-400 block mb-1">Engine</span>
                          <span class="text-lg font-bold text-emerald-400 font-mono">{{ vehicle.inspectionDetails?.engineRating || 94 }}%</span>
                       </div>
                       <div class="bg-white/[0.03] p-3 rounded-xl text-center border border-white/5 hover:border-driveway-cyan/30 hover:bg-white/5 transition-all">
                          <span class="text-[10px] text-gray-400 block mb-1">Brakes</span>
                          <span class="text-lg font-bold text-emerald-400 font-mono">{{ vehicle.inspectionDetails?.brakesRating || 92 }}%</span>
                       </div>
                       <div class="bg-white/[0.03] p-3 rounded-xl text-center border border-white/5 hover:border-driveway-cyan/30 hover:bg-white/5 transition-all">
                          <span class="text-[10px] text-gray-400 block mb-1">Powertrain</span>
                          <span class="text-lg font-bold text-emerald-400 font-mono">{{ vehicle.inspectionDetails?.transmissionRating || 95 }}%</span>
                       </div>
                       <div class="bg-white/[0.03] p-3 rounded-xl text-center border border-white/5 hover:border-driveway-cyan/30 hover:bg-white/5 transition-all">
                          <span class="text-[10px] text-gray-400 block mb-1">Body/Rust</span>
                          <span class="text-lg font-bold text-emerald-400 font-mono">{{ vehicle.inspectionDetails?.bodyRating || 89 }}%</span>
                       </div>
                       <div class="bg-white/[0.03] p-2.5 rounded-xl text-center border border-white/5 hover:border-driveway-cyan/30 hover:bg-white/5 transition-all">
                          <span class="text-[10px] text-gray-400 block mb-1">Interior</span>
                          <span class="text-lg font-bold text-emerald-400 font-mono">{{ vehicle.inspectionDetails?.interiorRating || 93 }}%</span>
                       </div>
                    </div>

                    <p class="text-[11.5px] text-gray-300 font-light italic leading-relaxed bg-white/[0.01] p-3 rounded-lg border border-white/5">
                       "{{ vehicle.inspectionDetails?.inspectorNotes || 'Verified authentic structural and electrical diagnostics. Chassis matching certified on-site by field inspectors. Ready for secure transport dispatch.' }}"
                    </p>
                 </div>

                 <!-- ESCROW LOGISTICS SEQUENCE DIAGRAM -->
                 <div class="space-y-4 select-none">
                    <h5 class="text-[10px] font-bold uppercase tracking-[0.2em] text-driveway-gold">Secure Escrow Safe Protocol</h5>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div class="bg-driveway-black/35 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors flex gap-3 text-xs leading-normal">
                           <mat-icon class="text-driveway-gold shrink-0 text-lg w-5 h-5 animate-pulse">payments</mat-icon>
                           <div>
                              <span class="font-medium text-white block mb-0.5">Deposit in Escrow</span>
                              <span class="text-gray-400 text-[10.5px]">Driveway247 locks deposit securely under platform contracts.</span>
                           </div>
                        </div>
                        <div class="bg-driveway-black/35 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors flex gap-3 text-xs leading-normal">
                           <mat-icon class="text-driveway-cyan shrink-0 text-lg w-5 h-5">local_shipping</mat-icon>
                           <div>
                              <span class="font-medium text-white block mb-0.5">Supervised Handover</span>
                              <span class="text-gray-400 text-[10.5px]">Logistics partners coordinate dispatch and transport verification.</span>
                           </div>
                        </div>
                        <div class="bg-driveway-black/35 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors flex gap-3 text-xs leading-normal">
                           <mat-icon class="text-emerald-450 shrink-0 text-lg w-5 h-5">verified</mat-icon>
                           <div>
                              <span class="font-medium text-white block mb-0.5">Arbitrate & Payout</span>
                              <span class="text-gray-400 text-[10.5px]">Review for 14 Days. Payout released once buyer signs off.</span>
                           </div>
                        </div>
                    </div>
                 </div>
              </div>

              <!-- RIGHT DECK: Active Escrow checkout controls & compliance chatbot -->
              <div class="w-full lg:w-[480px] flex flex-col p-6 md:p-8 bg-driveway-black/35 overflow-y-auto max-h-[44vh] lg:max-h-none z-10 select-none">
                 <div class="mb-5 select-none">
                    <span class="text-[10px] text-driveway-gold font-bold uppercase tracking-widest block">Active Verification Score</span>
                    <div class="flex items-center gap-2 mt-2">
                       <div class="px-2.5 py-1 bg-driveway-cyan/10 text-driveway-cyan border border-driveway-cyan/25 text-[9px] font-bold uppercase rounded tracking-wide animate-pulse">
                          SCORE METRIC: {{ vehicle.score || '95' }}% PERFECT MATCH
                       </div>
                       <span class="text-[11px] text-gray-500 font-mono">Location: {{ vehicle.location }}</span>
                    </div>
                 </div>

                 <!-- Purchase & Escrow Contract Locking states -->
                 @if (purchaseRef()) {
                    <div class="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-5 text-center mb-6 shadow-inner animate-luxury-reveal">
                       <mat-icon class="text-emerald-450 text-5xl h-12 w-12 mx-auto mb-2 animate-bounce">shield</mat-icon>
                       <p class="font-display font-semibold text-lg text-emerald-400 tracking-wide">Escrow Contract Active!</p>
                       <p class="text-xs text-gray-300 mt-2">Funds representing ₦{{ vehicle.price }} locked by Driveway247.ng.</p>
                       <span class="text-[9.5px] bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full mt-3 inline-block font-mono">CONTRACT ID: {{ purchaseRef() }}</span>
                       
                       <div class="mt-4 pt-4 border-t border-white/5 text-left text-[11px] space-y-2 text-gray-400 leading-normal">
                          <p class="flex items-center gap-2 font-light"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span> Dealership notified of escrow secure lock</p>
                          <p class="flex items-center gap-2 font-light"><span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Syncing with <a routerLink="/seller/dashboard" class="text-driveway-gold underline">Seller Hub</a> to dispatch</p>
                       </div>
                    </div>
                 } @else {
                    <div class="bg-white/[0.03] border border-white/10 rounded-2xl p-5 mb-6">
                       <p class="text-xs text-gray-400 mb-4 font-light leading-relaxed">
                          Platform accepts certified mobile bank transfers or Visa channels. Buyers have absolute 100% money-back structural assurance.
                       </p>
                       <button id="buy-car-escrow" (click)="exerciseEscrowPurchase(vehicle)" class="button-magnetic w-full py-4 rounded-full bg-driveway-gold text-black hover:bg-amber-400 font-display font-medium text-sm uppercase tracking-wider shadow-[0_8px_30px_rgba(235,177,91,0.25)] flex items-center justify-center gap-2">
                          <mat-icon class="text-sm">lock</mat-icon> LOCK VIA SECURE ESCROW (₦{{ vehicle.price }})
                       </button>
                    </div>
                 }

                 <!-- COMPLIANCE-HARDENED INTERACTIVE CONSULT CHAT -->
                 <div class="flex-1 flex flex-col glass-panel rounded-2xl border border-white/10 overflow-hidden bg-driveway-black/80 max-h-[290px]">
                    <div class="p-3 bg-white/5 border-b border-white/10 flex items-center justify-between select-none">
                       <span class="text-[9px] font-bold uppercase tracking-wider text-white">Interactive Compliance Consult</span>
                       <span class="text-[9px] text-gray-500 font-mono">ID: {{ vehicle.dealer }}</span>
                    </div>

                    <!-- Chat Messages list -->
                    <div id="demo-chat-feed" class="flex-grow p-4 space-y-3 overflow-y-auto max-h-[170px] text-xs">
                       @for (msg of chatMessages(); track msg.id) {
                          <div class="flex flex-col" [ngClass]="{'items-end': msg.sender === 'Buyer', 'items-start': msg.sender !== 'Buyer'}">
                             <span class="text-[9px] text-gray-500 mb-0.5">{{ msg.sender }} &middot; {{ msg.timestamp }}</span>
                             <div class="px-3.5 py-2 rounded-xl max-w-[85%] leading-normal animate-luxury-reveal" 
                                  [ngClass]="{
                                    'bg-driveway-gold text-black rounded-tr-none font-medium': msg.sender === 'Buyer', 
                                    'bg-white/10 text-white rounded-tl-none': msg.sender === 'Seller',
                                    'bg-red-500/15 text-[#ef4444] border border-red-500/25 rounded-lg text-center font-bold tracking-wide text-[10.5px] p-2': msg.sender === 'System'
                                  }">
                                {{ msg.text }}
                             </div>
                          </div>
                       }
                    </div>

                    <!-- Instant typing contact bypass detector display -->
                    @if (typingBypassNotice()) {
                       <div class="bg-[#ef4444]/15 border-t border-red-500/30 p-2 text-[10px] text-red-400 flex items-start gap-1.5 animate-pulse font-medium">
                          <mat-icon class="text-[13px] w-3.5 h-3.5 mt-0.5 shrink-0">report_problem</mat-icon>
                          <span>Bypass warning: cell digit or private app strings detected. Platform filters protect safety.</span>
                       </div>
                    }

                    <!-- Input message box -->
                    <div class="p-3 border-t border-white/10 flex items-center gap-2">
                       <input type="text" 
                              #msgInput
                              (keyup)="checkTypingBypass(msgInput.value)"
                              (keydown.enter)="sendChatMessage(msgInput); msgInput.value = ''"
                              placeholder="Type consult message..." 
                              class="flex-1 h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-driveway-gold focus:bg-white/10 transition-all font-light outline-none" />
                       
                       <button (click)="sendChatMessage(msgInput); msgInput.value = ''" class="button-magnetic w-9 h-9 bg-driveway-cyan text-black rounded-lg flex items-center justify-center hover:bg-cyan-400 transition-all shrink-0">
                          <mat-icon class="text-[16px] w-4.5 h-4.5">send</mat-icon>
                       </button>
                    </div>
                 </div>
              </div>
          </div>
       </div>
    }
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
export class HomeComponent implements OnInit {
  isLoaded = signal(false);
  isFilterLoading = signal(false);
  platformState = inject(PlatformStateService);

  // Scroll offset signals for calculated luxury parallax
  scrollY = signal<number>(0);
  smoothScrollY = signal<number>(0);
  private scrollLerpActive = false;

  // Escrow live statistics counters
  escrowCounter = signal(0);
  inspectionCounter = signal(0);
  bypassCounter = signal(100);
  arbitrationCounter = signal(0);

  // Filter & Search Signals binds
  searchQuery = signal<string>('');
  activeFilter = signal<string>('All Vehicles');

  // Modal selector states
  selectedVehicle = signal<Vehicle | null>(null);
  purchaseRef = signal<string | null>(null);

  // Instantly computed active chats matching active dialog vehicle ID
  chatMessages = computed(() => {
    const v = this.selectedVehicle();
    return v ? this.platformState.getChatForVehicle(v.id)() : [];
  });

  typingBypassNotice = signal<boolean>(false);

  // Quick categories filters definition
  quickFilters = [
    { label: 'All Vehicles', active: true },
    { label: 'Verified Only', icon: '✨' },
    { label: 'Luxury Offers', icon: '💎' },
    { label: 'SUVs', icon: '⛰️' },
    { label: 'Electric & Hybrid', icon: '⚡' },
    { label: 'Under ₦50M', icon: '💰' },
    { label: 'First-Time Buyers', icon: '🔰' }
  ];

  // COMPUTED RAILS METRICS FOR DISCOVERY SHELVES
  topPicksList = computed(() => {
    return this.platformState.approvedListings().filter(v => v.isVerified && parseInt(v.score) >= 94);
  });

  recentlyInspectedList = computed(() => {
    return this.platformState.approvedListings().filter(v => parseInt(v.score) >= 90).slice(0, 4);
  });

  premiumCollectionList = computed(() => {
    return this.platformState.approvedListings().filter(v => parseInt(v.price.replace(/,/g, '')) >= 100000000 || v.make === 'Porsche');
  });

  suvCollectionList = computed(() => {
    return this.platformState.approvedListings().filter(v => 
      v.model.toLowerCase().includes('rx') || 
      v.model.toLowerCase().includes('cruiser') || 
      v.model.toLowerCase().includes('rover') ||
      v.model.toLowerCase().includes('palisade') ||
      v.model.toLowerCase().includes('gle')
    );
  });

  budgetCollectionList = computed(() => {
    return this.platformState.approvedListings().filter(v => parseInt(v.price.replace(/,/g, '')) <= 50000000);
  });

  electricCollectionList = computed(() => {
    return this.platformState.approvedListings().filter(v =>  v.fuel === 'Electric' || v.fuel === 'Hybrid');
  });

  // Dynamic lists from state used for searching and filtering
  filteredVehiclesList = computed(() => {
    let list = this.platformState.approvedListings();
    const query = this.searchQuery().toLowerCase().trim();
    const filter = this.activeFilter();

    if (query) {
      list = list.filter(v => 
        v.make.toLowerCase().includes(query) || 
        v.model.toLowerCase().includes(query) || 
        v.dealer.toLowerCase().includes(query) ||
        v.year.includes(query)
      );
    }

    if (filter === 'Verified Only') {
      list = list.filter(v => v.isVerified);
    } else if (filter === 'Luxury Offers') {
      list = list.filter(v => parseInt(v.price.replace(/,/g, '')) >= 100000000 || v.make === 'Porsche');
    } else if (filter === 'SUVs') {
      list = list.filter(v => 
        v.model.toLowerCase().includes('rx') || 
        v.model.toLowerCase().includes('cruiser') || 
        v.model.toLowerCase().includes('rover') ||
        v.model.toLowerCase().includes('palisade') ||
        v.model.toLowerCase().includes('gle')
      );
    } else if (filter === 'Electric & Hybrid') {
      list = list.filter(v => v.fuel === 'Electric' || v.fuel === 'Hybrid');
    } else if (filter === 'Under ₦50M') {
      list = list.filter(v => parseInt(v.price.replace(/,/g, '')) <= 50000000);
    } else if (filter === 'First-Time Buyers') {
      list = list.filter(v => parseInt(v.price.replace(/,/g, '')) <= 35000000 && v.isVerified);
    }

    return list;
  });

  // HostListener updates scrolling position with extreme resolution on hardware frames
  @HostListener('window:scroll', [])
  onWindowScroll() {
     this.scrollY.set(window.scrollY);
     this.triggerSmoothScroll();
  }

  private triggerSmoothScroll() {
     if (this.scrollLerpActive) return;
     this.scrollLerpActive = true;
     requestAnimationFrame(() => this.tickSmoothScroll());
  }

  // Linear interpolation loop inside requestAnimationFrame ticker
  private tickSmoothScroll() {
     const target = this.scrollY();
     const current = this.smoothScrollY();
     const diff = target - current;
     
     if (Math.abs(diff) < 0.25) {
        this.smoothScrollY.set(target);
        this.scrollLerpActive = false;
     } else {
        this.smoothScrollY.set(current + diff * 0.085); // weighted luxury factor
        requestAnimationFrame(() => this.tickSmoothScroll());
     }
  }

  // Parallax calculations linked to GPU composition nodes via smoothScrollY
  heroImgStyle = computed(() => {
     const y = Math.min(this.smoothScrollY() * 0.38, 260);
     const scale = 1.04 + (this.smoothScrollY() * 0.00018);
     return `translate3d(0, ${y}px, 0) scale(${scale})`;
  });

  heroTextStyle = computed(() => {
     const y = Math.min(this.smoothScrollY() * 0.12, 120);
     return `perspective(1200px) rotateX(3.5deg) rotateY(-6.5deg) translate3d(0, ${y}px, 0)`;
  });

  sidePanelStyle = computed(() => {
     const y = Math.min(this.smoothScrollY() * 0.22, 150);
     return `translate3d(0, ${y}px, 0)`;
  });

  bannerParallaxStyle = computed(() => {
     const scroll = this.smoothScrollY();
     const y = Math.max(-50, Math.min(50, (scroll - 1700) * 0.07));
     return `translate3d(0, ${y}px, 0) scale(1.15)`;
  });

  ngOnInit() {
    setTimeout(() => {
      this.isLoaded.set(true);
      this.initIntersectionObserver();
    }, 100);
  }

  scrollToInventory() {
    if (typeof window === 'undefined') return;
    const el = document.getElementById('sticky-filters');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  private initIntersectionObserver() {
     if (typeof window === 'undefined') return;
     
     // 1. General scroll reveal entries for luxury fade-in shifts
     const items = document.querySelectorAll('.scroll-reveal');
     const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
           if (entry.isIntersecting) {
              entry.target.classList.add('active');
           }
        });
     }, {
        threshold: 0.06,
        rootMargin: '0px 0px -40px 0px'
     });
     
     items.forEach(el => observer.observe(el));

     // 2. Escrow counts row trigger
     const statsSection = document.getElementById('stats-row');
     if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
           entries.forEach(entry => {
              if (entry.isIntersecting) {
                 this.animateCounters();
                 statsObserver.unobserve(entry.target);
              }
           });
        }, { threshold: 0.1 });
        statsObserver.observe(statsSection);
     }
  }

  // Dual timing interpolation ticker for trust counters
  private animateCounters() {
     const duration = 2200; // 2.2 seconds counting curves
     const startTime = performance.now();
     
     const step = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Custom easing cubic out for statistic ticks
        const ease = 1 - Math.pow(1 - progress, 3);
        
        this.escrowCounter.set(Math.round(ease * 42.5 * 10) / 10);
        this.inspectionCounter.set(Math.round(ease * 100));
        this.bypassCounter.set(Math.round((1 - ease) * 100));
        this.arbitrationCounter.set(Math.round(ease * 14));
        
        if (progress < 1) {
           requestAnimationFrame(step);
        }
     };
     
     requestAnimationFrame(step);
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  clearSearch() {
    this.searchQuery.set('');
  }

  selectFilter(label: string) {
    if (this.activeFilter() === label) return;
    
    // Trigger premium skeleton loading sequence
    this.isFilterLoading.set(true);
    this.activeFilter.set(label);
    
    setTimeout(() => {
       this.isFilterLoading.set(false);
       // Re-trigger Intersection Observer on newly rendered cards
       setTimeout(() => this.initIntersectionObserver(), 50);
    }, 600);

    if (label !== 'All Vehicles') {
       // Scroll smoothly to active filters container overlay
       const element = document.getElementById('sticky-filters');
       if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
       }
    }
  }

  resetAllFilters() {
    this.searchQuery.set('');
    this.activeFilter.set('All Vehicles');
  }

  openDetailView(vehicle: Vehicle) {
    this.selectedVehicle.set(vehicle);
    this.purchaseRef.set(null); // Reset escrow trigger states
  }

  closeDetailView() {
    this.selectedVehicle.set(null);
    this.purchaseRef.set(null);
  }

  exerciseEscrowPurchase(vehicle: Vehicle) {
    const ref = this.platformState.purchaseVehicle(vehicle);
    this.purchaseRef.set(ref);
  }

  checkTypingBypass(text: string) {
    const phoneRegex = /(?:(?:\+?234|0)[789][01]\d{8})|(?:\d{4,11})/g;
    const whatsappKeywords = /(whatsapp|whatsapp me|wa\.me|telegram|call me|dm me|phone number|direct pay|pay to my bank|account number|0803|0802|0805|0812|090)/i;
    
    const matchedPhone = text.match(phoneRegex);
    const matchedKeyword = text.match(whatsappKeywords);

    this.typingBypassNotice.set(!!((matchedPhone && matchedPhone.join('').length >= 6) || matchedKeyword));
  }

  sendChatMessage(input: HTMLInputElement) {
    const text = input.value.trim();
    const v = this.selectedVehicle();
    if (text && v) {
       this.platformState.postMessage(v.id, 'Buyer', text);
       this.typingBypassNotice.set(false);
    }
  }

  // Real world automotive guides & reviews
  articles = [
     {
        title: "The 2026 Shift: Why Escrow is Mandatory for Luxury Imports",
        category: "Market Insights",
        readTime: 5,
        excerpt: "An in-depth look at how the Driveway247 escrow protocol has eliminated 98% of luxury vehicle import fraud in Nigeria.",
        image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=800&auto=format&fit=crop"
     },
     {
        title: "Top 5 SUVs for Lagos Roads Under ₦30M",
        category: "Safety Guide",
        readTime: 8,
        excerpt: "From the resilient Lexus RX to the versatile Toyota Highlander, we analyze the best mid-range SUVs tested for Nigerian terrain.",
        image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=800&auto=format&fit=crop"
     },
     {
        title: "Inside the 150-Point Inspection Process",
        category: "Trust & Verification",
        readTime: 4,
        excerpt: "Follow our certified field officers as they verify a Mercedes-Benz G-Wagon before it's approved for listing on the platform.",
        image: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?q=80&w=800&auto=format&fit=crop"
     }
  ];

  testimonials = [
     {
        name: "Hon. Gbolahan Afolabi",
        role: "Luxury Vehicle Buyer",
        location: "Maitama, Abuja",
        initials: "GA",
        text: "I was extremely skeptical about buying a 115 million Land Cruiser 300 Series from a local Lagos dealer. Under Driveway247's lock escrow protocol, my bank deposit was completely safe until the vehicle was physically signed off and verified by my Abuja legal team. Absolute engineering masterstroke."
     },
     {
        name: "Engr. Sandra Eze",
        role: "Certified Field operations inspector",
        location: "Lekki, Lagos",
        initials: "SE",
        text: "We don't do standard checks. We do strict on-site mechanical diagnostic scans. We verify body fillers, structural welds, computer error histories & VIN records. This platform is the operating system Africa's vehicle marketplace has been waiting for."
     },
     {
        name: "Alhaji Musa Yusuf",
        role: "Royal Autos Dealership Lead",
        location: "Ikeja, Lagos",
        initials: "MY",
        text: "Direct buyer negotiation typically introduces massive payment tracking complications. Escrow transaction coordination through Driveway247 has streamlined our wholesale logistics. We ship verified units with confidence, knowing payout settlement is locked in safe state."
     }
  ];
}
