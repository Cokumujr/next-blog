"use client";

import { Loader2, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentsSchema } from "@/app/schemas/comments";
import { Textarea } from "./ui/textarea";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Button } from "./ui/button";
import { useTransition } from "react";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import z from "zod/v3";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getInitials } from "@/lib/utils";
import { Separator } from "./ui/separator";

export function CommentsSection(props: {
    preLoadedComments: Preloaded<typeof api.comments.getCommentsByPostById>;
}) {
  const [isPending, startTransition] = useTransition();
  const params = useParams<{ postId: Id<"posts"> }>();
  const createComment = useMutation(api.comments.createComment);
  const comments = usePreloadedQuery(props.preLoadedComments) || [];

  const form = useForm({
    resolver: zodResolver(commentsSchema),
    defaultValues: {
      body: "",
      postId: params.postId,
    },
  });

  async function onSubmit(data: z.infer<typeof commentsSchema>) {
    startTransition(async () => {
      try {
        await createComment(data);
        toast.success("Comment posted successfully");
        form.reset();
      } catch (error) {
        toast.error("Failed to post comment");
      }
    });
  }
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-2 border-b pb-2">
        <MessageSquare className="size-6 text-muted-foreground" />
        <h1>{comments.length} Comments</h1>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <Controller
            name="body"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="body">Comment</FieldLabel>
                <Textarea
                  {...field}
                  id="body"
                  placeholder="Write your comment here..."
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button className="mt-4" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2" />
                <span>Posting...</span>
              </>
            ) : (
              "Post Comment"
            )}
          </Button>
              </form> 
              
              <Separator className="my-6" />

        <section className="mt-8">
          {comments.map((comment) => {
            // 1. Calculate initials once per comment
            const initials = getInitials(comment.authorName);

            return (
              <div key={comment._id} className="border rounded-md p-4 mb-4">
                <div className="text-sm text-muted-foreground mb-3 flex flex-row items-center gap-3">
                  <Avatar className="size-10 shrink-0">
                    <AvatarImage
                      src={`https://avatar.vercel.sh/${comment.authorName}.svg?text=${initials}`}
                      alt={comment.authorName}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex-col ">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-foreground">
                        {comment.authorName}
                      </span>
                      <span className="text-xs ">
                        {new Date(comment._creationTime).toLocaleDateString(
                          "en-GB",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                      </span>
                    </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap pt-1">
                    {comment.body}
                  </p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </CardContent>
    </Card>
  );
}
