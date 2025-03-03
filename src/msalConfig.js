import { PublicClientApplication } from "@azure/msal-browser";

const MSAL_CONFIG = {
    auth: {
        clientId: "e5c9d570-3d8e-47c6-9f2c-ded134328a55",
        /*clientId: "3e7276ba-2bdf-47b6-a5eb-4917c55727b8",*/
        authority: "https://login.microsoftonline.com/527eb7c2-9b68-4770-8060-daf7ee6932db", // Tenant-specific
        redirectUri: "https://gray-stone-07c20f810.6.azurestaticapps.net",
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
