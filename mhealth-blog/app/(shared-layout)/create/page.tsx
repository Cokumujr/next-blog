"use client";

import { createBlogAction } from "@/app/actions";
import { BlogPostSchema } from "@/app/schemas/blog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod/v3";

export default function CreatePage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const generateUploadUrl = useMutation(api.posts.generateImageUrl);

  const form = useForm({
    resolver: zodResolver(BlogPostSchema),
    defaultValues: {
      title: "",
      content: "",
      image: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof BlogPostSchema>) {
    startTransition(async () => {

      const runAction = async () => {
        
        try {
          let storageId = undefined;
          if (values.image) {
            const uploadUrl = await generateUploadUrl();
            const uploadResponse = await fetch(uploadUrl, {
              method: "POST",
              headers: {
                "Content-Type": values.image.type,
              },
              body: values.image,
            });
  
            if (!uploadResponse.ok) {
              throw new Error("Failed to upload image");
            }
  
            const uploadResult = await uploadResponse.json();
            storageId = uploadResult.storageId;
          } else {
            toast.info("No image provided. We have picked a beautiful default for you!");
          }
  
          const result = await createBlogAction({
            title: values.title,
            content: values.content,
            imageStorageId: storageId,
          });
  
          if (result?.error === "AUTH_REQUIRED") {
            toast.error("Please log in to continue");
            router.push("/auth/login");
          } else if (result?.error) {
            toast.error(result.error);
          } else if (result?.success) {
            toast.success("Blog post created successfully");
            router.push("/");
          }
        } catch (error) {
          if (error instanceof Error) {
            return { error: error.message };
          }
  
          return { error: "An unexpected error occurred" };
        }
      }

      await runAction();
    });
  }

  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          Create a New Blog Post
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Share your thoughts, insights, and stories with the world by creating
          a new blog post. Whether it&apos;s a personal experience, a how-to
          guide, or an opinion piece, we can&apos;t wait to read what you have
          to say!
        </p>
      </div>
      {/* Form for creating a new blog post goes here */}
      <div className="max-w-2xl mx-auto ">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Create a New Post</CardTitle>
            <CardDescription>
              Fill in the details below to publish your new blog post.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Form fields for title and content */}
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="title"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="title">Title</FieldLabel>
                      <Input
                        {...field}
                        id="title"
                        type="text"
                        placeholder="Enter post title"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="content"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="content">Content</FieldLabel>
                      <Textarea
                        {...field}
                        id="content"
                        rows={10}
                        placeholder="Enter post content"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="image"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="image">Image</FieldLabel>
                      <Input
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file);
                        }}
                        id="image"
                        type="file"
                        accept="image/*"
                        placeholder="Enter post Image"
                        aria-invalid={fieldState.invalid}
                        required={false}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Button disabled={isPending} className="self-end">
                  {isPending ? (
                    <>
                      <Loader2 className="size-4" />
                      <span> Publishing...</span>
                    </>
                  ) : (
                    "Publish Blog"
                  )}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
