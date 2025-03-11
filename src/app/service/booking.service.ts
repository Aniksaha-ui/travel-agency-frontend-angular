import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private http: HttpClient) {}

  findBookings() {
    return this.http.post('http://127.0.0.1:8000/api/mybookings', {});
  }

  bookTour(data: any) {
    return this.http.post('http://127.0.0.1:8000/api/booking', data);
  }
}
