import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, concatMap, forkJoin, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { SaleCut } from '@app/theme/pages/basic-data/basic.model';
import { Employee, Sale, SaleEmployee, SaleProducts } from './main.types';
import { PaginationResponse, SalePagination } from './pagination.types';
import { SaleList } from './user.types';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private _apiPath = environment.APIURL_LOCAL + '/api/v1.0';


  private _sale: ReplaySubject<Sale> = new ReplaySubject<Sale>(1);
  private _sales: BehaviorSubject<Sale[] | null> = new BehaviorSubject(null);
  private _salePagination: BehaviorSubject<SalePagination | null> = new BehaviorSubject(null);

  private _saleemps: BehaviorSubject<SaleEmployee[] | null> = new BehaviorSubject(null);
  private _saleemp: BehaviorSubject<SaleEmployee | null> = new BehaviorSubject(null);

  private _salepros: BehaviorSubject<SaleProducts[] | null> = new BehaviorSubject(null);
  private _salepro: BehaviorSubject<SaleProducts | null> = new BehaviorSubject(null);

  private _salecut: ReplaySubject<SaleCut> = new ReplaySubject<SaleCut>(1);
  private _salescut: BehaviorSubject<SaleCut[]> = new BehaviorSubject<SaleCut[]>(null);

  constructor(private _httpClient: HttpClient) { }

  set sale(value: Sale) {
    // Store the value
    this._sale.next(value);
  }

  set salecut(value: SaleCut) {
    // Store the value
    this._salecut.next(value);
  }

  //sales
  get sales$(): Observable<Sale[]> {
    return this._sales.asObservable();
  }

  get sale$(): Observable<Sale> {
    return this._sale.asObservable();
  }

  get salePagination$(): Observable<SalePagination> {
    return this._salePagination.asObservable();
  }

  get salecut$(): Observable<SaleCut> {
    return this._salecut.asObservable();
  }

  get salescut$(): Observable<SaleCut[]> {
    return this._salescut.asObservable();
  }

  getAllSale(): Observable<Sale[]> {
    return this._httpClient.get(this._apiPath + '/sales', {
      params: {
        q: '',
        page: '1',
        limit: 300
      }
    }).pipe(
      map((res: any) => res.data),
      tap((sales: any) => {
        this._sales.next(sales);
      })
    );
  }

  getSale(search: string = "", page: number = 1, limit: number = 10, sort: string = 'createdTime', order: 'asc' | 'desc' | '' = 'asc'): Observable<{ pagination: SalePagination, sales: Sale[] }> {
    return this._httpClient.get<PaginationResponse>(this._apiPath + '/sales', {
      params: {
        q: search,
        page: page.toString(),
        limit: limit.toString(),
        sort,
        order
      }
    }).pipe(
      map(response => {

        const ret: { pagination: SalePagination, sales: Sale[] } = {
          pagination: {
            length: response.totalItems,
            size: limit,
            page: response.currentPage - 1,
            lastPage: response.totalPages,
            startIndex: response.currentPage > 1 ? (response.currentPage - 1) * limit : 0,
            endIndex: Math.min(response.currentPage * limit, response.totalItems)
          },
          sales: response.data
        };

        this._salePagination.next(ret.pagination);
        this._sales.next(ret.sales);

        return ret;

      })
    );
  }


  getSaleCus(search: string = "", page: number = 1, limit: number = 10, saleId: number = 0, sort: string = 'createdTime', order: 'asc' | 'desc' | '' = 'asc'): Observable<{ pagination: SalePagination, sales: Sale[] }> {

    const params = {
      q: search,
      page: page.toString(),
      limit: limit.toString(),
      saleId,
      sort,
      order
    };

    return this._httpClient.get<PaginationResponse>(this._apiPath + '/sales', {
      params: params
    }).pipe(
      switchMap(response => {
        const sales: Sale[] = response.data;

        if (!sales.length) {
          const ret: { pagination: SalePagination, sales: Sale[] } = {
            pagination: {
              length: response.totalItems,
              size: limit,
              page: response.currentPage - 1,
              lastPage: response.totalPages,
              startIndex: response.currentPage > 1 ? (response.currentPage - 1) * limit : 0,
              endIndex: Math.min(response.currentPage * limit, response.totalItems)
            },
            sales
          };

          this._salePagination.next(ret.pagination);
          this._sales.next(ret.sales);

          return of(ret)
        }

        // Fetch keywords and platforms for each project
        const requests = sales.map(sale => forkJoin([
          this._httpClient.get<SaleEmployee[]>(`${environment.APIURL_LOCAL}/api/v1.0/sales/${sale.saleId}/sale_employee`)
        ]));

        return forkJoin(requests).pipe(

          map((responses: [
            SaleEmployee[]
          ][]) => {

            sales.forEach((warehouse, index) => {
              warehouse.empId = responses[index][0];
            });

            const ret: { pagination: SalePagination, sales: Sale[] } = {
              pagination: {
                length: response.totalItems,
                size: limit,
                page: response.currentPage - 1,
                lastPage: response.totalPages,
                startIndex: response.currentPage > 1 ? (response.currentPage - 1) * limit : 0,
                endIndex: Math.min(response.currentPage * limit, response.totalItems)
              },
              sales
            };

            this._salePagination.next(ret.pagination);
            this._sales.next(ret.sales);

            return ret;
          })
        );
      })
    );
  }

  getSaleBYIDCus(id): Observable<Sale[]> {
    return this._httpClient.get(`${environment.APIURL_LOCAL}/api/v1.0/sale_cus/${id}`).pipe(
      tap((sale: Sale[]) => {
        this._sales.next(sale);
      })
    );
  }

  getSaleBYIDSale(id): Observable<Sale[]> {
    return this._httpClient.get(`${environment.APIURL_LOCAL}/api/v1.0/sales/${id}`).pipe(
      tap((sale: Sale[]) => {
        this._sales.next(sale);
      })
    );
  }

  getSaleBYIDConsult(id): Observable<any> {
    return this._httpClient.get(`${environment.APIURL_LOCAL}/api/v1.0/sales/${id}/sale_employee`).pipe(
      tap((sale: any) => {
        this._sales.next(sale);
      })
    );
  }

  updateSaleEmployee(saleId, cusId, consultantList): Observable<any> {
    return this._httpClient.post(`${environment.APIURL_LOCAL}/api/v1.0/sales/${saleId}/sale_employee`, consultantList.map(empId => {
      return { saleId, cusId, empId: empId }
    })).pipe(
      tap((v) => console.log("updateSaleEmployee", v))
    )
  }

  deleteAllSaleEmployee(saleId): Observable<any> {
    return this._httpClient.delete(`${this._apiPath}/sales/${saleId}/sale_employee`).pipe(
      tap((v) => console.log("deleteAllSaleEmployee", v))
    )
  }


  saveSaleEmployee(saleId, cusId, consultantList): Observable<any> {
    return this._httpClient.post(`${environment.APIURL_LOCAL}/api/v1.0/sales/${saleId}/sale_employee`, consultantList.map(empId => {
      return { saleId, cusId, empId: empId }
    })).pipe(
      tap((v) => console.log("saveAllSaleEmployee", v))
    )
  }


  saveSaleProduct(saleId, cusId, saleCount, ProductList): Observable<any> {
    return this._httpClient.post(`${environment.APIURL_LOCAL}/api/v1.0/products/${saleId}/sale_product`, ProductList.map(courseId => {
      return { saleId, cusId, saleCount, ...courseId }
    })).pipe(
      tap((v) => console.log("saveAllSaleProduct", v))
    )
  }


  deleteSaleEmployee(saleId): Observable<any> {
    return this._httpClient.delete(`${environment.APIURL_LOCAL}/api/v1.0/sales/${saleId}/sale_employee`).pipe(
      tap((v) => console.log("deleteSaleEmployee", v))
    )
  }

  deleteSaleProduct(saleId): Observable<any> {
    return this._httpClient.delete(`${environment.APIURL_LOCAL}/api/v1.0/products/${saleId}/sale_product`).pipe(
      tap((v) => console.log("deleteSaleProduct", v))
    )
  }

  saveSale(saleNumber, salePayBalance, salePay, saleOverdue, cusId): Observable<any> {
    return this._httpClient.post(`${environment.APIURL_LOCAL}/api/v1.0/sales`, {
      saleNumber,
      salePayBalance,
      salePay,
      saleOverdue,
      cusId,
    }).pipe(
      tap((v) => console.log("saveAll", v))
    )
  }

  updateSale(slaeId, saleNumber, salePayBalance, salePay, saleOverdue, cusId): Observable<any> {
    return this._httpClient.put(`${environment.APIURL_LOCAL}/api/v1.0/sales/${slaeId}`, {
      saleNumber,
      salePayBalance,
      salePay,
      saleOverdue,
      cusId,
    }).pipe(
      tap((v) => console.log("saveAll", v))
    )
  }

  saveAll(saleNumber, salePayBalance, salePay, saleOverdue, cusId, consultantList, ProductList): Observable<any> {
    return this.saveSale(
      saleNumber,
      salePayBalance,
      salePay,
      saleOverdue,
      cusId,
    ).pipe(
      concatMap(wh => this.deleteSaleEmployee(wh.saleId).pipe(
        concatMap(() => this.saveSaleEmployee(wh.saleId, wh.cusId, consultantList).pipe(
          concatMap(() => this.deleteSaleProduct(wh.saleId).pipe(
            concatMap(() => this.saveSaleProduct(wh.saleId, wh.cusId, wh.saleCount, ProductList).pipe(
              map(() => wh)
            ))
          ))
        ))
      ))
    )
  }

  updateAll(saleId, saleNumber, salePayBalance, salePay, saleOverdue, cusId, consultantList, ProductList): Observable<any> {
    return this.updateSale(
      saleId,
      saleNumber,
      salePayBalance,
      salePay,
      saleOverdue,
      cusId,
    ).pipe(
      concatMap(wh => this.deleteSaleEmployee(wh.saleId).pipe(
        concatMap(() => this.saveSaleEmployee(wh.saleId, wh.cusId, consultantList).pipe(
          concatMap(() => this.deleteSaleProduct(wh.saleId).pipe(
            concatMap(() => this.saveSaleProduct(wh.saleId, wh.cusId, wh.saleCount, ProductList).pipe(
              map(() => wh)
            ))
          ))
        ))
      ))
    )
  }

  updateSales(id: number, data: Sale): Observable<Sale> {
    return this.sales$.pipe(
      take(1),
      switchMap((sales) =>
        this._httpClient
          .put<Sale>(`${environment.APIURL_LOCAL}/api/v1.0/sales/${id}`,
            data
          )
          .pipe(
            map((updatedSale: Sale) => {
              // Find the index of the updated sales
              const index = sales.findIndex(
                (item) => item.saleId === id
              );

              // Update the sales
              sales[index] = updatedSale;

              // Update the sales
              this._sales.next(sales);

              // Return the updated sales
              return updatedSale;
            })
          )
      )
    );
  }

  deleteSale(id: number): Observable<boolean> {
    return this.sales$.pipe(
      take(1),
      switchMap((sales) =>
        this._httpClient
          .delete<boolean>(`${environment.APIURL_LOCAL}/api/v1.0/sales/${id}`)
          .pipe(
            map((isDeleted: boolean) => {
              // Find the index of the deleted user
              const index = sales.findIndex(
                (item) => item.saleId === id
              );

              // Delete the user
              sales.splice(index, 1);

              // Update the sales
              this._sales.next(sales);

              // Return the deleted status
              return isDeleted;
            })
          )
      )
    );
  }

  getAllSaleCut(): Observable<SaleCut[]> {
    return this._httpClient.get(`${environment.APIURL_LOCAL}/api/v1.0/sale_cut/`).pipe(
      tap((salecut: SaleCut[]) => {
        this._salescut.next(salecut)
      })
    );
  }

  getSaleCutBYID(id): Observable<SaleCut[]> {
    return this._httpClient.get(`${environment.APIURL_LOCAL}/api/v1.0/sale_cut/${id}`).pipe(
      tap((salecut: SaleCut[]) => {
        this._salescut.next(salecut);
      })
    );
  }

  getSaleCutBYIDOrder(id): Observable<SaleCut[]> {
    return this._httpClient.get(`${environment.APIURL_LOCAL}/api/v1.0/sale_cut_order/${id}`).pipe(
      tap((salecut: SaleCut[]) => {
        this._salescut.next(salecut);
      })
    );
  }

  createSaleCut(data: SaleCut): Observable<SaleCut> {
    return this.salescut$.pipe(
      take(1),
      switchMap((salescut) =>
        this._httpClient
          .post<SaleCut>(`${environment.APIURL_LOCAL}/api/v1.0/sale_cut`, data)
          .pipe(
            map((newSaleCut) => {
              // Update the Sale with the new Sale
              this._salescut.next([...salescut, newSaleCut]);

              // Return the new Sales from observable
              return newSaleCut;
            })
          )
      )
    );
  }

  updateSaleCut(id: number, data: SaleCut): Observable<SaleCut> {
    return this.salescut$.pipe(
      take(1),
      switchMap((salescut) =>
        this._httpClient
          .put<SaleCut>(`${environment.APIURL_LOCAL}/api/v1.0/sale_cut/${id}`,
            data
          )
          .pipe(
            map((updatedSale: SaleCut) => {
              // Find the index of the updated salescut
              const index = salescut.findIndex(
                (item) => item.sale_cut_id === id
              );

              // Update the salescut
              salescut[index] = updatedSale;

              // Update the salescut
              this._salescut.next(salescut);

              // Return the updated salescut
              return updatedSale;
            })
          )
      )
    );
  }


  getSaleById(id): Observable<Sale | boolean> {
    return this._httpClient.get<Sale>(`${environment.APIURL_LOCAL}/api/v1.0/sales/${id}`).pipe(

      switchMap(warehouse => {

        const requests = forkJoin([
          this._httpClient.get<SaleEmployee[]>(`${environment.APIURL_LOCAL}/api/v1.0/sales/${warehouse.saleId}/sale_employee`)
        ]);

        return forkJoin(requests).pipe(

          map((responses: [
            SaleEmployee[]
          ][]) => {

            warehouse.empId = responses[0][0];

            this._sale.next(warehouse);

            return warehouse;
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

  getSaleByIdPo(id): Observable<Sale | boolean> {
    return this._httpClient.get<Sale>(`${environment.APIURL_LOCAL}/api/v1.0/sales/${id}`).pipe(

      switchMap(warehouse => {

        const requests = forkJoin([
          this._httpClient.get<SaleList[]>(`${environment.APIURL_LOCAL}/api/v1.0/sales_all/${warehouse.saleId}`)
        ]);

        return forkJoin(requests).pipe(

          map((responses: [
            SaleList[]
          ][]) => {

            // warehouse.courseId = responses[0][0];

            this._sale.next(warehouse);

            return warehouse;
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


}
