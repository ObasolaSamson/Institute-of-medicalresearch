import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { InactivityService } from '../services/inactivity.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private inactivityService: InactivityService
  ) {}

  logout() {
    // Stop inactivity monitoring
    this.inactivityService.stopMonitoring();
    
    // Use the auth service to logout
    this.authService.logout();

    // Show success message
    this.toastr.success('You have been logged out successfully', 'Logout');

    // Navigate to login page
    this.router.navigate(['/login']);
  }
}
