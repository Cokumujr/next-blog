import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./betterAuth/auth";

export const createPost = mutation({
    args: { title: v.string(), body: v.string(), imageStorageId: v.optional(v.id("_storage")) },
    handler: async (ctx, args) => {
        const authenticatedUser = await authComponent.safeGetAuthUser(ctx);
        if (!authenticatedUser) {
            throw new ConvexError("You must be logged in to create a post");
        }
        const blogPost = await ctx.db.insert("posts", {
            title: args.title,
            body: args.body,
            authorId: authenticatedUser._id,
            imageStorageId: args.imageStorageId,
        })
        if (!args.imageStorageId) {
            

        }
        return blogPost;
    }

})

export const getPosts = query({
    args:{},
    handler: async (ctx) => {
        const posts = await ctx.db.query("posts").order("desc").collect();
        return await Promise.all(posts.map(async (post) => {
            const resolvedImageUrl = post.imageStorageId ? await ctx.storage.getUrl(post.imageStorageId) : null;

            return {
                ...post,
                imageUrl: resolvedImageUrl,
            }
         }));
       
    }
})

export const generateImageUrl = mutation({
    args: {},
    handler: async (ctx) => { 
        const authenticatedUser = await authComponent.safeGetAuthUser(ctx);
        if (!authenticatedUser) {
            throw new ConvexError("You must be logged in to create a post");
        }

        return await ctx.storage.generateUploadUrl();


    }
    
})