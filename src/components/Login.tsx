import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogFooter } from "./ui/dialog";
import { Form, FormItem, FormLabel, FormControl } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


export default function Login({ showLogin, onClose }: { showLogin: boolean; onClose: () => void }) {
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
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
          <FormItem>
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormControl>
              <Input id="email" type="email" />
            </FormControl>
          </FormItem>
          <FormItem>
            <div className="flex justify-between items-center">
              <FormLabel htmlFor="password">Password</FormLabel>
              <a href="" className="underline text-sm">
                Forgot your password?
              </a>
            </div>
            <FormControl>
              <Input id="password" type="password" />
            </FormControl>
          </FormItem>
        </Form>
        <DialogFooter>
          <div className="flex flex-col justify-between items-center w-full">
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
      </DialogContent>
    </Dialog>
  )
}