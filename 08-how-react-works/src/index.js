import React from "react";

// REACT 18
import ReactDOM from "react-dom/client";
// REACT 17
// import ReactDOM from "react-dom";

import App from "./App";
import "./index.css";

// REACT 18
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// REACT 17
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById("root")
// );
