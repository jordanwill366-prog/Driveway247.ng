import { Component, signal, inject, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PlatformStateService, UserAccount } from '../../services/platform-state';

type Subdomain = 'buyer' | 'seller' | 'ops' | 'admin';

@Component({
  selector: 'app-auth-hub',
  standalone: true,
  imports: [MatIconModule, NgClass, RouterLink],
  template: `
    <div class="min-h-screen bg-neutral-950 text-white relative flex flex-col justify-between overflow-x-hidden font-sans pb-10">
      
      <!-- Premium Space-Grotesk Background Glows -->
      <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div class="absolute top-[10%] left-[5%] w-[40%] h-[40%] rounded-full bg-driveway-gold/5 blur-[120px]"></div>
        <div class="absolute bottom-[10%] right-[5%] w-[40%] h-[40%] rounded-full bg-driveway-cyan/4 blur-[140px]"></div>
      </div>

      <!-- Compact Admin Switcher Info Ribbon -->
      <div class="relative z-30 bg-driveway-charcoal/50 border-b border-white/5 py-4 px-6 backdrop-blur-md">
        <div class="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-driveway-gold to-amber-700 flex items-center justify-center">
              <mat-icon class="text-white text-xs">directions_car</mat-icon>
            </div>
            <div>
              <span class="font-display font-bold text-sm tracking-tight text-white">Driveway247<span class="text-driveway-gold font-light">.ng</span></span>
              <span class="text-[9px] font-display font-bold tracking-widest text-driveway-gold uppercase ml-2 bg-driveway-gold/10 px-2.5 py-0.5 rounded">Secure Hub</span>
            </div>
          </div>
          <div class="flex items-center gap-3.5">
            <span class="text-xs text-gray-400 font-light hidden lg:inline">Ecosystem Workspace Gateways</span>
            <a routerLink="/" class="text-xs text-driveway-gold hover:text-white border border-driveway-gold/20 hover:border-white px-4 py-1.5 rounded-full transition-all flex items-center gap-1 bg-white/2">
              <mat-icon class="text-xs w-4 h-4">keyboard_backspace</mat-icon> Return to Showroom
            </a>
          </div>
        </div>
      </div>

      <!-- Main Layout: Grid separating the Subdomain Simulator Selector and the Simulated Browser Window -->
      <div class="relative z-10 max-w-[1400px] w-full mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow items-stretch">
        
        <!-- LEFT PANEL: SUBDOMAIN CONTROLLER (L=4 columns) -->
        <div class="lg:col-span-4 flex flex-col justify-between space-y-6 text-left">
          <div class="space-y-6">
            <div>
              <span class="text-xs font-semibold tracking-widest text-driveway-gold uppercase block mb-1 font-sans">Ecosystem Portal</span>
              <h1 class="text-3xl font-display font-medium text-white tracking-tight leading-tight">Workspace<br/>Access Center</h1>
              <p class="text-xs text-gray-400 font-light mt-2.5 leading-relaxed">
                Access your dedicated workspace to manage vehicle listings, view inspection reports, or handle transaction escrows.
              </p>
            </div>

            <!-- Vertical selector list -->
            <div class="space-y-3.5">
              
              <!-- 1. Buyer Subdomain -->
              <button (click)="selectSubdomain('buyer')" 
                      [ngClass]="activeSub('buyer') ? 'border-driveway-gold bg-driveway-gold/[0.03] shadow-[0_0_20px_rgba(235,177,91,0.06)]' : 'border-white/5 bg-driveway-charcoal/20 hover:border-white/15'"
                      class="w-full p-4 rounded-2xl border text-left transition-all duration-300 outline-none flex items-center justify-between group">
                <div class="flex items-center gap-3.5">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                       [ngClass]="activeSub('buyer') ? 'bg-driveway-gold text-black' : 'bg-white/5 text-gray-400 group-hover:text-white'">
                    <mat-icon>shopping_bag</mat-icon>
                  </div>
                  <div>
                    <span class="text-[9px] font-mono tracking-wider block" [ngClass]="activeSub('buyer') ? 'text-driveway-gold' : 'text-gray-500'">BUYER SHOWROOM</span>
                    <h3 class="text-sm font-semibold text-white">driveway247.ng</h3>
                    <p class="text-[10px] text-gray-400 font-light mt-0.5">Immersive showroom and buyer discovery</p>
                  </div>
                </div>
                <mat-icon class="text-gray-600 group-hover:translate-x-1 duration-300 text-sm">chevron_right</mat-icon>
              </button>

              <!-- 2. Seller Subdomain -->
              <button (click)="selectSubdomain('seller')" 
                      [ngClass]="activeSub('seller') ? 'border-driveway-gold bg-driveway-gold/[0.03] shadow-[0_0_20px_rgba(235,177,91,0.06)]' : 'border-white/5 bg-driveway-charcoal/20 hover:border-white/15'"
                      class="w-full p-4 rounded-2xl border text-left transition-all duration-300 outline-none flex items-center justify-between group">
                <div class="flex items-center gap-3.5">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                       [ngClass]="activeSub('seller') ? 'bg-driveway-gold text-black' : 'bg-white/5 text-gray-400 group-hover:text-white'">
                    <mat-icon>storefront</mat-icon>
                  </div>
                  <div>
                    <span class="text-[9px] font-mono tracking-wider block" [ngClass]="activeSub('seller') ? 'text-driveway-gold' : 'text-gray-500'">DEALERSHIP PORTAL</span>
                    <h3 class="text-sm font-semibold text-white">sellers.driveway247.ng</h3>
                    <p class="text-[10px] text-gray-400 font-light mt-0.5">Inventory management and dealer onboarding</p>
                  </div>
                </div>
                <mat-icon class="text-gray-600 group-hover:translate-x-1 duration-300 text-sm">chevron_right</mat-icon>
              </button>

              <!-- 3. Ops/Workforce Subdomain -->
              <button (click)="selectSubdomain('ops')" 
                      [ngClass]="activeSub('ops') ? 'border-driveway-cyan bg-driveway-cyan/[0.03] shadow-[0_0_20px_rgba(6,182,212,0.06)]' : 'border-white/5 bg-driveway-charcoal/20 hover:border-white/15'"
                      class="w-full p-4 rounded-2xl border text-left transition-all duration-300 outline-none flex items-center justify-between group">
                <div class="flex items-center gap-3.5">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                       [ngClass]="activeSub('ops') ? 'bg-driveway-cyan text-black' : 'bg-white/5 text-gray-400 group-hover:text-white'">
                    <mat-icon>engineering</mat-icon>
                  </div>
                  <div>
                    <span class="text-[9px] font-mono tracking-wider block" [ngClass]="activeSub('ops') ? 'text-driveway-cyan' : 'text-gray-500'">FIELD & LOGISTICS</span>
                    <h3 class="text-sm font-semibold text-white">ops.driveway247.ng</h3>
                    <p class="text-[10px] text-gray-400 font-light mt-0.5">Inspection officers and dispatch courier transit</p>
                  </div>
                </div>
                <mat-icon class="text-gray-600 group-hover:translate-x-1 duration-300 text-sm">chevron_right</mat-icon>
              </button>

            </div>
          </div>

          <!-- Active Session Info Card -->
          <div class="glass-panel p-5 bg-driveway-charcoal/40 border border-white/5 rounded-2xl space-y-3.5 relative overflow-hidden">
            <div class="absolute -top-12 -right-12 w-24 h-24 bg-driveway-gold/5 rounded-full blur-2xl"></div>
            <div class="flex items-center justify-between pb-2 border-b border-white/5">
              <span class="text-[9px] font-sans font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <span class="h-1.5 w-1.5 rounded-full" [ngClass]="activeSession() ? 'bg-emerald-400' : 'bg-gray-600'"></span>
                Active Portal Session
              </span>
              <span class="text-[8px] font-sans text-driveway-gold font-bold">VERIFIED SECURE</span>
            </div>
            
            @if (activeSession(); as session) {
              <div class="space-y-2">
                <div class="flex items-center gap-2.5">
                  <div class="w-7 h-7 rounded-full bg-driveway-gold text-black font-bold flex items-center justify-center text-[10px]">
                    {{ session.fullName[0] }}
                  </div>
                  <div>
                    <h4 class="text-xs font-semibold text-white leading-none">{{ session.fullName }}</h4>
                    <span class="text-[9px] text-gray-400 mt-1 block">{{ session.email }}</span>
                  </div>
                </div>
                <div class="flex flex-wrap gap-1.5 pt-2">
                  <span class="px-2 py-0.5 bg-white/5 rounded text-[9px] font-mono border border-white/5 text-gray-300">ROLE: {{ session.role }}</span>
                  @if (session.role === 'Seller') {
                    <span class="px-2 py-0.5 rounded text-[9px] font-mono border"
                          [ngClass]="session.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-450 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'">
                      STATUS: {{ session.status }}
                    </span>
                  } @else {
                    <span class="px-2 py-0.5 bg-emerald-500/15 text-emerald-450 border border-emerald-500/10 rounded text-[9px] font-mono">STATUS: ACTIVE</span>
                  }
                </div>
                <div class="pt-3 flex gap-2">
                  <button (click)="triggerDashboardRedirect(session)" class="flex-grow h-8 bg-driveway-gold hover:bg-amber-400 text-black text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1 shadow-lg shadow-driveway-gold/10">
                    <mat-icon class="text-xs">dashboard</mat-icon> Open Dashboard
                  </button>
                  <button (click)="logout()" class="px-2.5 h-8 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg border border-white/5 transition-all">
                    <mat-icon class="text-xs">logout</mat-icon>
                  </button>
                </div>
              </div>
            } @else {
              <div class="py-2.5 text-center">
                <p class="text-[11px] text-gray-400 font-light leading-relaxed">No active workspace session. Select a portal on the left to sign in or register your franchise.</p>
              </div>
            }
          </div>
        </div>

        <!-- RIGHT PANEL: SIMULATED CHROME BROWSER WINDOW (L=8 columns) -->
        <div class="lg:col-span-8 flex flex-col items-stretch h-full">
          <div class="w-full bg-driveway-charcoal/80 border border-white/10 rounded-3xl shadow-[0_45px_90px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col h-full shrink-0 relative">
            
            <!-- 1. MAC-STYLE CHROME BROWSER TOP NAVIGATION SHELF -->
            <div class="bg-[#0e0e0e] px-4 py-3.5 border-b border-white/10 flex items-center justify-between select-none">
              <!-- Dot controls -->
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-red-500/60 block"></span>
                <span class="w-3 h-3 rounded-full bg-yellow-500/60 block"></span>
                <span class="w-3 h-3 rounded-full bg-green-500/60 block"></span>
                <!-- Browser history simulation buttons -->
                <div class="flex items-center gap-1 ml-4 py-0.5 px-1 bg-white/5 rounded border border-white/5">
                  <mat-icon class="text-gray-500 hover:text-white text-xs w-4 h-4 cursor-pointer">arrow_back</mat-icon>
                  <mat-icon class="text-gray-600 text-xs w-4 h-4">arrow_forward</mat-icon>
                  <mat-icon (click)="refreshActiveBrowser()" class="text-gray-500 hover:text-white text-xs w-4 h-4 ml-1 cursor-pointer">refresh</mat-icon>
                </div>
              </div>
              
              <!-- Address bar with SSL lock state -->
              <div class="flex-grow max-w-2xl mx-6">
                <div class="h-8 rounded-lg bg-neutral-900 border border-white/5 px-3 flex items-center justify-between text-left relative focus-within:border-driveway-gold/30 group">
                  <div class="flex items-center gap-2">
                    <mat-icon class="text-emerald-410 text-[14px] w-4 h-4">lock</mat-icon>
                    <span class="text-gray-400 text-[11px] font-mono tracking-wide">
                      https://{{ activeSubTitle() }}<span class="text-gray-500">{{ activeSubUrlPath() }}</span>
                    </span>
                  </div>
                  <span class="text-[9px] font-mono bg-emerald-500/[0.08] text-emerald-420 border border-emerald-500/10 px-1.5 py-0.5 rounded uppercase font-bold">SECURE CONNECTION</span>
                </div>
              </div>

              <!-- Terminal indicators -->
              <div class="flex items-center gap-2">
                <div class="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/5 border border-amber-500/10 text-[9px] font-mono text-driveway-gold">
                  <span class="h-1 w-1 rounded-full bg-driveway-gold animate-pulse"></span>
                  SECURE SANDBOX
                </div>
              </div>
            </div>

            <!-- 2. SIMULATED SITE PORTAL BODY -->
            <div class="bg-neutral-950 p-6 sm:p-10 flex-grow relative overflow-y-auto max-h-[640px] text-left">
              
              <!-- A. BUYER SHOWROOM AUTH PORTAL -->
              @if (isSub('buyer')) {
                <div class="max-w-md mx-auto animate-luxury-reveal space-y-6">
                  <div class="text-center space-y-2 mb-8">
                    <div class="w-12 h-12 rounded-full bg-driveway-gold/15 text-driveway-gold flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(235,177,91,0.15)]">
                      <mat-icon>shopping_bag</mat-icon>
                    </div>
                    <span class="text-[9px] font-mono tracking-widest text-driveway-gold uppercase font-bold block">MEMBERS SHOWROOM ACCESS</span>
                    <h2 class="text-2xl font-display font-medium text-white tracking-tight">Welcome Back</h2>
                    <p class="text-xs text-gray-400 font-light max-w-sm mx-auto">Enter your credentials to browse certified vehicles, view professional inspection files, and track active escrow transactions.</p>
                  </div>

                  @if (buyerAction() === 'login') {
                    <div class="space-y-4">
                      <div>
                        <label class="text-[10px] font-bold text-gray-450 uppercase tracking-wider mb-1.5 block">Email Address / Username</label>
                        <input #buyerEmail type="email" value="jordanwill366@gmail.com" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-driveway-gold font-sans" />
                      </div>
                      <div>
                        <label class="text-[10px] font-bold text-gray-450 uppercase tracking-wider mb-1.5 block">Account Password</label>
                        <input #buyerPassword type="password" value="pass123" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-driveway-gold font-sans" />
                      </div>

                      <div class="flex items-center justify-between text-[11px] text-gray-400 pb-1.5 font-sans">
                        <label class="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" checked class="accent-driveway-gold" /> Stay signed in
                        </label>
                        <span class="text-driveway-gold cursor-pointer hover:underline">Forgot your password?</span>
                      </div>

                      <button (click)="onBuyerLogin(buyerEmail.value, buyerPassword.value)" class="w-full h-12 bg-driveway-gold hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-350 flex items-center justify-center gap-2 shadow-lg shadow-driveway-gold/10">
                        <mat-icon class="text-sm">login</mat-icon> Enter Showroom
                      </button>

                      <div class="relative py-2 text-center text-[10px] text-gray-500 font-mono">
                        <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-white/5"></div>
                        <span class="relative bg-neutral-950 px-2 uppercase tracking-widest leading-none">or simulation quick entry</span>
                      </div>

                      <!-- Google OAuth simulated integration -->
                      <button (click)="onBuyerLogin('oauth-google@driveway247.ng', 'g-pass')" class="w-full h-11 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-sans">
                        <svg class="h-4 w-4" viewBox="0 0 24 24">
                          <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.47 1.7 14.92 1 12 1 7.37 1 3.42 3.65 1.5 7.5l3.8 2.95C6.22 7.15 8.92 5.04 12 5.04z"/>
                          <path fill="#4285F4" d="M23.51 12.3c0-.82-.07-1.61-.21-2.38H12v4.51h6.46a5.53 5.53 0 0 1-2.4 3.63l3.72 2.88c2.18-2 3.45-4.96 3.45-8.64z"/>
                          <path fill="#FBBC05" d="M5.3 14.5A7.12 7.12 0 0 1 4.96 12c0-.89.15-1.74.42-2.54L1.58 6.5C.57 8.52 0 10.2 0 12c0 1.8.57 3.48 1.58 5.5l3.72-3z"/>
                          <path fill="#34A853" d="M12 23c3.24 0 5.96-1.07 7.95-2.91l-3.72-2.88c-1.03.69-2.35 1.1-4.23 1.1-3.08 0-5.78-2.11-6.7-5.41L1.5 15.85C3.42 20.35 7.37 23 12 23z"/>
                        </svg>
                        Sign In with Google Identity
                      </button>

                      <p class="text-center text-[11px] text-gray-400 pt-2 font-sans">
                        New to Driveway247? <span (click)="buyerAction.set('signup')" class="text-driveway-gold cursor-pointer hover:underline font-semibold leading-relaxed">Create client account here →</span>
                      </p>
                    </div>
                  } @else {
                    <!-- Buyer signup mode -->
                    <div class="space-y-4">
                      <div>
                        <label class="text-[10px] font-bold text-gray-450 uppercase tracking-wider mb-1.5 block">Full Legal Name</label>
                        <input #bFull type="text" placeholder="e.g. Jordan Williams" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-driveway-gold font-sans" />
                      </div>
                      <div>
                        <label class="text-[10px] font-bold text-gray-450 uppercase tracking-wider mb-1.5 block">E-mail Delivery Address</label>
                        <input #bEmail type="email" placeholder="e.g. jordanwill366@gmail.com" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-driveway-gold font-sans" />
                      </div>
                      <div>
                        <label class="text-[10px] font-bold text-gray-450 uppercase tracking-wider mb-1.5 block">Secure Account Password</label>
                        <input #bPass type="password" placeholder="Passphrase key" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-driveway-gold font-sans" />
                      </div>

                      <button (click)="onBuyerSignUp(bFull.value, bEmail.value, bPass.value)" class="w-full h-12 bg-white text-black hover:bg-gray-255 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg">
                        <mat-icon class="text-sm">person_add</mat-icon> Create Showroom Account
                      </button>

                      <p class="text-center text-[10px] text-gray-500 font-light pt-2 leading-relaxed font-sans">
                        By creating a profile, you accept Driveway247 secure escrow procedures, professional physical inspection clearance, and transaction terms.
                      </p>

                      <p class="text-center text-[11px] text-gray-450 pt-2 font-sans">
                        Already have access? <span (click)="buyerAction.set('login')" class="text-driveway-gold cursor-pointer hover:underline font-semibold">Sign In instead →</span>
                      </p>
                    </div>
                  }
                </div>
              }

              <!-- B. SELLER DEALER AUTH PORTAL -->
              @if (isSub('seller')) {
                <div class="animate-luxury-reveal">
                  
                  @if (sellerAction() === 'login') {
                    <div class="max-w-md mx-auto space-y-6">
                      <div class="text-center space-y-2 mb-8">
                        <div class="w-12 h-12 rounded-full bg-driveway-gold/15 text-driveway-gold flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(235,177,91,0.15)]">
                          <mat-icon>storefront</mat-icon>
                        </div>
                        <span class="text-[9px] font-mono tracking-widest text-driveway-gold uppercase font-bold block">PARTNER DEALERS CONSOLE</span>
                        <h2 class="text-2xl font-display font-medium text-white tracking-tight">Dealer Workspace Login</h2>
                        <p class="text-xs text-gray-400 font-light">Provide dealership credentials to upload inventory, manage listings, and request secure escrow payouts.</p>
                      </div>

                      <div class="space-y-4 font-sans">
                        <div>
                          <label class="text-[10px] font-bold text-gray-450 uppercase tracking-wider mb-1.5 block">Dealer Email address</label>
                          <input #sEmail type="email" value="seller@driveway.ng" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-driveway-gold" />
                        </div>
                        <div>
                          <label class="text-[10px] font-bold text-gray-450 uppercase tracking-wider mb-1.5 block">Account Password</label>
                          <input #sPass type="password" value="••••••••" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-driveway-gold" />
                        </div>

                        <!-- Feedback area if locked -->
                        <div class="bg-black/30 border border-white/5 p-3 rounded-xl text-[10.5px] text-gray-400 space-y-1 text-left font-sans leading-relaxed">
                          <div class="flex items-center gap-1 text-driveway-gold font-semibold text-[11px] mb-0.5">
                            <mat-icon class="text-xs text-driveway-gold">gavel</mat-icon> Onboarding Verification Active
                          </div>
                          Dealer workspaces are validated after corporate documentation review (CAC and TIN) and physical site inspection checks.
                        </div>

                        <button (click)="onSellerLogin(sEmail.value, sPass.value)" class="w-full h-12 bg-driveway-gold hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-driveway-gold/10">
                          <mat-icon class="text-sm">vpn_key</mat-icon> Access Dealer Workspace
                        </button>

                        <p class="text-center text-[11px] text-gray-450 pt-2">
                          Not registered as a partner dealership? <span (click)="goToSellerSignup()" class="text-driveway-gold cursor-pointer hover:underline font-semibold leading-normal">Apply for Dealer Onboarding (CAC & Showroom check required) →</span>
                        </p>
                      </div>
                    </div>
                  } @else if (sellerAction() === 'vetted_pending') {
                    <!-- Corporate Review Custody Display -->
                    <div class="max-w-xl mx-auto space-y-6 text-center py-6">
                      <div class="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-6 relative animate-pulse">
                        <mat-icon class="text-driveway-gold text-4xl">hourglass_empty</mat-icon>
                        <span class="absolute -top-1.5 -right-1.5 h-4 w-4 bg-amber-500 rounded-full border-2 border-neutral-950 flex items-center justify-center text-[8px] font-bold text-black font-sans">!</span>
                      </div>
                      
                      <span class="text-[9px] font-mono tracking-widest text-driveway-gold bg-driveway-gold/10 border border-driveway-gold/20 px-3 py-1 rounded-full uppercase font-bold inline-block font-sans">ACCOUNT VETTING IN PROGRESS</span>
                      <h2 class="text-3xl font-display font-medium text-white tracking-tight">Verification Pending</h2>
                      
                      <!-- Summary of the fields registered -->
                      <p class="text-xs text-gray-400 leading-relaxed font-light max-w-md mx-auto">
                        Your dealership application (<span class="text-white font-medium">{{ pendingSellerReg()?.businessName }}</span>) was safely committed to the trust registry on <span class="text-white">{{ todayShort() }}</span>.
                      </p>

                      <div class="glass-panel p-5 bg-white/2 border border-white/5 rounded-2xl text-left space-y-3 max-w-md mx-auto text-xs font-sans leading-relaxed">
                        <h4 class="font-bold text-white uppercase tracking-wider text-[10px] text-driveway-gold font-sans">ONBOARDING MILESTONES:</h4>
                        <div class="space-y-2.5">
                          <div class="flex items-start gap-2 text-[11.5px]">
                            <mat-icon class="text-emerald-420 text-[15px] w-4 h-4 shrink-0 mt-0.5">check_circle</mat-icon>
                            <span>Franchise registration record created.</span>
                          </div>
                          <div class="flex items-start gap-2 text-[11.5px]">
                            <mat-icon class="text-emerald-420 text-[15px] w-4 h-4 shrink-0 mt-0.5">check_circle</mat-icon>
                            <span>Documents (CAC Incorporation & TIN tax codes) uploaded.</span>
                          </div>
                          <div class="flex items-start gap-2 text-[11.5px]">
                            <span class="w-3.5 h-3.5 rounded-full border border-amber-500/40 text-amber-500 text-[8px] font-bold flex items-center justify-center shrink-0 mt-0.5 animate-spin">◌</span>
                            <span class="text-gray-300">Admin manual audit of physical showroom photos & bank details in progress.</span>
                          </div>
                        </div>
                      </div>

                      <div class="bg-neutral-900 border border-white/5 p-4 rounded-xl max-w-md mx-auto text-[11px] text-gray-500 font-mono leading-relaxed">
                        <span class="text-driveway-cyan block font-bold text-xs uppercase mb-1 flex items-center gap-1 justify-center"><mat-icon class="text-xs text-driveway-cyan">verified_user</mat-icon> Sandbox Instant Approval Instructions:</span>
                        You can immediately bypass this review flow! Log in as an <span class="text-white font-bold cursor-pointer hover:underline" (click)="selectSubdomain('admin')">Admin</span>, navigate to the <span class="text-white font-bold">"KYC" tab</span>, and click <span class="text-white font-bold">Approve</span>. This will immediately unlock this dealership portal.
                      </div>

                      <div class="flex gap-3 justify-center pt-2">
                        <button (click)="sellerAction.set('login')" class="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-full text-xs font-semibold tracking-wide transition-all">Logout / Disconnect</button>
                        <button (click)="refreshActiveBrowser()" class="px-5 py-2.5 bg-driveway-gold hover:bg-amber-400 text-black rounded-full text-xs font-bold tracking-wide transition-all shadow-lg shadow-driveway-gold/10">Re-verify Status</button>
                      </div>
                    </div>
                  } @else {
                    <!-- C. SELLER MULTI-STEP CORPORATE ONBOARDING FLOW -->
                    <div class="max-w-2xl mx-auto space-y-6">
                      <!-- Progress indicators -->
                      <div class="flex items-center justify-between border-b border-white/5 pb-4 mb-4 select-none">
                        <div>
                          <span class="text-[9px] font-mono tracking-widest text-driveway-gold uppercase font-bold block mb-0.5">REGISTRATION PROGRESS</span>
                          <h2 class="text-lg font-display font-medium text-white">Dealership Registration</h2>
                        </div>
                        <div class="flex items-center gap-1.5 font-mono text-[10px] text-gray-400">
                          <span [ngClass]="signUpStep() === 1 ? 'text-white font-bold' : 'text-emerald-420 font-bold'">Step {{ signUpStep() }} of 2</span>
                        </div>
                      </div>

                      @if (signUpStep() === 1) {
                        <!-- Step 1: Merchant Basics and Authorization Keys -->
                        <div class="space-y-4 text-left font-sans">
                          <div class="bg-driveway-gold/5 border border-driveway-gold/15 p-4 rounded-xl text-xs text-driveway-gold font-light leading-relaxed mb-4">
                            <span class="block font-bold text-sm mb-1">Merchant Vetting Standards</span>
                            To preserve transaction high-trust and escrow security, all professional dealerships must provide official corporate numbers (CAC RC), tax identifiers (TIN), representative identity credentials, and physical showroom detail.
                          </div>

                          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Representative Full Name</label>
                              <input #sOwnerName type="text" placeholder="e.g. Chidi Okafor" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-driveway-gold font-sans" />
                            </div>
                            <div>
                              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Contact Mobile Number</label>
                              <input #sOwnerPhone type="tel" placeholder="e.g. +234 803 777 8899" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-driveway-gold font-sans" />
                            </div>
                          </div>

                          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Dealership Email address</label>
                              <input #sOwnerEmail type="email" placeholder="e.g. chidi@autohub-prime.ng" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-driveway-gold font-sans" />
                            </div>
                            <div>
                              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Account Access Password</label>
                              <input #sOwnerPassword type="password" value="pass1234" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-driveway-gold font-sans" />
                            </div>
                          </div>

                          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Government ID Card Photo (Simulated)</label>
                              <div class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-400 flex items-center justify-between font-sans hover:bg-white/10 transition-colors cursor-pointer">
                                <span class="flex items-center gap-1.5"><mat-icon class="text-sm">photo_camera</mat-icon> Upload ID PDF / Image</span>
                                <span class="text-[9px] font-mono bg-emerald-500/10 text-emerald-420 px-2 py-0.5 rounded border border-emerald-500/10">STAGED_OK</span>
                              </div>
                            </div>
                            <div>
                              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Owner Selfie Verification (Simulated)</label>
                              <div class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-400 flex items-center justify-between font-sans hover:bg-white/10 transition-colors cursor-pointer">
                                <span class="flex items-center gap-1.5"><mat-icon class="text-sm">face</mat-icon> Capture Live Selfie</span>
                                <span class="text-[9px] font-mono bg-emerald-500/10 text-emerald-420 px-2 py-0.5 rounded border border-emerald-500/10">FACIAL_OK</span>
                              </div>
                            </div>
                          </div>

                          <div class="flex justify-end pt-4 border-t border-white/5">
                            <button (click)="advanceStep1(sOwnerName.value, sOwnerPhone.value, sOwnerEmail.value, sOwnerPassword.value)" class="px-6 py-2.5 bg-driveway-gold hover:bg-amber-400 text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-driveway-gold/10">
                              Continue to Corporate Documents <mat-icon class="text-sm">arrow_forward</mat-icon>
                            </button>
                          </div>
                        </div>
                      } @else if (signUpStep() === 2) {
                        <!-- Step 2: Corporate Vetting detail parameters -->
                        <div class="space-y-4 text-left font-sans">
                          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Dealership Business Name</label>
                              <input #sBizName type="text" [value]="tempOwnerName() ? tempOwnerName() + ' Motors' : 'Alpha Dealership Ltd'" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-driveway-gold" />
                            </div>
                            <div>
                              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">CAC Incorporation Number</label>
                              <input #sCacNumber type="text" placeholder="e.g. RC-4903328" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-driveway-gold" />
                            </div>
                          </div>

                          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">FIRS Corporate Tax TIN</label>
                              <input #sTaxId type="text" placeholder="e.g. TIN-49938833-X" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-driveway-gold" />
                            </div>
                            <div>
                              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Physical Showroom Address</label>
                              <input #sAddress type="text" placeholder="e.g. 5 Lekki-Epe expressway, Lagos" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-driveway-gold" />
                            </div>
                          </div>

                          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Seller Settlement Bank</label>
                              <select #sBankName class="w-full h-11 px-4 bg-[#0e0e0e] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-driveway-gold">
                                <option>GTBank PLC</option>
                                <option selected>Access Bank Nigeria</option>
                                <option>Zenith Bank</option>
                                <option>First Bank of Nigeria</option>
                              </select>
                            </div>
                            <div>
                              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Bank Settlement Account Number</label>
                              <input #sBankAccount type="text" placeholder="10 Digits account code" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-driveway-gold" />
                            </div>
                          </div>

                          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="md:col-span-1">
                              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Years in Operation</label>
                              <input #sYears type="number" value="4" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-driveway-gold" />
                            </div>
                            <div class="md:col-span-2">
                              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Estimated Inventory Range</label>
                              <select #sInv class="w-full h-11 px-4 bg-[#0e0e0e] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-driveway-gold">
                                <option>Less than ₦50M</option>
                                <option selected>₦50M - ₦250M</option>
                                <option>₦250M - ₦1B</option>
                                <option>Above ₦1B</option>
                              </select>
                            </div>
                          </div>

                          <div class="pt-4 flex justify-between gap-3 border-t border-white/5">
                            <button (click)="signUpStep.set(1)" class="px-5 h-11 border border-white/10 hover:bg-white/5 text-gray-300 text-xs font-semibold rounded-xl transition-colors">Back to Step 1</button>
                            <button (click)="submitDealershipRegistration(sBizName.value, sCacNumber.value, sTaxId.value, sAddress.value, sBankName.value, sBankAccount.value, +sYears.value, sInv.value)" class="px-6 h-11 bg-white text-black hover:bg-gray-250 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-1">
                              <mat-icon class="text-sm">gavel</mat-icon> Submit Merchant Onboarding
                            </button>
                          </div>
                        </div>
                      }
                    </div>
                  }
                </div>
              }

              <!-- C. OPS (INSPECTION & DELIVERY) WORKFORCE LOGIN -->
              @if (isSub('ops')) {
                <div class="max-w-md mx-auto animate-luxury-reveal space-y-6">
                  <div class="text-center space-y-2 mb-8">
                    <div class="w-12 h-12 rounded-full bg-driveway-cyan/15 text-driveway-cyan flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                      <mat-icon>engineering</mat-icon>
                    </div>
                    <span class="text-[9px] font-mono tracking-widest text-driveway-cyan uppercase font-bold block">FIELD INVENTORY PORTAL</span>
                    <h2 class="text-2xl font-display font-medium text-white tracking-tight">Field Workforce Workspace</h2>
                    <p class="text-xs text-gray-400 font-light max-w-sm mx-auto">Access your daily scheduled inspections, verify showroom checklist criteria, or track secure receiver handovers.</p>
                  </div>

                  <div class="space-y-4">
                    <div>
                      <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Field Badge / Staff ID</label>
                      <input #opsStaffId type="text" placeholder="e.g. FLD-9022-ONLINE or LOG-701-DISPATCH" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-driveway-cyan font-mono" />
                    </div>
                    <div>
                      <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Account Passcode</label>
                      <input #opsPasscode type="password" placeholder="••••••••" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-driveway-cyan" />
                    </div>

                    <!-- Preloaded sandbox hints -->
                    <div class="bg-black/30 border border-white/5 rounded-2xl p-4 space-y-2 text-xs font-light text-left leading-relaxed font-sans">
                      <span class="text-[9.5px] font-mono uppercase text-driveway-cyan font-bold tracking-widest block"><mat-icon class="text-xs w-3.5 h-3.5 mr-0.5">help</mat-icon> Simulation Area Sandbox Credentials:</span>
                      <div class="space-y-1 text-[11px] font-mono">
                        <div class="flex justify-between border-b border-white/5 pb-1">
                          <span class="text-white">Frank (Inspector):</span>
                          <span class="text-driveway-gold cursor-pointer hover:underline" (click)="opsStaffId.value = 'FLD-9022-ONLINE'; opsPasscode.value = '1234'">Seed (FLD-9022)</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-white">James (Delivery-Dispatch):</span>
                          <span class="text-driveway-gold cursor-pointer hover:underline" (click)="opsStaffId.value = 'LOG-701-DISPATCH'; opsPasscode.value = '1234'">Seed (LOG-701)</span>
                        </div>
                      </div>
                    </div>

                    <button (click)="onOpsLogin(opsStaffId.value)" class="w-full h-12 bg-driveway-cyan hover:bg-[#22d3ee] text-black text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-driveway-cyan/15">
                      <mat-icon class="text-sm">verified_user</mat-icon> Access Operational Area
                    </button>
                  </div>
                </div>
              }

              <!-- D. ADMIN CONTROL MAINFRAME -->
              @if (isSub('admin')) {
                <div class="max-w-md mx-auto animate-luxury-reveal space-y-6">
                  <div class="text-center space-y-2 mb-8">
                    <div class="w-12 h-12 bg-red-500/15 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                      <mat-icon>admin_panel_settings</mat-icon>
                    </div>
                    <span class="text-[9px] font-sans tracking-widest text-red-450 uppercase font-bold block">ADMIN CONSOLE PORTAL</span>
                    <h2 class="text-2xl font-display font-medium text-white tracking-tight">Enterprise Admin Access</h2>
                    <p class="text-xs text-gray-400 font-light max-w-sm mx-auto">Manage platform verification workflows, moderate dealership listings, monitor active transactions, and release secure escrow payouts.</p>
                  </div>

                  <div class="space-y-4 font-sans">
                    <div>
                      <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Administrator Email Key</label>
                      <input #adminEmail type="email" value="command@driveway247.ng" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-red-500" />
                    </div>
                    <div>
                      <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Secure PIN Passcode</label>
                      <input #adminPin type="password" value="••••••••" class="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-red-500" />
                    </div>

                    <div class="bg-red-500/5 border border-red-500/10 rounded-xl p-3.5 space-y-1.5 text-[11px] leading-relaxed text-gray-450 text-left">
                      <div class="flex items-center gap-1 text-red-400 font-bold text-xs">
                        <mat-icon class="text-xs text-red-400">verified</mat-icon> Secure Administrative Session
                      </div>
                      This session is fully audited for security and quality purposes. Administrative activities are logged internally.
                    </div>

                    <button (click)="onAdminLogin(adminEmail.value)" class="w-full h-12 bg-red-500 hover:bg-red-400 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-500/10">
                      <mat-icon class="text-sm">security</mat-icon> Access Admin Console
                    </button>
                  </div>
                </div>
              }

            </div>
          </div>
        </div>

      </div>

      <!-- FOOTER -->
      <footer class="relative z-10 text-center font-sans text-[9px] text-gray-600 mt-6 max-w-[1400px] mx-auto px-6 tracking-wider uppercase">
        DRIVEWAY247 AUTOMOTIVE COMMERCE ECOSYSTEM // SECURED BY ENTERPRISE ESCROW // COPYRIGHT 2026
      </footer>

    </div>
  `,
  styles: [`
    .glass-panel {
      background: rgba(14, 14, 14, 0.75);
      backdrop-filter: blur(25px);
    }
    .accent-driveway-gold {
      accent-color: #ebb15b;
    }
    .accent-driveway-cyan {
      accent-color: #06b6d4;
    }
    .gold-gradient-text {
      background: linear-gradient(135deg, #ebb15b 0%, #ffffff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  `]
})
export class AuthComponent {
  platformState = inject(PlatformStateService);
  router = inject(Router);

