import { Component } from '@angular/core';
import { BookingService } from 'src/app/service/booking.service';

@Component({
  selector: 'app-mybookings',
  templateUrl: './mybookings.component.html',
  styleUrls: ['./mybookings.component.css'],
})
export class MybookingsComponent {
  bookings: any = [];
  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingService.findBookings().subscribe((response: any) => {
      this.bookings = response.data;
    });
  }

  cancelBooking(id: any) {
    this.bookingService.cancelBooking(id).subscribe((response: any) => {
      this.bookings = this.bookings.map((booking: any) =>
        booking.id === id ? { ...booking, status: 'cancelled' } : booking
      );
    });
  }
}
