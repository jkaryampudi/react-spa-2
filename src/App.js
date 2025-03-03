import { useState, useEffect } from "react";
import "./App.css";
import { LOGIN_REQUEST, PUBLIC_CLIENT_APPLICATION, TOKEN_REQUEST } from "./msalConfig";
import { getSalesforceAuthUrl, exchangeCodeForToken, generateSalesforceSSOUrl } from "./salesforceAuth";

function App() {
  const [azureToken, setAzureToken] = useState(null);
  const [salesforceToken, setSalesforceToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [interactionInProgress, setInteractionInProgress] = useState(false);

  // 🔹 Fetch Azure AD B2C token & check if user is logged in
  useEffect(() => {
    const account = PUBLIC_CLIENT_APPLICATION.getAllAccounts()[0];
    if (account) {
      PUBLIC_CLIENT_APPLICATION.setActiveAccount(account);
      handleRefreshToken();
    }
  }, []);

  // 🔹 Fetch Salesforce token if authorization code is available
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");

    if (authCode && !salesforceToken) {
      handleSalesforceLogin(authCode);
    }
  }, [salesforceToken]); // ✅ Best Practice: Only re-run if `salesforceToken` changes

  // 🔹 Azure AD B2C Login
  const handleSignIn = async () => {
    try {
      const loginResponse = await PUBLIC_CLIENT_APPLICATION.loginPopup(LOGIN_REQUEST);
      if (loginResponse.account) {
        PUBLIC_CLIENT_APPLICATION.setActiveAccount(loginResponse.account);
        await handleRefreshToken();
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  // 🔹 Azure AD B2C Logout
  const handleSignOut = async () => {
    if (!interactionInProgress) {
      setInteractionInProgress(true);
      try {
        await PUBLIC_CLIENT_APPLICATION.logoutPopup();
      } catch (error) {
        console.error("Logout Error:", error);
      }
      setAzureToken(null);
      setSalesforceToken(null);
      setUserEmail(null);
      setInteractionInProgress(false);
    }
  };

  // 🔹 Azure AD B2C Token Refresh
  const handleRefreshToken = async () => {
    try {
      const tokenResponse = await PUBLIC_CLIENT_APPLICATION.acquireTokenSilent(TOKEN_REQUEST);
      setAzureToken(tokenResponse.accessToken);

      // Extract email from token payload
      const decodedToken = JSON.parse(atob(tokenResponse.accessToken.split(".")[1]));
      setUserEmail(decodedToken.email);
    } catch (error) {
      console.error("Token Refresh Error:", error);
    }
  };

  // 🔹 Salesforce Login (Exchanges auth code for access token)
  const handleSalesforceLogin = async (authCode) => {
    try {
      const token = await exchangeCodeForToken(authCode);
      setSalesforceToken(token);
    } catch (error) {
      console.error("Salesforce Authentication Error:", error);
    }
  };

  // 🔹 Redirect to Salesforce Login Page
  const redirectToSalesforceLogin = () => {
    window.location.href = getSalesforceAuthUrl();
  };

  // 🔹 Seamless SSO to Salesforce Experience Cloud
  const goToExperienceCloud = async () => {
    if (!salesforceToken || !userEmail) {
      alert("Please log in first!");
      return;
    }

    const ssoUrl = await generateSalesforceSSOUrl(salesforceToken, userEmail);
    if (ssoUrl) {
      window.location.href = ssoUrl;
    } else {
      console.error("Failed to generate SSO URL.");
    }
  };

  return (
    <div className="App">
      <h1>React + Azure B2C + Salesforce Experience Cloud</h1>

      {azureToken ? (
        <div>
          <p style={{ color: "green", fontSize: "20px", fontWeight: "bold" }}>
            You are authenticated!
          </p>
          <p>Your Azure Access Token:</p>
          <p
            style={{
              color: "blue",
              fontSize: "16px",
              fontWeight: "bold",
              width: "80%",
              wordWrap: "break-word",
              margin: "auto",
            }}
          >
            {azureToken}
          </p>

          {salesforceToken ? (
            <button
              onClick={goToExperienceCloud}
              style={{ margin: "10px", padding: "10px", fontSize: "16px" }}
            >
              Go to Experience Cloud
            </button>
          ) : (
            <button onClick={redirectToSalesforceLogin}>
              Login to Salesforce
            </button>
          )}

          <button onClick={handleSignOut} disabled={interactionInProgress}>
            Logout
          </button>
        </div>
      ) : (
        <div>
          <p style={{ color: "red", fontSize: "20px", fontWeight: "bold" }}>
            You are not authenticated!
          </p>
          <button onClick={handleSignIn}>Login</button>
        </div>
      )}
    </div>
  );
}

export default App;
