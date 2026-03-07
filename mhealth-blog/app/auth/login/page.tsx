"use client";


import { loginSchema } from "@/app/schemas/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod/v3";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter();

  const form = useForm({
      resolver: zodResolver(loginSchema),
      defaultValues: {
        email: "",
        password: "",
      }
  });

  function onSubmit(data: z.infer<typeof loginSchema>) {

    startTransition(async () => { 
      await authClient.signIn.email({
        email: data.email,
        password: data.password,
        fetchOptions: {
            onSuccess: () => {
                toast.success("Logged in successfully");
                router.push("/");
            },
            onError: (error) => {
                toast.error(error.error.message || "Failed to log in");
            }
        }
      });
    });
    }
  
  return (
    <>
      <Card>
        <CardHeader className="text-center">
            <CardTitle className="text-lg" >Log In</CardTitle>
        <CardDescription>
          Log in to your existing account
        </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Sign Up Form goes here */}
          <form onSubmit={form.handleSubmit(onSubmit)} >
            <FieldGroup>
              
              <Controller
                name="email"
                control={form.control}
                render={({ field ,fieldState}) => (
                  <Field >
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input {...field} id="email" type="email" placeholder="pookie@gmail.com" aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              /> 
              <Controller
                name="password"
                control={form.control}
                render={({ field ,fieldState}) => (
                  <Field >
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input {...field} id="password" type="password" placeholder="********" aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

                 <Button disabled={isPending}>
                {isPending ?
                  <>
                    <Loader2 className="size-4" />
                    <span>Logging in...</span>
                  </> : "Log in"}
              </Button>
            </FieldGroup>

          </form>
        </CardContent>
      </Card>
      
      </>

  )
}