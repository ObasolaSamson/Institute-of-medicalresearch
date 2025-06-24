import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-household-details',
  templateUrl: './household-details.component.html',
  styleUrls: ['./household-details.component.scss'],
})
export class HouseholdDetailsComponent implements OnInit {
  householdDetails: any;
  householdId: string = '';
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private dashboardService: DashboardService
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
}
