import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getProfile, requireUserProfile } from "./userProfile";

export const getGym = query({
  args: { gymId: v.id("gyms") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.gymId);
  },
});

export const listActiveGyms = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("gyms")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .collect();
  },
});

export const listAdminGyms = query({
  args: {},
  handler: async (ctx) => {
    const user = await getProfile(ctx);
    if (!user) return null;
    if (!user.isAdmin) throw new Error("Unauthorized");
    return await ctx.db.query("gyms").order("desc").collect();
  },
});

export const listMyGyms = query({
  args: {},
  handler: async (ctx) => {
    const user = await getProfile(ctx);
    if (!user) return [];
    if (!user.isGYMOwner && !user.isAdmin) return [];

    return await ctx.db
      .query("gyms")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .collect();
  },
});

export const createGym = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    address: v.string(),
    location: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    ownerEmail: v.optional(v.string()),
    image: v.optional(v.string()),
    passPrice: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await requireUserProfile(ctx);
    if (!user.isAdmin) {
      throw new Error("Unauthorized");
    }

    let ownerId: any = undefined;
    if (args.ownerEmail) {
      const ownerProfile = await ctx.db
        .query("userProfile")
        .withIndex("by_email", (q) =>
          q.eq("email", args.ownerEmail!.toLowerCase())
        )
        .first();
      if (ownerProfile) {
        ownerId = ownerProfile._id;
      }
    }

    const gymId = await ctx.db.insert("gyms", {
      ...args,
      ownerId,
      ownerEmail: args.ownerEmail?.toLowerCase(),
      isActive: true,
      createdAt: Date.now(),
    });

    return gymId;
  },
});

export const updateGym = mutation({
  args: {
    gymId: v.id("gyms"),
    name: v.string(),
    description: v.optional(v.string()),
    address: v.string(),
    location: v.object({
      lat: v.number(),
      lng: v.number(),
    }),
    ownerEmail: v.optional(v.string()),
    image: v.optional(v.string()),
    passPrice: v.optional(v.number()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await requireUserProfile(ctx);
    const gym = await ctx.db.get(args.gymId);
    if (!gym) throw new Error("Gym not found");

    // Only Admin or the owner can update
    const isOwner = gym.ownerId === user._id;
    if (!user.isAdmin && !isOwner) throw new Error("Unauthorized");

    const { gymId, ...fields } = args;

    // If owner email changed and user is admin, try to link it
    let ownerId = gym.ownerId;
    if (user.isAdmin && args.ownerEmail !== gym.ownerEmail) {
      if (args.ownerEmail) {
        const ownerProfile = await ctx.db
          .query("userProfile")
          .withIndex("by_email", (q) =>
            q.eq("email", args.ownerEmail!.toLowerCase())
          )
          .first();
        ownerId = ownerProfile ? ownerProfile._id : undefined;
      } else {
        ownerId = undefined;
      }
    }

    await ctx.db.patch(gymId, {
      ...fields,
      ownerId,
      ownerEmail: fields.ownerEmail?.toLowerCase(),
    });
  },
});

export const deleteGym = mutation({
  args: { gymId: v.id("gyms") },
  handler: async (ctx, args) => {
    const user = await requireUserProfile(ctx);
    if (!user.isAdmin) throw new Error("Unauthorized");
    await ctx.db.delete(args.gymId);
  },
});
