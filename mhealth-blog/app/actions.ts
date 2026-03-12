"use server";

import { getToken } from "@/lib/auth-server";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

type PostSchema = {
  title: string;
  content: string;
  imageStorageId: string | undefined;
};

export async function createBlogAction(values: PostSchema) {
  
  try {
    const { title, content ,imageStorageId } = values;
    const token = await getToken();
    if (!token) {
      return { error: "AUTH_REQUIRED" };
    }

    await fetchMutation(
      api.posts.createPost,
      
      { title, body: content, imageStorageId: imageStorageId as Id<"_storage"> | undefined },
      { token },
    );

    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error) {
      const convexError = error as { data?: string };
      return { error: convexError.data || error.message };
    }

    return { error: "An unexpected error occurred" };
  }
}
