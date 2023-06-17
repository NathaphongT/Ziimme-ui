import { Injectable } from '@angular/core';
import { Employee } from './user.types';
import { BehaviorSubject, Observable, ReplaySubject, map, switchMap, take, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private _employee: ReplaySubject<Employee> = new ReplaySubject<Employee>(1);
  private _employees: BehaviorSubject<Employee[]> = new BehaviorSubject<Employee[]>(null);

  constructor(private _httpClient: HttpClient) { }

  set employee(value: Employee) {
    // Store the value
    this._employee.next(value);
  }

  get employee$(): Observable<Employee> {
    return this._employee.asObservable();
  }

  get employees$(): Observable<Employee[]> {
    return this._employees.asObservable();
  }

  getAllEmployee(): Observable<Employee[]> {
    return this._httpClient.get(`${environment.APIURL_LOCAL}/api/v1.0/employee/`).pipe(
      tap((employee: Employee[]) => {
        this._employees.next(employee)
      })
    );
  }

  createEmployee(data: Employee): Observable<Employee> {
    return this.employees$.pipe(
      take(1),
      switchMap((employees) =>
        this._httpClient
          .post<Employee>(`${environment.APIURL_LOCAL}/api/v1.0/employee`, data)
          .pipe(
            map((newEmployee) => {
              // Update the Employee with the new Employee
              this._employees.next([...employees, newEmployee]);

              // Return the new categorys from observable
              return newEmployee;
            })
          )
      )
    );
  }

  updateEmployee(id: number, data: Employee): Observable<Employee> {
    return this.employees$.pipe(
      take(1),
      switchMap((employees) =>
        this._httpClient
          .put<Employee>(`${environment.APIURL_LOCAL}/api/v1.0/employee/${id}`,
            data
          )
          .pipe(
            map((updatedEmployee: Employee) => {
              // Find the index of the updated employees
              const index = employees.findIndex(
                (item) => item.emp_id === id
              );

              // Update the employees
              employees[index] = updatedEmployee;

              // Update the employees
              this._employees.next(employees);

              // Return the updated employees
              return updatedEmployee;
            })
          )
      )
    );
  }

  deleteEmployee(id: number): Observable<boolean> {
    return this.employees$.pipe(
      take(1),
      switchMap((employees) =>
        this._httpClient
          .delete<boolean>(`${environment.APIURL_LOCAL}/api/v1.0/employee/${id}`)
          .pipe(
            map((isDeleted: boolean) => {
              // Find the index of the deleted user
              const index = employees.findIndex(
                (item) => item.emp_id === id
              );

              // Delete the user
              employees.splice(index, 1);

              // Update the employees
              this._employees.next(employees);

              // Return the deleted status
              return isDeleted;
            })
          )
      )
    );
  }

}