  activeSubdomain = signal<Subdomain>('buyer');
  
  // Buyer-specific signals
  buyerAction = signal<'login' | 'signup'>('login');

  // Seller-specific signup signals
  sellerAction = signal<'login' | 'signup' | 'vetted_pending'>('login');
  signUpStep = signal<number>(1);
  
  // Temporary storage for multi-step signup
  tempOwnerName = signal<string>('');
  tempOwnerPhone = signal<string>('');
  tempOwnerEmail = signal<string>('');
  tempOwnerPassword = signal<string>('');

  // Active user session linked directly to State
  activeSession = computed(() => this.platformState.getSession());
  
  // Pending registrations cached locally to show pending state immediately
  pendingSellerReg = signal<UserAccount | null>(null);

  isSub(sub: Subdomain): boolean {
    return this.activeSubdomain() === sub;
  }

  activeSub(sub: Subdomain): boolean {
    return this.activeSubdomain() === sub;
  }

  selectSubdomain(sub: Subdomain) {
    this.activeSubdomain.set(sub);
  }

  activeSubTitle(): string {
    switch (this.activeSubdomain()) {
      case 'buyer': return 'driveway247.ng';
      case 'seller': return 'sellers.driveway247.ng';
      case 'ops': return 'ops.driveway247.ng';
      case 'admin': return 'admin.driveway247.ng';
    }
  }

