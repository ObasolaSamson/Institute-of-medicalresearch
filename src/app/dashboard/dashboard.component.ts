import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  user = {
    familyMembers: ['Feyiseye Ogundoro', 'Janet Ogundoro', 'Taiwo Ogundoro', 'Kehinde Ogundoro'],
    address: '13 olokonla Street, Ibadan, Nigeria',
    earnings: 'N7,200,000',
    lastHospitalVisit: 'Jan 12, 2024',
    hospitalRecords: [
      { date: 'Jan 10, 2024', hospital: 'University of Ibadan Teaching Hospital', reason: 'Checkup' },
      { date: 'Dec 15, 2023', hospital: 'City Clinic', reason: 'Erectile dysfunction' },
    ]
  };
}
