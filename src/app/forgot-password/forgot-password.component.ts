import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.resetForm.valid) {
      this.loading = true;
      const { email } = this.resetForm.value;

      this.authService.forgotPassword(email).subscribe({
        next: (response) => {
          this.loading = false;
          if (response && response.success) {
            this.toastr.success(
              'Password reset instructions have been sent to your email',
              'Success'
            );
            this.router.navigate(['/login']);
          } else {
            this.toastr.error(
              'Failed to send reset instructions. Please try again.',
              'Error'
            );
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Password reset request failed', error);
          this.toastr.error(
            'An error occurred. Please try again later.',
            'Error'
          );
        },
      });
    } else {
      this.toastr.warning('Please enter a valid email address', 'Warning');
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
