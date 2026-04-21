import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { VisaApplicationSummary } from 'src/app/models/visa.models';
import { VisaService } from 'src/app/service/visa.service';

type DashboardFilter = 'all' | 'active' | 'needs_action' | 'approved';

@Component({
  selector: 'app-visa-dashboard',
  templateUrl: './visa-dashboard.component.html',
  styleUrls: ['./visa-dashboard.component.css'],
})
export class VisaDashboardComponent implements OnInit {
  applications: VisaApplicationSummary[] = [];
  filteredApplications: VisaApplicationSummary[] = [];
  activeFilter: DashboardFilter = 'all';
  isLoading = true;
  loadError = '';
  paymentNotice = '';

  readonly filters: { value: DashboardFilter; label: string }[] = [
    { value: 'all', label: 'All Cases' },
    { value: 'active', label: 'Active' },
    { value: 'needs_action', label: 'Needs Action' },
    { value: 'approved', label: 'Approved' },
  ];

  constructor(private visaService: VisaService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.paymentNotice = this.route.snapshot.queryParamMap.get('payment') || '';
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading = true;
    this.loadError = '';

    this.visaService.getMyApplications().subscribe({
      next: (response) => {
        if (this.visaService.isSuccess(response.isExecute)) {
          this.applications = response.data?.data || [];
          this.applyFilter();
        } else {
          this.loadError = response.message || 'Unable to load visa applications.';
        }

        this.isLoading = false;
      },
      error: (error) => {
        this.loadError = this.visaService.getErrorMessage(
          error,
          'Unable to load visa applications.'
        );
        this.isLoading = false;
      },
    });
  }

  setFilter(filter: DashboardFilter): void {
    this.activeFilter = filter;
    this.applyFilter();
  }

  get totalCases(): number {
    return this.applications.length;
  }

  get activeCases(): number {
    return this.applications.filter((application) =>
      ['draft', 'submitted', 'under_review', 'document_pending', 'processing'].includes(
        application.status
      )
    ).length;
  }

  get needsActionCount(): number {
    return this.applications.filter((application) => application.status === 'document_pending')
      .length;
  }

  get approvedCount(): number {
    return this.applications.filter((application) => application.status === 'approved').length;
  }

  getStatusLabel(status?: string | null): string {
    return this.visaService.getStatusLabel(status);
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

  getPaymentStatusLabel(status?: string | null): string {
    return this.visaService.getPaymentStatusLabel(status);
  }

  canContinueProcessing(application: VisaApplicationSummary): boolean {
    return (
      this.visaService.isEditableStatus(application.status) ||
      (this.visaService.isPayableStatus(application.status) &&
        application.payment_status !== 'paid')
    );
  }

  getApplicationReference(application: VisaApplicationSummary): string {
    return application.application_no || `Visa Application #${application.id}`;
  }

  private applyFilter(): void {
    if (this.activeFilter === 'all') {
      this.filteredApplications = [...this.applications];
      return;
    }

    if (this.activeFilter === 'active') {
      this.filteredApplications = this.applications.filter((application) =>
        ['draft', 'submitted', 'under_review', 'document_pending', 'processing'].includes(
          application.status
        )
      );
      return;
    }

    if (this.activeFilter === 'needs_action') {
      this.filteredApplications = this.applications.filter(
        (application) => application.status === 'document_pending'
      );
      return;
    }

    this.filteredApplications = this.applications.filter(
      (application) => application.status === 'approved'
    );
  }
}
