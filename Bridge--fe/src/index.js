import React from "react";
import ReactDOM from "react-dom";
import { MoralisProvider } from "react-moralis";
import App from "./App";
let url = process.env.REACT_APP_MORALIS_SERVER_URL;
let password = process.env.REACT_APP_MORALIS_APP_ID;
ReactDOM.render(
  <MoralisProvider serverUrl={url} appId={password}>
    <App />
  </MoralisProvider>,
  document.getElementById("root")
);
