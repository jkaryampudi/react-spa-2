import { PublicClientApplication } from "@azure/msal-browser";

const MSAL_CONFIG = {
    auth: {
        clientId: "8838d638-ab81-4618-a2f3-8b599deac91d",
        authority: "https://login.microsoftonline.com/jaykaryampudigmail.onmicrosoft.com",
        redirectUri: "https://salmon-stone-00ae7060f.4.azurestaticapps.net",
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: false,
    },
};

const LOGIN_REQUEST = {
    scopes: ["openid", "offline_access"]
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
    PUBLIC_CLIENT_APPLICATION
};
