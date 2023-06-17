import { ChangeDetectorRef, Component } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { animate, style, transition, trigger } from '@angular/animations';
import { TokenStorageService } from '../../../../../_service/token-storage.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/_service/user.service';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/_service/user.types';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig],
  animations: [
    trigger('slideInOutLeft', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
    trigger('slideInOutRight', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(-100%)' })),
      ]),
    ]),
  ],
})
export class NavRightComponent {

  user: User;
  username?: string;

  visibleUserList: boolean;
  chatMessage: boolean;
  friendId: boolean;

  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(config: NgbDropdownConfig, private tokenStorageService: TokenStorageService, private _userService: UserService, private _changeDetectorRef: ChangeDetectorRef) {
    config.placement = 'bottom-right';
    this.visibleUserList = false;
    this.chatMessage = false;
  }

  ngOnInit(): void {
    this._userService.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: User) => {
        this.user = user;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  onChatToggle(friend_id) {
    this.friendId = friend_id;
    this.chatMessage = !this.chatMessage;
  }

  Logout(): void {
    this.tokenStorageService.signOut();
  }
}
