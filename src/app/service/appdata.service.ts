import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppdataService {
  constructor() {}

  userInfo: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  userInformation = this.userInfo.asObservable();

  loginStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loginState = this.loginStatus.asObservable();
}