  activeSubUrlPath(): string {
    const sub = this.activeSubdomain();
    if (sub === 'buyer') {
      return this.buyerAction() === 'login' ? '/secure/login' : '/secure/onboarding';
    } else if (sub === 'seller') {
      if (this.sellerAction() === 'login') return '/login';
      if (this.sellerAction() === 'vetted_pending') return '/review/pending';
      return `/register/stage-${this.signUpStep()}`;
    } else if (sub === 'ops') {
      return '/workforce/login';
    } else {
      return '/control/payouts';
    }
  }

  refreshActiveBrowser() {
    // If we are showing pending review state, double check in central state if approved!
    const pending = this.pendingSellerReg();
    if (this.sellerAction() === 'vetted_pending' && pending) {
      const bizName = pending.businessName;
      const matchingUserInDb = this.platformState.getUsers().find(u => u.businessName === bizName);
      if (matchingUserInDb && matchingUserInDb.status === 'Approved') {
        // Yes, Admin cleared their KYC! Let's update session and route to dashboard!
        this.platformState.setSession(matchingUserInDb);
        this.router.navigate(['/seller/dashboard']);
      }
    }
  }

  logout() {
    this.platformState.logout();
    this.pendingSellerReg.set(null);
    this.sellerAction.set('login');
  }

