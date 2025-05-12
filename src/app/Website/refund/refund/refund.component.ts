import { Component } from '@angular/core';
import { RefundService } from 'src/app/service/refund.service';

@Component({
  selector: 'app-refund',
  templateUrl: './refund.component.html',
  styleUrls: ['./refund.component.css'],
})
export class RefundComponent {
  refunds: any[] = [];

  constructor(private refundService: RefundService) {}

  ngOnInit(): void {
    this.refundService.findRefunds().subscribe((response: any) => {
      if (response.status === 'success') {
        this.refunds = response.data;
      } else {
        //logout;
      }
    });
  }
}
