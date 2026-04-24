import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// Get the root element
const rootElement = document.getElementById("root");
if (!rootElement) {
    throw new Error("Root element not found");
}
// Create and render the React app
const root = createRoot(rootElement);
root.render(/*#__PURE__*/ React.createElement(App, null));
// Handle Hot Module Replacement (HMR)
if (import.meta.hot) {
    import.meta.hot.accept("./App", ()=>{
        // Re-render the app when App.tsx changes
        root.render(/*#__PURE__*/ React.createElement(App, null));
    });
}
