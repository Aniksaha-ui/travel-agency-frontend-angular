import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from 'src/app/service/booking.service';
import { TourService } from 'src/app/service/tour.service';

@Component({
  selector: 'app-book-tour',
  templateUrl: './book-tour.component.html',
  styleUrls: ['./book-tour.component.css'],
})
export class BookTourComponent {
  tripData: any;
  seatLayout: any[] = [];
  selectedSeats: any[] = [];

  loginForm: FormGroup = new FormGroup({
    amount: new FormControl('', Validators.required),
    payment_method: new FormControl('', Validators.required),
    card: new FormControl(''),
    nagad: new FormControl(''),
    bkash: new FormControl(''),
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tourService: TourService,
    private bookingService: BookingService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.tourService
        .getBookingLayout(params.get('id'))
        .subscribe((res: any) => {
          if (res.data) {
            this.tripData = res.data.tripSummaries[0];
            this.seatLayout = res.data.seat_layout;
          }
        });
    });
  }

  // Function to toggle seat selection
  toggleSeat(seat: any) {
    if (seat.is_available === '0') return; // Prevent selection if seat is unavailable

    const index = this.selectedSeats.findIndex(
      (s) => s.seat_id === seat.seat_id,
    );
    if (index === -1) {
      this.selectedSeats.push({
        trip_id: seat.trip_id,
        seat_id: seat.seat_id,
        seat_number: seat.seat_number,
      });
    } else {
      this.selectedSeats.splice(index, 1);
    }
  }

  // Function to check if a seat is selected
  isSeatSelected(seat: any): boolean {
    return this.selectedSeats.some((s) => s.seat_id === seat.seat_id);
  }

  // Form submission handler
  onSubmit(): void {
    const requestData = {
      seatinfo: this.selectedSeats,
      paymentinfo: this.loginForm.value,
    };
    this.bookingService.bookTour(requestData).subscribe((res: any) => {
      if (res.status.toUpperCase() === 'SUCCESS') {
        if (res && res.data && res.data.redirected_url) {
          window.location.href = res.data.redirected_url;
        }
         
        this.router.navigate(['/my-bookings']);
      }
    });
    
  }

  calculateTotalAmount(): number {
    this.loginForm.patchValue({
      amount: this.selectedSeats.length * this.tripData.price,
    });
    return this.selectedSeats.length * this.tripData.price;
  }
}
