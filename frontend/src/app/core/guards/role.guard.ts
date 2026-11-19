import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Rol } from '../models/models';
import { AuthService } from '../services/auth.service';

export const roleGuard = (...roles: Rol[]): CanActivateFn => () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.estaAutenticado()) return router.createUrlTree(['/login']);
  return auth.tieneRol(...roles) ? true : router.createUrlTree([auth.rutaInicial()]);
};