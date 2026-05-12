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
