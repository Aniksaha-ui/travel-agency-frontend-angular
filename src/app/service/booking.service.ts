import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private http: HttpClient) {}

  findBookings() {
    return this.http.post(
      'http://travelbooking.infinitycodehubltd.com/public/api  /mybookings',
      {}
    );
  }

  bookTour(data: any) {
    return this.http.post(
      'http://travelbooking.infinitycodehubltd.com/public/api  /booking',
      data
    );
  }
}
