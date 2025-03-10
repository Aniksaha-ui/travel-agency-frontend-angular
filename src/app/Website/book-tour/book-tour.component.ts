import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TourService } from 'src/app/service/tour.service';

@Component({
  selector: 'app-book-tour',
  templateUrl: './book-tour.component.html',
  styleUrls: ['./book-tour.component.css'],
})
export class BookTourComponent {
  tripData: any;
  seatLayout: any[] = [];
  groupedSeats: {
    [key: string]: { seat_number: string; is_available: string };
  } = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tourService: TourService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.tourService
        .getBookingLayout(params.get('id'))
        .subscribe((res: any) => {
          if (res.data) {
            this.tripData = res.data.tripSummaries[0];
            this.seatLayout = res.data.seat_layout;
            this.processSeatLayout();
          }
        });
    });
  }

  processSeatLayout() {
    this.groupedSeats = this.seatLayout.reduce((acc, seat: any) => {
      if (!acc[seat.seat_number]) {
        acc[seat.seat_number] = {
          seat_number: seat.seat_number,
          is_available: seat.is_available,
        };
      }
      return acc;
    }, {} as { [key: string]: { seat_number: string; is_available: string } });
  }
}
