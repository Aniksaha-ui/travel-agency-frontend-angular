import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  VisaApplicantInfoPayload,
  VisaApplicationDetail,
  VisaCountry,
  VisaDocument,
  VisaDraftPayload,
  VisaPaymentMethod,
  VisaPaymentPayload,
  VisaRequirement,
  VisaType,
} from 'src/app/models/visa.models';
import { VisaService } from 'src/app/service/visa.service';

@Component({
  selector: 'app-visa-application-form',
  templateUrl: './visa-application-form.component.html',
  styleUrls: ['./visa-application-form.component.css'],
})
export class VisaApplicationFormComponent implements OnInit {
  applicationId: number | null = null;
  application: VisaApplicationDetail | null = null;
  countries: VisaCountry[] = [];
  visaTypes: VisaType[] = [];
  requirements: VisaRequirement[] = [];

  isLoadingPage = true;
  isSavingDraft = false;
  isSavingApplicant = false;
  isSubmittingApplication = false;
  isPayingApplication = false;
  uploadingDocumentType = '';
  deletingDocumentId: number | null = null;

  pageError = '';
  draftNotice = '';
  applicantNotice = '';
  documentNotice = '';
  submitNotice = '';
  paymentNotice = '';
  paymentQueryState = '';

  documentRemarks: Record<number, string> = {};

  draftForm: FormGroup = this.fb.group({
    country_id: ['', Validators.required],
    visa_type_id: ['', Validators.required],
    booking_id: [''],
    package_booking_id: [''],
    remarks: ['', Validators.maxLength(500)],
  });

  applicantForm: FormGroup = this.fb.group({
    full_name: ['', [Validators.required, Validators.maxLength(150)]],
    passport_number: ['', [Validators.required, Validators.maxLength(50)]],
    passport_expiry: [''],
    date_of_birth: [''],
    nationality: ['', Validators.maxLength(100)],
    phone: ['', Validators.maxLength(20)],
    email: ['', Validators.email],
    address: [''],
  });

  submitForm: FormGroup = this.fb.group({
    remarks: ['', Validators.maxLength(500)],
  });

  paymentForm: FormGroup = this.fb.group({
    amount: ['', [Validators.required, Validators.min(1)]],
    payment_method: ['bkash', Validators.required],
    bkash: [''],
    nagad: [''],
    card: [''],
    booking_id: [''],
    package_booking_id: [''],
  });

  constructor(
    private fb: FormBuilder,
    private visaService: VisaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.paymentQueryState = this.route.snapshot.queryParamMap.get('payment') || '';
    this.applicationId = this.parseOptionalNumber(
      this.route.snapshot.queryParamMap.get('applicationId')
    );

    this.onPaymentMethodChange();
    this.loadCountries();
  }

  loadCountries(): void {
    this.isLoadingPage = true;
    this.pageError = '';

    this.visaService.getCountries().subscribe({
      next: (response) => {
        if (this.visaService.isSuccess(response.isExecute)) {
          this.countries = response.data || [];

          if (this.applicationId) {
            this.loadApplication(this.applicationId);
            return;
          }
        } else {
          this.pageError = response.message || 'Unable to load visa countries.';
        }

        this.isLoadingPage = false;
      },
      error: (error) => {
        this.pageError = this.visaService.getErrorMessage(
          error,
          'Unable to load visa countries.'
        );
        this.isLoadingPage = false;
      },
    });
  }

  loadApplication(applicationId: number): void {
    this.pageError = '';

    this.visaService.getMyApplication(applicationId).subscribe({
      next: (response) => {
        if (this.visaService.isSuccess(response.isExecute)) {
          this.application = response.data;
          this.applicationId = response.data.id;
          this.patchFormsFromApplication(response.data);
        } else {
          this.pageError = response.message || 'Unable to load visa application.';
        }

        this.isLoadingPage = false;
      },
      error: (error) => {
        this.pageError = this.visaService.getErrorMessage(
          error,
          'Unable to load visa application.'
        );
        this.isLoadingPage = false;
      },
    });
  }

