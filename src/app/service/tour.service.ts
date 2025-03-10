import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TourService {
  constructor(private http: HttpClient) {}

  getAllTours(formData = {}) {
    return this.http.post(
      `http://travelbooking.infinitycodehubltd.com/public/api/trips`,
      formData
    );
  }

  getSingleTour(tripId: any) {
    return this.http.get(
      `http://travelbooking.infinitycodehubltd.com/public/api/trip/${tripId}`
    );
  }

  getBookingLayout(tripId: any) {
    return this.http.post(
      `http://travelbooking.infinitycodehubltd.com/public/api/user/tripsummery`,
      { trip_id: tripId }
    );
  }
}
