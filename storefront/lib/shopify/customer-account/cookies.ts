export const SESSION_COOKIE = '__mf_customer_session';
export const FLOW_COOKIE = '__mf_oauth_flow';
// Short-lived flag set on logout so the next /account/login passes
// prompt=login and forces re-auth even if Shopify SSO is still alive.
export const FORCE_REAUTH_COOKIE = '__mf_force_reauth';