  onCountryChange(): void {
    const countryId = this.parseOptionalNumber(this.draftForm.get('country_id')?.value);

    this.visaTypes = [];
    this.requirements = [];
    this.draftForm.patchValue({ visa_type_id: '' });
    this.paymentForm.patchValue({ amount: '' });

    if (countryId) {
      this.loadVisaTypes(countryId);
    }
  }

  onVisaTypeChange(): void {
    const visaTypeId = this.parseOptionalNumber(this.draftForm.get('visa_type_id')?.value);

    this.requirements = [];

    if (visaTypeId) {
      this.loadRequirements(visaTypeId);
      this.syncPaymentAmount();
    }
  }

  onPaymentMethodChange(): void {
    const paymentMethod = this.paymentForm.get('payment_method')?.value as VisaPaymentMethod;
    const bkashControl = this.paymentForm.get('bkash');
    const nagadControl = this.paymentForm.get('nagad');
    const cardControl = this.paymentForm.get('card');

    bkashControl?.clearValidators();
    nagadControl?.clearValidators();
    cardControl?.clearValidators();

    if (paymentMethod === 'bkash') {
      bkashControl?.setValidators([Validators.required, Validators.maxLength(50)]);
    }

    if (paymentMethod === 'nagad') {
      nagadControl?.setValidators([Validators.required, Validators.maxLength(50)]);
    }

    if (paymentMethod === 'card') {
      cardControl?.setValidators([Validators.required, Validators.maxLength(50)]);
    }

    bkashControl?.updateValueAndValidity();
    nagadControl?.updateValueAndValidity();
    cardControl?.updateValueAndValidity();
  }

  saveDraft(): void {
    this.resetMessages();

    if (this.draftForm.invalid) {
      this.draftForm.markAllAsTouched();
      return;
    }

    const payload: VisaDraftPayload = this.cleanDraftPayload();
    this.isSavingDraft = true;

    const request$ = this.applicationId
      ? this.visaService.updateDraft(this.applicationId, payload)
      : this.visaService.createDraft(payload);

    request$.subscribe({
      next: (response) => {
        this.isSavingDraft = false;

        if (!this.visaService.isSuccess(response.isExecute)) {
          this.pageError = response.message || 'Unable to save visa draft.';
          return;
        }

        this.draftNotice = response.message || 'Visa draft saved successfully.';
        const returnedId = response.data?.id || this.applicationId;

        if (returnedId) {
          this.applicationId = returnedId;
          this.updateQueryParams(returnedId);
          this.loadApplication(returnedId);
        }
      },
      error: (error) => {
        this.isSavingDraft = false;
        this.pageError = this.visaService.getErrorMessage(error, 'Unable to save visa draft.');
      },
    });
  }

  saveApplicantInfo(): void {
    this.resetMessages();

    if (!this.applicationId) {
      this.pageError = 'Create the visa draft first.';
      return;
    }

    if (this.applicantForm.invalid) {
      this.applicantForm.markAllAsTouched();
      return;
    }

    const payload = this.cleanApplicantPayload();
    this.isSavingApplicant = true;

    const request$ = this.hasApplicantRecord()
      ? this.visaService.updateApplicantInfo(this.applicationId, payload)
      : this.visaService.storeApplicantInfo({
          ...payload,
          visa_application_id: this.applicationId,
        });

    request$.subscribe({
      next: (response) => {
        this.isSavingApplicant = false;

        if (!this.visaService.isSuccess(response.isExecute)) {
          this.pageError = response.message || 'Unable to save applicant information.';
          return;
        }

        this.applicantNotice = response.message || 'Applicant information saved successfully.';
        this.loadApplication(this.applicationId!);
      },
      error: (error) => {
        this.isSavingApplicant = false;
        this.pageError = this.visaService.getErrorMessage(
          error,
          'Unable to save applicant information.'
        );
      },
    });
  }

  deleteApplicantInfo(): void {
    this.resetMessages();

    if (!this.applicationId || !this.hasApplicantRecord()) {
      return;
    }

    if (!window.confirm('Remove applicant information from this visa application?')) {
      return;
    }

    this.isSavingApplicant = true;

    this.visaService.deleteApplicantInfo(this.applicationId).subscribe({
      next: (response) => {
        this.isSavingApplicant = false;

        if (!this.visaService.isSuccess(response.isExecute)) {
          this.pageError = response.message || 'Unable to delete applicant information.';
          return;
        }

        this.applicantNotice = response.message || 'Applicant information deleted successfully.';
        this.loadApplication(this.applicationId!);
      },
      error: (error) => {
        this.isSavingApplicant = false;
        this.pageError = this.visaService.getErrorMessage(
          error,
          'Unable to delete applicant information.'
        );
      },
    });
  }