  todayShort(): string {
    return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // --- ACTIONS ---

  onBuyerLogin(email: string, pass: string) {
    if (!email) return;
    if (pass) {
      console.log('Simulating secure decryption of user credentials certificate.');
    }
    const session = this.platformState.loginAs(email, 'Buyer');
    if (session) {
      this.router.navigate(['/']);
    }
  }

  onBuyerSignUp(fullName: string, email: string, pass: string) {
    if (!fullName || !email) return;
    if (pass) {
      console.log('Generating secure local login container crypt.');
    }
    const session = this.platformState.loginAs(email, 'Buyer');
    if (session) {
      session.fullName = fullName;
      this.router.navigate(['/']);
    }
  }

  goToSellerSignup() {
    this.sellerAction.set('signup');
    this.signUpStep.set(1);
  }

  advanceStep1(name: string, phone: string, email: string, pass: string) {
    if (!name || !email) {
      alert('Please state owner full name and active email structure.');
      return;
    }
    this.tempOwnerName.set(name);
    this.tempOwnerPhone.set(phone);
    this.tempOwnerEmail.set(email);
    this.tempOwnerPassword.set(pass);
    this.signUpStep.set(2);
  }

  submitDealershipRegistration(bizName: string, cac: string, tax: string, address: string, bank: string, act: string, years: number, inventory: string) {
    if (!bizName || !cac) {
      alert('CAC Identification RC-number and official business name are required parameters.');
      return;
    }

    const payload = {
      fullName: this.tempOwnerName() || 'Authorized Dealer Rep',
      email: this.tempOwnerEmail() || 'corpo@dealer.ng',
      phone: this.tempOwnerPhone() || '+234 112233',
      businessName: bizName,
      cacNumber: cac,
      taxId: tax || 'TIN-NOT-SUBMITTED',
      address: address || 'No address stated',
      bankName: bank,
      bankAccountNumber: act || '0000000000',
      yearsInOperation: years,
      inventoryEstimate: inventory
    };

    const registeredUser = this.platformState.registerSeller(payload);
    
    // Stash registration cache locally
    this.pendingSellerReg.set(registeredUser);
    
    // Switch view to technical pending review state!
    this.sellerAction.set('vetted_pending');
  }

  onSellerLogin(email: string, pass: string) {
    if (!email) return;
    if (pass) {
      console.log('Simulating corporate credentials audit handshake.');
    }
    const session = this.platformState.loginAs(email, 'Seller');
    if (session) {
      if (session.status === 'Pending Review' || session.status === 'Rejected') {
        this.pendingSellerReg.set(session);
        this.sellerAction.set('vetted_pending');
      } else {
        this.router.navigate(['/seller/dashboard']);
      }
    } else {
      alert('Dealership email not recognized. Make sure you register first!');
    }
  }

  onOpsLogin(staffId: string) {
    if (!staffId) return;
    const isInspector = staffId.toLowerCase().includes('fld');
    
    // Type-safe role mapping based on workforce department
    const role: UserAccount['role'] = isInspector ? 'Inspector' : 'Delivery';
    const session = this.platformState.loginAs(staffId, role);
    
    if (session) {
      if (isInspector) {
        this.router.navigate(['/inspector/dashboard']);
      } else {
        this.router.navigate(['/delivery/dashboard']);
      }
    } else {
      alert('Unrecognized badge credential code.');
    }
  }

  onAdminLogin(email: string) {
    if (!email) return;
    const session = this.platformState.loginAs(email, 'Admin');
    if (session) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      alert('Administrative decryption credentials declined.');
    }
  }

  triggerDashboardRedirect(session: UserAccount) {
    if (session.role === 'Buyer') this.router.navigate(['/']);
    else if (session.role === 'Seller') {
      if (session.status === 'Pending Review') {
        this.sellerAction.set('vetted_pending');
        this.activeSubdomain.set('seller');
      } else {
        this.router.navigate(['/seller/dashboard']);
      }
    }
    else if (session.role === 'Inspector') this.router.navigate(['/inspector/dashboard']);
    else if (session.role === 'Delivery') this.router.navigate(['/delivery/dashboard']);
    else if (session.role === 'Admin') this.router.navigate(['/admin/dashboard']);
  }
}
