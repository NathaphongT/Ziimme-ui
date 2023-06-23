import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, map, of, switchMap, take, throwError } from 'rxjs';
import { Sale, SaleEmployee } from './main.types';
import { PaginationResponse, SalePagination } from './pagination.types';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environment';

@Injectable({
  providedIn: 'root'
})
export class ManageService {

  private _apiPath = environment.APIURL_LOCAL + '/api/v1.0';

  private _sales: BehaviorSubject<Sale[] | null> = new BehaviorSubject(null);
  private _sale: BehaviorSubject<Sale | null> = new BehaviorSubject(null);

  private _salePagination: BehaviorSubject<SalePagination | null> = new BehaviorSubject(null);

  constructor(
    private _http: HttpClient
  ) { }

  get salePagination$(): Observable<SalePagination> {
    return this._salePagination.asObservable();
  }

  //Sale
  get sale$(): Observable<Sale> {
    return this._sale.asObservable();
  }

  get sales$(): Observable<Sale[]> {
    return this._sales.asObservable();
  }
  /////////////////////////////////////////////////

  updateSale(id, updates) {
    return this.sales$.pipe(
      take(1),
      switchMap((sales) =>
        this._http
          .patch(`${environment.APIURL_LOCAL}/api/v1.0/sales/${id}`, updates)
          .pipe(
            map((updatedSale: Sale) => {

              const index = sales.findIndex(warehouse => warehouse.saleId == id);
              if (index !== -1) {
                sales[index] = { ...sales[index], ...updatedSale };
                this._sales.next(sales);
              }
              return updatedSale;
            })
          )
      )
    );
  }

  getSale(search: string = "", page: number = 1, limit: number = 10, socialTypeId: number = 0, sort: string = 'createdTime', order: 'asc' | 'desc' | '' = 'asc', useStatus: string | null = null): Observable<{ pagination: SalePagination, warehouses: Sale[] }> {

    const params = {
      q: search,
      page: page.toString(),
      limit: limit.toString(),
      socialTypeId,
      sort,
      order
    };

    if (useStatus) {
      params['useStatus'] = useStatus;
    }

    return this._http.get<PaginationResponse>(this._apiPath + '/sales', {
      params: params
    }).pipe(
      switchMap(response => {
        const warehouses: Sale[] = response.data;

        if (!warehouses.length) {
          const ret: { pagination: SalePagination, warehouses: Sale[] } = {
            pagination: {
              length: response.totalItems,
              size: limit,
              page: response.currentPage - 1,
              lastPage: response.totalPages,
              startIndex: response.currentPage > 1 ? (response.currentPage - 1) * limit : 0,
              endIndex: Math.min(response.currentPage * limit, response.totalItems)
            },
            warehouses
          };

          this._salePagination.next(ret.pagination);
          this._sales.next(ret.warehouses);

          return of(ret)
        }

        // Fetch keywords and platforms for each project
        const requests = warehouses.map(sale => forkJoin([
          this._http.get<SaleEmployee[]>(`${environment.APIURL_LOCAL}/api/v1.0/sales/${sale.empId}/sale_employee`)
        ]));

        return forkJoin(requests).pipe(

          map((responses: [
            SaleEmployee[]
          ][]) => {

            warehouses.forEach((warehouse, index) => {
              warehouse.empId = responses[index][0];
            });

            const ret: { pagination: SalePagination, warehouses: Sale[] } = {
              pagination: {
                length: response.totalItems,
                size: limit,
                page: response.currentPage - 1,
                lastPage: response.totalPages,
                startIndex: response.currentPage > 1 ? (response.currentPage - 1) * limit : 0,
                endIndex: Math.min(response.currentPage * limit, response.totalItems)
              },
              warehouses
            };

            this._salePagination.next(ret.pagination);
            this._sales.next(ret.warehouses);

            return ret;
          })
        );
      })
    );
  }

  getSaleById(id): Observable<Sale | boolean> {
    return this._http.get<Sale>(`${environment.APIURL_LOCAL}/api/v1.0/sales/${id}`).pipe(

      switchMap(sale => {

        const requests = forkJoin([
          this._http.get<SaleEmployee[]>(`${environment.APIURL_LOCAL}/api/v1.0/sales/${sale.empId}/sale_employee`)
        ]);

        return forkJoin(requests).pipe(

          map((responses: [
            SaleEmployee[]
          ][]) => {

            sale.empId = responses[0][0];

            this._sale.next(sale);

            return sale;
          })
        );
      }),
      switchMap(warehouse => {

        if (!warehouse) {
          return throwError(() => 'Could not found Warehouse with id of ' + id + '!');
        }

        return of(warehouse)
      })
    );
  }

  deleteSale(id: number): Observable<boolean> {
    return this.sales$.pipe(
      take(1),
      switchMap((sales) =>
        this._http
          .delete<boolean>(this._apiPath + '/sales/' + id)
          .pipe(
            map((isDeleted: boolean) => {
              // Find the index of the deleted category
              const index = sales.findIndex(
                (item) => item.saleId === id
              );

              // Delete the category
              sales.splice(index, 1);

              // Update the sales
              this._sales.next(sales);

              // Return the deleted status
              return isDeleted;
            }),
            /* filter(isDeleted => isDeleted),
            concatMap(() => this.deleteSocial(id).pipe(
              concatMap(() => this.deleteWareHouseCategory(id))
            )) */
          )
      )
    );
  }
}
