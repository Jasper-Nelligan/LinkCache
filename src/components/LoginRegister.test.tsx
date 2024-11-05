import { screen, fireEvent, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import LoginRegister from './LoginRegister';
import { renderWithProviders } from '@/test-utils';
import * as backend from "@/backend";
import { beforeEach } from 'node:test';
import * as auth from '../providers/authProvider';

describe("LoginRegister", () => {
  beforeEach(() => {
    vi.spyOn(auth, "useAuth").mockReturnValue({
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
  
  it("should render login form", () => {
    renderWithProviders(<LoginRegister
      isOpen={true}
      showLoginForm={true}
      onClose={vi.fn()}
      setShowLoginForm={vi.fn()}
    />);

    expect(screen.getByText("Enter your email below to login to your account")).toBeTruthy();
  });

  it("should render registration form", () => {
    renderWithProviders(<LoginRegister
      isOpen={true}
      showLoginForm={false}
      onClose={vi.fn()}
      setShowLoginForm={vi.fn()}
    />);

    expect(screen.getByText("Register an account to save your links across devices")).toBeTruthy();
  });

  it("switching between forms should reset form fields", () => {
    const setShowLoginForm = vi.fn();
    const { rerender } = renderWithProviders(<LoginRegister
      isOpen={true}
      showLoginForm={true}
      onClose={vi.fn()}
      setShowLoginForm={setShowLoginForm}
    />);

    // Simulate entering values into the login form fields
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: 'password' } });
    fireEvent.click(screen.getByText("Register"));

    expect(setShowLoginForm).toHaveBeenCalledWith(false);

    // Switch to the registration form
    rerender(<LoginRegister
      isOpen={true}
      showLoginForm={false}
      onClose={vi.fn()}
      setShowLoginForm={setShowLoginForm}
    />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: 'password' } });
    fireEvent.click(screen.getByText("Login"));

    expect(setShowLoginForm).toHaveBeenCalledWith(true);

    // Switch back to the login form
    rerender(<LoginRegister
      isOpen={true}
      showLoginForm={true}
      onClose={vi.fn()}
      setShowLoginForm={setShowLoginForm}
    />);

    // Check that the login form fields are reset
    expect((screen.getByLabelText("Email") as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText("Password") as HTMLInputElement).value).toBe('');

    // Switch back to the registration form
    rerender(<LoginRegister
      isOpen={true}
      showLoginForm={false}
      onClose={vi.fn()}
      setShowLoginForm={setShowLoginForm}
    />);

    // Check that the registration form fields are reset
    expect((screen.getByLabelText("Email") as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText("Password") as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText("Confirm Password") as HTMLInputElement).value).toBe('');
  });

  it("should close the dialog when close is clicked", () => {
    const onClose = vi.fn();
    renderWithProviders(<LoginRegister
      isOpen={true}
      showLoginForm={true}
      onClose={onClose}
      setShowLoginForm={vi.fn()}
    />);

    fireEvent.click(screen.getByText("Close"));

    expect(onClose).toHaveBeenCalled();
  });

  it("should reset login form when dialog is closed", () => {
    const onClose = vi.fn();
    const { rerender } = renderWithProviders(<LoginRegister
      isOpen={true}
      showLoginForm={true}
      onClose={onClose}
      setShowLoginForm={vi.fn()}
    />);

    fireEvent.input(screen.getByLabelText("Email"), { target: { value: "test" } });
    fireEvent.input(screen.getByLabelText("Password"), { target: { value: "test" } });
    fireEvent.click(screen.getByText("Close"));

    rerender(<LoginRegister
      isOpen={true}
      showLoginForm={true}
      onClose={onClose}
      setShowLoginForm={vi.fn()}
    />);

    expect(onClose).toHaveBeenCalled();
    expect((screen.getByLabelText("Email") as HTMLInputElement).value).toEqual("");
    expect((screen.getByLabelText("Password") as HTMLInputElement).value).toEqual("");
  });

  it("should reset registration form when dialog is closed", () => {
    const onClose = vi.fn();
    const { rerender } = renderWithProviders(<LoginRegister
      isOpen={true}
      showLoginForm={false}
      onClose={onClose}
      setShowLoginForm={vi.fn()}
    />);

    fireEvent.input(screen.getByLabelText("Email"), { target: { value: "test" } });
    fireEvent.input(screen.getByLabelText("Password"), { target: { value: "test" } });
    fireEvent.input(screen.getByLabelText("Confirm Password"), { target: { value: "test" } });
    fireEvent.click(screen.getByText("Close"));

    rerender(<LoginRegister
      isOpen={true}
      showLoginForm={false}
      onClose={onClose}
      setShowLoginForm={vi.fn()}
    />);

    expect(onClose).toHaveBeenCalled();
    expect((screen.getByLabelText("Email") as HTMLInputElement).value).toEqual("");
    expect((screen.getByLabelText("Password") as HTMLInputElement).value).toEqual("");
    expect((screen.getByLabelText("Confirm Password") as HTMLInputElement).value).toEqual("");
  });

  it("should show error messages when login form contains empty fields on submit", async () => {
    renderWithProviders(<LoginRegister
      isOpen={true}
      showLoginForm={true}
      onClose={vi.fn()}
      setShowLoginForm={vi.fn()}
    />);

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email")).toBeTruthy();
      expect(screen.getByText("Password required")).toBeTruthy();
    });
  });

  it("should show error messages when resgistration form contains empty fields on submit", async () => {
    renderWithProviders(<LoginRegister
      isOpen={true}
      showLoginForm={false}
      onClose={vi.fn()}
      setShowLoginForm={vi.fn()}
    />);

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email")).toBeTruthy();
      expect(screen.getByText("Password must be at least 8 characters long")).toBeTruthy();
    });
  });

  it("should show error message when passwords don't match", async () => {
    renderWithProviders(<LoginRegister
      isOpen={true}
      showLoginForm={false}
      onClose={vi.fn()}
      setShowLoginForm={vi.fn()}
    />);

    fireEvent.input(screen.getByLabelText("Email"), { target: { value: "  " } }); 
    fireEvent.input(screen.getByLabelText("Password"), { target: { value: "password" } });
    fireEvent.input(screen.getByLabelText("Confirm Password"), { target: { value: "password1" } });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(screen.getByText("Passwords don't match")).toBeTruthy();
    });
  });

  it("should show error message when password is less than 8 characters", async () => {
    renderWithProviders(<LoginRegister
      isOpen={true}
      showLoginForm={false}
      onClose={vi.fn()}
      setShowLoginForm={vi.fn()}
    />);

    fireEvent.input(screen.getByLabelText("Email"), { target: { value: "test@email.com" } }); 
    fireEvent.input(screen.getByLabelText("Password"), { target: { value: "pass" } });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(screen.getByText("Password must be at least 8 characters long")).toBeTruthy();
    });
  });

  it("should show error message when account or password is wrong", async () => {
    renderWithProviders(<LoginRegister
      isOpen={true}
      showLoginForm={true}
      onClose={vi.fn()}
      setShowLoginForm={vi.fn()}
    />);

    vi.spyOn(backend, 'loginUser').mockResolvedValue(401);

    fireEvent.input(screen.getByLabelText("Email"), { target: { value: "test@email.com" } }); 
    fireEvent.input(screen.getByLabelText("Password"), { target: { value: "password" } });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(screen.getAllByText("Invalid email or password")).toHaveLength(2);
    });
  });

  it("should show error message when account already exists", async () => {
    renderWithProviders(<LoginRegister
      isOpen={true}
      showLoginForm={false}
      onClose={vi.fn()}
      setShowLoginForm={vi.fn()}
    />);

    vi.spyOn(backend, 'addUser').mockResolvedValue(409);

    fireEvent.input(screen.getByLabelText("Email"), { target: { value: "test@email.com" } }); 
    fireEvent.input(screen.getByLabelText("Password"), { target: { value: "password" } });
    fireEvent.input(screen.getByLabelText("Confirm Password"), { target: { value: "password" } });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(screen.getByText("An account with this email already exists")).toBeTruthy();
    });
  });
});