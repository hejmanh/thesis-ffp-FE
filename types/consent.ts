export interface ConsentStatus {
  hasSeen: boolean;
  hasConsented: boolean;
  consentedAt: string | null;
  consentVersion: string | null;
}

export interface ConsentPayload {
  agreed: boolean;
  consentVersion: string;
}

export interface ConsentResult {
  consentedAt: string;
  consentVersion: string;
}
