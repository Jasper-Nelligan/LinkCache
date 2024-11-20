import { StrictMode } from 'react'
import App from './App.tsx'
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@/providers/theme-provider"
import { AuthProvider } from './providers/authProvider.tsx';

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </StrictMode>
  );
}
