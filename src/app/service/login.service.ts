import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}
  private baseUrl: string = environment.apiBaseUrl;

  login(data: any) {
    return this.http.post(`${this.baseUrl}/login`, data);
  }
}
