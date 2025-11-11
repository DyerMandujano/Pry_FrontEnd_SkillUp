import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; //

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    // Opcional: Verificar si es estudiante
    // const user = authService.getCurrentUser(); // Necesitarías un método en AuthService para esto
    // if (user.rol === 'estudiante') {
    //   return true;
    // }
    return true; // Por ahora, solo comprobamos si está logueado
  } else {
    // Si no hay sesión, redirige al login
    router.navigate(['/login']);
    return false;
  }
};