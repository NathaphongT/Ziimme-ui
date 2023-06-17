import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, map, switchMap, take, tap } from 'rxjs';
import { Customer } from '../../../_service/user.types';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private _customer: ReplaySubject<Customer> = new ReplaySubject<Customer>(1);
  private _customers: BehaviorSubject<Customer[]> = new BehaviorSubject<Customer[]>(null);
  customerss$: any;

  constructor(private _httpClient: HttpClient) { }

  set customer(value: Customer) {
    // Store the value
    this._customer.next(value);
  }

  get customer$(): Observable<Customer> {
    return this._customer.asObservable();
  }

  get customers$(): Observable<Customer[]> {
    return this._customers.asObservable();
  }

  getAllCustomer(): Observable<Customer[]> {
    return this._httpClient.get(`${environment.APIURL_LOCAL}/api/v1.0/customer/`).pipe(
      tap((customer: Customer[]) => {
        this._customers.next(customer)
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
                (item) => item.cus_id === id
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
                (item) => item.cus_id === id
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
