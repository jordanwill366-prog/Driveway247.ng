import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PlatformStateService } from '../services/platform-state';

export const authGuard = (expectedRoles: string[]): CanActivateFn => {
  return () => {
    const sService = inject(PlatformStateService);
    const router = inject(Router);
    const session = sService.getSession();

    if (!session) {
      router.navigate(['/auth']);
      return false;
    }

    const normRole = session.role.toLowerCase();
    const hasRole = expectedRoles.some(r => r.toLowerCase() === normRole);

    if (!hasRole) {
      // Unprivileged role access fallback redirects to appropriate dashboard safely
      if (normRole === 'buyer') {
        router.navigate(['/dashboard/buyer']);
      } else if (normRole === 'seller') {
        router.navigate(['/dashboard/seller']);
      } else if (normRole === 'admin') {
        router.navigate(['/dashboard/admin']);
      } else {
        router.navigate(['/']);
      }
      return false;
    }

    return true;
  };
};
