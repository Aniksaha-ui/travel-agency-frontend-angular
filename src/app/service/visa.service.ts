import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  VisaApiResponse,
  VisaApplicantInfoPayload,
  VisaApplicationDetail,
  VisaApplicationSummary,
  VisaCollectionResponse,
  VisaCountry,
  VisaDocument,
  VisaDocumentPayload,
  VisaDraftPayload,
  VisaPaginatedResponse,
  VisaPayment,
  VisaPaymentPayload,
  VisaRequirement,
  VisaType,
} from '../models/visa.models';

@Injectable({
  providedIn: 'root',
})
export class VisaService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getCountries(search?: string) {
    return this.http.get<VisaApiResponse<VisaCountry[]>>(`${this.baseUrl}/countries`, {
      params: this.buildParams({ search }),
    });
  }

  getVisaTypes(countryId?: number | null, search?: string) {
    return this.http.get<VisaApiResponse<VisaCollectionResponse<VisaType>>>(
      `${this.baseUrl}/visa-types`,
      {
        params: this.buildParams({
          country_id: countryId ?? undefined,
          search,
        }),
      }
    );
  }

  getRequirements(visaTypeId: number) {
    return this.http.get<VisaApiResponse<VisaRequirement[]>>(
      `${this.baseUrl}/visa/requirements`,
      {
        params: this.buildParams({ visa_type_id: visaTypeId }),
      }
    );
  }

  createDraft(payload: VisaDraftPayload) {
    return this.http.post<VisaApiResponse<VisaApplicationDetail>>(
      `${this.baseUrl}/visa/apply`,
      payload
    );
  }

  updateDraft(applicationId: number, payload: Partial<VisaDraftPayload>) {
    return this.http.post<VisaApiResponse<VisaApplicationDetail>>(
      `${this.baseUrl}/visa/update/${applicationId}`,
      payload
    );
  }

  deleteDraft(applicationId: number) {
    return this.http.delete<VisaApiResponse<unknown>>(`${this.baseUrl}/visa/${applicationId}`);
  }

  storeApplicantInfo(payload: VisaApplicantInfoPayload) {
    return this.http.post<VisaApiResponse<VisaApplicationDetail>>(
      `${this.baseUrl}/visa/applicant-info`,
      payload
    );
  }

  updateApplicantInfo(applicationId: number, payload: Partial<VisaApplicantInfoPayload>) {
    return this.http.post<VisaApiResponse<VisaApplicationDetail>>(
      `${this.baseUrl}/visa/applicant-info/update/${applicationId}`,
      payload
    );
  }

  deleteApplicantInfo(applicationId: number) {
    return this.http.delete<VisaApiResponse<unknown>>(
      `${this.baseUrl}/visa/applicant-info/${applicationId}`
    );
  }

  uploadDocument(payload: VisaDocumentPayload) {
    const formData = new FormData();
    formData.append('visa_application_id', String(payload.visa_application_id));
    formData.append('document_type', payload.document_type);
    if (payload.remarks) {
      formData.append('remarks', payload.remarks);
    }
    formData.append('file', payload.file);

    return this.http.post<VisaApiResponse<VisaDocument>>(
      `${this.baseUrl}/visa/upload-document`,
      formData
    );
  }

  updateDocument(documentId: number, payload: Omit<VisaDocumentPayload, 'visa_application_id'>) {
    const formData = new FormData();
    formData.append('document_type', payload.document_type);
    if (payload.remarks) {
      formData.append('remarks', payload.remarks);
    }
    formData.append('file', payload.file);

    return this.http.post<VisaApiResponse<VisaDocument>>(
      `${this.baseUrl}/visa/document/update/${documentId}`,
      formData
    );
  }

  deleteDocument(documentId: number) {
    return this.http.delete<VisaApiResponse<unknown>>(
      `${this.baseUrl}/visa/document/${documentId}`
    );
  }

  submitApplication(applicationId: number, remarks?: string) {
    return this.http.post<VisaApiResponse<VisaApplicationDetail>>(
      `${this.baseUrl}/visa/submit`,
      this.cleanPayload({
        visa_application_id: applicationId,
        remarks,
      })
    );
  }

  payApplication(payload: VisaPaymentPayload) {
    return this.http.post<VisaApiResponse<VisaPayment>>(`${this.baseUrl}/visa/pay`, payload);
  }

  getMyApplications(search?: string, status?: string, page?: number) {
    return this.http.get<VisaApiResponse<VisaPaginatedResponse<VisaApplicationSummary>>>(
      `${this.baseUrl}/visa/my-applications`,
      {
        params: this.buildParams({
          search,
          status,
          page,
        }),
      }
    );
  }

  getMyApplication(applicationId: number) {
    return this.http.get<VisaApiResponse<VisaApplicationDetail>>(
      `${this.baseUrl}/visa/my-applications/${applicationId}`
    );
  }

  isSuccess(status: string | boolean | undefined): boolean {
    return status === true || status === 'SUCCESS';
  }

  getStatusLabel(status?: string | null): string {
    const labels: Record<string, string> = {
      draft: 'Draft',
      submitted: 'Submitted',
      under_review: 'Under Review',
      document_pending: 'Document Pending',
      processing: 'Processing',
      approved: 'Approved',
      rejected: 'Rejected',
    };

    return status ? labels[status] ?? this.toTitleCase(status) : 'Unknown';
  }

  getPaymentStatusLabel(status?: string | null): string {
    const labels: Record<string, string> = {
      pending: 'Pending',
      paid: 'Paid',
      failed: 'Failed',
      cancelled: 'Cancelled',
    };

    return status ? labels[status] ?? this.toTitleCase(status) : 'Unknown';
  }

  isEditableStatus(status?: string | null): boolean {
    return status === 'draft' || status === 'document_pending';
  }

  isSubmittableStatus(status?: string | null): boolean {
    return status === 'draft' || status === 'document_pending';
  }

  isPayableStatus(status?: string | null): boolean {
    return (
      status === 'submitted' ||
      status === 'under_review' ||
      status === 'document_pending' ||
      status === 'processing' ||
      status === 'approved'
    );
  }

  isFinalStatus(status?: string | null): boolean {
    return status === 'approved' || status === 'rejected';
  }

  getDocumentUrl(filePath?: string | null): string | null {
    if (!filePath) {
      return null;
    }

    if (/^https?:\/\//i.test(filePath)) {
      return filePath;
    }

    return `${environment.imageBaseUrl}${filePath}`;
  }

  getErrorMessage(error: any, fallback = 'Request failed. Please try again.'): string {
    if (error?.error?.message) {
      return error.error.message;
    }

    if (error?.message) {
      return error.message;
    }

    return fallback;
  }

  extractCollectionItems<T>(payload?: VisaCollectionResponse<T> | null): T[] {
    if (Array.isArray(payload)) {
      return payload;
    }

    if (payload && Array.isArray(payload.data)) {
      return payload.data;
    }

    return [];
  }

  private buildParams(params: Record<string, string | number | undefined | null>) {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    });

    return httpParams;
  }

  private cleanPayload<T extends Record<string, any>>(payload: T): Partial<T> {
    return Object.entries(payload).reduce((cleaned, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        cleaned[key as keyof T] = value;
      }
      return cleaned;
    }, {} as Partial<T>);
  }

  private toTitleCase(value: string): string {
    return value
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }
}
