import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketService } from 'src/app/service/ticket.service';
import { ticketStatus } from 'src/app/utils/constants/textConstants';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-tickets',
  templateUrl: './add-tickets.component.html',
  styleUrls: ['./add-tickets.component.css'],
})
export class AddTicketsComponent {
  ticketForm: FormGroup;
  attachmentFile: File | null = null;
  ticketStatus = ticketStatus;
  imageBaseUrl = environment.imageBaseUrl;

  constructor(
    private route: Router,
    private ticketService: TicketService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.ticketForm = this.fb.group({
      title: [''],
      description: [''],
      remarks: [''],
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.attachmentFile = event.target.files[0];
    }
  }

  submitTicket() {
    const formData = new FormData();

    formData.append('title', this.ticketForm.get('title')?.value);
    formData.append('description', this.ticketForm.get('description')?.value);
    formData.append('remarks', this.ticketForm.get('remarks')?.value);

    if (this.attachmentFile) {
      formData.append('attachment', this.attachmentFile);
    }

    this.ticketService.addTicket(formData).subscribe((res: any) => {
      if (res && res.isExecute) {
        this.route.navigate(['/tickets']);
      }
    });
  }
}
