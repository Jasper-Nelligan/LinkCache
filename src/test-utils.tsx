import { render, RenderOptions } from "@testing-library/react";
import { ReactElement, ReactNode } from "react";
import { AuthProvider } from "./providers/authProvider";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

export function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: Providers, ...options });
}

//