import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BookingService } from 'src/app/service/booking.service';
import { TourService } from 'src/app/service/tour.service';

@Component({
  selector: 'app-booking-invoice',
  templateUrl: './booking-invoice.component.html',
  styleUrls: ['./booking-invoice.component.css'],
})
export class BookingInvoiceComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tourService: TourService,
    private bookingService: BookingService
  ) {}

  invoiceData: any = {};

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.bookingService
        .bookingInvoice(params.get('id'))
        .subscribe((res: any) => {
          if (res.data) {
            this.invoiceData = res.data[0];
          }
        });
    });
  }

  downloadInvoice() {
    // Logic to download the invoice
    console.log('Downloading Invoice...');
    // You can add functionality here to export the data as a PDF or generate a downloadable file
  }
}
