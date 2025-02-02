import { useState, useEffect } from 'react';
import './App.css';
import { LOGIN_REQUEST, PUBLIC_CLIENT_APPLICATION, TOKEN_REQUEST } from './msalConfig';
import { getSalesforceUserInfo } from "./salesforceApi";

function App() {
  const [token, setToken] = useState(null);
  const [salesforceUser, setSalesforceUser] = useState(null);
  const [interactionInProgress, setInteractionInProgress] = useState(false);

  useEffect(() => {
    // Check if the user is already logged in on page load
    const account = PUBLIC_CLIENT_APPLICATION.getAllAccounts()[0];
    if (account) {
      PUBLIC_CLIENT_APPLICATION.setActiveAccount(account);
      fetchSalesforceData();
    }
  }, []);

  const handleSignIn = async () => {
    try {
      const loginResponse = await PUBLIC_CLIENT_APPLICATION.loginPopup(LOGIN_REQUEST);
      if (loginResponse.account) {
        PUBLIC_CLIENT_APPLICATION.setActiveAccount(loginResponse.account);
      }
      fetchSalesforceData();
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleSignOut = async () => {
    if (!interactionInProgress) {
      setInteractionInProgress(true);
      await PUBLIC_CLIENT_APPLICATION.logout();
      setToken(null);
      setSalesforceUser(null);
      setInteractionInProgress(false);
    }
  };

  const handleRefreshToken = async () => {
    try {
      const tokenResponse = await PUBLIC_CLIENT_APPLICATION.acquireTokenSilent(TOKEN_REQUEST);
      setToken(tokenResponse.accessToken);
    } catch (error) {
      console.error("Token Refresh Error:", error);
    }
  };

  const fetchSalesforceData = async () => {
    try {
      const tokenResponse = await PUBLIC_CLIENT_APPLICATION.acquireTokenSilent(TOKEN_REQUEST);
      setToken(tokenResponse.accessToken);

      const userInfo = await getSalesforceUserInfo();
      if (userInfo) {
        setSalesforceUser(userInfo);
      }
    } catch (error) {
      console.error("Salesforce Data Fetch Error:", error);
    }
  };

  return (
    <div className="App">
      <h1>React.JS Azure AD Authentication with MSAL.js & Salesforce</h1>
      
      {token ? (
        <div>
          <p style={{ color: 'green', fontSize: '20px', fontWeight: 'bold' }}>
            You are authenticated!
          </p>
          <p>Your access token:</p>
          <p style={{
            color: 'blue', fontSize: '16px', fontWeight: 'bold',
            width: "80%", wordWrap: "break-word", margin: "auto"
          }}>
            {token}
          </p>

          {/* Display Salesforce User Info */}
          {salesforceUser ? (
            <div>
              <h2>Salesforce User Info</h2>
              <p><strong>Name:</strong> {salesforceUser.name}</p>
              <p><strong>Email:</strong> {salesforceUser.email}</p>
              <p><strong>Username:</strong> {salesforceUser.username}</p>
            </div>
          ) : (
            <p>Loading Salesforce user info...</p>
          )}

          <button onClick={handleRefreshToken} style={{ margin: "10px" }}>
            Refresh Token
          </button>

          <button onClick={handleSignOut} disabled={interactionInProgress}>
            Logout
          </button>
        </div>
      ) : (
        <div>
          <p style={{ color: 'red', fontSize: '20px', fontWeight: 'bold' }}>
            You are not authenticated!
          </p>
          <p>Please click the button below to login.</p>
          <button onClick={handleSignIn}>Login</button>
        </div>
      )}
    </div>
  );
}

export default App;
