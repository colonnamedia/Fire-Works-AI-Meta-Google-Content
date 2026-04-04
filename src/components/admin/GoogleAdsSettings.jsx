import React, { useState } from "react";
import { CheckCircle, XCircle, Loader2, Wifi, Key, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

const SECRETS = [
  { key: "GOOGLE_ADS_DEVELOPER_TOKEN", label: "Developer Token", hint: "From your Google Ads manager account → Tools → API Center" },
  { key: "GOOGLE_ADS_CLIENT_ID", label: "Client ID", hint: "OAuth2 Client ID from Google Cloud Console" },
  { key: "GOOGLE_ADS_CLIENT_SECRET", label: "Client Secret", hint: "OAuth2 Client Secret from Google Cloud Console" },
  { key: "GOOGLE_ADS_REFRESH_TOKEN", label: "Refresh Token", hint: "Generated via OAuth2 flow with Google Ads scope" },
  { key: "GOOGLE_ADS_CUSTOMER_ID", label: "Customer ID", hint: "Your Google Ads account ID (no dashes, e.g. 1234567890)" },
  { key: "GOOGLE_ADS_LOGIN_CUSTOMER_ID", label: "Login Customer ID (MCC)", hint: "Manager account ID — only needed if accessing via a manager account" },
];

export default function GoogleAdsSettings() {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await base44.functions.invoke("testGoogleAdsConnection", {});
      setTestResult(res.data);
    } catch (err) {
      setTestResult({ success: false, error: err.message });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Key className="w-5 h-5 text-primary" /> Google Ads API Settings
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Used to enhance Google Ads keyword recommendations with real search volume data. All credentials are stored securely as backend secrets.
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-blue-800">
          <p className="font-semibold mb-1">How to set credentials</p>
          <p className="text-blue-700 text-xs">
            Go to <strong>Dashboard → Settings → Environment Variables</strong> and add the secrets listed below.
            These credentials are never exposed to the frontend.
          </p>
        </div>
      </div>

      {/* Secrets table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="divide-y divide-border">
          {SECRETS.map(s => (
            <div key={s.key} className="px-5 py-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono font-semibold text-foreground">{s.key}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.hint}</p>
              </div>
              <div className="text-xs text-muted-foreground shrink-0 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Test Connection */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-1">Test Connection</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Verify your credentials are correct and the Google Ads API is accessible.
        </p>

        <Button onClick={handleTestConnection} disabled={testing} variant="outline">
          {testing ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Testing...</>
          ) : (
            <><Wifi className="w-4 h-4 mr-2" />Test Connection</>
          )}
        </Button>

        {testResult && (
          <div className={`mt-4 p-4 rounded-xl border text-sm ${testResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
            <div className="flex items-center gap-2 mb-2">
              {testResult.success
                ? <CheckCircle className="w-4 h-4 text-green-600" />
                : <XCircle className="w-4 h-4 text-red-600" />}
              <span className={`font-semibold ${testResult.success ? "text-green-800" : "text-red-800"}`}>
                {testResult.success ? "Connected Successfully" : `Failed at: ${testResult.step || "unknown"}`}
              </span>
            </div>
            <p className={`text-xs ${testResult.success ? "text-green-700" : "text-red-700"}`}>
              {testResult.message || testResult.error}
            </p>
            {testResult.checks && (
              <div className="mt-3 space-y-1">
                {Object.entries(testResult.checks).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-2 text-xs">
                    {v
                      ? <CheckCircle className="w-3 h-3 text-green-500" />
                      : <XCircle className="w-3 h-3 text-red-500" />}
                    <span className={v ? "text-green-700" : "text-red-700"}>{k}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Usage note */}
      <div className="text-xs text-muted-foreground bg-secondary/50 rounded-xl p-4">
        <p className="font-semibold text-foreground mb-1">How this integration works</p>
        <p>When generating a Google Ads strategy, the system first calls the Google Ads Keyword Planner API to fetch real keyword ideas with search volume and competition data. These keywords are then passed to the AI to generate more accurate campaign recommendations. If the API is unavailable, the system automatically falls back to AI-generated keyword suggestions — the user experience is never interrupted.</p>
      </div>
    </div>
  );
}