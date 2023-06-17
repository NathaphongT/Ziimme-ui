import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../../user.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  /**
  * Constructor
  */
  constructor(
    private _userService: UserService,
    private _router: Router
  ) {

  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean> | boolean | UrlTree {
    return this._userService.user$.pipe(
      map(user => {

        if (user.userRole || next.data["roles"] && !next.data["roles"].some(guardRole => user.userRole.toLowerCase().includes(guardRole.toLowerCase()))) {
            this._router.navigate(["/"])
            return false
        }
        else
        {
          return true
        }
      })
    )
  }
}
