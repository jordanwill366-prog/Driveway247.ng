import {Routes} from '@angular/router';

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
    path: 'seller/dashboard',
    loadComponent: () => import('./pages/seller/seller').then((m) => m.SellerDashboardComponent),
  },
  {
    path: 'inspector/dashboard',
    loadComponent: () => import('./pages/inspector/inspector').then((m) => m.InspectorDashboardComponent),
  },
  {
    path: 'delivery/dashboard',
    loadComponent: () => import('./pages/delivery/delivery').then((m) => m.DeliveryDashboardComponent),
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./pages/admin/admin').then((m) => m.AdminDashboardComponent),
  }
];
