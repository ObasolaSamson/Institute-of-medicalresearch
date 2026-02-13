import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { InactivityService } from './services/inactivity.service';
import { AuthService } from './services/auth.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'web-app';
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private inactivityService: InactivityService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    initFlowbite();
    
    // Start monitoring if user is already logged in
    if (this.authService.isLoggedIn()) {
      this.inactivityService.startMonitoring();
    }

    // Monitor route changes to restart inactivity timer after login
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        // Restart monitoring if user is logged in
        if (this.authService.isLoggedIn()) {
          this.inactivityService.startMonitoring();
        } else {
          this.inactivityService.stopMonitoring();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.inactivityService.stopMonitoring();
  }
}
