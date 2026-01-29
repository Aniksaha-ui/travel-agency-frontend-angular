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

  // New properties for preview
  previewUrl: string | ArrayBuffer | null = null;
  fileType: 'image' | 'other' | null = null;
  fileSize: string = '';
  isDragging = false;

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
      this.handleFile(event.target.files[0]);
    }
  }

  handleFile(file: File) {
    this.attachmentFile = file;
    this.fileSize = this.formatBytes(file.size);

    if (file.type.startsWith('image/')) {
      this.fileType = 'image';
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.fileType = 'other';
      this.previewUrl = null;
    }
  }

  removeFile() {
    this.attachmentFile = null;
    this.previewUrl = null;
    this.fileType = null;
    this.fileSize = '';
    // Reset file input if needed (requires ViewChild usually, but re-render helps)
  }

  onDragOver(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    if (event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
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
