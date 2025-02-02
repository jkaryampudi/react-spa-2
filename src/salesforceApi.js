import { PUBLIC_CLIENT_APPLICATION, SALESFORCE_TOKEN_REQUEST } from "./msalConfig";

const SALESFORCE_API_URL = "https://storm-eb707416e288b6.my.salesforce.com/services/data/v53.0/sobjects/User/me"; // Update instance & API version

async function getSalesforceAccessToken() {
    try {
        const account = PUBLIC_CLIENT_APPLICATION.getAllAccounts()[0];

        if (!account) {
            console.error("No user is signed in.");
            return null;
        }

        const tokenResponse = await PUBLIC_CLIENT_APPLICATION.acquireTokenSilent({
            scopes: ["https://storm-eb707416e288b6.my.salesforce.com/.default"],
            account: account
        });

        return tokenResponse.accessToken;
    } catch (error) {
        console.error("Error getting Salesforce access token:", error);
        return null;
    }
}

async function getSalesforceUserInfo() {
    const accessToken = await getSalesforceAccessToken();
    
    if (!accessToken) {
        console.error("Failed to get Salesforce token.");
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

        const userData = await response.json();
        console.log("Salesforce User Data:", userData);
        return userData;
    } catch (error) {
        console.error("Error fetching Salesforce user data:", error);
        return null;
    }
}

export { getSalesforceUserInfo };
