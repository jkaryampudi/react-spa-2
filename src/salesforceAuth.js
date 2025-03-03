import axios from "axios";
import { SignJWT } from "jose";
import { SALESFORCE_CONFIG } from "./salesforceConfig";

// 🔹 Generate Salesforce Authorization URL
export const getSalesforceAuthUrl = () => {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: SALESFORCE_CONFIG.clientId,
    redirect_uri: SALESFORCE_CONFIG.redirectUri,
  });

  return `${SALESFORCE_CONFIG.authUrl}?${params.toString()}`;
};

// 🔹 Exchange Authorization Code for Salesforce Access Token
export const exchangeCodeForToken = async (authCode) => {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: SALESFORCE_CONFIG.clientId,
    client_secret: SALESFORCE_CONFIG.clientSecret,
    redirect_uri: SALESFORCE_CONFIG.redirectUri,
    code: authCode,
  });

  try {
    const response = await axios.post(SALESFORCE_CONFIG.tokenUrl, params);
    return response.data.access_token;
  } catch (error) {
    console.error("Salesforce Token Exchange Error:", error);
    throw error;
  }
};

// 🔹 Generate SSO URL for Salesforce Experience Cloud using `jose`
export const generateSalesforceSSOUrl = async (accessToken, userEmail) => {
  if (!accessToken || !userEmail) {
    console.error("Missing required parameters for SSO URL.");
    return null;
  }

  const jwtPayload = {
    iss: SALESFORCE_CONFIG.clientId, // Azure B2C Client ID
    sub: userEmail, // User's Email
    aud: SALESFORCE_CONFIG.authUrl, // Salesforce Audience (Authorization URL)
    exp: Math.floor(Date.now() / 1000) + 60 * 5, // 5-minute expiry
  };

  try {
    // Encode client secret for signing the JWT
    const encoder = new TextEncoder();
    const secretKey = encoder.encode(SALESFORCE_CONFIG.clientSecret);

    // Sign JWT using `jose` (browser-friendly)
    const signedToken = await new SignJWT(jwtPayload)
      .setProtectedHeader({ alg: "HS256" })
      .sign(secretKey);

    return `${SALESFORCE_CONFIG.experienceCloudUrl}?id_token=${signedToken}`;
  } catch (error) {
    console.error("Error generating JWT for Salesforce SSO:", error);
    return null;
  }
};
