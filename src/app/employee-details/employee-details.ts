import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../services/employee';
import { Employee } from '../employee.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-details.html',
  styleUrl: './employee-details.css'
})
export class EmployeeDetails {

  employee?: Employee;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService
  ) { }

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.employeeService.getEmployeeById(id).subscribe({
      next: (emp) => {
        if (emp) {
          this.employee = emp;
        } else {
          console.warn('Employee not found for id', id);
        }
      },
      error: (err) => {
        console.error('Error loading employee details:', err);
      }
    });
  }
}