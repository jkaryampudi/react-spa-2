import { PublicClientApplication } from "@azure/msal-browser";

const MSAL_CONFIG = {
    auth: {
        clientId: "8838d638-ab81-4618-a2f3-8b599deac91d",
        authority: "https://login.microsoftonline.com/d3ad2e7f-49fe-4b21-88e1-58b4700e6a3b",
        redirectUri: "https://salmon-stone-00ae7060f.4.azurestaticapps.net",
    },
    cache: {
        cacheLocation: "sessionStorage", // Ensures state is cleared on page refresh
        storeAuthStateInCookie: true, // Useful for cross-browser session persistence
    }
};

const LOGIN_REQUEST = {
    scopes: ["openid", "profile", "offline_access", "User.Read"]
};

const TOKEN_REQUEST = {
    scopes: ["User.ReadWrite.All"]
};

const GRAPH_CONFIG = {
    graphUsersEndpoint: "https://graph.microsoft.com/v1.0/users"
};

const PUBLIC_CLIENT_APPLICATION = new PublicClientApplication(MSAL_CONFIG);

async function initializeMsal() {
    try {
        // Handle redirects first before any other login attempt
        const response = await PUBLIC_CLIENT_APPLICATION.handleRedirectPromise();
        if (response) {
            console.log("User logged in via redirect:", response);
            return;
        }

        // Check if user is already signed in
        const accounts = PUBLIC_CLIENT_APPLICATION.getAllAccounts();
        if (accounts.length > 0) {
            console.log("User already signed in:", accounts[0]);
            return;
        }

        // If no user session is active, redirect for login (only once)
        if (!sessionStorage.getItem("msal.interaction.status")) {
            console.log("No active session, initiating login...");
            sessionStorage.setItem("msal.interaction.status", "in_progress");
            await PUBLIC_CLIENT_APPLICATION.loginRedirect(LOGIN_REQUEST);
        }
    } catch (error) {
        console.error("MSAL Initialization Error:", error);
    }
}

// Initialize MSAL on app startup
initializeMsal();

export {
    MSAL_CONFIG,
    LOGIN_REQUEST,
    TOKEN_REQUEST,
    GRAPH_CONFIG,
    PUBLIC_CLIENT_APPLICATION
};
