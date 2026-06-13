import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../employee.model';
import { Observable, tap, catchError, of, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = 'http://localhost:3001/employees';

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<Employee[]> {
    console.log('Calling:', this.apiUrl);

    return this.http.get<Employee[]>(this.apiUrl).pipe(
      map(data => {
        console.log('Response:', data);
        // If API returned data, save it locally and return it.
        if (data && data.length > 0) {
          this.saveToLocal(data);
          return data;
        }

        // If API returned an empty array, try localStorage so UI keeps previous data.
        const local = this.loadFromLocal();
        console.warn('API returned empty list; using localStorage fallback:', local.length);
        return local;
      }),
      catchError(err => {
        console.error('API getEmployees failed, falling back to localStorage:', err);
        const local = this.loadFromLocal();
        return of(local);
      })
    );
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee).pipe(
      tap(saved => {
        const current = this.loadFromLocal();
        current.push(saved);
        this.saveToLocal(current);
      }),
      catchError(err => {
        console.error('API addEmployee failed, saving to localStorage only:', err);
        const current = this.loadFromLocal();
        current.push(employee);
        this.saveToLocal(current);
        return of(employee as Employee);
      })
    );
  }

  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const current = this.loadFromLocal().filter(e => e.id !== id);
        this.saveToLocal(current);
      }),
      catchError(err => {
        console.error('API deleteEmployee failed, removing from localStorage only:', err);
        const current = this.loadFromLocal().filter(e => e.id !== id);
        this.saveToLocal(current);
        return of(void 0);
      })
    );
  }

  getEmployeeById(id: string): Observable<Employee | undefined> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`).pipe(
      tap(e => console.log('getEmployeeById Response:', e)),
      catchError(err => {
        console.error('API getEmployeeById failed, falling back to localStorage:', err);
        const found = this.loadFromLocal().find(x => x.id === id);
        return of(found);
      })
    );
  }

  updateEmployee(
    updatedEmployee: Employee
  ): Observable<Employee> {

    return this.http.put<Employee>(`${this.apiUrl}/${updatedEmployee.id}`, updatedEmployee).pipe(
      tap(saved => {
        const list = this.loadFromLocal().map(e => e.id === saved.id ? saved : e);
        this.saveToLocal(list);
      }),
      catchError(err => {
        console.error('API updateEmployee failed, updating localStorage only:', err);
        const list = this.loadFromLocal().map(e => e.id === updatedEmployee.id ? updatedEmployee : e);
        this.saveToLocal(list);
        return of(updatedEmployee as Employee);
      })
    );
  }

  private saveToLocal(list: Employee[]): void {
    try {
      localStorage.setItem('employees', JSON.stringify(list));
    } catch (e) {
      console.warn('Unable to save employees to localStorage', e);
    }
  }

  private loadFromLocal(): Employee[] {
    try {
      const raw = localStorage.getItem('employees');
      if (!raw) return [];
      return JSON.parse(raw) as Employee[];
    } catch (e) {
      console.warn('Unable to load employees from localStorage', e);
      return [];
    }
  }

  // public accessor for components to synchronously read local cache
  getLocalEmployees(): Employee[] {
    return this.loadFromLocal();
  }
}