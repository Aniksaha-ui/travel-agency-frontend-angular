import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post('http://127.0.0.1:8000/api/login', data);
  }
}
