import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

export const authGuardCoordinador: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.verificarCoordinador()) {
    return true;
  }
  else {
    router.navigate(['/login/coordinator']);
    return false;
  }
};

export const authGuardEstudiante: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.verificarEstudiante()) {
    return true;
  }
  else {
    router.navigate(['/login/student']);
    return false;
  }
}

export const authGuardAdmin: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.verificarAdmin()) {
    return true;
  }
  else {
    router.navigate(['/login/admin']);
    return false;
  }
}

export const authGuardProfesor: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.verificarProfesor()) {
    return true;
  }
  else {
    router.navigate(['/login/teacher']);
    return false;
  }
}
