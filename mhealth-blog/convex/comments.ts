import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./betterAuth/auth";

export const getCommentsByPostById = query({
    args: { postId: v.id("posts") },
    handler: async (ctx, { postId }) => {
        const comments = await ctx.db
            .query("comments")
            .filter((q) => q.eq(q.field("postId"), postId))
            .order("desc")
            .collect();
        
        return comments;
    }
})


export const createComment = mutation({
    args: {
        postId: v.id("posts"),
        body: v.string()
    },
    handler: async (ctx, { postId, body }) => {

        const authenticatedUser = await authComponent.safeGetAuthUser(ctx);
        if (!authenticatedUser) {
                throw new ConvexError("You must be logged in to create a post");
            }

        const comment = await ctx.db.insert("comments", {
            postId,
            authorId: authenticatedUser._id,
            authorName: authenticatedUser.name,
            body
        });
        return comment;
    }
})