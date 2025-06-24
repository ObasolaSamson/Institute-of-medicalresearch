import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DashboardService } from '../services/dashboard.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  showCreateUserModal: boolean = false;
  userForm!: FormGroup;
  roles: any[] = [];
  users: any[] = [];
  isLoading = false;
  showConfirmPassword = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private dashboardService: DashboardService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Load users data
    this.loadUsers();
    this.onGetRoles();
    this.createform();
  }

  createform() {
    this.userForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        middleName: [''],
        email: ['', [Validators.required, Validators.email]],
        dateOfBirth: ['', Validators.required],
        gender: ['', Validators.required],
        maritalStatus: ['', Validators.required],
        phoneNumber: ['', Validators.required],
        roleName: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  openCreateUserModal(): void {
    this.showCreateUserModal = true;
  }

  closeCreateUserModal(): void {
    this.showCreateUserModal = false;
    this.userForm.reset();
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      console.log('Form submitted:', this.userForm.value);
      this.toastr.warning(
        'Please fill in all required fields correctly.',
        'Warning'
      );
      return;
    }

    this.isLoading = true;
    const payload = this.userForm.value;

    this.dashboardService.saveStaff(payload).subscribe({
      next: (res) => {
        console.log('User saved successfully', res);
        this.isLoading = false;
        this.toastr.success('User created successfully!', 'Success');
        this.closeCreateUserModal();
        this.loadUsers(); // Reload the users list
      },
      error: (err) => {
        console.error('Failed to save user', err);
        this.isLoading = false;
        this.toastr.error(
          err.error?.message || 'Failed to create user. Please try again.',
          'Error'
        );
      },
    });
  }

  loadUsers(): void {
    this.isLoading = true;

    this.dashboardService.getStaff().subscribe({
      next: (res) => {
        console.log('Fetched staff', res);
        this.users = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching staff details:', err);
        this.isLoading = false;
      },
    });
  }

  onGetRoles() {
    this.isLoading = true;

    this.dashboardService.getRoles().subscribe({
      next: (res) => {
        console.log('Fetched roles', res);
        this.roles = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching household details:', err);
        this.isLoading = false;
      },
    });
  }

  editUser(user: any) {}

  // editUser(user: User): void {
  //   // Implement edit user logic
  // }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.users = this.users.filter((user) => user.id !== userId);
    }
  }
}
