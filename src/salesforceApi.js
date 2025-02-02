import { PUBLIC_CLIENT_APPLICATION, TOKEN_REQUEST } from "./msalConfig";
import { exchangeAzureTokenForSalesforce } from "./salesforceAuth"; // Import token exchange function

const SALESFORCE_API_URL = "https://storm-eb707416e288b6.my.salesforce.com/services/data/v62.0/sobjects/User/me"; // Update instance & API version

/**
 * dRetrieves the Salesforce access token by first obtaining an Azure token
 * and then exchanging it for a Salesforce token.
 */
const getSalesforceAccessToken = async () => {
    try {
        const account = PUBLIC_CLIENT_APPLICATION.getAllAccounts()[0];

        if (!account) {
            console.error("No user is signed in.");
            return null;
        }

        // Get Azure Access Token using MSAL
        const tokenResponse = await PUBLIC_CLIENT_APPLICATION.acquireTokenSilent({
            scopes: TOKEN_REQUEST.scopes,
            account: account
        });

        if (!tokenResponse.accessToken) {
            console.error("Failed to get Azure token.");
            return null;
        }

        // Exchange Azure Token for Salesforce Token
        const salesforceToken = await exchangeAzureTokenForSalesforce(tokenResponse.accessToken);

        if (!salesforceToken) {
            console.error("Failed to exchange Azure token for Salesforce token.");
            return null;
        }

        return salesforceToken;
    } catch (error) {
        console.error("Error retrieving Salesforce access token:", error);
        return null;
    }
};

/**
 * Fetches user information from Salesforce using the obtained access token.
 */
const getSalesforceUserInfo = async () => {
    const accessToken = await getSalesforceAccessToken();

    if (!accessToken) {
        console.error("Failed to retrieve Salesforce token.");
        return null;
    }

    try {
        const response = await fetch(SALESFORCE_API_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Salesforce API request failed: ${response.statusText}`);
        }

        const userData = await response.json();
        console.log("Salesforce User Data:", userData);
        return userData;
    } catch (error) {
        console.error("Error fetching Salesforce user data:", error);
        return null;
    }
};

export { getSalesforceUserInfo };
