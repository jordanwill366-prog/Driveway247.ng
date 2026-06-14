import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { PlatformStateService } from '../../services/platform-state';
import { NgClass, CommonModule } from '@angular/common';
import { BaseUserProfile, VehicleListing, InspectionRequest, DeliveryOrder } from '../../../shared/types';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [MatIconModule, NgClass, CommonModule],
  template: `
    <div class="min-h-screen bg-neutral-950 text-white font-sans pb-24">
      
      <!-- Top Header -->
      <div class="bg-neutral-900 border-b border-white/5 py-6 px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center">
            <mat-icon class="text-white">admin_panel_settings</mat-icon>
          </div>
          <div>
            <h1 class="text-xl font-display font-bold">Mainframe Command Center</h1>
            <p class="text-xs text-gray-400">Manage verified listings, assign inspectors, track shipments, and ban bad actors.</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium flex items-center gap-2">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Master Auth Key Active
          </div>
          <button (click)="logout()" class="px-3 h-9 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg border border-white/5 transition-all text-xs flex items-center gap-1">
            <mat-icon class="text-xs">logout</mat-icon> Sign Out
          </button>
        </div>
      </div>

      <!-- Main Layout Body -->
      <div class="max-w-[1400px] mx-auto px-6 py-8">

        <!-- STATS BANNER -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-left">
          <div class="bg-white/2 border border-white/5 p-5 rounded-2xl">
            <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">Ecosystem Users</span>
            <div class="flex justify-between items-baseline">
              <span class="text-2xl font-bold">{{ systemUsers().length }}</span>
              <span class="text-[10px] text-gray-500">Live Profiles</span>
            </div>
          </div>
          <div class="bg-white/2 border border-white/5 p-5 rounded-2xl">
            <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">Approved Listings</span>
            <div class="flex justify-between items-baseline">
              <span class="text-2xl font-bold text-amber-500">{{ approvedCount() }}</span>
              <span class="text-[10px] text-gray-500">Verified Catalog</span>
            </div>
          </div>
          <div class="bg-white/2 border border-white/5 p-5 rounded-2xl">
            <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">Active Inspections</span>
            <div class="flex justify-between items-baseline">
              <span class="text-2xl font-bold text-cyan-400">{{ activeInspectionsCount() }}</span>
              <span class="text-[10px] text-gray-500">Field Allocations</span>
            </div>
          </div>
          <div class="bg-white/2 border border-white/5 p-5 rounded-2xl bg-rose-950/5">
            <span class="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">Banned Accounts</span>
            <div class="flex justify-between items-baseline">
              <span class="text-2xl font-bold text-rose-500">{{ bannedCount() }}</span>
              <span class="text-[10px] text-rose-500/70">Access Revoked</span>
            </div>
          </div>
        </div>

        <!-- CONTROL NAVIGATION TABS -->
        <div class="flex gap-2 border-b border-white/5 mb-8 overflow-x-auto pb-2 select-none">
          <button (click)="activeTab.set('users')" [ngClass]="activeTab() === 'users' ? 'border-b-2 border-rose-500 text-rose-500 bg-white/2' : 'text-gray-400 hover:text-white border-transparent'" class="px-5 py-3 font-medium text-xs transition-all whitespace-nowrap flex items-center gap-2 rounded-t-xl bg-transparent border-0 cursor-pointer">
            <mat-icon class="text-sm">people</mat-icon> User Roster & Suspensions ({{ systemUsers().length }})
          </button>
          <button (click)="activeTab.set('listings')" [ngClass]="activeTab() === 'listings' ? 'border-b-2 border-rose-500 text-rose-500 bg-white/2' : 'text-gray-400 hover:text-white border-transparent'" class="px-5 py-3 font-medium text-xs transition-all whitespace-nowrap flex items-center gap-2 rounded-t-xl bg-transparent border-0 cursor-pointer">
            <mat-icon class="text-sm">gavel</mat-icon> Market Publication Queue ({{ pendingListings().length }})
          </button>
          <button (click)="activeTab.set('inspections')" [ngClass]="activeTab() === 'inspections' ? 'border-b-2 border-rose-500 text-rose-500 bg-white/2' : 'text-gray-400 hover:text-white border-transparent'" class="px-5 py-3 font-medium text-xs transition-all whitespace-nowrap flex items-center gap-2 rounded-t-xl bg-transparent border-0 cursor-pointer">
            <mat-icon class="text-sm">build_circle</mat-icon> Field Inspections Agency ({{ activeInspectionsCount() }})
          </button>
          <button (click)="activeTab.set('logistics')" [ngClass]="activeTab() === 'logistics' ? 'border-b-2 border-rose-500 text-rose-500 bg-white/2' : 'text-gray-400 hover:text-white border-transparent'" class="px-5 py-3 font-medium text-xs transition-all whitespace-nowrap flex items-center gap-2 rounded-t-xl bg-transparent border-0 cursor-pointer">
            <mat-icon class="text-sm">local_shipping</mat-icon> Delivery Order Courier Hub                  
          </button>
        </div>

        <!-- Feedback Area -->
        @if (notificationMessage()) {
          <div class="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 shadow-lg animate-fadeIn">
            <mat-icon>check_circle</mat-icon>
            <span>{{ notificationMessage() }}</span>
          </div>
        }

        <!-- MAIN DYNAMIC CONTENT DECK -->
        <div class="bg-neutral-900 border border-white/5 rounded-3xl p-6 sm:p-8 text-left">
          
          <!-- TAB 1: USER ROSTER & BAN/UNBAN (Requirement #7) -->
          @if (activeTab() === 'users') {
            <div class="space-y-6">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 class="text-lg font-display font-bold">Secure User Directory</h3>
                  <p class="text-xs text-gray-400">Restrict, verify, or suspend accounts inside the unified Carvello dealership roster.</p>
                </div>
                <button (click)="loadUsers()" class="px-3.5 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-xs font-semibold flex items-center gap-1">
                  <mat-icon class="text-sm">refresh</mat-icon> Reload Users
                </button>
              </div>

              <!-- Users table / cards -->
              <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
                @for (usr of systemUsers(); track usr.id) {
                  <div [ngClass]="usr.isBanned ? 'border-red-500/20 bg-red-500/[0.01]' : 'border-white/5 bg-white/2'"
                       class="border rounded-2xl p-5 flex flex-col md:flex-row justify-between gap-4 transition-all hover:bg-white/[0.03]">
                    
                    <div class="flex items-start gap-3.5">
                      <div class="w-11 h-11 rounded-full bg-neutral-800 flex items-center justify-center shrink-0 border border-white/5 overflow-hidden">
                        <img [src]="usr.avatarUrl" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
                      </div>
                      <div class="space-y-1">
                        <div class="flex items-center gap-2">
                          <h4 class="font-bold text-sm tracking-tight text-white leading-tight">{{ usr.fullName }}</h4>
                          <span [ngClass]="usr.role === 'admin' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : (usr.role === 'seller' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20')"
                                class="px-2 py-0.5 text-[8.5px] font-bold uppercase rounded border scale-95 font-mono">
                            {{ usr.role }}
                          </span>
                        </div>
                        <span class="text-xs font-mono text-gray-400 block">{{ usr.email }}</span>
                        <p class="text-[11px] text-gray-500">Phone: {{ usr.phone }}</p>

                        <!-- Extra business parameters -->
                        @if (usr.role === 'seller') {
                          <div class="bg-black/30 p-2.5 rounded-xl text-[10.5px] space-y-1 mt-2 text-gray-400 border border-white/5">
                            <p><b>CAC Corporate:</b> {{ usr.businessName }}</p>
                            <p><b>Tax TIN:</b> {{ usr.taxId }}</p>
                            <div class="flex items-center gap-1.5 pt-1">
                              Status: 
                              @if (usr.isVerified) {
                                <span class="text-emerald-400 font-bold flex items-center gap-0.5"><mat-icon class="text-xs">check_circle</mat-icon> Vetted V1 ✓</span>
                              } @else {
                                <button (click)="approveKYC(usr.id)" class="px-2.5 py-0.5 bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-black hover:scale-105 duration-200 border border-amber-500/30 rounded text-[9px] uppercase font-bold">
                                  Approve KYC Vetting
                                </button>
                              }
                            </div>
                          </div>
                        }

                        @if (usr.role === 'buyer') {
                          <p class="text-[10.5px] text-gray-400 bg-black/20 p-2 rounded-lg mt-2 font-mono">
                            <b>Address:</b> {{ usr.deliveryAddress || 'No default address set' }}
                          </p>
                        }
                      </div>
                    </div>

                    <div class="shrink-0 flex md:flex-col justify-end items-end gap-2 border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                      @if (usr.role !== 'admin') {
                        @if (usr.isBanned) {
                          <span class="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/25 rounded text-[10px] font-bold uppercase block tracking-wider mb-2 font-mono">Account Suspended</span>
                          <button (click)="unbanUser(usr.id)" class="px-4 py-2 bg-emerald-500 text-black hover:bg-emerald-400 transition-colors rounded-xl text-xs font-bold leading-none flex items-center gap-1">
                            <mat-icon class="text-sm">check_circle</mat-icon> Reinstate Account
                          </button>
                        } @else {
                          <button (click)="banUser(usr.id)" class="px-4 py-2 border border-rose-500/20 hover:border-rose-500 text-rose-500 hover:bg-rose-500/10 transition-all rounded-xl text-xs font-bold leading-none flex items-center gap-1.5">
                            <mat-icon class="text-sm">block</mat-icon> Suspend Access
                          </button>
                        }
                      } @else {
                        <span class="text-xs font-mono text-gray-500">System Protected</span>
                      }
                    </div>

                  </div>
                }
              </div>
            </div>
          }

          <!-- TAB 2: LISTING MODERATION QUEUE (Requirement #7) -->
          @if (activeTab() === 'listings') {
            <div class="space-y-6">
              <div>
                <h3 class="text-lg font-display font-bold">Market Publication Board Approvals</h3>
                <p class="text-xs text-gray-400">Audit freshly submitted dealer listings with physical inspection status checkmarks before releasing to general buyer search results.</p>
              </div>

              <div class="grid grid-cols-1 gap-4">
                @for (car of pendingListings(); track car.id) {
                  <div class="bg-white/2 border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                    
                    <div class="flex items-start gap-4">
                      <div class="w-24 h-16 rounded-xl overflow-hidden bg-neutral-800 shrink-0 border border-white/10 shadow-lg">
                        <img [src]="car.image" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
                      </div>
                      <div>
                        <h4 class="font-bold text-base leading-tight text-white">{{ car.year }} {{ car.make }} {{ car.model }}</h4>
                        <p class="text-xs text-gray-400 font-mono mt-1"><b>Seller:</b> {{ car.sellerName }} &middot; <b>Price:</b> ₦{{ car.price.toLocaleString() }}</p>
                        <p class="text-xs text-gray-500">Location: {{ car.location }} &middot; Mileage: {{ car.mileage.toLocaleString() }} mi</p>
                        
                        <div class="flex gap-2.5 items-center mt-2.5 flex-wrap">
                          @if (car.isInspected) {
                            <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-0.5 font-mono">
                              <mat-icon class="text-xs">verified_user</mat-icon> Inspected Vetted (Score: {{ car.inspectorRating || 5 }}/5)
                            </span>
                            <span class="text-[10px] text-gray-400 italic">Report: "{{ car.inspectorReport }}"</span>
                          } @else {
                            <span class="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-0.5 font-mono">
                              <mat-icon class="text-xs">hourglass_empty</mat-icon> Physical Vetting Pending
                            </span>
                            <span class="text-[10.5px] text-gray-500">Request an operational checklist from the Field Inspections tab!</span>
                          }
                        </div>
                      </div>
                    </div>

                    <div class="shrink-0 flex gap-2 w-full md:w-auto">
                      <button (click)="rejectListing(car.id)" class="px-4 py-2.5 border border-white/5 text-gray-400 hover:text-white hover:border-white/10 transition-colors text-xs font-bold rounded-xl flex-grow md:flex-grow-0 cursor-pointer">
                        Reject
                      </button>
                      <button (click)="approveListing(car.id)" class="px-5 py-2.5 bg-amber-500 text-black hover:bg-amber-400 transition-colors text-xs font-extrabold uppercase tracking-wide rounded-xl flex items-center gap-1.5 shadow-lg shadow-amber-500/10 flex-grow md:flex-grow-0 cursor-pointer">
                        <mat-icon class="text-sm">publish</mat-icon> Approve & Publish
                      </button>
                    </div>

                  </div>
                } @empty {
                  <div class="py-12 text-center text-gray-500 space-y-2">
                    <mat-icon class="text-4xl">dashboard_customize</mat-icon>
                    <p class="text-sm font-semibold">Publication Queue Cleared</p>
                    <p class="text-xs">All registered automobiles are published and visible to buyers.</p>
                  </div>
                }
              </div>
            </div>
          }

          <!-- TAB 3: INSPECTION DECK (Requirement #8) -->
          @if (activeTab() === 'inspections') {
            <div class="space-y-6">
              <div>
                <h3 class="text-lg font-display font-bold">150-Point Physical Inspection Dispatch Desk</h3>
                <p class="text-xs text-gray-400">Coordinate on-site evaluations. Assign certified field officers, or submit finalized reports with checklist rankings.</p>
              </div>

              <div class="grid grid-cols-1 gap-6 text-left">
                @for (ins of inspectionRequests(); track ins.id) {
                  <div class="bg-white/2 border border-white/5 rounded-2xl p-5 space-y-4">
                    
                    <div class="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-4 gap-4">
                      <div class="flex items-center gap-3">
                        <div class="w-12 h-9 rounded-lg overflow-hidden bg-neutral-800 border border-white/10 shrink-0">
                          <img [src]="ins.vehicleImage" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
                        </div>
                        <div>
                          <span class="text-[9px] font-mono tracking-widest text-[#ef4444] uppercase font-bold">{{ ins.status }}</span>
                          <h4 class="font-bold text-sm text-white leading-tight mt-0.5">{{ ins.vehicleName }}</h4>
                        </div>
                      </div>

                      <div class="flex gap-2">
                        @if (ins.status === 'pending_assignment') {
                          <span class="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-[#ebaf5b] text-[9.5px] font-bold uppercase block tracking-wider font-mono">Awaiting Dispatch</span>
                        } @else if (ins.status === 'assigned') {
                          <span class="px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-[#22d3ee] text-[9.5px] font-bold uppercase block tracking-wider font-mono">Officer En Route</span>
                        } @else {
                          <span class="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[9.5px] font-bold uppercase block tracking-wider font-mono flex items-center gap-0.5"><mat-icon class="text-xs">task_alt</mat-icon> Vetting Complete</span>
                        }
                      </div>
                    </div>

                    <!-- Details Area -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                      <div class="space-y-1 bg-black/10 p-3 rounded-xl border border-white/2">
                        <span class="text-gray-500 font-bold uppercase tracking-wider text-[8.5px] block">Buyer Request details</span>
                        <p><b>Client:</b> {{ ins.buyerName }} (ID: {{ ins.buyerId }})</p>
                        <p><b>Showroom Location:</b> {{ ins.location }}</p>
                        <p><b>Request Reference:</b> ID: {{ ins.id }}</p>
                      </div>

                      <div class="space-y-2 bg-black/15 p-3 rounded-xl border border-white/2">
                        <span class="text-gray-400 font-bold uppercase tracking-wider text-[8.5px] block flex items-center gap-1">
                          <mat-icon class="text-xs text-rose-500">engineering</mat-icon> Assigned Inspector Officer
                        </span>
                        
                        @if (ins.status === 'pending_assignment') {
                          <div class="flex items-center gap-2 pt-1 font-sans">
                            <select #inspectorSelect class="h-8 px-2 bg-neutral-950 border border-white/10 rounded-lg text-xs text-white focus:outline-none">
                              <option value="Frank Adebayo (FLD-9022)">Frank Adebayo (FLD-9022)</option>
                              <option value="Sola Williams (FLD-1044)">Sola Williams (FLD-1044)</option>
                              <option value="Ibrahim Bello (FLD-Abuja)">Ibrahim Bello (FLD-Abuja)</option>
                            </select>
                            <button (click)="assignInspector(ins.id, inspectorSelect.value)" class="h-8 px-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer">
                              Assign ✓
                            </button>
                          </div>
                        } @else {
                          <div class="space-y-1">
                            <p><b>Officer:</b> {{ ins.assignedInspectorName }}</p>
                            <p><b>Target Date:</b> {{ ins.scheduledDate }}</p>
                          </div>
                        }
                      </div>
                    </div>

                    <!-- Inspection Report details (Completed vs Submit Report) -->
                    @if (ins.status === 'assigned') {
                      <!-- Dynamic inspector report form simulator for admin/inspector testing -->
                      <div class="bg-black/40 border border-dashed border-white/10 p-4 rounded-xl space-y-3.5 text-xs animate-fadeIn">
                        <span class="text-rose-500 font-bold uppercase tracking-wider text-[9px] block flex items-center gap-1">
                          <mat-icon class="text-xs">description</mat-icon> Inspector Scorecard Reporting Station (Simulated)
                        </span>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label class="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Vetting Score Rating</label>
                            <select #ratingSelect class="w-full h-9 px-2 bg-neutral-950 border border-white/10 rounded-lg text-xs text-white">
                              <option value="5" selected>5 / 5 (Outstanding condition)</option>
                              <option value="4.5">4.5 / 5 (Very clean Tokunbo)</option>
                              <option value="4">4 / 5 (Good operational state)</option>
                              <option value="3">3 / 5 (Minor wear, needs service)</option>
                            </select>
                          </div>
                          <div>
                            <label class="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">Inspections Report Photos (Mock list)</label>
                            <div class="w-full h-9 px-3 bg-neutral-950 border border-white/10 rounded-lg text-xs text-gray-400 flex items-center justify-between">
                              <span>3 Diagnostic Photos attached</span>
                              <span class="text-[8.5px] bg-emerald-500/10 text-emerald-450 px-1.5 py-0.5 rounded border border-emerald-500/20 font-mono font-bold uppercase">STAGED</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label class="text-[9.5px] font-bold text-gray-300 uppercase tracking-wider mb-1 block">Mechanic Diagnosis Details & Faults Listing</label>
                          <textarea #reportDetailsArea rows="2.5" placeholder="E.g. Powertrain diagnostic clean. Mild scratch on driver's threshold rim, structural indices fully verified." 
                                    class="w-full bg-neutral-950 border border-white/10 focus:border-rose-500 rounded-lg p-2 text-xs text-white focus:outline-none"></textarea>
                        </div>

                        <div class="flex justify-end pt-1">
                          <button (click)="submitInspection(ins.id, +ratingSelect.value, reportDetailsArea.value)" class="h-9 px-4 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-lg uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-emerald-500/15 cursor-pointer">
                            <mat-icon class="text-sm">check_circle</mat-icon> Log Diagnostic Report & Complete Vetting
                          </button>
                        </div>
                      </div>
                    }

                    @if (ins.status === 'completed') {
                      <div class="p-4 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-xl space-y-1.5 text-xs text-gray-300 font-sans">
                        <p class="text-white font-bold text-[10px] uppercase tracking-wider text-emerald-410">REPORT DIGEST:</p>
                        <p><b>Checklist Score:</b> <span class="text-white font-semibold">{{ ins.rating }}/5 Stars</span></p>
                        <p class="italic text-gray-400 leading-relaxed font-light">"{{ ins.reportDetails }}"</p>
                        
                        <div class="flex gap-2.5 pt-2">
                          @for (url of ins.photos; track url) {
                            <div class="relative w-16 h-12 rounded border border-white/10 overflow-hidden shrink-0">
                              <img [src]="url" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
                            </div>
                          }
                        </div>
                      </div>
                    }

                  </div>
                } @empty {
                  <div class="py-12 bg-white/2 border border-white/5 rounded-2xl text-center text-gray-500 italic font-mono text-xs">
                    No active inspection requests queued in dispatch directory.
                  </div>
                }
              </div>
            </div>
          }

          <!-- TAB 4: DELIVERY TRACKING (Requirement #9) -->
          @if (activeTab() === 'logistics') {
            <div class="space-y-6">
              <div>
                <h3 class="text-lg font-display font-bold">Logistics Carrier Dispatch Room</h3>
                <p class="text-xs text-gray-400">View chosen delivery methods, verify pricing metrics, and dispatch dynamic courier routing log updates to status boards.</p>
              </div>

              <!-- Shipments Listing -->
              <div class="grid grid-cols-1 gap-4">
                @for (del of systemDeliveries(); track del.id) {
                  <div class="bg-white/2 border border-white/5 rounded-2xl p-5 space-y-4">
                    
                    <div class="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-3.5 gap-4">
                      <div class="flex items-center gap-3">
                        <div class="w-12 h-9 rounded-xl overflow-hidden border border-white/10 shrink-0">
                          <img [src]="del.vehicleImage" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
                        </div>
                        <div>
                          <span class="text-[9.5px] font-mono tracking-wider text-rose-500 block">ID Reference: {{ del.id }}</span>
                          <h4 class="font-bold text-sm text-white leading-tight mt-0.5">{{ del.vehicleName }}</h4>
                        </div>
                      </div>

                      <div class="flex gap-2 font-mono">
                        <span [ngClass]="del.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-[#f43f5e] border border-rose-500/20'"
                              class="px-2.5 py-1 text-[9.5px] uppercase font-bold tracking-widest rounded leading-none flex items-center gap-0.5">
                          {{ del.status }}
                        </span>
                      </div>
                    </div>

                    <!-- Dispatch logistics summary -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                      
                      <div class="bg-black/10 p-3 rounded-xl border border-white/2 space-y-1">
                        <span class="text-gray-500 font-bold uppercase tracking-wider text-[8px] block">Client Consignee</span>
                        <p><b>Buyer:</b> {{ del.buyerName }} (ID: {{ del.buyerId }})</p>
                        <p><b>Method:</b> {{ del.deliveryMethod === 'pickup' ? 'Self‑Pickup ( Lagos Center )' : 'Home Delivery Carrier' }}</p>
                        <p><b>Address:</b> {{ del.deliveryAddress }}</p>
                      </div>

                      <div class="bg-black/10 p-3 rounded-xl border border-white/2 space-y-1">
                        <span class="text-gray-500 font-bold uppercase tracking-wider text-[8px] block">Shipping Quotation</span>
                        <p class="text-base font-bold text-white mt-1">₦{{ del.shippingQuote.toLocaleString() }}</p>
                        <p class="text-gray-500 text-[10px]">Distance fee matching standard logistics index metrics</p>
                      </div>

                      <div class="bg-black/15 p-3 rounded-xl border border-white/2 space-y-2">
                        <span class="text-gray-400 font-bold uppercase tracking-wider text-[8px] block">Dispatch Courier Routing Terminal</span>
                        <label class="text-[9.5px] font-bold text-gray-400 uppercase tracking-widest block">Update Carrier transit Status</label>
                        
                        <div class="flex items-center gap-2">
                          <select #deliveryStatusSelect class="h-8 px-2 bg-neutral-950 border border-white/10 rounded-lg text-xs text-white">
                            <option value="pending" [selected]="del.status === 'pending'">Awaiting Dealer Handover</option>
                            <option value="dispatched" [selected]="del.status === 'dispatched'">Dispatched / Verified</option>
                            <option value="in_transit" [selected]="del.status === 'in_transit'">In Transit on expressway</option>
                            <option value="delivered" [selected]="del.status === 'delivered'">Delivered & Received✓</option>
                          </select>
                          <button (click)="updateDeliveryStatus(del.id, deliveryStatusSelect.value)" class="h-8 px-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer">
                            Update
                          </button>
                        </div>
                      </div>

                    </div>

                    <!-- Tracking details -->
                    <div class="bg-neutral-950 p-3.5 rounded-xl border border-white/[0.04]">
                      <span class="text-[10px] font-mono tracking-wider font-semibold text-rose-500 block mb-1">LIVE LOGISTICS SHIPMENT TELEMETRY:</span>
                      <p class="text-xs text-gray-300 italic">"{{ del.trackingDetails }}"</p>
                    </div>

                  </div>
                } @empty {
                  <div class="py-12 bg-white/2 border border-white/5 rounded-2xl text-center text-gray-400 italic text-xs font-mono">
                    No delivery shipments logs on record.
                  </div>
                }
              </div>
            </div>
          }

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
      animation: fadeIn 0.4s ease-out forwards;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  platformState = inject(PlatformStateService);
  router = inject(Router);

  activeTab = signal<'users' | 'listings' | 'inspections' | 'logistics'>('users');
  errorMessage = signal<string>('');
  notificationMessage = signal<string>('');

  // Sourced lists
  systemUsers = signal<BaseUserProfile[]>([]);
  systemDeliveries = signal<DeliveryOrder[]>([]);
  inspectionRequests = signal<InspectionRequest[]>([]);
  allListings = signal<VehicleListing[]>([]);

  // Computed lists and metrics
  pendingListings = computed(() => {
    return this.allListings().filter(l => l.status === 'pending_approval');
  });

  approvedCount = computed(() => {
    return this.allListings().filter(l => l.status === 'approved').length;
  });

  bannedCount = computed(() => {
    return this.systemUsers().filter(u => u.isBanned).length;
  });

  activeInspectionsCount = computed(() => {
    return this.inspectionRequests().filter(i => i.status !== 'completed').length;
  });

  ngOnInit() {
    this.loadUsers();
    this.loadListings();
    this.loadInspections();
    this.loadDeliveries();
  }

  showToast(message: string) {
    this.notificationMessage.set(message);
    setTimeout(() => {
      this.notificationMessage.set('');
    }, 4000);
  }

  // --- ACTIONS ENGINE ---

  loadUsers() {
    this.platformState.fetchAdminUsers().subscribe({
      next: (res) => this.systemUsers.set(res || []),
      error: (err) => console.error('Error fetching admin directory users:', err)
    });
  }

  loadListings() {
    this.platformState.http.get<VehicleListing[]>('/api/listings').subscribe({
      next: (res) => this.allListings.set(res || []),
      error: (err) => console.error('Error fetching catalog listings:', err)
    });
  }

  loadInspections() {
    this.platformState.fetchInspections().subscribe({
      next: (res) => this.inspectionRequests.set(res || []),
      error: (err) => console.error('Error loading inspection roster requests:', err)
    });
  }

  loadDeliveries() {
    this.platformState.fetchDeliveries().subscribe({
      next: (res) => this.systemDeliveries.set(res || []),
      error: (err) => console.error('Error fetching logistics deliveries:', err)
    });
  }

  banUser(userId: string) {
    this.platformState.banUserBack(userId).subscribe({
      next: (res) => {
        if (res.success) {
          this.showToast('User suspended successfully. Platform token cleared.');
          this.loadUsers();
        }
      },
      error: (err) => console.error('Error suspending user account:', err)
    });
  }

  unbanUser(userId: string) {
    this.platformState.unbanUserBack(userId).subscribe({
      next: (res) => {
        if (res.success) {
          this.showToast('Suspension revoked. User login privileges restored.');
          this.loadUsers();
        }
      },
      error: (err) => console.error('Error reinstating user account:', err)
    });
  }

  approveKYC(userId: string) {
    this.platformState.approveKYCBack(userId).subscribe({
      next: (res) => {
        if (res.success) {
          this.showToast('Dealership Cac TIN registration approved! Channel unlocked.');
          this.loadUsers();
        }
      },
      error: (err) => console.error('Error approving details merchant credentials:', err)
    });
  }

  approveListing(id: string) {
    this.platformState.approveListingBack(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.showToast('Automobile successfully released to public listing discovery showroom!');
          this.loadListings();
        }
      },
      error: (err) => console.error('Error approving dealer listing:', err)
    });
  }

  rejectListing(id: string) {
    this.platformState.http.post<{ success: boolean }>(`/api/listings/${id}/reject`, {}).subscribe({
      next: (res) => {
        if (res.success) {
          this.showToast('Automobile publication declined.');
          this.loadListings();
        }
      },
      error: (err) => console.error('Error rejecting listing publication:', err)
    });
  }

  assignInspector(inspectionId: string, name: string) {
    this.platformState.assignInspectorBack(inspectionId, { assignedInspectorName: name }).subscribe({
      next: (res) => {
        if (res.success) {
          this.showToast(`Professional officer allocated to vetting request!`);
          this.loadInspections();
        }
      },
      error: (err) => console.error('Error allocating field agent:', err)
    });
  }

  submitInspection(inspectionId: string, rating: number, details: string) {
    const finalReportNotes = details || '150-Point chassis clearance active. Gear tooth matching ratios and tire tread specs confirmed safe.';
    this.platformState.submitInspectionReportBack(inspectionId, {
      rating,
      reportDetails: finalReportNotes
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.showToast('Checking complete scorecard successfully recorded on vehicle record!');
          this.loadInspections();
          this.loadListings(); // updates verified checkmarks
        }
      },
      error: (err) => console.error('Error submitting field report notes:', err)
    });
  }

  updateDeliveryStatus(id: string, status: string) {
    let details = 'Courier shipment updated.';
    if (status === 'dispatched') {
      details = 'Shipment released by dealer. Logistics transport carrier loaded.';
    } else if (status === 'in_transit') {
      details = 'Transit carrier is currently on expressway en route to Lagos showroom handover hub.';
    } else if (status === 'delivered') {
      details = 'Physical receiver handover checklist completed. Signature logged on-site.';
    }

    this.platformState.updateDeliveryStatusBack(id, status, details).subscribe({
      next: (res) => {
        if (res.success) {
          this.showToast(`Shipment transit telemetry successfully updated to [${status}].`);
          this.loadDeliveries();
        }
      },
      error: (err) => console.error('Error dispatching logistics status telemetry:', err)
    });
  }

  logout() {
    this.platformState.logoutWithBackend().subscribe(() => {
      this.platformState.setSession(null);
      this.router.navigate(['/auth']);
    });
  }
}
