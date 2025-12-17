import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./toolkit/reducer";
import { Provider } from "react-redux";

const store = configureStore({
  reducer: rootReducer,
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster/>
      </BrowserRouter>
    </Provider>
  // </React.StrictMode>
);

