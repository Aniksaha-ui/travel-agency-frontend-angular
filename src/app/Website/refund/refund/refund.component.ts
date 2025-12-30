import { Component, OnInit } from '@angular/core';
import { RefundService } from 'src/app/service/refund.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

declare var bootstrap: any;

@Component({
  selector: 'app-refund',
  templateUrl: './refund.component.html',
  styleUrls: ['./refund.component.css'],
})
export class RefundComponent implements OnInit {
  refunds: any[] = [];
  selectedRefund: any = null;
  modal: any;
  imageBaseUrl = environment.imageBaseUrl;

  constructor(private refundService: RefundService, private router: Router) {}

  ngOnInit(): void {
    this.loadRefunds();
  }

  loadRefunds(): void {
    this.refundService.findRefunds().subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.refunds = response.data;
        } else {
          console.error('Failed to load refunds');
          this.refunds = [];
        }
      },
      (error) => {
        console.error('API error:', error);
        this.refunds = [];
      }
    );
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

  openRefundModal(refund: any): void {
    this.selectedRefund = refund;

    if (!this.modal) {
      const modalElement = document.getElementById('refundModal');
      this.modal = new bootstrap.Modal(modalElement);
    }

    this.modal.show();
  }

  navigateToRequest(): void {
    this.router.navigate(['/request-refund']);
  }
}
