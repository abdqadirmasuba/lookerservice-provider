import * as Linking from 'expo-linking';
import { apiRequests } from './apiRequest';

export type PaymentCreateResponse = {
  provider: string;
  status: string;
  message: string;
  data: {
    error: any;
    merchant_reference: string;
    order_tracking_id: string;
    redirect_url: string;
    status: string;
  };
};

export function createSupportPaymentCallbackUrl() {
  return Linking.createURL('/success', {
    scheme: 'lookerserviceprovider',
  });
}

export async function createPayment(amount: number, phoneNumber: string) {
  const callbackUrl = createSupportPaymentCallbackUrl();

  const payload = {
    id: 'TEST-XXX',
    amount,
    currency: 'UGX',
    description: 'Testing',
    callback: callbackUrl,
    callback_url: callbackUrl,
    notification_id: 'ea0f99fd-9cb4-481a-b70f-da4acafcef51',
    billing_address: {
      email_address: 'john@doe.com',
      phone_number: phoneNumber,
    },
  };

  return apiRequests.post('/payments/create', payload);
}
