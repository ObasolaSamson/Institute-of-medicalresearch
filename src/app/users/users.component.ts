import { Component } from '@angular/core';


interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  users: User[] = [
    { id: 1, name: 'Enzo Fernandez', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Nicholas Jackson', email: 'jane@example.com', role: 'Editor' },
    { id: 3, name: 'Cole Palmer', email: 'mike@example.com', role: 'User' },
    { id: 3, name: 'Noni Madueke', email: 'mike@example.com', role: 'User' },
  ];

  createUser() {
    alert('Open Create User Modal or Redirect to Create Page');
  }

  editUser(user: User) {
    alert(`Edit User: ${user.name}`);
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.users = this.users.filter(user => user.id !== userId);
    }
  }
}
