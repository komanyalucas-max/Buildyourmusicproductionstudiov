// Pesapal API 3.0 Integration Service
// Tanzania Merchant Credentials

const PESAPAL_CONFIG = {
    consumer_key: 'ngW+UEcnDhltUc5fxPfrCD987xMh3Lx8',
    consumer_secret: 'q27RChYs5UkypdcNYKzuUw460Dg=',
    ipn_id: 'c3c20000-d0cd-40ca-9f24-daee228440a6',
    // Use sandbox for testing, switch to live for production
    base_url: 'https://cybqa.pesapal.com/pesapalv3', // Sandbox
    // base_url: 'https://pay.pesapal.com/v3', // Live/Production
};

interface PesapalAuthResponse {
    token: string;
    expiryDate: string;
    error: any;
    status: string;
    message: string;
}

interface PesapalOrderRequest {
    id: string; // Merchant reference (order ID)
    currency: string;
    amount: number;
    description: string;
    callback_url: string;
    cancellation_url?: string;
    notification_id: string;
    branch?: string;
    billing_address: {
        email_address?: string;
        phone_number?: string;
        country_code?: string;
        first_name?: string;
        middle_name?: string;
        last_name?: string;
        line_1?: string;
        line_2?: string;
        city?: string;
        state?: string;
        postal_code?: string;
        zip_code?: string;
    };
    redirect_mode?: 'TOP_WINDOW' | 'PARENT_WINDOW';
}

interface PesapalOrderResponse {
    order_tracking_id: string;
    merchant_reference: string;
    redirect_url: string;
    error: any;
    status: string;
    message?: string;
}

interface PesapalTransactionStatus {
    payment_method: string;
    amount: number;
    created_date: string;
    confirmation_code: string;
    payment_status_description: string;
    description: string;
    message: string;
    payment_account: string;
    call_back_url: string;
    status_code: number; // 0=INVALID, 1=COMPLETED, 2=FAILED, 3=REVERSED
    merchant_reference: string;
    currency: string;
    error: any;
    status: string;
}

class PesapalService {
    private token: string | null = null;
    private tokenExpiry: Date | null = null;

    /**
     * Get authentication token (valid for 5 minutes)
     */
    async getAuthToken(): Promise<string> {
        // Check if we have a valid token
        if (this.token && this.tokenExpiry && new Date() < this.tokenExpiry) {
            return this.token;
        }

        try {
            const response = await fetch(`${PESAPAL_CONFIG.base_url}/api/Auth/RequestToken`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    consumer_key: PESAPAL_CONFIG.consumer_key,
                    consumer_secret: PESAPAL_CONFIG.consumer_secret,
                }),
            });

            if (!response.ok) {
                throw new Error(`Authentication failed: ${response.statusText}`);
            }

            const data: PesapalAuthResponse = await response.json();

            if (data.status !== '200' || !data.token) {
                throw new Error(data.message || 'Failed to get authentication token');
            }

            this.token = data.token;
            this.tokenExpiry = new Date(data.expiryDate);

            return this.token;
        } catch (error) {
            console.error('Pesapal authentication error:', error);
            throw error;
        }
    }

    /**
     * Submit order request to Pesapal
     */
    async submitOrder(orderData: PesapalOrderRequest): Promise<PesapalOrderResponse> {
        try {
            const token = await this.getAuthToken();

            const response = await fetch(`${PESAPAL_CONFIG.base_url}/api/Transactions/SubmitOrderRequest`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                throw new Error(`Order submission failed: ${response.statusText}`);
            }

            const data: PesapalOrderResponse = await response.json();

            if (data.status !== '200') {
                throw new Error(data.message || 'Failed to submit order');
            }

            return data;
        } catch (error) {
            console.error('Pesapal order submission error:', error);
            throw error;
        }
    }

    /**
     * Get transaction status
     */
    async getTransactionStatus(orderTrackingId: string): Promise<PesapalTransactionStatus> {
        try {
            const token = await this.getAuthToken();

            const response = await fetch(
                `${PESAPAL_CONFIG.base_url}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to get transaction status: ${response.statusText}`);
            }

            const data: PesapalTransactionStatus = await response.json();

            if (data.status !== '200') {
                throw new Error(data.message || 'Failed to get transaction status');
            }

            return data;
        } catch (error) {
            console.error('Pesapal transaction status error:', error);
            throw error;
        }
    }

    /**
     * Cancel order
     */
    async cancelOrder(orderTrackingId: string): Promise<{ status: string; message: string }> {
        try {
            const token = await this.getAuthToken();

            const response = await fetch(`${PESAPAL_CONFIG.base_url}/api/Transactions/CancelOrder`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    order_tracking_id: orderTrackingId,
                }),
            });

            if (!response.ok) {
                throw new Error(`Order cancellation failed: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Pesapal order cancellation error:', error);
            throw error;
        }
    }

    /**
     * Get registered IPN URLs
     */
    async getRegisteredIPNs(): Promise<any[]> {
        try {
            const token = await this.getAuthToken();

            const response = await fetch(`${PESAPAL_CONFIG.base_url}/api/URLSetup/GetIpnList`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to get IPNs: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Pesapal get IPNs error:', error);
            throw error;
        }
    }

    /**
     * Helper: Create order request from order data
     */
    createOrderRequest(
        orderId: string,
        amount: number,
        customerEmail: string,
        customerName: string,
        customerPhone?: string,
        description?: string
    ): PesapalOrderRequest {
        const [firstName, ...lastNameParts] = customerName.split(' ');
        const lastName = lastNameParts.join(' ');

        return {
            id: orderId,
            currency: 'TZS', // Tanzanian Shilling
            amount: amount,
            description: description || `Order ${orderId}`,
            callback_url: `${window.location.origin}/payment-callback`,
            cancellation_url: `${window.location.origin}/payment-cancelled`,
            notification_id: PESAPAL_CONFIG.ipn_id,
            branch: 'Studio Builder - Online',
            billing_address: {
                email_address: customerEmail,
                phone_number: customerPhone,
                country_code: 'TZ',
                first_name: firstName,
                last_name: lastName || '',
            },
            redirect_mode: 'PARENT_WINDOW',
        };
    }

    /**
     * Get payment status description
     */
    getStatusDescription(statusCode: number): string {
        switch (statusCode) {
            case 0:
                return 'INVALID';
            case 1:
                return 'COMPLETED';
            case 2:
                return 'FAILED';
            case 3:
                return 'REVERSED';
            default:
                return 'UNKNOWN';
        }
    }
}

export const pesapalService = new PesapalService();
export type { PesapalOrderRequest, PesapalOrderResponse, PesapalTransactionStatus };
