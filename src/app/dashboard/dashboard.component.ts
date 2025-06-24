import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  households: any[] = []; // Full data
  currentPage = 1;
  pageSize = 10; // Or however many items you want per page
  totalItems = 0;
  totalPages = 0;
  pageRange = { start: 0, end: 0 };
  isLoading = false;
  itemsPerPage = 10;
  selectedTab: string = 'households'; // Default tab
  householdMembers: any[] = [];
  ageGroupFilter: string = '';
  nameFilter: string = '';
  genderFilter: string = '';
  filteredHouseholdMembers: any[] = [];
  paginatedHouseholdMembers: any[] = [];
  totalHouseHolds: string = '';
  totalHouseHoldMembers: string = '';

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchHouseholds();
    this.fetchHouseholdMembers();
    this.filteredHouseholdMembers = this.householdMembers;
    this.getDashboardData();
  }

  // applyFilters(field: string) {
  //   if (field === 'age') {
  //     if (this.ageGroupFilter) {
  //       this.filteredHouseholdMembers = this.householdMembers.filter((member) =>
  //         member.ageGroup?.toString().includes(this.ageGroupFilter)
  //       );
  //     } else {
  //       this.filteredHouseholdMembers = this.householdMembers;
  //     }
  //   }

  //   if (field === 'name') {
  //     if (this.nameFilter) {
  //       this.filteredHouseholdMembers = this.householdMembers.filter((member) =>
  //         member.name?.toLowerCase().includes(this.nameFilter.toLowerCase())
  //       );
  //     } else {
  //       this.filteredHouseholdMembers = this.householdMembers;
  //     }
  //   }

  //   if (field === 'gender') {
  //     if (this.genderFilter) {
  //       this.filteredHouseholdMembers = this.householdMembers.filter((member) =>
  //         member.gender?.toLowerCase().includes(this.genderFilter.toLowerCase())
  //       );
  //     } else {
  //       this.filteredHouseholdMembers = this.householdMembers;
  //     }
  //   }
  // }

  fetchHouseholds(): void {
    this.isLoading = true;
    const payload = {
      searchString: '',
      skip: this.currentPage,
      pageSize: this.itemsPerPage,
    };

    this.dashboardService.getHouseholds(payload).subscribe({
      next: (res) => {
        console.log('API response:', res);

        this.households = res.houseHoldList || [];
        this.totalItems = res.totalRecord || 0;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      },
      error: (err) => {
        console.error('Error fetching households', err);
      },
    });
  }

  getDashboardData() {
    this.isLoading = true;
    this.dashboardService.getHouseholdCount({ searchString: null }).subscribe({
      next: (res) => {
        console.log('Household Dashboard Data:', res);
        this.totalHouseHolds = res.totalHouseHolds;
        this.totalHouseHoldMembers = res.totalHouseHoldMembers;
      },
      error: (err) => {
        console.error('Error fetching households', err);
      },
    });
  }

  // fetchHouseholdMembers(): void {
  //   this.isLoading = true;
  //   const payload = {
  //     searchString: '',
  //     skip: this.currentPage,
  //     pageSize: this.itemsPerPage,
  //   };
  //   this.dashboardService.getHouseholdmembers(payload).subscribe({
  //     next: (res) => {
  //       console.log('API response:', res);
  //       this.households = res.houseHoldList || [];
  //       this.totalItems = res.totalRecord || 0;
  //       this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  //     },
  //     error: (err) => {
  //       console.error('Error fetching households', err);
  //     },
  //   });
  // }

  // fetchHouseholdMembers(): void {
  //   this.isLoading = true;
  //   const payload = {
  //     searchString: '',
  //     skip: (this.currentPage - 1) * this.itemsPerPage,
  //     pageSize: this.itemsPerPage,
  //   };
  //   this.dashboardService.getHouseholdmembers(payload).subscribe({
  //     next: (res) => {
  //       console.log('API response:', res);
  //       this.householdMembers = res.houseHoldMembers || [];
  //       this.filteredHouseholdMembers = res.houseHoldMembers || [];
  //       this.totalItems = res.totalRecord || 0;
  //       this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  //       this.pageRange = {
  //         start: (this.currentPage - 1) * this.itemsPerPage + 1,
  //         end: Math.min(this.currentPage * this.itemsPerPage, this.totalItems),
  //       };
  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       console.error('Error fetching households', err);
  //       this.isLoading = false;
  //     },
  //   });
  // }
  fetchHouseholdMembers(): void {
    this.isLoading = true;

    const payload = {
      searchString: '',
      skip: 0, // Always start from 0
      pageSize: 1, // Just fetch 1 to get totalRecord first
    };

    this.dashboardService.getHouseholdmembers(payload).subscribe({
      next: (res) => {
        const totalRecords = res.totalRecord || 0;

        // Now that we know the total number, fetch all members
        this.dashboardService
          .getHouseholdmembers({
            searchString: '',
            skip: 0,
            pageSize: totalRecords,
          })
          .subscribe({
            next: (fullRes) => {
              this.householdMembers = fullRes.houseHoldMembers || [];
              this.filteredHouseholdMembers = [...this.householdMembers];
              this.totalItems = this.filteredHouseholdMembers.length;
              this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
              this.updatePaginatedMembers();
              this.isLoading = false;
            },
            error: (err) => {
              console.error('Error fetching full household members', err);
              this.isLoading = false;
            },
          });
      },
      error: (err) => {
        console.error('Error fetching total records', err);
        this.isLoading = false;
      },
    });
  }

  updatePaginatedMembers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedHouseholdMembers = this.filteredHouseholdMembers.slice(
      startIndex,
      endIndex
    );
  }

  applyFilters(field: string) {
    this.filteredHouseholdMembers = this.householdMembers.filter((member) => {
      const matchesName = this.nameFilter
        ? member.name?.toLowerCase().includes(this.nameFilter.toLowerCase())
        : true;
      const matchesGender = this.genderFilter
        ? member.gender?.toLowerCase().includes(this.genderFilter.toLowerCase())
        : true;
      const matchesAge = this.ageGroupFilter
        ? member.ageGroup?.toString().includes(this.ageGroupFilter)
        : true;

      return matchesName && matchesGender && matchesAge;
    });

    this.currentPage = 1;
    this.totalItems = this.filteredHouseholdMembers.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.updatePaginatedMembers();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    if (this.selectedTab === 'households') {
      this.fetchHouseholds();
    } else {
      this.updatePaginatedMembers();
    }
  }

  onPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      if (this.selectedTab === 'households') {
        this.fetchHouseholds();
      } else {
        this.updatePaginatedMembers();
      }
    }
  }

  onNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      if (this.selectedTab === 'households') {
        this.fetchHouseholds();
      } else {
        this.updatePaginatedMembers();
      }
    }
  }

  selectTab(tabName: string) {
    this.selectedTab = tabName;
  }

  viewHouseholdDetails(id: string) {
    this.router.navigate(['/householdDetails'], { queryParams: { id } });
  }
}
