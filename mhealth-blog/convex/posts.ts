import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./betterAuth/auth";
import { Doc } from "./_generated/dataModel";

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

export const getPostById = query({
    args: { postId: v.id("posts") },
    handler: async (ctx, args) => {
        const post = await ctx.db.get(args.postId);
        if (!post) {
            throw new ConvexError("Post not found");
        }
        const resolvedImageUrl = post.imageStorageId ? await ctx.storage.getUrl(post.imageStorageId) : null;

        return {
            ...post,
            imageUrl: resolvedImageUrl,
        }
    }
})

interface searchResultTypes {
    _id: string;
    title: string;
    body: string;

}
export const searchPosts = query({
    args: {
        term: v.string(),
        limit:v.number(),
    },
    handler: async (ctx,args) => {
        const limit = args.limit;
        const results: Array<searchResultTypes> = [];

        const seen = new Set();
        const pushDocs = async (docs: Array<Doc<"posts">>) => {
            for (const doc of docs) {
                if (seen.has(doc._id)) continue;
                seen.add(doc._id);
                results.push({
                    _id: doc._id,
                    title: doc.title,
                    body: doc.body,
                })
                if (results.length >= limit) break;
            }
        };

        const titleMatches = await ctx.db.query("posts")
            .withSearchIndex("search_title", (q) => q.search("title", args.term))
            .take(limit)
        
        await pushDocs(titleMatches);

        if (results.length < limit) {
            const bodyMatches = await ctx.db.query("posts").withSearchIndex
                ("search_body", (q) => q.search("body", args.term))
                .take(limit)
            await pushDocs(bodyMatches)

        }

        return results



    }
})