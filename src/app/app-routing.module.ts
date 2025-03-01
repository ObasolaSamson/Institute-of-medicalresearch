import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ShellComponent } from './shell/shell.component';
import { AuthGuard } from './auth.guard';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, 
  { path: 'login', component: LoginComponent },


  
  { path: '',
  component: ShellComponent,
  children: [
 
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]  },

    { path: 'users', component: UsersComponent, canActivate: [AuthGuard]  },

  ]
},
 
{ path: '**', redirectTo: 'login' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
