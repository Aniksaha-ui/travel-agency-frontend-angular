import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TourService {
  constructor(private http: HttpClient) {}

  getAllTours(formData = {}) {
    return this.http.post(`${environment.apiBaseUrl}/trips`, formData);
  }
}
