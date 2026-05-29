import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <footer class="bg-[#0a0a0a] border-t border-white/5 pt-20 pb-10">
       <div class="max-w-[1400px] mx-auto px-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
             <div class="lg:col-span-2">
                <a href="/" class="flex items-center gap-3 mb-6 group">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-driveway-gold to-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                     <mat-icon class="text-white text-base w-5 h-5">directions_car</mat-icon>
                  </div>
                  <span class="font-display font-bold text-2xl tracking-tight text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-all">Driveway247<span class="text-driveway-gold">.ng</span></span>
                </a>
                <p class="text-gray-400 text-sm max-w-sm font-light leading-relaxed mb-8">
                  The premium automotive ecosystem. Every vehicle verified. Every transaction protected by escrow. Buy and sell with absolute confidence.
                </p>
                <div class="flex gap-4">
                   <!-- Social Mock Icons -->
                   <a href="#" class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-colors">
                      <span class="font-serif">in</span>
                   </a>
                   <a href="#" class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-colors">
                      <span class="font-serif">tw</span>
                   </a>
                   <a href="#" class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-colors">
                      <span class="font-serif">ig</span>
                   </a>
                </div>
             </div>
             
             <div>
                <h4 class="text-white font-medium mb-6 uppercase tracking-wider text-xs">Buy</h4>
                <ul class="space-y-4 text-sm text-gray-400">
                   <li><a href="#" class="hover:text-driveway-gold transition-colors">Browse Vehicles</a></li>
                   <li><a href="#" class="hover:text-driveway-gold transition-colors">Premium Collection</a></li>
                   <li><a href="#" class="hover:text-driveway-gold transition-colors">How Escrow Works</a></li>
                   <li><a href="#" class="hover:text-driveway-gold transition-colors">Inspection Reports</a></li>
                </ul>
             </div>

             <div>
                <h4 class="text-white font-medium mb-6 uppercase tracking-wider text-xs">Sell</h4>
                <ul class="space-y-4 text-sm text-gray-400">
                   <li><a href="#" class="hover:text-driveway-gold transition-colors">Seller Portal</a></li>
                   <li><a href="#" class="hover:text-driveway-gold transition-colors">Dealer Hub</a></li>
                   <li><a href="#" class="hover:text-driveway-gold transition-colors">Verification Process</a></li>
                   <li><a href="#" class="hover:text-driveway-gold transition-colors">Fees & Pricing</a></li>
                </ul>
             </div>

             <div>
                <h4 class="text-white font-medium mb-6 uppercase tracking-wider text-xs">Platform</h4>
                <ul class="space-y-4 text-sm text-gray-400">
                   <li><a href="#" class="hover:text-driveway-cyan transition-colors">Inspector Portal</a></li>
                   <li><a href="#" class="hover:text-white transition-colors">Admin Center</a></li>
                   <li><a href="#" class="hover:text-white transition-colors">Trust & Safety</a></li>
                   <li><a href="#" class="hover:text-white transition-colors">Contact Support</a></li>
                </ul>
             </div>
          </div>

          <div class="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
             <p>&copy; 2026 Driveway247.ng. All rights reserved.</p>
             <div class="flex items-center gap-6">
                <a href="#" class="hover:text-gray-300 transition-colors">Privacy Policy</a>
                <a href="#" class="hover:text-gray-300 transition-colors">Terms of Service</a>
                <a href="#" class="hover:text-gray-300 transition-colors">Cookie Policy</a>
             </div>
          </div>
       </div>
    </footer>
  `
})
export class FooterComponent {}
