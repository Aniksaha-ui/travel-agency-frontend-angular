export interface VisaApiResponse<T> {
  isExecute: string | boolean;
  data: T;
  message: string;
  errors?: Record<string, string[]>;
}

export interface VisaPaginatedResponse<T> {
  current_page: number;
  data: T[];
  last_page: number;
  total: number;
}

export type VisaApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'document_pending'
  | 'processing'
  | 'approved'
  | 'rejected';

export type VisaDocumentStatus = 'pending' | 'approved' | 'rejected';

export type VisaPaymentStatus = 'pending' | 'paid' | 'failed' | 'cancelled';

export type VisaPaymentMethod = 'card' | 'bkash' | 'nagad' | 'internet_banking';

export interface VisaCountry {
  id: number;
  name: string;
  iso_code: string;
  flag?: string | null;
  is_popular?: number | boolean;
  status?: number | boolean;
}

export interface VisaType {
  id: number;
  country_id: number;
  visa_name: string;
  processing_days?: number | null;
  fee?: number | string | null;
  description?: string | null;
  country_name?: string;
  country_iso_code?: string;
  country_flag?: string | null;
}

export interface VisaRequirement {
  id: number;
  visa_type_id: number;
  document_name: string;
  is_required: number | boolean;
  created_at?: string;
  updated_at?: string;
}

export interface VisaApplicantInfo {
  full_name?: string | null;
  passport_number?: string | null;
  passport_expiry?: string | null;
  date_of_birth?: string | null;
  nationality?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}

export interface VisaDocument {
  id: number;
  visa_application_id: number;
  document_type: string;
  remarks?: string | null;
  status: VisaDocumentStatus | string;
  file_path?: string | null;
  uploaded_by_name?: string | null;
  reviewed_by_name?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface VisaPayment {
  id?: number;
  visa_payment_id?: number | null;
  payment_id?: number | null;
  booking_id?: number | null;
  amount?: number | string | null;
  payment_status?: VisaPaymentStatus | string | null;
  payment_method?: VisaPaymentMethod | string | null;
  transaction_reference?: string | null;
  redirected_url?: string | null;
  created_at?: string;
}

export interface VisaStatusLog {
  id: number;
  old_status?: string | null;
  new_status?: string | null;
  note?: string | null;
  changed_by_name?: string | null;
  created_at?: string;
}

export interface VisaApplicationSummary {
  id: number;
  application_no?: string | null;
  country_id?: number | null;
  visa_type_id?: number | null;
  visa_package_id?: number | null;
  booking_id?: number | null;
  package_booking_id?: number | null;
  country_name?: string | null;
  visa_name?: string | null;
  status: VisaApplicationStatus | string;
  remarks?: string | null;
  assigned_officer_name?: string | null;
  payment_status?: VisaPaymentStatus | string | null;
  applied_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface VisaApplicationDetail extends VisaApplicationSummary {
  applicant_info?: VisaApplicantInfo | null;
  documents?: VisaDocument[];
  payments?: VisaPayment[];
  required_documents?: VisaRequirement[];
  status_logs?: VisaStatusLog[];
}

export interface VisaDraftPayload {
  country_id: number;
  visa_type_id: number;
  booking_id?: number;
  package_booking_id?: number;
  remarks?: string;
}

export interface VisaApplicantInfoPayload {
  visa_application_id?: number;
  full_name: string;
  passport_number: string;
  passport_expiry?: string;
  date_of_birth?: string;
  nationality?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface VisaDocumentPayload {
  visa_application_id: number;
  document_type: string;
  remarks?: string;
  file: File;
}

export interface VisaPaymentPayload {
  visa_application_id: number;
  amount: number;
  payment_method: VisaPaymentMethod;
  booking_id?: number;
  package_booking_id?: number;
  bkash?: string;
  nagad?: string;
  card?: string;
}
