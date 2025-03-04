import { useState, useEffect } from "react";
import "./App.css";
import { LOGIN_REQUEST, PUBLIC_CLIENT_APPLICATION } from "./msalConfig";
import { getSalesforceAuthUrl, exchangeCodeForToken, generateSalesforceSSOUrl } from "./salesforceAuth";

function App() {
  const [azureUser, setAzureUser] = useState(null);
  const [salesforceToken, setSalesforceToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const accounts = PUBLIC_CLIENT_APPLICATION.getAllAccounts();
    if (accounts.length > 0) {
      PUBLIC_CLIENT_APPLICATION.setActiveAccount(accounts[0]);
      setAzureUser(accounts[0]);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const loginResponse = await PUBLIC_CLIENT_APPLICATION.loginPopup(LOGIN_REQUEST);
      if (loginResponse.account) {
        PUBLIC_CLIENT_APPLICATION.setActiveAccount(loginResponse.account);
        setAzureUser(loginResponse.account);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    await PUBLIC_CLIENT_APPLICATION.logoutPopup();
    setAzureUser(null);
  };

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