  uploadRequirementDocument(requirement: VisaRequirement, event: Event): void {
    this.resetMessages();

    if (!this.applicationId) {
      this.pageError = 'Create the visa draft first.';
      return;
    }

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!this.isAllowedFile(file)) {
      this.pageError = 'Only JPG, JPEG, PNG, and PDF files are allowed.';
      input.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      this.pageError = 'Document size must be 10 MB or less.';
      input.value = '';
      return;
    }

    const existingDocument = this.getRequirementDocument(requirement);
    const remarks = this.documentRemarks[requirement.id] || '';
    this.uploadingDocumentType = requirement.document_name;

    const request$ = existingDocument
      ? this.visaService.updateDocument(existingDocument.id, {
          document_type: requirement.document_name,
          remarks: remarks || undefined,
          file,
        })
      : this.visaService.uploadDocument({
          visa_application_id: this.applicationId,
          document_type: requirement.document_name,
          remarks: remarks || undefined,
          file,
        });

    request$.subscribe({
      next: (response) => {
        this.uploadingDocumentType = '';
        input.value = '';

        if (!this.visaService.isSuccess(response.isExecute)) {
          this.pageError = response.message || 'Unable to upload document.';
          return;
        }

        this.documentRemarks[requirement.id] = '';
        this.documentNotice = response.message || 'Document uploaded successfully.';
        this.loadApplication(this.applicationId!);
      },
      error: (error) => {
        this.uploadingDocumentType = '';
        input.value = '';
        this.pageError = this.visaService.getErrorMessage(error, 'Unable to upload document.');
      },
    });
  }

  deleteDocument(document: VisaDocument): void {
    this.resetMessages();

    if (!window.confirm(`Delete "${document.document_type}" from this application?`)) {
      return;
    }

    this.deletingDocumentId = document.id;

    this.visaService.deleteDocument(document.id).subscribe({
      next: (response) => {
        this.deletingDocumentId = null;

        if (!this.visaService.isSuccess(response.isExecute)) {
          this.pageError = response.message || 'Unable to delete document.';
          return;
        }

        this.documentNotice = response.message || 'Document deleted successfully.';
        this.loadApplication(this.applicationId!);
      },
      error: (error) => {
        this.deletingDocumentId = null;
        this.pageError = this.visaService.getErrorMessage(error, 'Unable to delete document.');
      },
    });
  }

  submitApplication(): void {
    this.resetMessages();

    if (!this.applicationId) {
      this.pageError = 'Create the visa draft first.';
      return;
    }

    if (!this.hasCompleteApplicantInfo()) {
      this.pageError =
        'Complete applicant information before submitting. Full name and passport number are required.';
      return;
    }

    if (!this.hasAllRequiredDocuments()) {
      this.pageError = 'Upload all required documents before submitting.';
      return;
    }

    this.isSubmittingApplication = true;

    this.visaService
      .submitApplication(
        this.applicationId,
        this.normalizeText(this.submitForm.get('remarks')?.value) || undefined
      )
      .subscribe({
        next: (response) => {
          this.isSubmittingApplication = false;

          if (!this.visaService.isSuccess(response.isExecute)) {
            this.pageError = response.message || 'Unable to submit visa application.';
            return;
          }

          this.submitNotice = response.message || 'Visa application submitted successfully.';
          this.loadApplication(this.applicationId!);
        },
        error: (error) => {
          this.isSubmittingApplication = false;
          this.pageError = this.visaService.getErrorMessage(
            error,
            'Unable to submit visa application.'
          );
        },
      });
  }

  payApplication(): void {
    this.resetMessages();

    if (!this.applicationId) {
      this.pageError = 'Create the visa draft first.';
      return;
    }

    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    const amount = Number(this.paymentForm.get('amount')?.value);
    const paymentMethod = this.paymentForm.get('payment_method')?.value as VisaPaymentMethod;

    const payload: VisaPaymentPayload = {
      visa_application_id: this.applicationId,
      amount,
      payment_method: paymentMethod,
      booking_id:
        this.parseOptionalNumber(this.paymentForm.get('booking_id')?.value) ||
        this.application?.booking_id ||
        undefined,
      package_booking_id:
        this.parseOptionalNumber(this.paymentForm.get('package_booking_id')?.value) ||
        this.application?.package_booking_id ||
        undefined,
      bkash: this.normalizeText(this.paymentForm.get('bkash')?.value) || undefined,
      nagad: this.normalizeText(this.paymentForm.get('nagad')?.value) || undefined,
      card: this.normalizeText(this.paymentForm.get('card')?.value) || undefined,
    };

    this.isPayingApplication = true;

    this.visaService.payApplication(payload).subscribe({
      next: (response) => {
        this.isPayingApplication = false;

        if (!this.visaService.isSuccess(response.isExecute)) {
          this.pageError = response.message || 'Unable to process visa payment.';
          return;
        }

        const redirectedUrl = response.data?.redirected_url;

        if (redirectedUrl) {
          window.location.assign(redirectedUrl);
          return;
        }

        const paymentStatus = response.data?.payment_status || 'success';
        this.paymentNotice = response.message || 'Visa payment completed successfully.';
        this.router.navigate(['/visa', this.applicationId], {
          queryParams: { payment: paymentStatus === 'paid' ? 'success' : paymentStatus },
        });
      },
      error: (error) => {
        this.isPayingApplication = false;
        this.pageError = this.visaService.getErrorMessage(
          error,
          'Unable to process visa payment.'
        );
      },
    });
  }

  deleteDraft(): void {
    this.resetMessages();

    if (!this.applicationId || !this.application || this.application.status !== 'draft') {
      return;
    }

    if (!window.confirm('Delete this visa draft permanently?')) {
      return;
    }

    this.isSavingDraft = true;

    this.visaService.deleteDraft(this.applicationId).subscribe({
      next: (response) => {
        this.isSavingDraft = false;

        if (!this.visaService.isSuccess(response.isExecute)) {
          this.pageError = response.message || 'Unable to delete visa draft.';
          return;
        }

        this.router.navigate(['/visa']);
      },
      error: (error) => {
        this.isSavingDraft = false;
        this.pageError = this.visaService.getErrorMessage(error, 'Unable to delete visa draft.');
      },
    });
  }

  hasApplicantRecord(): boolean {
    const applicantInfo = this.application?.applicant_info;

    return !!(
      applicantInfo?.full_name ||
      applicantInfo?.passport_number ||
      applicantInfo?.passport_expiry ||
      applicantInfo?.date_of_birth ||
      applicantInfo?.nationality ||
      applicantInfo?.phone ||
      applicantInfo?.email ||
      applicantInfo?.address
    );
  }

  hasCompleteApplicantInfo(): boolean {
    const applicantInfo = this.application?.applicant_info;

    return !!(
      applicantInfo?.full_name?.trim() &&
      applicantInfo?.passport_number?.trim()
    );
  }

  hasApplicantInfo(): boolean {
    return this.hasCompleteApplicantInfo();
  }

  canEditProcess(): boolean {
    return !this.application || this.visaService.isEditableStatus(this.application.status);
  }

  canSubmitApplication(): boolean {
    return (
      !!this.applicationId &&
      !!this.application &&
      this.visaService.isSubmittableStatus(this.application.status) &&
      this.hasCompleteApplicantInfo() &&
      this.hasAllRequiredDocuments()
    );
  }

  canOpenPayment(): boolean {
    return (
      !!this.application &&
      this.visaService.isPayableStatus(this.application.status) &&
      !this.isPaymentCompleted()
    );
  }

  isPaymentCompleted(): boolean {
    const directStatus = this.application?.payment_status;
    if (directStatus === 'paid') {
      return true;
    }

    return (
      this.application?.payments?.some((payment) => payment.payment_status === 'paid') || false
    );
  }

  getSelectedVisaType(): VisaType | undefined {
    const visaTypeId = this.parseOptionalNumber(this.draftForm.get('visa_type_id')?.value);
    return this.visaTypes.find((visaType) => visaType.id === visaTypeId);
  }

  getSelectedCountryName(): string {
    const countryId = this.parseOptionalNumber(this.draftForm.get('country_id')?.value);
    return this.countries.find((country) => country.id === countryId)?.name || 'Not Selected';
  }

  getApplicationReference(): string {
    return this.application?.application_no || (this.applicationId ? `Draft #${this.applicationId}` : 'New Application');
  }

  isDraftStepComplete(): boolean {
    return !!this.applicationId;
  }

  isApplicantStepComplete(): boolean {
    return this.hasCompleteApplicantInfo();
  }

  isDocumentStepReady(): boolean {
    return !!this.applicationId && !!this.draftForm.get('visa_type_id')?.value;
  }

  isDocumentStepComplete(): boolean {
    return this.isDocumentStepReady() && this.getCompletedRequiredDocumentCount() >= this.getRequiredDocumentCount();
  }

  getRequiredDocumentCount(): number {
    return this.requirements.filter((requirement) => this.isRequirementRequired(requirement)).length;
  }

  getCompletedRequiredDocumentCount(): number {
    return this.requirements
      .filter((requirement) => this.isRequirementRequired(requirement))
      .filter((requirement) => {
        const document = this.getRequirementDocument(requirement);
        return !!document && document.status !== 'rejected';
      }).length;
  }

  getUploadedDocumentCount(): number {
    return this.application?.documents?.length || 0;
  }

  getCompletedStepCount(): number {
    let completedSteps = 0;

    if (this.isDraftStepComplete()) {
      completedSteps += 1;
    }

    if (this.isApplicantStepComplete()) {
      completedSteps += 1;
    }

    if (this.isDocumentStepComplete()) {
      completedSteps += 1;
    }

    if (this.isPaymentCompleted()) {
      completedSteps += 1;
    }

    return completedSteps;
  }

  getRequirementDocument(requirement: VisaRequirement): VisaDocument | undefined {
    return this.application?.documents?.find(
      (document) =>
        document.document_type?.trim().toLowerCase() ===
        requirement.document_name.trim().toLowerCase()
    );
  }

  hasAllRequiredDocuments(): boolean {
    return this.requirements
      .filter((requirement) => this.isRequirementRequired(requirement))
      .every((requirement) => {
        const document = this.getRequirementDocument(requirement);
        return !!document && document.status !== 'rejected';
      });
  }

  isRequirementRequired(requirement: VisaRequirement): boolean {
    return requirement.is_required === true || requirement.is_required === 1;
  }

  getDocumentStatusClass(status?: string | null): string {
    const classMap: Record<string, string> = {
      pending: 'status-pending',
      approved: 'status-approved',
      rejected: 'status-rejected',
    };

    return status ? classMap[status] || 'status-default' : 'status-default';
  }

  getStatusLabel(status?: string | null): string {
    return this.visaService.getStatusLabel(status);
  }

  getPaymentStatusLabel(status?: string | null): string {
    return this.visaService.getPaymentStatusLabel(status);
  }

  getDocumentUrl(document?: VisaDocument | null): string | null {
    return this.visaService.getDocumentUrl(document?.file_path || null);
  }

  setDocumentRemark(requirementId: number, event: Event): void {
    const input = event.target as HTMLTextAreaElement;
    this.documentRemarks[requirementId] = input.value;
  }

  private patchFormsFromApplication(application: VisaApplicationDetail): void {
    this.draftForm.patchValue({
      country_id: application.country_id || '',
      visa_type_id: application.visa_type_id || '',
      booking_id: application.booking_id || '',
      package_booking_id: application.package_booking_id || '',
      remarks: application.remarks || '',
    });

    this.applicantForm.patchValue({
      full_name: application.applicant_info?.full_name || '',
      passport_number: application.applicant_info?.passport_number || '',
      passport_expiry: application.applicant_info?.passport_expiry || '',
      date_of_birth: application.applicant_info?.date_of_birth || '',
      nationality: application.applicant_info?.nationality || '',
      phone: application.applicant_info?.phone || '',
      email: application.applicant_info?.email || '',
      address: application.applicant_info?.address || '',
    });

    this.submitForm.patchValue({
      remarks: application.remarks || '',
    });

    this.paymentForm.patchValue({
      booking_id: application.booking_id || '',
      package_booking_id: application.package_booking_id || '',
    });

    if (application.country_id) {
      this.loadVisaTypes(application.country_id, application.visa_type_id || undefined);
    } else {
      this.visaTypes = [];
    }

    if (application.visa_type_id) {
      this.loadRequirements(application.visa_type_id);
    } else {
      this.requirements = [];
    }

    this.syncPaymentAmount();
  }

  private loadVisaTypes(countryId: number, selectedVisaTypeId?: number): void {
    this.visaService.getVisaTypes(countryId).subscribe({
      next: (response) => {
        if (this.visaService.isSuccess(response.isExecute)) {
          this.visaTypes = response.data || [];

          if (selectedVisaTypeId) {
            this.draftForm.patchValue({
              visa_type_id: selectedVisaTypeId,
            });
          }

          this.syncPaymentAmount();
        } else {
          this.pageError = response.message || 'Unable to load visa types.';
        }
      },
      error: (error) => {
        this.pageError = this.visaService.getErrorMessage(error, 'Unable to load visa types.');
      },
    });
  }

  private loadRequirements(visaTypeId: number): void {
    this.visaService.getRequirements(visaTypeId).subscribe({
      next: (response) => {
        if (this.visaService.isSuccess(response.isExecute)) {
          this.requirements = response.data || [];
        } else {
          this.pageError = response.message || 'Unable to load required documents.';
        }
      },
      error: (error) => {
        this.pageError = this.visaService.getErrorMessage(
          error,
          'Unable to load required documents.'
        );
      },
    });
  }

  private syncPaymentAmount(): void {
    const selectedVisaType = this.getSelectedVisaType();
    const fee = Number(selectedVisaType?.fee || 0);

    if (!fee || this.isPaymentCompleted()) {
      return;
    }

    this.paymentForm.patchValue({
      amount: fee,
      booking_id:
        this.parseOptionalNumber(this.draftForm.get('booking_id')?.value) ||
        this.application?.booking_id ||
        '',
      package_booking_id:
        this.parseOptionalNumber(this.draftForm.get('package_booking_id')?.value) ||
        this.application?.package_booking_id ||
        '',
    });
  }

  private cleanDraftPayload(): VisaDraftPayload {
    return {
      country_id: Number(this.draftForm.get('country_id')?.value),
      visa_type_id: Number(this.draftForm.get('visa_type_id')?.value),
      booking_id: this.parseOptionalNumber(this.draftForm.get('booking_id')?.value) || undefined,
      package_booking_id:
        this.parseOptionalNumber(this.draftForm.get('package_booking_id')?.value) || undefined,
      remarks: this.normalizeText(this.draftForm.get('remarks')?.value) || undefined,
    };
  }

  private cleanApplicantPayload(): VisaApplicantInfoPayload {
    return {
      full_name: this.normalizeText(this.applicantForm.get('full_name')?.value),
      passport_number: this.normalizeText(
        this.applicantForm.get('passport_number')?.value
      ).toUpperCase(),
      passport_expiry: this.applicantForm.get('passport_expiry')?.value || undefined,
      date_of_birth: this.applicantForm.get('date_of_birth')?.value || undefined,
      nationality: this.normalizeText(this.applicantForm.get('nationality')?.value) || undefined,
      phone: this.normalizeText(this.applicantForm.get('phone')?.value) || undefined,
      email: this.normalizeText(this.applicantForm.get('email')?.value) || undefined,
      address: this.normalizeText(this.applicantForm.get('address')?.value) || undefined,
    };
  }

  private normalizeText(value: any): string {
    return String(value || '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private parseOptionalNumber(value: any): number | null {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  private updateQueryParams(applicationId: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        applicationId,
      },
      queryParamsHandling: 'merge',
    });
  }

  private isAllowedFile(file: File): boolean {
    return ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
  }

  private resetMessages(): void {
    this.pageError = '';
    this.draftNotice = '';
    this.applicantNotice = '';
    this.documentNotice = '';
    this.submitNotice = '';
    this.paymentNotice = '';
  }
}
