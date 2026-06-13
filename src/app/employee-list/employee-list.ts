import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee';
import { Employee } from '../employee.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.css']
})
export class EmployeeList implements OnInit {

  employees: Employee[] = [];
  allEmployees: Employee[] = [];
  searchText: string = '';

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('Employee List Component Loaded');
    // load cached employees immediately so UI shows data across refresh
    const cached = this.employeeService.getLocalEmployees?.() ?? [];
    if (cached.length > 0) {
      this.allEmployees = [...cached];
      this.employees = [...cached];
    }

    // then refresh from API
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {

        console.log('API DATA:', data);

        this.allEmployees = [...data];
        this.employees = [...data];

        console.log('allEmployees:', this.allEmployees.length);
        console.log('employees:', this.employees.length);

        // removed startup alert to avoid popup on page load
      },
      error: (err) => {
        console.error('API ERROR:', err);
      }
    });
  }

  searchEmployee(): void {
    this.applySearch();
  }

  private applySearch(): void {
    const filter = this.searchText?.trim().toLowerCase() ?? '';

    if (!filter) {
      this.employees = [...this.allEmployees];
      return;
    }

    this.employees = this.allEmployees.filter(employee =>
      employee.name?.toLowerCase().includes(filter)
    );
  }

  deleteEmployee(id: string): void {

    if (confirm('Delete Employee?')) {

      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }

  editEmployee(id: string): void {
    this.router.navigate(['/edit', id]);
  }

  viewEmployee(id: string): void {
    this.router.navigate(['/details', id]);
  }

  getTotalSalary(): number {
    return this.allEmployees.reduce(
      (total, employee) => total + Number(employee.salary),
      0
    );
  }

  getDepartmentCount(): number {

    const departments = new Set(
      this.allEmployees.map(employee => employee.department)
    );

    return departments.size;
  }
}