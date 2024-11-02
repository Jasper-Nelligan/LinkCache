import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LoginRegister from './LoginRegister';

describe("LoginRegister", () => {
  it("should render login form", () => {
    render(<LoginRegister
      isOpen={true}
      showLoginForm={true}
      onClose={vi.fn()}
      setShowLoginForm={vi.fn()}
      onSubmitForm={vi.fn()}
    />);

    expect(screen.getByText("Enter your email below to login to your account")).toBeTruthy();
  });

  it("should render registration form", () => {
    render(<LoginRegister
      isOpen={true}
      showLoginForm={false}
      onClose={vi.fn()}
      setShowLoginForm={vi.fn()}
      onSubmitForm={vi.fn()}
    />);

    expect(screen.getByText("Register an account to save your links across devices")).toBeTruthy();
  });

  it("switching between forms should reset form fields", () => {
    const setShowLoginForm = vi.fn();
    const { rerender } = render(<LoginRegister
      isOpen={true}
      showLoginForm={true}
      onClose={vi.fn()}
      setShowLoginForm={setShowLoginForm}
      onSubmitForm={vi.fn()}
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
      onSubmitForm={vi.fn()}
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
      onSubmitForm={vi.fn()}
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
      onSubmitForm={vi.fn()}
    />);

    // Check that the registration form fields are reset
    expect((screen.getByLabelText("Email") as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText("Password") as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText("Confirm Password") as HTMLInputElement).value).toBe('');
  });

  it("should close the dialog when close is clicked", () => {
    const onClose = vi.fn();
    render(<LoginRegister
      isOpen={true}
      showLoginForm={true}
      onClose={onClose}
      setShowLoginForm={vi.fn()}
      onSubmitForm={vi.fn()}
    />);

    fireEvent.click(screen.getByText("Close"));

    expect(onClose).toHaveBeenCalled();
  });

  it("should call onSubmit handler when login form is submitted", async () => {
    const onClose = vi.fn();
    const onSubmitForm = vi.fn();
    render(<LoginRegister
      isOpen={true}
      showLoginForm={true}
      onClose={onClose}
      setShowLoginForm={vi.fn()}
      onSubmitForm={onSubmitForm}
    />);

    fireEvent.input(screen.getByLabelText("Email"), { target: { value: "test@email.com" } });
    fireEvent.input(screen.getByLabelText("Password"), { target: { value: "testtest" } });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(onSubmitForm).toHaveBeenCalledWith({
        email: "test@email.com",
        password: "testtest",
        type: "login"
      });
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("should call onSubmit handler when registration form is submitted", async () => {
    const onClose = vi.fn();
    const onSubmitForm = vi.fn();
    render(<LoginRegister
      isOpen={true}
      showLoginForm={false}
      onClose={onClose}
      setShowLoginForm={vi.fn()}
      onSubmitForm={onSubmitForm}
    />);

    fireEvent.input(screen.getByLabelText("Email"), { target: { value: "test@email.com" } });
    fireEvent.input(screen.getByLabelText("Password"), { target: { value: "testtest" } });
    fireEvent.input(screen.getByLabelText("Confirm Password"), { target: { value: "testtest" } });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(onSubmitForm).toHaveBeenCalledWith({
        email: "test@email.com",
        password: "testtest",
        type: "register"
      });
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("should reset login form when dialog is closed", () => {
    const onClose = vi.fn();
    const { rerender } = render(<LoginRegister
      isOpen={true}
      showLoginForm={true}
      onClose={onClose}
      setShowLoginForm={vi.fn()}
      onSubmitForm={vi.fn()}
    />);

    fireEvent.input(screen.getByLabelText("Email"), { target: { value: "test" } });
    fireEvent.input(screen.getByLabelText("Password"), { target: { value: "test" } });
    fireEvent.click(screen.getByText("Close"));

    rerender(<LoginRegister
      isOpen={true}
      showLoginForm={true}
      onClose={onClose}
      setShowLoginForm={vi.fn()}
      onSubmitForm={vi.fn()}
    />);

    expect(onClose).toHaveBeenCalled();
    expect((screen.getByLabelText("Email") as HTMLInputElement).value).toEqual("");
    expect((screen.getByLabelText("Password") as HTMLInputElement).value).toEqual("");
  });

  it("should reset registration form when dialog is closed", () => {
    const onClose = vi.fn();
    const { rerender } = render(<LoginRegister
      isOpen={true}
      showLoginForm={false}
      onClose={onClose}
      setShowLoginForm={vi.fn()}
      onSubmitForm={vi.fn()}
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
      onSubmitForm={vi.fn()}
    />);

    expect(onClose).toHaveBeenCalled();
    expect((screen.getByLabelText("Email") as HTMLInputElement).value).toEqual("");
    expect((screen.getByLabelText("Password") as HTMLInputElement).value).toEqual("");
    expect((screen.getByLabelText("Confirm Password") as HTMLInputElement).value).toEqual("");
  });

  it("shoud show error messages when login form contains empty fields on submit", async () => {
    render(<LoginRegister
      isOpen={true}
      showLoginForm={true}
      onClose={vi.fn()}
      setShowLoginForm={vi.fn()}
      onSubmitForm={vi.fn()}
    />);

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email")).toBeTruthy();
      expect(screen.getByText("Password required")).toBeTruthy();
    });
  });

  it("shoud show error messages when resgistration form contains empty fields on submit", async () => {
    render(<LoginRegister
      isOpen={true}
      showLoginForm={false}
      onClose={vi.fn()}
      setShowLoginForm={vi.fn()}
      onSubmitForm={vi.fn()}
    />);

    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email")).toBeTruthy();
      expect(screen.getByText("Password must be at least 8 characters long")).toBeTruthy();
    });
  });
});