import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, map, switchMap, take, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Employee } from '@app/_service/main.types';
import { EmployeePagination, PaginationResponse } from '@app/_service/pagination.types';
import { SaleList, SaleListEmp } from '@app/_service/user.types';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private _apiPath = environment.APIURL_LOCAL + '/api/v1.0';

  private _employee: ReplaySubject<Employee> = new ReplaySubject<Employee>(1);
  private _employees: BehaviorSubject<Employee[] | null> = new BehaviorSubject(null);
  private _employeesPagination: BehaviorSubject<EmployeePagination | null> = new BehaviorSubject(null);

  private _salelistemp: ReplaySubject<SaleListEmp> = new ReplaySubject<SaleListEmp>(1);
  private _salelistemps: BehaviorSubject<SaleListEmp[] | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient) { }

  set employee(value: Employee) {
    // Store the value
    this._employee.next(value);
  }

  //Customer
  get employee$(): Observable<Employee> {
    return this._employee.asObservable();
  }

  get employees$(): Observable<Employee[]> {
    return this._employees.asObservable();
  }

  get employeesPagination$(): Observable<EmployeePagination> {
    return this._employeesPagination.asObservable();
  }

  //SaleListEmp
  get salelistemp$(): Observable<SaleListEmp> {
    return this._salelistemp.asObservable();
  }

  get salelistemps$(): Observable<SaleListEmp[]> {
    return this._salelistemps.asObservable();
  }

  // ignored pagination
  getAllEmployee(): Observable<Employee[]> {
    return this._httpClient.get(this._apiPath + '/employee', {
      params: {
        q: '',
        page: '1',
        limit: 300
      }
    }).pipe(
      map((res: any) => res.data),
      tap((customers: any) => {
        this._employees.next(customers);
      })
    );
  }

  getEmployee(search: string = "", page: number = 1, limit: number = 10, sort: string = 'createdTime', order: 'asc' | 'desc' | '' = 'asc'): Observable<{ pagination: EmployeePagination, employees: Employee[] }> {
    return this._httpClient.get<PaginationResponse>(this._apiPath + '/employee', {
      params: {
        q: search,
        page: page.toString(),
        limit: limit.toString(),
        sort,
        order
      }
    }).pipe(
      map(response => {

        const ret: { pagination: EmployeePagination, employees: Employee[] } = {
          pagination: {
            length: response.totalItems,
            size: limit,
            page: response.currentPage - 1,
            lastPage: response.totalPages,
            startIndex: response.currentPage > 1 ? (response.currentPage - 1) * limit : 0,
            endIndex: Math.min(response.currentPage * limit, response.totalItems)
          },
          employees: response.data
        };

        this._employeesPagination.next(ret.pagination);
        this._employees.next(ret.employees);

        return ret;

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
                (item) => item.empId === id
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
                (item) => item.empId === id
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

  getSaleAllEmp(): Observable<SaleListEmp[]> {
    return this._httpClient.get(`${environment.APIURL_LOCAL}/api/v1.0/sales_all_emp/`).pipe(
      tap((customers: any) => {
        this._salelistemps.next(customers);
      })
    );
  }

  getSaleListEmp(id): Observable<SaleListEmp[]> {
    return this._httpClient.get(`${environment.APIURL_LOCAL}/api/v1.0/sales_all_emp/${id}`).pipe(
      tap((saleallemp: SaleListEmp[]) => {
        this._salelistemps.next(saleallemp);
      })
    );
  }

}
