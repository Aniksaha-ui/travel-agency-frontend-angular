import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RefundService {
  constructor(private http: HttpClient) {}

  private baseUrl: string = environment.apiBaseUrl;
  findRefunds() {
    return this.http.post(`${this.baseUrl}/refund`, {});
  }
}
