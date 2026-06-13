import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from '../services/employee';
import { Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-employee.html',
  styleUrl: './add-employee.css'
})
export class AddEmployee {

  employeeForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    department: new FormControl('', Validators.required),
    salary: new FormControl('', [
      Validators.required,
      Validators.min(1000)
    ])
  });

  constructor(private employeeService: EmployeeService, private router: Router) { }

  addEmployee() {

    if (this.employeeForm.valid) {

      const employee = {
        id: Date.now().toString(),
        name: this.employeeForm.value.name!,
        email: this.employeeForm.value.email!,
        department: this.employeeForm.value.department!,
        salary: Number(this.employeeForm.value.salary)
      };

      this.employeeService.addEmployee(employee).subscribe({
        next: (response) => {

          console.log('Employee saved:', response);

          this.employeeForm.reset();

          alert('Employee Added Successfully');

          this.router.navigate(['/']).then(success => {
            console.log('Navigation Success:', success);
          });

        },

        error: (err) => {
          console.error('Add Employee Error:', err);
        }
      });
    }
  }

}