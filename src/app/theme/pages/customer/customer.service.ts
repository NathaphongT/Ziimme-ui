import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, forkJoin, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { Customer } from '../../../_service/user.types';
import { environment } from '@environments/environment';
import { CustomerPagination, PaginationResponse } from '@app/_service/pagination.types';
import { Sale, SaleEmployee } from '@app/_service/main.types';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private _apiPath = environment.APIURL_LOCAL + '/api/v1.0';

  private _customer: ReplaySubject<Customer> = new ReplaySubject<Customer>(1);
  private _customers: BehaviorSubject<Customer[] | null> = new BehaviorSubject(null);
  private _customersPagination: BehaviorSubject<CustomerPagination | null> = new BehaviorSubject(null);

  customerss$: any;

  constructor(private _httpClient: HttpClient) { }

  set customer(value: Customer) {
    // Store the value
    this._customer.next(value);
  }


  //Customer
  get customer$(): Observable<Customer> {
    return this._customer.asObservable();
  }

  get customers$(): Observable<Customer[]> {
    return this._customers.asObservable();
  }

  get customersPagination$(): Observable<CustomerPagination> {
    return this._customersPagination.asObservable();
  }

  // ignored pagination
  getAllCustomer(): Observable<Customer[]> {
    return this._httpClient.get(this._apiPath + '/customer', {
      params: {
        q: '',
        page: '1',
        limit: 300
      }
    }).pipe(
      map((res: any) => res.data),
      tap((customers: any) => {
        this._customers.next(customers);
      })
    );
  }

  getCustomer(search: string = "", page: number = 1, limit: number = 10, sort: string = 'createdTime', order: 'asc' | 'desc' | '' = 'asc'): Observable<{ pagination: CustomerPagination, customers: Customer[] }> {
    return this._httpClient.get<PaginationResponse>(this._apiPath + '/customer', {
      params: {
        q: search,
        page: page.toString(),
        limit: limit.toString(),
        sort,
        order
      }
    }).pipe(
      map(response => {

        const ret: { pagination: CustomerPagination, customers: Customer[] } = {
          pagination: {
            length: response.totalItems,
            size: limit,
            page: response.currentPage - 1,
            lastPage: response.totalPages,
            startIndex: response.currentPage > 1 ? (response.currentPage - 1) * limit : 0,
            endIndex: Math.min(response.currentPage * limit, response.totalItems)
          },
          customers: response.data
        };

        this._customersPagination.next(ret.pagination);
        this._customers.next(ret.customers);

        return ret;

      })
    );
  }

  getByIdCustomer(id): Observable<Customer> {
    return this._httpClient.get(`${environment.APIURL_LOCAL}/api/v1.0/customer/${id}`).pipe(
      tap((customer: Customer) => {
        this._customer.next(customer)
      })
    );
  }

  createCustomer(data: Customer): Observable<Customer> {
    return this.customers$.pipe(
      take(1),
      switchMap((customers) =>
        this._httpClient
          .post<Customer>(`${environment.APIURL_LOCAL}/api/v1.0/customer`, data)
          .pipe(
            map((newCustomer) => {
              // Update the Employee with the new Employee
              this._customers.next([...customers, newCustomer]);

              // Return the new categorys from observable
              return newCustomer;
            })
          )
      )
    );
  }

  updateCustomer(id: number, data: Customer): Observable<Customer> {
    return this.customers$.pipe(
      take(1),
      switchMap((customers) =>
        this._httpClient
          .put<Customer>(`${environment.APIURL_LOCAL}/api/v1.0/customer/${id}`,
            data
          )
          .pipe(
            map((updatedCustomer: Customer) => {
              // Find the index of the updated customerss
              const index = customers.findIndex(
                (item) => item.cusId === id
              );

              // Update the customerss
              customers[index] = updatedCustomer;

              // Update the customerss
              this._customers.next(customers);

              // Return the updated customerss
              return updatedCustomer;
            })
          )
      )
    );
  }

  deleteCustomer(id: number): Observable<boolean> {
    return this.customers$.pipe(
      take(1),
      switchMap((customer) =>
        this._httpClient
          .delete<boolean>(`${environment.APIURL_LOCAL}/api/v1.0/customer/${id}`)
          .pipe(
            map((isDeleted: boolean) => {
              // Find the index of the deleted user
              const index = customer.findIndex(
                (item) => item.cusId === id
              );

              // Delete the user
              customer.splice(index, 1);

              // Update the customer
              this._customers.next(customer);

              // Return the deleted status
              return isDeleted;
            })
          )
      )
    );
  }
}
