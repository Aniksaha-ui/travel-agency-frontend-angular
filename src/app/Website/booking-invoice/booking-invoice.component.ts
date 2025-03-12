import { Component } from '@angular/core';

@Component({
  selector: 'app-booking-invoice',
  templateUrl: './booking-invoice.component.html',
  styleUrls: ['./booking-invoice.component.css'],
})
export class BookingInvoiceComponent {
  invoiceData = {
    booking_id: 8,
    transaction_reference: 'ACSX68JWMP',
    user: {
      name: 'Anik Saha',
      email: 'sahaanik104@gmail.com',
    },
    trip: {
      trip_id: 1,
      trip_name: 'Grand Trip Faridpur',
    },
    payment: {
      status: 'payment init',
      method: 'card',
      nagad: null,
      bkash: null,
      card: '4706614431298592',
    },
    seats: [
      {
        seat_id: 15,
        seat_number: 'A1',
      },
      {
        seat_id: 16,
        seat_number: 'A2',
      },
    ],
  };

  constructor() {}

  ngOnInit(): void {}

  downloadInvoice() {
    // Logic to download the invoice
    console.log('Downloading Invoice...');
    // You can add functionality here to export the data as a PDF or generate a downloadable file
  }
}
