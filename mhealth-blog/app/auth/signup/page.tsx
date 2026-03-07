
"use client";

import { signUpSchema } from "@/app/schemas/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form"; 
import { toast } from "sonner";
import * as z from "zod/v3";




export default function SignUpPage() {

  const [isPending, startTransition] = useTransition()
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    }
  });

   function onSubmit(data: z.infer<typeof signUpSchema>) {

    startTransition(async() => { 
      await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        fetchOptions: {
            onSuccess: () => {
                toast.success("Account created successfully");
                router.push("/");
            },
            onError: (error) => {
                toast.error(error.error.message || "Failed to create account");
            }
        }
      });

    });
  }

  return (
      <>
      <Card>
        <CardHeader className="text-center">
            <CardTitle className="text-lg" >Sign Up</CardTitle>
        <CardDescription>
          Create an   Account to get Started
        </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Sign Up Form goes here */}
          <form onSubmit={form.handleSubmit(onSubmit)} >
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field ,fieldState}) => (
                  <Field >
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input {...field} id="name" placeholder="wepukhulu" aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
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
                    <Loader2 className="mr-2" />
                    <span>Creating Account...</span>
                  </> : "Sign Up"}
              </Button>
            </FieldGroup>

          </form>
        </CardContent>
      </Card>
      
      </>

    
  )
}