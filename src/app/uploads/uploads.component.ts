import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DashboardService } from '../services/dashboard.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.scss'],
})
export class UploadsComponent implements OnInit {
  // Household upload properties
  householdUploadForm!: FormGroup;
  selectedHouseholdFile: File | null = null;
  isHouseholdUploading = false;
  householdUploadProgress = 0;

  // Member upload properties
  memberUploadForm!: FormGroup;
  selectedMemberFile: File | null = null;
  isMemberUploading = false;
  memberUploadProgress = 0;

  constructor(
    private fb: FormBuilder,
    private dashboardService: DashboardService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.createForms();
  }

  createForms() {
    this.householdUploadForm = this.fb.group({
      file: [null, [Validators.required]],
    });

    this.memberUploadForm = this.fb.group({
      file: [null, [Validators.required]],
    });
  }

  // Household upload methods
  onHouseholdFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedHouseholdFile = input.files[0];
      this.householdUploadForm.patchValue({
        file: this.selectedHouseholdFile,
      });
    }
  }

  getHouseholdFileName(): string {
    return this.selectedHouseholdFile
      ? this.selectedHouseholdFile.name
      : 'No file selected';
  }

  onHouseholdSubmit() {
    if (this.householdUploadForm.invalid || !this.selectedHouseholdFile) {
      this.toastr.warning('Please select a file to upload', 'Warning');
      return;
    }

    this.isHouseholdUploading = true;
    this.householdUploadProgress = 0;

    const formData = new FormData();
    formData.append('file', this.selectedHouseholdFile);

    const progressInterval = setInterval(() => {
      if (this.householdUploadProgress < 90) {
        this.householdUploadProgress += 10;
      }
    }, 500);

    this.dashboardService.uploadHouseholds(formData).subscribe({
      next: (response) => {
        clearInterval(progressInterval);
        this.householdUploadProgress = 100;
        this.isHouseholdUploading = false;
        this.toastr.success('Households uploaded successfully!', 'Success');
        this.resetHouseholdForm();
      },
      error: (error) => {
        clearInterval(progressInterval);
        this.isHouseholdUploading = false;
        this.toastr.error(
          error.error?.message || 'Failed to upload households',
          'Error'
        );
      },
    });
  }

  resetHouseholdForm() {
    this.householdUploadForm.reset();
    this.selectedHouseholdFile = null;
    this.householdUploadProgress = 0;
  }

  // Member upload methods
  onMemberFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedMemberFile = input.files[0];
      this.memberUploadForm.patchValue({
        file: this.selectedMemberFile,
      });
    }
  }

  getMemberFileName(): string {
    return this.selectedMemberFile
      ? this.selectedMemberFile.name
      : 'No file selected';
  }

  onMemberSubmit() {
    if (this.memberUploadForm.invalid || !this.selectedMemberFile) {
      this.toastr.warning('Please select a file to upload', 'Warning');
      return;
    }

    this.isMemberUploading = true;
    this.memberUploadProgress = 0;

    const formData = new FormData();
    formData.append('file', this.selectedMemberFile);

    const progressInterval = setInterval(() => {
      if (this.memberUploadProgress < 90) {
        this.memberUploadProgress += 10;
      }
    }, 500);

    this.dashboardService.uploadHouseholdMembers(formData).subscribe({
      next: (response) => {
        clearInterval(progressInterval);
        this.memberUploadProgress = 100;
        this.isMemberUploading = false;
        this.toastr.success(
          'Household members uploaded successfully!',
          'Success'
        );
        this.resetMemberForm();
      },
      error: (error) => {
        clearInterval(progressInterval);
        this.isMemberUploading = false;
        this.toastr.error(
          error.error?.message || 'Failed to upload household members',
          'Error'
        );
      },
    });
  }

  resetMemberForm() {
    this.memberUploadForm.reset();
    this.selectedMemberFile = null;
    this.memberUploadProgress = 0;
  }
}
