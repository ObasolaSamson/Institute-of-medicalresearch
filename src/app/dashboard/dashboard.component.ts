import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
  isLoadingMembers = false;
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
  searchKeys: any[] = [];
  selectedSearchKey: any = null;
  searchValue: string = '';
  selectedHouseholdSearchKey: any = null;
  householdSearchValue: string = '';

  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchHouseholds();
    this.fetchHouseholdMembers();
    this.getDashboardData();
    this.onGetSearchKeys()
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

  fetchHouseholds(searchKey: number | null = null, searchString: string = ''): void {
    this.isLoading = true;
    const payload: any = {
      searchString: searchString,
      skip: this.currentPage,
      pageSize: this.itemsPerPage,
    };

    // Add searchKey to payload if provided
    if (searchKey !== null) {
      payload.searchKey = searchKey;
    }

    this.dashboardService.getHouseholds(payload).subscribe({
      next: (res) => {
        console.log('API response:', res);

        this.households = res.houseHoldList || [];
        this.totalItems = res.totalRecord || 0;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching households', err);
        this.isLoading = false;
      },
    });
  }

  onSearchHouseholds(): void {
    const { searchKeyId, searchString } = this.getHouseholdSearchParams();
    this.currentPage = 1; // Reset to first page when searching
    this.fetchHouseholds(searchKeyId, searchString);
  }

  onHouseholdSearchKeyChange(): void {
    // Reset search value when key changes
    this.householdSearchValue = '';
  }

  resetHouseholdsSearch(): void {
    this.selectedHouseholdSearchKey = null;
    this.householdSearchValue = '';
    this.currentPage = 1;
    this.fetchHouseholds(null, '');
  }

  resetMembersSearch(): void {
    this.selectedSearchKey = null;
    this.searchValue = '';
    this.currentPage = 1;
    this.fetchHouseholdMembers(null, '');
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

  onGetSearchKeys(): void {
    this.dashboardService.getSearchKeys().subscribe({
      next: (res) => {
        console.log('Search Keys:', res);
        this.searchKeys = res || [];
      },
      error: (err) => {
        console.error('Error fetching search keys', err);
      },
    });
  }

  fetchHouseholdMembers(searchKey: number | null = null, searchString: string = ''): void {
    this.isLoadingMembers = true;

    // Calculate skip based on current page (0-indexed)
    const skip = (this.currentPage - 1) * this.itemsPerPage;

    const payload: any = {
      searchString: searchString,
      skip: skip,
      pageSize: this.itemsPerPage,
    };

    // Add searchKey to payload if provided
    if (searchKey !== null) {
      payload.searchKey = searchKey;
    }

    this.dashboardService.getHouseholdmembers(payload).subscribe({
      next: (res) => {
        this.paginatedHouseholdMembers = res.houseHoldMembers || [];
        this.totalItems = res.totalRecord || 0;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.isLoadingMembers = false;
      },
      error: (err) => {
        console.error('Error fetching household members', err);
        this.isLoadingMembers = false;
      },
    });
  }

  onSearchHouseholdMembers(): void {
    const searchKeyId = this.selectedSearchKey ? this.selectedSearchKey.id : null;
    const searchString = this.searchValue || '';
    this.currentPage = 1; // Reset to first page when searching
    this.fetchHouseholdMembers(searchKeyId, searchString);
  }

  onSearchKeyChange(): void {
    // Reset search value when key changes
    this.searchValue = '';
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

  private getHouseholdSearchParams() {
    const searchKeyId = this.selectedHouseholdSearchKey ? this.selectedHouseholdSearchKey.id : null;
    const searchString = this.householdSearchValue || '';
    return { searchKeyId, searchString };
  }

  onPageChange(page: number) {
    this.currentPage = page;
    if (this.selectedTab === 'households') {
      const { searchKeyId, searchString } = this.getHouseholdSearchParams();
      this.fetchHouseholds(searchKeyId, searchString);
    } else {
      const searchKeyId = this.selectedSearchKey ? this.selectedSearchKey.id : null;
      const searchString = this.searchValue || '';
      this.fetchHouseholdMembers(searchKeyId, searchString);
    }
  }

  onPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      if (this.selectedTab === 'households') {
        const { searchKeyId, searchString } = this.getHouseholdSearchParams();
        this.fetchHouseholds(searchKeyId, searchString);
      } else {
        const searchKeyId = this.selectedSearchKey ? this.selectedSearchKey.id : null;
        const searchString = this.searchValue || '';
        this.fetchHouseholdMembers(searchKeyId, searchString);
      }
    }
  }

  onNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      if (this.selectedTab === 'households') {
        const { searchKeyId, searchString } = this.getHouseholdSearchParams();
        this.fetchHouseholds(searchKeyId, searchString);
      } else {
        const searchKeyId = this.selectedSearchKey ? this.selectedSearchKey.id : null;
        const searchString = this.searchValue || '';
        this.fetchHouseholdMembers(searchKeyId, searchString);
      }
    }
  }

  selectTab(tabName: string) {
    this.selectedTab = tabName;
  }

  viewHouseholdDetails(id: string) {
    this.router.navigate(['/householdDetails'], { queryParams: { id } });
  }

  deleteHouseholdMember(memberId: string) {
    if (!memberId) {
      this.toastr.error('Member ID is required', 'Error');
      return;
    }

    if (confirm('Are you sure you want to delete this household member?')) {
      this.isLoadingMembers = true;
      this.dashboardService.deleteHouseholdMember(memberId).subscribe({
        next: (res) => {
          this.toastr.success('Household member deleted successfully', 'Success');
          // Refresh the household members list
          const searchKeyId = this.selectedSearchKey ? this.selectedSearchKey.id : null;
          const searchString = this.searchValue || '';
          this.fetchHouseholdMembers(searchKeyId, searchString);
          // Refresh dashboard data to update counts
          this.getDashboardData();
        },
        error: (err) => {
          console.error('Error deleting household member', err);
          this.toastr.error(
            err.error?.message || 'Failed to delete household member',
            'Error'
          );
          this.isLoadingMembers = false;
        },
      });
    }
  }
}
