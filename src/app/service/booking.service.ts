import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private http: HttpClient) {}
  private baseUrl: string = environment.apiBaseUrl;
  findBookings() {
    return this.http.post(`${this.baseUrl}/mybookings`, {});
  }

  bookTour(data: any) {
    return this.http.post(`${this.baseUrl}/booking`, data);
  }

  bookingInvoice(booking_id: any) {
    return this.http.post(`${this.baseUrl}/invoice`, {
      booking_id: booking_id,
    });
  }
}
