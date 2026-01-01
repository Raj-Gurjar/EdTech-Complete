import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./toolkit/reducer";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";

const store = configureStore({
  reducer: rootReducer,
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";

console.log("googleClientId", googleClientId);
const root = ReactDOM.createRoot(rootElement);
root.render(
  // <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <Toaster/>
        </BrowserRouter>
      </Provider>
    </GoogleOAuthProvider>
  // </React.StrictMode>
);

