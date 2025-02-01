import { PublicClientApplication } from "@azure/msal-browser";

const MSAL_CONFIG = {
    auth: {
        clientId: "8838d638-ab81-4618-a2f3-8b599deac91d",
        authority: "https://login.microsoftonline.com/d3ad2e7f-49fe-4b21-88e1-58b4700e6a3b",
        redirectUri: "https://salmon-stone-00ae7060f.4.azurestaticapps.net",
    },
    cache: {
        cacheLocation: "sessionStorage", // Prevents cached tokens from persisting between sessions
        storeAuthStateInCookie: true, // Helps with issues in Safari and private browsing
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
        // Step 1: Wait for any ongoing authentication process to complete
        console.log("Checking for redirect response...");
        const response = await PUBLIC_CLIENT_APPLICATION.handleRedirectPromise();

        if (response) {
            console.log("Login completed via redirect:", response);
            return;
        }

        // Step 2: Check if the user is already signed in
        const accounts = PUBLIC_CLIENT_APPLICATION.getAllAccounts();
        if (accounts.length > 0) {
            console.log("User already signed in:", accounts[0]);
            return;
        }

        // Step 3: Ensure no other login attempt is in progress
        if (sessionStorage.getItem("msal.interaction.status") === "in_progress") {
            console.warn("Login already in progress, waiting...");
            return;
        }

        // Step 4: If no session found, start login
        console.log("No active session, initiating login...");
        sessionStorage.setItem("msal.interaction.status", "in_progress");
        await PUBLIC_CLIENT_APPLICATION.loginRedirect(LOGIN_REQUEST);
    } catch (error) {
        console.error("MSAL Initialization Error:", error);

        // Step 5: If error is "interaction_in_progress", do nothing (avoid retry loops)
        if (error.errorCode === "interaction_in_progress") {
            console.warn("Authentication is already in progress, skipping additional login request.");
            return;
        }

        // Step 6: Clear interaction status if login failed
        sessionStorage.removeItem("msal.interaction.status");
    }
}

// Ensure the MSAL instance is properly initialized
initializeMsal();

export {
    MSAL_CONFIG,
    LOGIN_REQUEST,
    TOKEN_REQUEST,
    GRAPH_CONFIG,
    PUBLIC_CLIENT_APPLICATION
};
