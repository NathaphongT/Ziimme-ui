import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthUtils } from './auth.utils';
import { UserService } from '../user.service';
import { User } from '../user.types';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _authenticated: boolean = false;

  constructor(
    private _httpClient: HttpClient, private _activatedRoute: ActivatedRoute, private _userService: UserService
  ) {
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  set accessToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  get accessToken(): string {
    return localStorage.getItem('accessToken') ?? '';
  }

  signIn(credentials: { username: string; password: string }): Observable<any> {
    // Throw error, if the user is already logged in
    if (this._authenticated) {
      return throwError('User is already logged in.');
    }
    localStorage.setItem('Password', credentials.password);
    return this._httpClient.post(environment.APIURL_LOCAL + '/api/v1.0/login', credentials).pipe(
      map((response: any) => response.data),
      switchMap((response: any) => {


        this.accessToken = response.token.split(" ")[1];

        // Set the authenticated flag to true
        this._authenticated = true;

        // Store the user on the user service
        this._userService.user = response.user;

        // Return a new observable with the response
        return of(response);
      })
    );
  }

  signOut(): Observable<any> {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('Password');
    this._authenticated = false;
    return this._httpClient.get(`${environment.APIURL_LOCAL}/api/v1.0/logout`).pipe(
      tap((response) => {
        of(response.status)
      })
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this._httpClient.post(`${environment.APIURL_LOCAL}/api/v1.0/forgot-password`, {
      email
    });
  }

  check(): Observable<boolean> {

    if (this._authenticated) {
      return of(true);
    }

    if (!this.accessToken || this.accessToken === undefined) {
      return of(false);
    }

    if (AuthUtils.isTokenExpired(this.accessToken)) {
      return of(false);
    }

    return this._userService.get().pipe(
      switchMap((response: User) => {

        this._authenticated = true;

        //this._userService.user = response;

        return of(true);
      })
    );

  }
}
