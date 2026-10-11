import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SessionState } from '../state/session.state';

export const authGuard: CanActivateFn = () => {
  const session = inject(SessionState);
  const router = inject(Router);

  if (session.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};
