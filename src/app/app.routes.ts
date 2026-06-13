import { Routes } from '@angular/router';
import { EmployeeList } from './employee-list/employee-list';
import { AddEmployee } from './add-employee/add-employee';
import { EmployeeDetails } from './employee-details/employee-details';
import { EditEmployee } from './edit-employee/edit-employee';

export const routes: Routes = [
  { path: '', component: EmployeeList },
  { path: 'add', component: AddEmployee },
  { path: 'details/:id', component: EmployeeDetails },
  { path: 'edit/:id', component: EditEmployee }
];