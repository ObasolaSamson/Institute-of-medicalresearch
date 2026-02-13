import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class InactivityService implements OnDestroy {
  private readonly INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
  private inactivityTimer: any;
  private destroy$ = new Subject<void>();
  private isMonitoring = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  /**
   * Start monitoring user activity
   */
  startMonitoring(): void {
    // Only start if user is logged in
    if (!this.authService.isLoggedIn()) {
      return;
    }

    // Stop existing monitoring if already running
    this.stopMonitoring();

    // Create new destroy subject
    this.destroy$ = new Subject<void>();
    this.isMonitoring = true;

    this.resetTimer();

    // Listen to user activity events
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    events.forEach((event) => {
      fromEvent(document, event)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          if (this.isMonitoring && this.authService.isLoggedIn()) {
            this.resetTimer();
          }
        });
    });
  }

  /**
   * Reset the inactivity timer
   */
  private resetTimer(): void {
    // Clear existing timer
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    // Set new timer
    this.inactivityTimer = setTimeout(() => {
      this.handleInactivity();
    }, this.INACTIVITY_TIMEOUT);
  }

  /**
   * Handle user inactivity - log out the user
   */
  private handleInactivity(): void {
    // Only logout if user is still logged in
    if (this.authService.isLoggedIn()) {
      this.toastr.warning(
        'You have been logged out due to inactivity',
        'Session Expired'
      );
      this.authService.logout();
      this.router.navigate(['/login'], {
        queryParams: { reason: 'inactivity' },
      });
    }
  }

  /**
   * Stop monitoring user activity
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
    if (this.destroy$) {
      this.destroy$.next();
      this.destroy$.complete();
    }
  }

  /**
   * Cleanup on service destruction
   */
  ngOnDestroy(): void {
    this.stopMonitoring();
  }
}

