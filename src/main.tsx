import { StrictMode } from 'react'
import App from './App.tsx'
import ReactDOM from "react-dom/client";


const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
