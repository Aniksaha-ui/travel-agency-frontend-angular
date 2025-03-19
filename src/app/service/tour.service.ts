import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TourService {
  constructor(private http: HttpClient) {}
  private baseUrl: string = environment.apiBaseUrl;

  getAllTours(formData = {}) {
    return this.http.post(`${this.baseUrl}/trips`, formData);
  }

  getSingleTour(tripId: any) {
    return this.http.get(`${this.baseUrl}/trip/${tripId}`);
  }

  getBookingLayout(tripId: any) {
    return this.http.post(`${this.baseUrl}/user/tripsummery`, {
      trip_id: tripId,
    });
  }
}
