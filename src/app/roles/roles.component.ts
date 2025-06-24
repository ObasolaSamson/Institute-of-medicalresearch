import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DashboardService } from '../services/dashboard.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class RolesComponent implements OnInit {
  roles: any[] = [];
  showCreateRoleModal: boolean = false;
  roleForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dashboardService: DashboardService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.loadRoles();
  }

  createForm() {
    this.roleForm = this.fb.group({
      roleName: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  loadRoles(): void {
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

  openCreateRoleModal(): void {
    this.showCreateRoleModal = true;
  }

  closeCreateRoleModal(): void {
    this.showCreateRoleModal = false;
    this.roleForm.reset();
  }

  onSubmit(): void {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      this.toastr.warning(
        'Please fill in all required fields correctly.',
        'Warning'
      );
      return;
    }

    this.isLoading = true;
    const payload = this.roleForm.value;

    this.dashboardService.createRole(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.toastr.success('Role created successfully!', 'Success');
        this.closeCreateRoleModal();
        this.loadRoles();
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error(
          err.error?.message || 'Failed to create role',
          'Error'
        );
      },
    });
  }

  deleteRole(roleId: string): void {
    if (confirm('Are you sure you want to delete this role?')) {
      this.isLoading = true;
      this.dashboardService.deleteRole(roleId).subscribe({
        next: () => {
          this.isLoading = false;
          this.toastr.success('Role deleted successfully!', 'Success');
          this.loadRoles();
        },
        error: (err) => {
          this.isLoading = false;
          this.toastr.error(
            err.error?.message || 'Failed to delete role',
            'Error'
          );
        },
      });
    }
  }
}
