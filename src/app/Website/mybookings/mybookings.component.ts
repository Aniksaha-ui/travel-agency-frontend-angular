import { Component, OnInit } from '@angular/core';
import { BookingService } from 'src/app/service/booking.service';

declare var bootstrap: any;

@Component({
  selector: 'app-mybookings',
  templateUrl: './mybookings.component.html',
  styleUrls: ['./mybookings.component.css'],
})
export class MybookingsComponent implements OnInit {
  bookings: any = [];
  selectedBooking: any = null;
  modal: any;

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingService.findBookings().subscribe((response: any) => {
      this.bookings = response.data;
    });
  }

  formatDateTime(datetime: string): string {
    if (!datetime) return 'N/A';
    const date = new Date(datetime);
    return (
      date.toLocaleDateString() +
      ' ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  }

  openBookingModal(booking: any): void {
    this.selectedBooking = booking;

    if (!this.modal) {
      const modalElement = document.getElementById('bookingModal');
      this.modal = new bootstrap.Modal(modalElement);
    }

    this.modal.show();
  }

  cancelBooking(id: any) {
    this.bookingService.cancelBooking(id).subscribe((response: any) => {
      this.bookings = this.bookings.map((booking: any) =>
        booking.id === id ? { ...booking, status: 'cancelled' } : booking
      );
      
      // Update selected booking if it's the one being cancelled
      if (this.selectedBooking && this.selectedBooking.id === id) {
        this.selectedBooking.status = 'cancelled';
      }
    });
  }
}
