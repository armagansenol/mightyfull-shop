export interface ShopifyTokenResponse {
  access_token: string;
  expires_in: number;
  id_token?: string;
  refresh_token: string;
  scope: string;
  token_type: 'Bearer';
}

export interface CustomerSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  idToken?: string;
}

export interface PKCEParams {
  codeVerifier: string;
  codeChallenge: string;
  state: string;
  nonce: string;
}

export interface AuthorizationFlowState {
  codeVerifier: string;
  state: string;
  nonce: string;
  returnTo?: string;
}
