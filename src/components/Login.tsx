import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogFooter } from "./ui/dialog";
import { Form, FormItem, FormLabel, FormControl, FormField, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


export default function Login({ showLogin, onClose }: { showLogin: boolean; onClose: () => void }) {
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password required"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Dialog open={showLogin} onOpenChange={onClose}>
      <DialogContent className="max-w-[50vh]">
        <DialogTitle>Login</DialogTitle>
        <DialogDescription>Enter your email below to login to your account</DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(data => console.log(data))} className="space-y-5">
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
                  <div className="flex justify-between items-center">
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <a href="" className="underline text-sm">
                      Forgot your password?
                    </a>
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
                  <a href="" className="underline ml-1 text-sm">
                    Register
                  </a>
                </div>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}