import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-household-details',
  templateUrl: './household-details.component.html',
  styleUrls: ['./household-details.component.scss'],
})
export class HouseholdDetailsComponent implements OnInit {
  householdDetails: any;
  householdId: string = '';
  isLoading: boolean = false;
  showAddMemberModal: boolean = false;
  isAddingMember: boolean = false;
  newMember: any = {
    houseHoldId: '',
    firstName: '',
    middleName: '',
    lastName: '',
    phoneNumber: '',
    memberRole: '',
    isExactDateOfBirth: true,
    educationalQualification: '',
    gender: '',
    maritalStatus: '',
    occupation: '',
    ageGroup: '',
    workStatus: '',
    hhPosition: '',
    husbandName: '',
    motherName: '',
    fatherName: '',
    dateOfBirth: '',
    submissionDate: '',
    enumerationStartDate: '',
    enumerationEndDate: '',
    interviewDate: '',
    id: '',
    isActive: true,
  };

  constructor(
    private route: ActivatedRoute,
    private dashboardService: DashboardService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.householdId = params['id'];
      if (this.householdId) {
        this.fetchHouseholdDetails();
      }
    });
  }

  fetchHouseholdDetails() {
    this.isLoading = true;
    this.dashboardService.getHouseholdDetails(this.householdId).subscribe({
      next: (data) => {
        console.log('Fetched Household Details:', data);
        this.householdDetails = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching household details:', err);
        this.isLoading = false;
      },
    });
  }

  openAddMemberModal() {
    // Pre-populate household ID before opening modal
    const householdIdToUse = this.householdDetails?.id || 
                              this.householdId || 
                              '';
    
    // Reset form and pre-populate household ID
    this.newMember = {
      houseHoldId: householdIdToUse,
      firstName: '',
      middleName: '',
      lastName: '',
      phoneNumber: '',
      memberRole: '',
      isExactDateOfBirth: true,
      educationalQualification: '',
      gender: '',
      maritalStatus: '',
      occupation: '',
      ageGroup: '',
      workStatus: '',
      hhPosition: '',
      husbandName: '',
      motherName: '',
      fatherName: '',
      dateOfBirth: '',
      submissionDate: '',
      enumerationStartDate: '',
      enumerationEndDate: '',
      interviewDate: '',
      id: '',
      isActive: true,
    };
    
    this.showAddMemberModal = true;
  }

  closeAddMemberModal() {
    this.showAddMemberModal = false;
  }

  onAddMember() {
    if (!this.newMember.firstName || !this.newMember.lastName) {
      this.toastr.error('Please fill in all required fields', 'Validation Error');
      return;
    }

    this.isAddingMember = true;
    this.newMember.houseHoldId = this.newMember.houseHoldId
      ?.replace(/[\u200B-\u200D\uFEFF\u00A0]/g, '')
      .trim();

    // Format dates
    const now = new Date();
    const submissionDate = now.toISOString();
    const enumerationStartDate = now.toISOString();
    const enumerationEndDate = new Date(now.getTime() + 30 * 60000).toISOString(); // 30 minutes later

    // Remove empty id field - backend will generate it
    const { id, ...memberData } = this.newMember;
    
    const payload = {
      ...memberData,
      submissionDate: submissionDate,
      enumerationStartDate: enumerationStartDate,
      enumerationEndDate: enumerationEndDate,
      // Ensure dateOfBirth is in YYYY-MM-DD format
      dateOfBirth: this.newMember.dateOfBirth,
      // Ensure interviewDate is in YYYY-MM-DD format
      interviewDate: this.newMember.interviewDate,
    };

    this.dashboardService.addHouseholdMember(payload).subscribe({
      next: (res) => {
        this.toastr.success('Household member added successfully', 'Success');
        this.closeAddMemberModal();
        this.isAddingMember = false;
        // Refresh the household details to show updated information
        this.fetchHouseholdDetails();
      },
      error: (err) => {
        console.error('Error adding household member', err);
        this.toastr.error(
          err.error?.message || 'Failed to add household member',
          'Error'
        );
        this.isAddingMember = false;
      },
    });
  }
}
