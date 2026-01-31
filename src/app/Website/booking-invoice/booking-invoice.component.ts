import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BookingService } from 'src/app/service/booking.service';
import { TourService } from 'src/app/service/tour.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  ) { }

  invoiceData: any = {};
  today: Date = new Date();

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
    const data = document.getElementById('invoice-content');
    if (data) {
      html2canvas(data, { scale: 2 }).then((canvas) => {
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const position = 0;

        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.save(`invoice_${this.invoiceData.booking_id}.pdf`);
      });
    }
  }
}
