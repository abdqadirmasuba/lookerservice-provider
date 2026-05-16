// ── List endpoint shapes ──────────────────────────────────────────────────────

/** Service entry returned in the list (GET …/direct) */
export interface DirectRequestServiceSummary {
  service_name: string;
  icon_url: string;
}

/** Single card returned by GET …/direct */
export interface DirectRequestSummary {
  id: string;
  request_number: string;
  status: 'open' | 'closed' | 'in_progress' | 'completed' | 'cancelled';
  provider_response: 'pending' | 'accepted' | 'rejected';
  client_name: string;
  client_picture: string | null;
  services: DirectRequestServiceSummary[];
  created_at: string;
}

// ── Detail endpoint shapes ────────────────────────────────────────────────────

/** One priced line-item inside a service */
export interface ServiceRequestItem {
  label: string;
  amount: number;
  currency: string;
}

/** Service entry returned in the detail (GET …/:id) */
export interface DirectRequestServiceDetail {
  id: string;
  service_name: string;
  service_icon: string;
  items: ServiceRequestItem[];
}

/** Full request object returned by GET …/:id */
export interface DirectRequestDetail {
  id: string;
  request_number: string;
  request_type: string;
  status: 'open' | 'closed' | 'in_progress' | 'completed' | 'cancelled';
  provider_response: 'pending' | 'accepted' | 'rejected';
  response_message: string | null;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  budget_min: number | null;
  budget_max: number | null;
  preferred_date: string | null;
  deadline: string | null;
  images: string[] | string;
  services: DirectRequestServiceDetail[];
  client_name: string;
  client_email: string;
  client_phone: string | null;
  client_picture: string | null;
  bid_count: number;
  has_bid: boolean;
  created_at: string;
}

// ── Legacy shape (kept for any remaining usages) ──────────────────────────────

export interface ServiceRequestService {
  category_icon?: string;
  category_name: string;
  id: string;
  service_icon?: string | null;
  service_name: string;
  title: string;
}

export interface ProviderResponse {
  provider_response_type: 'pending' | 'accepted' | 'rejected';
  valid: boolean;
}

export interface ServiceRequest {
  id: string;
  request_number: string;
  client_id: string;
  request_type: string;
  target_provider_id: string;
  provider_response: ProviderResponse;
  response_message: string | null;
  responded_at: string | null;
  description: string;
  location: string;
  address: string;
  city: string;
  budget_min: number;
  budget_max: number;
  preferred_date: string;
  deadline: string;
  images: string;
  status: 'open' | 'closed' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  client_picture: string | null;
  services: ServiceRequestService[];
  bid_count?: number;
  has_bid?: boolean;
}

export interface ServiceRequestsResponse {
  success: boolean;
  message: string;
  data: ServiceRequest[];
}

export interface ServiceRequestDetailResponse {
  success: boolean;
  message: string;
  data: ServiceRequest;
}

export interface AcceptRequestPayload {
  provider_id: string;
  request_id: string;
}

export interface RejectRequestPayload {
  provider_id: string;
  request_id: string;
  reason?: string;
}
