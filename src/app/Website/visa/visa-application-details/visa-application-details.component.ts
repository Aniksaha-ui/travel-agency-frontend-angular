import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { VisaApplicationDetail, VisaDocument, VisaPayment, VisaStatusLog } from 'src/app/models/visa.models';
import { VisaService } from 'src/app/service/visa.service';

@Component({
  selector: 'app-visa-application-details',
  templateUrl: './visa-application-details.component.html',
  styleUrls: ['./visa-application-details.component.css'],
})
export class VisaApplicationDetailsComponent implements OnInit {
  application: VisaApplicationDetail | null = null;
  isLoading = true;
  loadError = '';
  paymentNotice = '';

  constructor(private route: ActivatedRoute, private visaService: VisaService) {}

  ngOnInit(): void {
    const applicationId = Number(this.route.snapshot.paramMap.get('id'));
    this.paymentNotice = this.route.snapshot.queryParamMap.get('payment') || '';

    if (!applicationId) {
      this.loadError = 'Visa application not found.';
      this.isLoading = false;
      return;
    }

    this.loadApplication(applicationId);
  }

  getStatusLabel(status?: string | null): string {
    return this.visaService.getStatusLabel(status);
  }

  getPaymentStatusLabel(status?: string | null): string {
    return this.visaService.getPaymentStatusLabel(status);
  }

  getStatusClass(status?: string | null): string {
    const classMap: Record<string, string> = {
      draft: 'status-draft',
      submitted: 'status-submitted',
      under_review: 'status-under_review',
      document_pending: 'status-document_pending',
      processing: 'status-processing',
      approved: 'status-approved',
      rejected: 'status-rejected',
    };

    return status ? classMap[status] || 'status-default' : 'status-default';
  }

  getDocumentStatusClass(status?: string | null): string {
    const classMap: Record<string, string> = {
      pending: 'status-pending',
      approved: 'status-approved',
      rejected: 'status-rejected',
    };

    return status ? classMap[status] || 'status-default' : 'status-default';
  }

  getApplicationReference(): string {
    return this.application?.application_no || (this.application ? `Visa Application #${this.application.id}` : 'Visa Application');
  }

  maskPassport(passportNumber?: string | null): string {
    if (!passportNumber) {
      return 'Not Provided';
    }

    if (passportNumber.length <= 4) {
      return passportNumber;
    }

    return `${passportNumber.slice(0, 2)}${'*'.repeat(passportNumber.length - 4)}${passportNumber.slice(-2)}`;
  }

  getLatestPayment(): VisaPayment | null {
    return this.application?.payments?.[0] || null;
  }

  getDocumentUrl(document?: VisaDocument | null): string | null {
    return this.visaService.getDocumentUrl(document?.file_path || null);
  }

  getStatusLogTitle(log: VisaStatusLog): string {
    if (log.old_status && log.new_status) {
      return `${this.getStatusLabel(log.old_status)} to ${this.getStatusLabel(log.new_status)}`;
    }

    return this.getStatusLabel(log.new_status || log.old_status || 'updated');
  }

  canContinueProcessing(): boolean {
    if (!this.application) {
      return false;
    }

    const hasPaidStatus =
      this.application.payment_status === 'paid' ||
      this.application.payments?.some((payment) => payment.payment_status === 'paid');

    return (
      this.visaService.isEditableStatus(this.application.status) ||
      (this.visaService.isPayableStatus(this.application.status) && !hasPaidStatus)
    );
  }

  private loadApplication(applicationId: number): void {
    this.isLoading = true;
    this.loadError = '';

    this.visaService.getMyApplication(applicationId).subscribe({
      next: (response) => {
        if (this.visaService.isSuccess(response.isExecute)) {
          this.application = response.data;
        } else {
          this.loadError = response.message || 'Unable to load visa application details.';
        }

        this.isLoading = false;
      },
      error: (error) => {
        this.loadError = this.visaService.getErrorMessage(
          error,
          'Unable to load visa application details.'
        );
        this.isLoading = false;
      },
    });
  }
}
