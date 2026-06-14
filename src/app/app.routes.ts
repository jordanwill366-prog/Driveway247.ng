import {Routes} from '@angular/router';
import {authGuard} from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth/auth').then((m) => m.AuthComponent),
  },
  {
    path: 'dashboard/buyer',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
    canActivate: [authGuard(['buyer', 'admin'])]
  },
  {
    path: 'dashboard/seller',
    loadComponent: () => import('./pages/seller/seller').then((m) => m.SellerDashboardComponent),
    canActivate: [authGuard(['seller', 'admin'])]
  },
  {
    path: 'dashboard/admin',
    loadComponent: () => import('./pages/admin/admin').then((m) => m.AdminDashboardComponent),
    canActivate: [authGuard(['admin'])]
  },
  {
    path: 'seller/dashboard',
    loadComponent: () => import('./pages/seller/seller').then((m) => m.SellerDashboardComponent),
    canActivate: [authGuard(['seller', 'admin'])]
  },
  {
    path: 'inspector/dashboard',
    loadComponent: () => import('./pages/inspector/inspector').then((m) => m.InspectorDashboardComponent),
    canActivate: [authGuard(['admin'])]
  },
  {
    path: 'delivery/dashboard',
    loadComponent: () => import('./pages/delivery/delivery').then((m) => m.DeliveryDashboardComponent),
    canActivate: [authGuard(['admin'])]
  },
  {
    path: 'broker/dashboard',
    loadComponent: () => import('./pages/broker/broker').then((m) => m.BrokerDashboardComponent),
    canActivate: [authGuard(['admin'])]
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./pages/admin/admin').then((m) => m.AdminDashboardComponent),
    canActivate: [authGuard(['admin'])]
  }
];
