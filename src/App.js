import { useState, useEffect } from "react";
import "./App.css";
import { LOGIN_REQUEST, PUBLIC_CLIENT_APPLICATION, TOKEN_REQUEST } from "./msalConfig";

function App() {
  const [token, setToken] = useState(null);
  const [interactionInProgress, setInteractionInProgress] = useState(false);

  useEffect(() => {
    const account = PUBLIC_CLIENT_APPLICATION.getAllAccounts()[0];
    if (account) {
      PUBLIC_CLIENT_APPLICATION.setActiveAccount(account);
    }
  }, []);

  const handleSignIn = async () => {
    try {
      const loginResponse = await PUBLIC_CLIENT_APPLICATION.loginPopup(LOGIN_REQUEST);
      if (loginResponse.account) {
        PUBLIC_CLIENT_APPLICATION.setActiveAccount(loginResponse.account);
        await handleRefreshToken(); // Get token after login
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleSignOut = async () => {
    if (!interactionInProgress) {
      setInteractionInProgress(true);
      try {
        await PUBLIC_CLIENT_APPLICATION.logoutPopup();
      } catch (error) {
        console.error("Logout Error:", error);
      }
      setToken(null);
      setInteractionInProgress(false);
    }
  };

const handleRefreshToken = async () => {
  try {
    const tokenResponse = await PUBLIC_CLIENT_APPLICATION.acquireTokenSilent(TOKEN_REQUEST);
    setToken(tokenResponse.accessToken);
  } catch (error) {
    if (error.name === "InteractionRequiredAuthError") {
      console.warn("Token refresh failed, prompting user...");
      try {
        const interactiveResponse = await PUBLIC_CLIENT_APPLICATION.acquireTokenPopup(TOKEN_REQUEST);
        setToken(interactiveResponse.accessToken);
      } catch (popupError) {
        console.error("Interactive login failed:", popupError);
      }
    } else {
      console.error("Token Refresh Error:", error);
    }
  }
};


  return (
    <div className="App">
      <h1>React.JS Azure AD Authentication with MSAL.js</h1>

      {token ? (
        <div>
          <p style={{ color: "green", fontSize: "20px", fontWeight: "bold" }}>
            You are authenticated!
          </p>
          <p>Your access token:</p>
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
            {token}
          </p>

          <button onClick={handleRefreshToken} style={{ margin: "10px" }}>
            Refresh Token
          </button>

          <button onClick={handleSignOut} disabled={interactionInProgress}>
            Logout
          </button>
        </div>
      ) : (
        <div>
          <p style={{ color: "red", fontSize: "20px", fontWeight: "bold" }}>
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
