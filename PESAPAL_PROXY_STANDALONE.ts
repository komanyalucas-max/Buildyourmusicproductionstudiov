// Pesapal Proxy - Supabase Edge Function
// Copy this entire file to Supabase Dashboard

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PESAPAL_CONFIG = {
    consumer_key: 'ngW+UEcnDhltUc5fxPfrCD987xMh3Lx8',
    consumer_secret: 'q27RChYs5UkypdcNYKzuUw460Dg=',
    ipn_id: 'c3c20000-d0cd-40ca-9f24-daee228440a6',
    base_url: 'https://cybqa.pesapal.com/pesapalv3', // Sandbox
};

interface PesapalAuthResponse {
    token: string;
    expiryDate: string;
    error: any;
    status: string;
    message: string;
}

// Token cache (in-memory, resets on cold start)
let cachedToken: string | null = null;
let tokenExpiry: Date | null = null;

async function getAuthToken(): Promise<string> {
    // Check if we have a valid cached token
    if (cachedToken && tokenExpiry && new Date() < tokenExpiry) {
        return cachedToken;
    }

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

    cachedToken = data.token;
    tokenExpiry = new Date(data.expiryDate);

    return cachedToken;
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { action, ...payload } = await req.json();

        switch (action) {
            case 'auth': {
                const token = await getAuthToken();
                return new Response(
                    JSON.stringify({ token, success: true }),
                    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                );
            }

            case 'submit-order': {
                const token = await getAuthToken();
                const response = await fetch(
                    `${PESAPAL_CONFIG.base_url}/api/Transactions/SubmitOrderRequest`,
                    {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify(payload.orderData),
                    }
                );

                const data = await response.json();
                return new Response(
                    JSON.stringify(data),
                    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                );
            }

            case 'get-status': {
                const token = await getAuthToken();
                const response = await fetch(
                    `${PESAPAL_CONFIG.base_url}/api/Transactions/GetTransactionStatus?orderTrackingId=${payload.orderTrackingId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();
                return new Response(
                    JSON.stringify(data),
                    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                );
            }

            case 'cancel-order': {
                const token = await getAuthToken();
                const response = await fetch(
                    `${PESAPAL_CONFIG.base_url}/api/Transactions/CancelOrder`,
                    {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            order_tracking_id: payload.orderTrackingId,
                        }),
                    }
                );

                const data = await response.json();
                return new Response(
                    JSON.stringify(data),
                    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                );
            }

            case 'get-ipns': {
                const token = await getAuthToken();
                const response = await fetch(
                    `${PESAPAL_CONFIG.base_url}/api/URLSetup/GetIpnList`,
                    {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();
                return new Response(
                    JSON.stringify(data),
                    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                );
            }

            default:
                return new Response(
                    JSON.stringify({ error: 'Invalid action' }),
                    { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                );
        }
    } catch (error: any) {
        console.error('Pesapal proxy error:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
