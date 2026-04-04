import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const checks = {
      GOOGLE_ADS_DEVELOPER_TOKEN: !!Deno.env.get('GOOGLE_ADS_DEVELOPER_TOKEN'),
      GOOGLE_ADS_CLIENT_ID: !!Deno.env.get('GOOGLE_ADS_CLIENT_ID'),
      GOOGLE_ADS_CLIENT_SECRET: !!Deno.env.get('GOOGLE_ADS_CLIENT_SECRET'),
      GOOGLE_ADS_REFRESH_TOKEN: !!Deno.env.get('GOOGLE_ADS_REFRESH_TOKEN'),
      GOOGLE_ADS_CUSTOMER_ID: !!Deno.env.get('GOOGLE_ADS_CUSTOMER_ID'),
    };

    const missingSecrets = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k);
    if (missingSecrets.length > 0) {
      return Response.json({
        success: false,
        step: 'credentials_check',
        error: `Missing secrets: ${missingSecrets.join(', ')}`,
        checks,
      });
    }

    // Step 1: Get access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: Deno.env.get('GOOGLE_ADS_CLIENT_ID'),
        client_secret: Deno.env.get('GOOGLE_ADS_CLIENT_SECRET'),
        refresh_token: Deno.env.get('GOOGLE_ADS_REFRESH_TOKEN'),
        grant_type: 'refresh_token',
      }),
    });

    const tokenJson = await tokenRes.json();
    if (!tokenJson.access_token) {
      return Response.json({
        success: false,
        step: 'oauth_token',
        error: `Token refresh failed: ${tokenJson.error_description || tokenJson.error || 'unknown'}`,
        checks,
      });
    }

    // Step 2: Test API access — list accessible customers
    const customerId = Deno.env.get('GOOGLE_ADS_CUSTOMER_ID').replace(/-/g, '');
    const loginCustomerId = Deno.env.get('GOOGLE_ADS_LOGIN_CUSTOMER_ID');

    const headers = {
      'Authorization': `Bearer ${tokenJson.access_token}`,
      'developer-token': Deno.env.get('GOOGLE_ADS_DEVELOPER_TOKEN'),
      'Content-Type': 'application/json',
    };
    if (loginCustomerId) headers['login-customer-id'] = loginCustomerId.replace(/-/g, '');

    const apiRes = await fetch(
      `https://googleads.googleapis.com/v17/customers/${customerId}/googleAds:search`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ query: 'SELECT customer.id, customer.descriptive_name FROM customer LIMIT 1' }),
      }
    );

    const apiJson = await apiRes.json();

    if (apiJson.error) {
      return Response.json({
        success: false,
        step: 'api_access',
        error: apiJson.error.message || JSON.stringify(apiJson.error),
        checks,
      });
    }

    const customerName = apiJson.results?.[0]?.customer?.descriptiveName || 'Unknown';
    return Response.json({
      success: true,
      message: `Connected successfully to Google Ads account: ${customerName} (ID: ${customerId})`,
      checks,
    });
  } catch (error) {
    return Response.json({ success: false, step: 'unexpected', error: error.message }, { status: 500 });
  }
});