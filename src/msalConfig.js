import { PublicClientApplication } from "@azure/msal-browser";

const MSAL_CONFIG = {
    auth: {
        clientId: "8838d638-ab81-4618-a2f3-8b599deac91d",
        /*clientId: "3e7276ba-2bdf-47b6-a5eb-4917c55727b8",*/
        authority: "https://login.microsoftonline.com/d3ad2e7f-49fe-4b21-88e1-58b4700e6a3b", // Tenant-specific
        redirectUri: "https://salmon-stone-00ae7060f.4.azurestaticapps.net",
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: true,
    }
};

const LOGIN_REQUEST = {
    scopes: ["openid", "profile", "offline_access", "User.Read"]
};

const SALESFORCE_TOKEN_REQUEST = {
    scopes: ["https://storm-eb707416e288b6.my.salesforce.com/.default"]
};

const TOKEN_REQUEST = {
    scopes: ["User.ReadWrite.All"]
};

const GRAPH_CONFIG = {
    graphUsersEndpoint: "https://graph.microsoft.com/v1.0/users"
};

const PUBLIC_CLIENT_APPLICATION = new PublicClientApplication(MSAL_CONFIG);

async function initializeMsal() {
    await PUBLIC_CLIENT_APPLICATION.initialize();
    
}

initializeMsal();

export {
    MSAL_CONFIG,
    LOGIN_REQUEST,
    TOKEN_REQUEST,
    GRAPH_CONFIG,
    SALESFORCE_TOKEN_REQUEST,
    PUBLIC_CLIENT_APPLICATION
};
