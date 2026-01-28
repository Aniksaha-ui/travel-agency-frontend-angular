import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelServiceService } from 'src/app/service/hotel-service.service';

@Component({
  selector: 'app-hotel-details',
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.css'],
})
export class HotelDetailsComponent implements OnInit {
  hotel: any;
  bookingForm: FormGroup;
  totalCost: number = 0;
  selectedRoom: any = null;

  constructor(
    private fb: FormBuilder,
    private hotelService: HotelServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Create the booking form
    this.bookingForm = this.fb.group({
      hotel_room_id: ['', Validators.required],
      check_in_date: ['', Validators.required],
      check_out_date: ['', Validators.required],
      total_persons: [1, [Validators.required, Validators.min(1)]],
      payment_method: ['', Validators.required],
      card: [''],
      bkash: [''],
      nagad: [''],
    });
  }

  ngOnInit(): void {
    // Load the hotel data
    this.getSingleHotel();
  }

  /** Fetch hotel details */
  getSingleHotel() {
    this.route.paramMap.subscribe((params) => {
      this.hotelService
        .getSingleHotel(params.get('id'))
        .subscribe((res: any) => {
          console.log('Hotel Response:', res.hotel);

          if (res.hotel) {
            this.hotel = res.hotel;
          }
        });
    });
  }

  /** When user selects a room */
  onRoomSelect(roomId: string) {
    this.bookingForm.patchValue({ hotel_room_id: roomId });
    this.selectedRoom = this.hotel.rooms.find(
      (r: any) => r.room_id == parseInt(roomId, 10)
    );
    this.calculateCost();
  }

  /** Days difference */
  getDaysDiff(start: Date, end: Date): number {
    const diff = end.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  /** Check if date is in range */
  isDateInRange(date: Date, start: Date, end: Date): boolean {
    return date >= start && date <= end;
  }

  /** Calculate total cost based on date and seasonal price */
  calculateCost() {
    if (!this.selectedRoom) return;

    const checkIn = new Date(this.bookingForm.value.check_in_date);
    const checkOut = new Date(this.bookingForm.value.check_out_date);

    if (checkIn && checkOut && checkOut > checkIn) {
      const days = this.getDaysDiff(checkIn, checkOut);
      let total = 0;

      for (let i = 0; i <= days; i++) {
        const currentDate = new Date(checkIn);
        currentDate.setDate(checkIn.getDate() + i);

        const priceObj = this.selectedRoom.prices.find((p: any) =>
          this.isDateInRange(
            currentDate,
            new Date(p.season_start),
            new Date(p.season_end)
          )
        );

        total += priceObj ? parseFloat(priceObj.price_per_night) : 0;
      }
      this.totalCost = total;
    }
  }

  /** Handle form submit */
  onSubmit() {
    if (this.bookingForm.invalid || !this.selectedRoom) return;

    const bookingData = {
      hotel_id: this.hotel.id,
      hotel_room_id: this.bookingForm.value.hotel_room_id,
      check_in_date: this.bookingForm.value.check_in_date,
      check_out_date: this.bookingForm.value.check_out_date,
      total_persons: this.bookingForm.value.total_persons,
      total_cost: this.totalCost,
      payment_method: this.bookingForm.value.payment_method,
      card: this.bookingForm.value.card,
      bkash: this.bookingForm.value.bkash,
      nagad: this.bookingForm.value.nagad,
    };

    this.hotelService.bookingHotel(bookingData).subscribe((res: any) => {
      if (res.isExecute) {
        this.router.navigate(['/my-bookings']);
      } else {
        alert('Booking failed: ' + res.message);
      }
    });
  }
}
