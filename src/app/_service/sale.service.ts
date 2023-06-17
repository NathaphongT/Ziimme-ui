import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, concatMap, map, switchMap, take, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Sale, SaleCut } from '@app/theme/pages/basic-data/basic.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private _sale: ReplaySubject<Sale> = new ReplaySubject<Sale>(1);
  private _sales: BehaviorSubject<Sale[]> = new BehaviorSubject<Sale[]>(null);

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

  get sale$(): Observable<Sale> {
    return this._sale.asObservable();
  }

  get sales$(): Observable<Sale[]> {
    return this._sales.asObservable();
  }

  get salecut$(): Observable<SaleCut> {
    return this._salecut.asObservable();
  }

  get salescut$(): Observable<SaleCut[]> {
    return this._salescut.asObservable();
  }

  getAllSale(): Observable<Sale[]> {
    return this._httpClient.get(`${environment.APIURL_LOCAL}/api/v1.0/sale/`).pipe(
      tap((sale: Sale[]) => {
        this._sales.next(sale)
      })
    );
  }

  // getSaleBYID(id): Observable<any> {
  //   return this._httpClient.get(`${environment.APIURL_LOCAL}/api/v1.0/sale_base/${id}`).pipe(
  //     tap((sale: any) => {
  //       this._sales.next(sale);
  //     })
  //   );
  // }

  getSaleBYIDSale(id): Observable<Sale[]> {
    return this._httpClient.get(`${environment.APIURL_LOCAL}/api/v1.0/sale/${id}`).pipe(
      tap((sale: Sale[]) => {
        this._sales.next(sale);
      })
    );
  }

  getSaleBYIDCus(id): Observable<any> {
    return this._httpClient.get(`${environment.APIURL_LOCAL}/api/v1.0/sale_cus/${id}`).pipe(
      tap((sale: any) => {
        this._sales.next(sale);
      })
    );
  }

  getSaleBYIDConsult(id): Observable<any> {
    return this._httpClient.get(`${environment.APIURL_LOCAL}/api/v1.0/sale_con/${id}`).pipe(
      tap((sale: any) => {
        this._sales.next(sale);
      })
    );
  }

  createSale(data: Sale): Observable<Sale> {
    return this.sales$.pipe(
      take(1),
      switchMap((sales) =>
        this._httpClient
          .post<Sale>(`${environment.APIURL_LOCAL}/api/v1.0/sale`, data)
          .pipe(
            map((newSale) => {
              // Update the Sale with the new Sale
              this._sales.next([...sales, newSale]);

              // Return the new Sales from observable
              return newSale;
            })
          )
      )
    );
  }



  saveWareHouseCategory(sale_id, consultantList): Observable<any> {
    return this._httpClient.post(`${environment.APIURL_LOCAL}/api/v1.0/sales/${sale_id}/sale_employee`, consultantList.map(emp_id => {
      return { sale_id, emp_id: emp_id }
    })).pipe(
      tap((v) => console.log("saveWareHouseCategory", v))
    )
  }

  saveWareHouse(sale_number, sale_product, sale_count, sale_pay_balance, sale_pay, sale_overdue, cus_id): Observable<any> {
    return this._httpClient.post(`${environment.APIURL_LOCAL}/api/v1.0/sale`, {
      sale_number,
      sale_product,
      sale_count,
      sale_pay_balance,
      sale_pay,
      sale_overdue,
      cus_id,
    }).pipe(
      tap((v) => console.log("saveWareHouse", v))
    )
  }

  saveAll(sale_number, sale_product, sale_count, sale_pay_balance, sale_pay, sale_overdue, cus_id, consultantList) {
    return this.saveWareHouse(
      sale_number,
      sale_product,
      sale_count,
      sale_pay_balance,
      sale_pay,
      sale_overdue,
      cus_id,
    )
      .pipe(
        concatMap(wh => this.saveWareHouseCategory(wh.sale_id, consultantList).pipe(
          map(() => wh)
        ))
      )
  }

  updateSale(id: number, data: Sale): Observable<Sale> {
    return this.sales$.pipe(
      take(1),
      switchMap((sales) =>
        this._httpClient
          .put<Sale>(`${environment.APIURL_LOCAL}/api/v1.0/sale/${id}`,
            data
          )
          .pipe(
            map((updatedSale: Sale) => {
              // Find the index of the updated sales
              const index = sales.findIndex(
                (item) => item.sale_id === id
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
          .delete<boolean>(`${environment.APIURL_LOCAL}/api/v1.0/sale/${id}`)
          .pipe(
            map((isDeleted: boolean) => {
              // Find the index of the deleted user
              const index = sales.findIndex(
                (item) => item.sale_id === id
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

  getSaleCutBYIDOrder(id): Observable<SaleCut> {
    return this._httpClient.get(`${environment.APIURL_LOCAL}/api/v1.0/sale_cut_order/${id}`).pipe(
      tap((salecut: SaleCut) => {
        this._salecut.next(salecut);
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


}
