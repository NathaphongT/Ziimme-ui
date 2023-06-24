import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, ReplaySubject, switchMap, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './user.types';
import { PaginationResponse, UserPagination } from './pagination.types';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _apiPath = environment.APIURL_LOCAL + '/api/v1.0';

  private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
  private _users: BehaviorSubject<User[] | null> = new BehaviorSubject(null);
  private _usersPagination: BehaviorSubject<UserPagination | null> = new BehaviorSubject(null);

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter for user
   *
   * @param value
   */
  set user(value: User) {
    // Store the value
    this._user.next(value);
  }

  //Users
  get users$(): Observable<User[]> {
    return this._users.asObservable();
  }

  get user$(): Observable<User> {
    return this._user.asObservable();
  }

  get usersPagination$(): Observable<UserPagination> {
    return this._usersPagination.asObservable();
  }

  // get pagination$(): Observable<UserPagination> {
  //   return this._pagination.asObservable();
  // }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  get() {
    return this._httpClient.get(`${environment.APIURL_LOCAL}/api/v1.0/authentication`).pipe(
      tap((user: User) => {
        this._user.next(user);
      })
    );
  }

  getAllUser(): Observable<User[]> {
    return this._httpClient.get(this._apiPath + '/users', {
      params: {
        q: '',
        page: '1',
        limit: 300
      }
    }).pipe(
      map((res: any) => res.data),
      tap((users: any) => {
        this._users.next(users);
      })
    );
  }

  getUser(search: string = "", page: number = 1, limit: number = 10, sort: string = 'createdTime', order: 'asc' | 'desc' | '' = 'asc'): Observable<{ pagination: UserPagination, users: User[] }> {
    return this._httpClient.get<PaginationResponse>(this._apiPath + '/users', {
      params: {
        q: search,
        page: page.toString(),
        limit: limit.toString(),
        sort,
        order
      }
    }).pipe(
      map(response => {

        const ret: { pagination: UserPagination, users: User[] } = {
          pagination: {
            length: response.totalItems,
            size: limit,
            page: response.currentPage - 1,
            lastPage: response.totalPages,
            startIndex: response.currentPage > 1 ? (response.currentPage - 1) * limit : 0,
            endIndex: Math.min(response.currentPage * limit, response.totalItems)
          },
          users: response.data
        };

        this._usersPagination.next(ret.pagination);
        this._users.next(ret.users);

        return ret;

      })
    );
  }

  createUser(data: User): Observable<User> {
    return this.users$.pipe(
      take(1),
      switchMap((users) =>
        this._httpClient
          .post<User>(`${environment.APIURL_LOCAL}/api/v1.0/users`, data)
          .pipe(
            map((newUser) => {
              // Update the users with the new users
              this._users.next([...users, newUser]);

              // Return the new categorys from observable
              return newUser;
            })
          )
      )
    );
  }

  updateUser(id: number, data: User): Observable<User> {
    return this.users$.pipe(
      take(1),
      switchMap((users) =>
        this._httpClient
          .put<User>(`${environment.APIURL_LOCAL}/api/v1.0/users/${id}`,
            data
          )
          .pipe(
            map((updatedUser: User) => {
              // Find the index of the updated users
              const index = users.findIndex(
                (item) => item.userId === id
              );

              // Update the users
              users[index] = updatedUser;

              // Update the users
              this._users.next(users);

              // Return the updated users
              return updatedUser;
            })
          )
      )
    );
  }

  deleteUser(id: number): Observable<boolean> {
    return this.users$.pipe(
      take(1),
      switchMap((users) =>
        this._httpClient
          .delete<boolean>(`${environment.APIURL_LOCAL}/api/v1.0/users/${id}`)
          .pipe(
            map((isDeleted: boolean) => {
              // Find the index of the deleted user
              const index = users.findIndex(
                (item) => item.userId === id
              );

              // Delete the user
              users.splice(index, 1);

              // Update the users
              this._users.next(users);

              // Return the deleted status
              return isDeleted;
            })
          )
      )
    );
  }


}
