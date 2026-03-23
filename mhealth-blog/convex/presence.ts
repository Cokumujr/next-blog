
import { mutation, query } from "./_generated/server";
import { components } from "./_generated/api";
import { ConvexError, v } from "convex/values";
import { Presence } from "@convex-dev/presence";
import { authComponent } from "./betterAuth/auth";
import { Id } from "./betterAuth/_generated/dataModel";



export const presence = new Presence(components.presence);

export const heartbeat = mutation({
  args: {
    roomId: v.string(),
    userId: v.string(),
    sessionId: v.string(),
    interval: v.number(),
  },
  handler: async (ctx, { roomId, userId, sessionId, interval }) => {
      // TODO: Add your auth checks here.
      const user = await authComponent.safeGetAuthUser(ctx);
      if (!user || user._id !== userId) {
        throw new ConvexError("Unauthorized");
       }
    return await presence.heartbeat(ctx, roomId, userId, sessionId, interval);
  },
});

export const list = query({
  args: { roomToken: v.string() },
  handler: async (ctx, { roomToken }) => {
    const entries = await presence.list(ctx, roomToken);
    if (entries.length === 0) return [];

    // 1. Get all unique user IDs from the room
    const userIds = [...new Set(entries.map((e) => e.userId))];

    // 2. Fetch all users in one batch
    const users = await Promise.all(
      userIds.map((id) => authComponent.getAnyUserById(ctx, id))
    );

    // 3. a quick lookup map
    const userMap = new Map(
        users.filter(u => u !== null).map((u) => [u!._id, u])
    );

    // 4. Map the entries back with the user data
    return entries.map((entry) => {
      const userData = userMap.get(entry.userId as Id<"user">);
      return {
        ...entry,
        name: userData?.name ?? "Anonymous"
      };
    });
  },
});

export const disconnect = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, { sessionToken }) => {
    // Can't check auth here because it's called over http from sendBeacon.
    return await presence.disconnect(ctx, sessionToken);
  },
});

export const getUserId = query({
  args: { },
  handler: async (ctx) => {
    
    const user = await authComponent.safeGetAuthUser(ctx);
    return user?._id;
  },
});