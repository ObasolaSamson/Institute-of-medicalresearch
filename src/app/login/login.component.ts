import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  authForm!: FormGroup;
  errorMessage = '';
  loading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      remember: [true],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (this.authForm.valid) {
      this.loading = true;
      const { email, password } = this.authForm.value;

      this.authService.login(email, password).subscribe({
        next: (res) => {
          this.loading = false;
          if (res?.token) {
            localStorage.setItem('authToken', res.token);
            this.toastr.success('Login successful!', 'Success');
            console.log('reached hre');
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = 'Login failed. No token returned.';
            this.toastr.error('Login failed. No token returned.', 'Error');
          }
        },
        error: (err) => {
          this.loading = false;
          console.error('Login error:', err);
          this.errorMessage = 'Invalid email or password.';
          this.toastr.error('Invalid email or password.', 'Error');
        },
      });
    } else {
      this.toastr.warning(
        'Please fill in all required fields correctly.',
        'Warning'
      );
    }
  }
}
