import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(
      'https://travelbooking.infinitycodehubltd.com/public/api/login',
      data
    );
  }
}
