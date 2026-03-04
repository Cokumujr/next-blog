
"use client";

import { signUpSchema } from "@/app/schemas/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form"; 




export default function SignUpPage() {

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    }
  });

  function onSubmit() {
    console.log("Form submitted");
  }

  return (
    <div >

      <Card>
        <CardHeader>
            <CardTitle>Sign Up Form</CardTitle>
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

                <Button>Sign Up</Button>
            </FieldGroup>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}