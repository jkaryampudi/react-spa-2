const SALESFORCE_TOKEN_URL = "https://login.salesforce.com/services/oauth2/token"; // Update for sandbox if needed

/**
 * Exchanges an Azure Access Token for a Salesforce Access Token.
 * @param {string} azureToken - The Azure AD access token.
 * @returns {Promise<string|null>} - The Salesforce access token or null if failed.
 */
export const exchangeAzureTokenForSalesforce = async (azureToken) => {
    try {
        const response = await fetch(SALESFORCE_TOKEN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
                client_id: "3MVG95nWQGdmAiErDZVgS8zk.IlOdJaZfVaEbb4IIAz_McJWhlxWTu8N_WXxfL6xLV7la2sUJgkVjG2dz9wUW",  // Store in .env for security
                client_secret: "45047B6DD97E6B1EC511BE8E972B846459E1F1671B2BE5E9E6F905EF4FA8C054", // Store in .env
                assertion: azureToken // Use Azure AD Access Token here
            }),
        });

        const data = await response.json();

        if (data.access_token) {
            console.log("Salesforce Access Token Retrieved:", data.access_token);
            return data.access_token;
        } else {
            console.error("Salesforce Token Exchange Failed:", data);
            return null;
        }
    } catch (error) {
        console.error("Error exchanging Azure token for Salesforce token:", error);
        return null;
    }
};
