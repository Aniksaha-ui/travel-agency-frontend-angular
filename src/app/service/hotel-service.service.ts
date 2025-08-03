import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HotelServiceService {
  constructor(private http: HttpClient) {}
  private baseUrl: string = environment.apiBaseUrl;

  getHotels(data: any) {
    return this.http.post(`${this.baseUrl}/hotels`, data);
  }
}
