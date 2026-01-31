import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppdataService {
  constructor() { }

  userInfo: BehaviorSubject<any> = new BehaviorSubject<any>(
    JSON.parse(localStorage.getItem('user') || 'null')
  );
  userInformation = this.userInfo.asObservable();

  loginStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    localStorage.getItem('isLoggedIn') === 'true'
  );
  loginState = this.loginStatus.asObservable();
}
