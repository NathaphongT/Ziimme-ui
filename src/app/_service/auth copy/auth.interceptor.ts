import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    /**
     * Constructor
     */
    constructor(private _authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
        let newReq = req;

        if (this._authService.accessToken && this._authService.accessToken.length)
        {
            newReq = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + this._authService.accessToken)
            });
        }

        return next.handle(newReq).pipe(
            catchError((error: HttpErrorResponse) => {

                if ( error instanceof HttpErrorResponse && error.status === 401 )
                {
                    // Sign out
                    this._authService.signOut();

                    // Reload the app
                    location.reload();
                }

                return throwError(error)
            })
        );
    }
}