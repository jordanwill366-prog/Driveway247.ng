import { Component, signal, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgClass, CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PlatformStateService } from '../../services/platform-state';

@Component({
  selector: 'app-auth-hub',
  standalone: true,
  imports: [MatIconModule, NgClass, RouterLink, CommonModule],
  template: `
    <div class="min-h-screen bg-neutral-950 text-white relative flex flex-col justify-between overflow-x-hidden font-sans pb-10">
      
      <!-- Premium Space Glows -->
      <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div class="absolute top-[10%] left-[5%] w-[40%] h-[40%] rounded-full bg-amber-500/[0.03] blur-[120px]"></div>
        <div class="absolute bottom-[10%] right-[5%] w-[40%] h-[40%] rounded-full bg-cyan-500/[0.03] blur-[140px]"></div>
      </div>

      <!-- Header Ribbon -->
      <div class="relative z-30 bg-neutral-900/60 border-b border-white/5 py-4 px-6 backdrop-blur-md">
        <div class="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
              <mat-icon class="text-white text-xs">directions_car</mat-icon>
            </div>
            <div>
              <span class="font-display font-bold text-sm tracking-tight text-white">Carvello<span class="text-amber-500 font-light">.ng</span></span>
              <span class="text-[9px] font-mono tracking-widest text-amber-500 uppercase ml-2 bg-amber-500/10 px-2.5 py-0.5 rounded">Secure Auth Gate</span>
            </div>
          </div>
          <div>
            <a routerLink="/" class="text-xs text-amber-500 hover:text-white border border-amber-500/20 hover:border-white px-4 py-1.5 rounded-full transition-all flex items-center gap-1 bg-white/2">
              <mat-icon class="text-xs w-4 h-4">keyboard_backspace</mat-icon> Return to Showroom
            </a>
          </div>
        </div>
      </div>

      <!-- Main Portal Grid -->
      <div class="relative z-10 max-w-[1200px] w-full mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow items-center">
        
        <!-- LEFT PANEL: Ecosystem Info -->
        <div class="lg:col-span-5 text-left space-y-6">
          <div>
            <span class="text-xs font-semibold tracking-widest text-amber-500 uppercase block mb-1 font-mono">Ecosystem Gateways</span>
            <h1 class="text-3xl sm:text-4xl font-display font-medium text-white tracking-tight leading-tight">Authentic<br/>Car Platform</h1>
            <p class="text-xs text-gray-400 font-light mt-3 leading-relaxed">
              Log in to access your customized secure workspaces. All sessions are protected with industry-standard JWT credentials signed via httpOnly token cookies.
            </p>
          </div>

          <!-- Feature Cards -->
          <div class="space-y-3 font-sans">
            <div class="flex items-start gap-3 bg-white/2 border border-white/5 p-3.5 rounded-xl text-left">
              <mat-icon class="text-amber-500 shrink-0">verified_user</mat-icon>
              <div>
                <h4 class="text-xs font-bold text-white uppercase tracking-wider">High Trust Vetting</h4>
                <p class="text-[11px] text-gray-400 leading-normal">Inspection scoring and verification criteria enforce safety indices before listing publications.</p>
              </div>
            </div>
            <div class="flex items-start gap-3 bg-white/2 border border-white/5 p-3.5 rounded-xl text-left">
              <mat-icon class="text-cyan-500 shrink-0">local_shipping</mat-icon>
              <div>
                <h4 class="text-xs font-bold text-white uppercase tracking-wider">Logistics & Delivery</h4>
                <p class="text-[11px] text-gray-400 leading-normal">Choose dynamic delivery methods. Track real-time carrier dispatch updates straight to your driveway.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT PANEL: COMPACT FORM PANEL -->
        <div class="lg:col-span-7 flex justify-center w-full">
          <div class="w-full max-w-lg bg-neutral-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_45px_90px_rgba(0,0,0,0.85)] relative text-left">
            
            <!-- Error / Success Toast -->
            @if (errorMessage()) {
              <div class="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2.5 animate-fadeIn">
                <mat-icon class="text-sm">error</mat-icon>
                <span>{{ errorMessage() }}</span>
              </div>
            }

            @if (successMessage()) {
              <div class="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start gap-2.5 animate-fadeIn">
                <mat-icon class="text-sm">check_circle</mat-icon>
                <span>{{ successMessage() }}</span>
              </div>
            }

            <!-- Mode Selector TAB -->
            <div class="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <div class="flex gap-4">
                <button (click)="switchMode('login')" 
                        [class]="authMode() === 'login' ? 'text-amber-500 border-b-2 border-amber-500 font-bold pb-1 text-sm' : 'text-gray-400 hover:text-white pb-1 text-sm'" 
                        class="transition-all tracking-wide bg-transparent border-0 cursor-pointer">
                  SIGN IN
                </button>
                <button (click)="switchMode('register')" 
                        [class]="authMode() === 'register' ? 'text-amber-500 border-b-2 border-amber-500 font-bold pb-1 text-sm' : 'text-gray-400 hover:text-white pb-1 text-sm'" 
                        class="transition-all tracking-wide bg-transparent border-0 cursor-pointer">
                  CREATE ACCOUNT
                </button>
              </div>
              <span class="text-[9px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded tracking-wider text-gray-400">JWT SECURED</span>
            </div>

            <!-- 1. MANDATORY ROLE SECTOR RADIO BUTTONS (To prevent role confusion) -->
            <div class="mb-6 space-y-2">
              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Access Workspace Role Selector</label>
              <div class="grid grid-cols-3 gap-3">
                
                <!-- Radio Option Buyer -->
                <label [ngClass]="selectedRole() === 'buyer' ? 'border-amber-500 bg-amber-500/5 text-amber-500' : 'border-white/10 bg-white/2 hover:border-white/20 text-gray-400'"
                       class="relative p-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all gap-1.5 select-none text-xs">
                  <input type="radio" name="authRole" value="buyer" [checked]="selectedRole() === 'buyer'" (change)="setRole('buyer')" class="sr-only" />
                  <mat-icon class="text-base">shopping_bag</mat-icon>
                  <span class="font-bold tracking-wide">Buyer</span>
                </label>

                <!-- Radio Option Seller -->
                <label [ngClass]="selectedRole() === 'seller' ? 'border-amber-500 bg-amber-500/5 text-amber-500' : 'border-white/10 bg-white/2 hover:border-white/20 text-gray-400'"
                       class="relative p-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all gap-1.5 select-none text-xs">
                  <input type="radio" name="authRole" value="seller" [checked]="selectedRole() === 'seller'" (change)="setRole('seller')" class="sr-only" />
                  <mat-icon class="text-base">storefront</mat-icon>
                  <span class="font-bold tracking-wide">Seller</span>
                </label>

                <!-- Radio Option Admin -->
                <label [ngClass]="selectedRole() === 'admin' ? 'border-rose-500 bg-rose-500/5 text-rose-500' : 'border-white/10 bg-white/2 hover:border-white/20 text-gray-400'"
                       class="relative p-3 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all gap-1.5 select-none text-xs">
                  <input type="radio" name="authRole" value="admin" [checked]="selectedRole() === 'admin'" (change)="setRole('admin')" class="sr-only" />
                  <mat-icon class="text-base">admin_panel_settings</mat-icon>
                  <span class="font-bold tracking-wide">Admin</span>
                </label>

              </div>
            </div>

            <!-- MAIN SUBMIT FORM -->
            <form (submit)="onSubmit($event)" class="space-y-4">
              
              <!-- Full name (Sign up only) -->
              @if (authMode() === 'register') {
                <div class="animate-fadeIn">
                  <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Full Name</label>
                  <input #fullNameInput type="text" placeholder="e.g. Jordan Williams" class="w-full h-11 px-4 bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl text-xs text-white focus:outline-none" required />
                </div>
              }

              <!-- Email -->
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Email Address</label>
                <input #emailInput type="email" placeholder="e.g. email@domain.com" class="w-full h-11 px-4 bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl text-xs text-white focus:outline-none" required />
              </div>

              <!-- Phone (Sign up only) -->
              @if (authMode() === 'register') {
                <div class="animate-fadeIn shadow-inner">
                  <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Phone Number</label>
                  <input #phoneInput type="tel" placeholder="+234 803 111 2222" class="w-full h-11 px-4 bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl text-xs text-white focus:outline-none" required />
                </div>
              }

              <!-- Password -->
              <div>
                <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Password</label>
                <input #passwordInput type="password" placeholder="Passphrase key" class="w-full h-11 px-4 bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl text-xs text-white focus:outline-none" required />
              </div>

              <!-- SPECIFIC ROLE FIELDS (Sign up only) -->
              @if (authMode() === 'register') {
                
                @if (selectedRole() === 'buyer') {
                  <div class="space-y-1.5 animate-fadeIn">
                    <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Default Handover Delivery Address</label>
                    <input #deliveryAddressInput type="text" placeholder="e.g. Block 42, Lekki Phase 1, Lagos" class="w-full h-11 px-4 bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl text-xs text-white focus:outline-none" required />
                  </div>
                }

                @if (selectedRole() === 'seller') {
                  <div class="space-y-4 animate-fadeIn">
                    <div>
                      <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Dealership Business Name</label>
                      <input #businessNameInput type="text" placeholder="e.g. Alpha Dealership Ltd" class="w-full h-11 px-4 bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl text-xs text-white focus:outline-none" required />
                    </div>
                    <div>
                      <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Corporate Tax identifier (TIN)</label>
                      <input #taxIdInput type="text" placeholder="e.g. TIN-482201" class="w-full h-11 px-4 bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl text-xs text-white focus:outline-none" required />
                    </div>
                  </div>
                }

              }

              <!-- Backing note helper -->
              @if (authMode() === 'login') {
                <div class="text-[11px] text-gray-400 flex items-center justify-between py-1.5 font-sans leading-relaxed">
                  <span>Simulation defaults: <b class="text-white">pass123</b></span>
                  <span class="text-amber-500 font-medium cursor-pointer hover:underline">Forgot passcode?</span>
                </div>
              }

              <!-- Sandbox Demo Click-to-Prefill Accounts -->
              <div class="mt-4 p-3 bg-white/2 border border-white/5 rounded-xl text-[10.5px] text-gray-400 text-left font-mono">
                <span class="text-amber-500 text-[10px] uppercase font-bold block mb-1.5">Sandbox Instant Access Keys</span>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div (click)="prefill('buyer', 'jordanwill366@gmail.com', 'pass123', emailInput, passwordInput)" class="p-1.5 bg-neutral-950/60 rounded border border-white/5 cursor-pointer hover:border-amber-500 transition-colors">
                    <b>Jordan (Buyer)</b>
                  </div>
                  <div (click)="prefill('seller', 'seller@driveway.ng', 'pass123', emailInput, passwordInput)" class="p-1.5 bg-neutral-950/60 rounded border border-white/5 cursor-pointer hover:border-amber-500 transition-colors">
                    <b>Lagos (Seller)</b>
                  </div>
                  <div (click)="prefill('admin', 'admin@carvello.ng', 'pass123', emailInput, passwordInput)" class="p-1.5 bg-neutral-950/60 rounded border border-rose-500/15 cursor-pointer hover:border-rose-500 transition-colors">
                    <b>Chief (Admin)</b>
                  </div>
                </div>
              </div>

              <!-- Submit Button -->
              <button type="submit" [disabled]="submitting()" 
                      [ngClass]="selectedRole() === 'admin' ? 'bg-rose-600 hover:bg-rose-500' : 'bg-amber-500 hover:bg-amber-400 text-black'"
                      class="w-full h-12 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mt-2 shadow-lg disabled:opacity-50 select-none cursor-pointer">
                <mat-icon class="text-sm">lock_open</mat-icon>
                <span>{{ submitting() ? 'Verifying Safe Token...' : (authMode() === 'login' ? 'ESTABLISH SECURE ACCESS' : 'CREATE PLATFORM PROFILE') }}</span>
              </button>

            </form>
          </div>
        </div>

      </div>

    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out forwards;
    }
  `]
})
export class AuthComponent {
  platformState = inject(PlatformStateService);
  router = inject(Router);

