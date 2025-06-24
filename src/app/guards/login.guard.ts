import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('authToken');

    if (token) {
      // User is already logged in, redirect to dashboard
      this.router.navigate(['/dashboard']);
      return false;
    } else {
      // User is not logged in, allow access to login page
      return true;
    }
  }
}
