import { useState, useEffect } from "react";
import "./App.css";
import { LOGIN_REQUEST, PUBLIC_CLIENT_APPLICATION } from "./msalConfig";
import { generateSalesforceSSOUrl } from "./salesforceAuth";

function App() {
  const [azureUser, setAzureUser] = useState(null);

  // ✅ Check if user is already logged in on page load
  useEffect(() => {
    const accounts = PUBLIC_CLIENT_APPLICATION.getAllAccounts();
    if (accounts.length > 0) {
      PUBLIC_CLIENT_APPLICATION.setActiveAccount(accounts[0]);
      setAzureUser(accounts[0]);
    }
  }, []);

  // ✅ Azure AD B2C Login
  const handleLogin = async () => {
    try {
      const loginResponse = await PUBLIC_CLIENT_APPLICATION.loginPopup(LOGIN_REQUEST);
      if (loginResponse.account) {
        PUBLIC_CLIENT_APPLICATION.setActiveAccount(loginResponse.account);
        setAzureUser(loginResponse.account);
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  // ✅ Azure AD B2C Logout
  const handleLogout = async () => {
    await PUBLIC_CLIENT_APPLICATION.logoutPopup();
    setAzureUser(null);
  };

  // ✅ Ensure user is logged in & fetch access token before SSO
  const goToExperienceCloud = async () => {
    if (!azureUser) {
      alert("Please log in first!");
      return;
    }

    try {
      // Fetch new access token for SSO
      const tokenResponse = await PUBLIC_CLIENT_APPLICATION.acquireTokenSilent(LOGIN_REQUEST);

      // Generate Salesforce SSO URL
      const ssoUrl = await generateSalesforceSSOUrl(tokenResponse.accessToken, azureUser.username);
      
      if (ssoUrl) {
        window.location.href = ssoUrl;
      } else {
        console.error("Failed to generate SSO URL.");
        alert("SSO failed. Please try again.");
      }
    } catch (error) {
      console.error("Error obtaining Salesforce SSO URL:", error);
      alert("Authentication failed. Please log in again.");
    }
  };

  return (
    <div className="App">
      <h1>React + Azure B2C + Salesforce Experience Cloud</h1>

      {azureUser ? (
        <div>
          <p>Welcome, {azureUser.username}!</p>
          <button onClick={goToExperienceCloud}>Go to Experience Cloud</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}

export default App;
