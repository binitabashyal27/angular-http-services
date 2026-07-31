import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentComponent } from './student/student.component';
import { EmployeeComponent } from './employee/employee.component';
import { DepartmentManagement } from './department-management/department-management.component';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'dashboard',
    component: DashboardComponent
  },
   {
    path: 'student',
    component: StudentComponent
  },

  {
    path: 'employee',
    component: EmployeeComponent
  },
 {
    path: 'department-management',
    component: DepartmentManagement
  }

];