import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from 'src/app/service/ticket.service';
import { ticketResolvedStatus, ticketStatus } from 'src/app/utils/constants/textConstants';
import { environment } from 'src/environments/environment';



declare var bootstrap: any;

@Component({
  selector: 'app-customer-ticket-list',
  templateUrl: './customer-ticket-list.component.html',
  styleUrls: ['./customer-ticket-list.component.css']
})
export class CustomerTicketListComponent {
  imageBaseUrl = environment.imageBaseUrl;

  tickets: any[] = [];
  ticketStatus = ticketStatus;
  ticketResolvedStatus = ticketResolvedStatus;

  constructor(private ticketService: TicketService, private router: Router) { }

  selectedTicket: any = null;
  modal: any;

  openTicketModal(ticket: any) {
    this.selectedTicket = ticket;

    // initialize modal if not yet created
    if (!this.modal) {
      const modalElement = document.getElementById('ticketModal');
      this.modal = new bootstrap.Modal(modalElement);
    }

    this.modal.show();
  }

  isLoading = true;

  ngOnInit(): void {
    this.isLoading = true;
    this.ticketService.ticketList().subscribe((response: any) => {
      if (response && response.isExecute === true && response.data.length > 0) {
        this.tickets = response.data ?? [];
      } else {

      }
      this.isLoading = false;
    }, () => this.isLoading = false);
  }


  addNewTickets() {
    this.router.navigate(['/add/tickets']);
  }

  getDisplayStatus(ticket: any): string {
    const rStatus = Number(ticket.resloved_status);
    const status = Number(ticket.status);

    if (rStatus === 2 && status === 2) {
      return 'declined';
    } else if (rStatus === 1 && status === 0) {
      return 'pending';
    } else if (rStatus === 1 && status === 2) {
      return 'resolved!';
    }

    // Fallback to original status if no match
    return this.ticketStatus[status] || 'unknown';
  }

  getStatusClass(ticket: any): string {
    const statusText = this.getDisplayStatus(ticket).toLowerCase();
    if (statusText.includes('declined')) return 'status-declined';
    if (statusText.includes('resolved')) return 'status-resolved';
    if (statusText.includes('pending')) return 'status-pending';
    return '';
  }
}
