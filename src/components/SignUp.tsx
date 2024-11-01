import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { useEffect } from "react";

export default function SignUp({ showSignUp, onClose }: { showSignUp: boolean; onClose: () => void }) {
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  }).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    form.reset({
      email: "",
      password: "",
      confirmPassword: "",
    });
  }, [showSignUp]);

  // TODO rename to register
  return (
    <Dialog open={showSignUp} onOpenChange={onClose}>
      <DialogContent className="max-w-[50vh]">
        <DialogTitle>Sign Up</DialogTitle>
        <DialogDescription>Register an account to save your links across devices</DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(data => console.log(data))} className="space-y-2">
            <FormField
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
                <Button className="w-full" type="submit">Sign Up</Button>
                <p className="text-gray-500 mt-2 mb-2">- or -</p>
                <Button className="w-full" variant="outline">
                  <span className="flex justify-center items-center">
                    <img src="/google_icon.png" alt="Google icon" className="h-4 w-4 mr-2" />
                    Sign up with Google
                  </span>
                </Button>
                <div className="flex justify-center items-center mt-4">
                  <p>Already have an account?</p>
                  <a href="" className="underline ml-1 text-sm">
                    Login
                  </a>
                </div>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog >
  )
}