  authMode = signal<'login' | 'register'>('login');
  selectedRole = signal<'buyer' | 'seller' | 'admin'>('buyer');
  submitting = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  switchMode(mode: 'login' | 'register') {
    this.authMode.set(mode);
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  setRole(role: 'buyer' | 'seller' | 'admin') {
    this.selectedRole.set(role);
  }

  prefill(role: 'buyer' | 'seller' | 'admin', email: string, pass: string, emailIn: HTMLInputElement, passIn: HTMLInputElement) {
    this.selectedRole.set(role);
    emailIn.value = email;
    passIn.value = pass;
    this.authMode.set('login');
  }

  onSubmit(e: Event) {
    e.preventDefault();
    this.errorMessage.set('');
    this.successMessage.set('');
    this.submitting.set(true);

    const form = e.target as HTMLFormElement;
    const email = (form.querySelector('input[type="email"]') as HTMLInputElement).value;
    const password = (form.querySelector('input[type="password"]') as HTMLInputElement).value;

    if (this.authMode() === 'login') {
      // Execute REST login
      this.platformState.loginWithBackend(email, password, this.selectedRole()).subscribe({
        next: (res) => {
          this.submitting.set(false);
          if (res.success && res.profile) {
            this.successMessage.set('Secure credentials validated! Opening dynamic workspace redirect...');
            this.platformState.setSession(res.profile);
            
            // Trigger proper dynamic redirect path
            setTimeout(() => {
              if (res.profile.role.toLowerCase() === 'admin') {
                this.router.navigate(['/dashboard/admin']);
              } else if (res.profile.role.toLowerCase() === 'seller') {
                this.router.navigate(['/dashboard/seller']);
              } else {
                this.router.navigate(['/dashboard/buyer']);
              }
            }, 1000);
          } else {
            this.errorMessage.set(res.error || 'Autheticating credentials was declined.');
          }
        },
        error: (err) => {
          this.submitting.set(false);
          this.errorMessage.set(err.error?.error || 'Endpoint communication error occurred.');
        }
      });
    } else {
      // Execute REST registration
      const fullName = (form.querySelector('input[placeholder="e.g. Jordan Williams"]') as HTMLInputElement)?.value || '';
      const phone = (form.querySelector('input[placeholder="+234 803 111 2222"]') as HTMLInputElement)?.value || '';
      
      const payload: {
        email: string;
        fullName: string;
        phone?: string;
        role: 'buyer' | 'seller' | 'admin';
        password?: string;
        businessName?: string;
        taxId?: string;
        deliveryAddress?: string;
      } = {
        email,
        fullName,
        phone,
        password,
        role: this.selectedRole() as 'buyer' | 'seller' | 'admin'
      };

      if (this.selectedRole() === 'buyer') {
        const addressInput = form.querySelector('input[placeholder="e.g. Block 42, Lekki Phase 1, Lagos"]') as HTMLInputElement;
        payload.deliveryAddress = addressInput?.value || '';
      } else if (this.selectedRole() === 'seller') {
        const bName = (form.querySelector('input[placeholder="e.g. Alpha Dealership Ltd"]') as HTMLInputElement)?.value || '';
        const tId = (form.querySelector('input[placeholder="e.g. TIN-482201"]') as HTMLInputElement)?.value || '';
        payload.businessName = bName;
        payload.taxId = tId;
      }

      this.platformState.registerWithBackend(payload).subscribe({
        next: (res) => {
          this.submitting.set(false);
          if (res.success && res.profile) {
            this.successMessage.set('Profile successfully verified! Welcome to the ecosystem.');
            this.platformState.setSession(res.profile);
            
            setTimeout(() => {
              if (res.profile.role.toLowerCase() === 'admin') {
                this.router.navigate(['/dashboard/admin']);
              } else if (res.profile.role.toLowerCase() === 'seller') {
                this.router.navigate(['/dashboard/seller']);
              } else {
                this.router.navigate(['/dashboard/buyer']);
              }
            }, 1000);
          } else {
            this.errorMessage.set(res.error || 'Corporate registration checklist validation failed.');
          }
        },
        error: (err) => {
          this.submitting.set(false);
          this.errorMessage.set(err.error?.error || 'Database submission failed.');
        }
      });
    }
  }
}
