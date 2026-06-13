import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../services/employee';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-employee.html',
  styleUrl: './edit-employee.css'
})
export class EditEmployee {

  employeeId = '';

  employeeForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    department: new FormControl(''),
    salary: new FormControl('')
  });

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private router: Router
  ) { }

  ngOnInit() {

    this.employeeId = this.route.snapshot.paramMap.get('id') ?? '';

    this.employeeService
      .getEmployeeById(this.employeeId)
      .subscribe({
        next: (employee) => {
          if (!employee) {
            console.warn('Employee not found, redirecting');
            this.router.navigate(['/']);
            return;
          }

          this.employeeForm.patchValue({
            name: employee.name,
            email: employee.email,
            department: employee.department,
            salary: employee.salary.toString()
          });
        },
        error: (err) => {
          console.error('Error loading employee for edit:', err);
        }
      });
  }

  updateEmployee() {

    const updatedEmployee = {
      id: this.employeeId,
      name: this.employeeForm.value.name!,
      email: this.employeeForm.value.email!,
      department: this.employeeForm.value.department!,
      salary: Number(this.employeeForm.value.salary)
    };

    this.employeeService
      .updateEmployee(updatedEmployee)
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }
}