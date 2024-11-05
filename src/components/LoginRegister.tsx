import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { credentialDetails, registrationDetails } from "@/types";
import { useEffect, useState } from "react";
import { addUser, loginUser } from "@/backend";
import { useAuth } from "@/providers/authProvider";

// TODO login works when database is down for some reason, fix this
// TODO prevent copy/paste into the confirm password field
export default function LoginRegister({ isOpen, showLoginForm, setShowLoginForm, onClose }:
  {
    isOpen: boolean;
    showLoginForm: boolean;
    onClose: () => void;
    setShowLoginForm: (showLoginForm: boolean) => void;
  }) {
  const { login } = useAuth();

  const registrationFormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  }).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  const registrationForm = useForm<z.infer<typeof registrationFormSchema>>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const loginFormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password required"),
  });

  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    resetForm();
  }, [showLoginForm]);

  const handleRegistrationSubmit = async (data: registrationDetails) => {
    const { confirmPassword, ...formData } = data;

    const response = await addUser(formData);
    if (response === 409) {
      registrationForm.setError("email", {
        type: "manual",
        message: "An account with this email already exists",
      });
      return;
    }

    login();
    resetForm();
    onClose();
  };

  const handleLoginSubmit = async (data: credentialDetails) => {
    // Call the backend function to login
    const response = await loginUser(data);

    if (response === 401) {
      loginForm.setError("email", {
        type: "manual",
        message: "Invalid email or password",
      });
      loginForm.setError("password", {
        type: "manual",
        message: "Invalid email or password",
      });
      return;
    }

    login();
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  }

  const resetForm = () => {
    // Use setValue to reset the form fields, as reset() causes the form to become unresponsive
    if (showLoginForm) {
      loginForm.setValue("email", "")
      loginForm.setValue("password", "")
      loginForm.clearErrors();
    } else {
      registrationForm.setValue("email", "")
      registrationForm.setValue("password", "")
      registrationForm.setValue("confirmPassword", "")
      registrationForm.clearErrors();
    }
  }

  const renderRegistrationForm = () => {
    return (
      <DialogContent className="max-w-[50vh]">
        <DialogTitle>Register</DialogTitle>
        <DialogDescription>Register an account to save your links across devices</DialogDescription>
        <Form {...registrationForm}>
          <form onSubmit={registrationForm.handleSubmit(handleRegistrationSubmit)} className="space-y-2">
            <FormField
              control={registrationForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input id="email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registrationForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormControl>
                    <Input id="password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registrationForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                  <FormControl>
                    <Input id="confirmPassword" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <div className="flex flex-col justify-between items-center w-full mt-5">
                <Button className="w-full" type="submit">Register</Button>
                <p className="text-gray-500 mt-2 mb-2">- or -</p>
                <Button className="w-full" variant="outline">
                  <span className="flex justify-center items-center">
                    <img src="/google_icon.png" alt="Google icon" className="h-4 w-4 mr-2" />
                    Sign up with Google
                  </span>
                </Button>
                <div className="flex justify-center items-center mt-4">
                  <p>Already have an account?</p>
                  <Button variant="link" type="button" onClick={() => setShowLoginForm(true)} className="p-1">
                    Login
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    )
  }

  const renderLoginForm = () => {
    return (
      <DialogContent className="max-w-[50vh]">
        <DialogTitle>Login</DialogTitle>
        <DialogDescription>Enter your email below to login to your account</DialogDescription>
        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-5">
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input id="email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Button variant="link" type="button" className="p-0">
                      Forgot password?
                    </Button>
                  </div>
                  <FormControl>
                    <Input id="password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <div className="flex flex-col justify-between items-center w-full mt-5">
                <Button className="w-full">Login</Button>
                <p className="text-gray-500 mt-2 mb-2">- or -</p>
                <Button className="w-full" variant="outline">
                  <span className="flex justify-center items-center">
                    <img src="/google_icon.png" alt="Google icon" className="h-4 w-4 mr-2" />
                    Login with Google
                  </span>
                </Button>
                <div className="flex justify-center items-center mt-4">
                  <p>Don't have an account?</p>
                  <Button variant="link" type="button" onClick={() => setShowLoginForm(false)} className="p-1">
                    Register
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      {showLoginForm ? renderLoginForm() : renderRegistrationForm()}
    </Dialog>
  )
}