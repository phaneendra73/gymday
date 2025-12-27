import { MutationCtx, QueryCtx, mutation } from "./_generated/server";
import { Doc } from "./_generated/dataModel";
import { authComponent } from "./auth";

/**
 * Reads the user profile. Does NOT create one if it doesn't exist.
 */
export async function getProfile(
  ctx: QueryCtx | MutationCtx
): Promise<Doc<"userProfile"> | null> {
  const identity = await authComponent.safeGetAuthUser(ctx);
  if (!identity) {
    return null;
  }

  return await ctx.db
    .query("userProfile")
    .withIndex("by_authId", (q) => q.eq("authId", identity._id))
    .first();
}

/**
 * Ensures a user profile exists. Can only be called from mutations.
 */
export async function requireUserProfile(
  ctx: MutationCtx
): Promise<Doc<"userProfile">> {
  const identity = await authComponent.safeGetAuthUser(ctx);
  if (!identity) {
    throw new Error("Unauthenticated");
  }

  let profile = await ctx.db
    .query("userProfile")
    .withIndex("by_authId", (q) => q.eq("authId", identity._id))
    .first();

  if (!profile) {
    const profileId = await ctx.db.insert("userProfile", {
      authId: identity._id,
      email: identity.email,
      name: identity.name,
      isGYMOwner: false,
      isAdmin: false,
      createdAt: Date.now(),
    });

    profile = await ctx.db.get(profileId);
  }

  if (!profile) {
    throw new Error("Failed to create user profile");
  }

  return profile;
}

export const initProfile = mutation({
  args: {},
  handler: async (ctx: MutationCtx) => {
    return await requireUserProfile(ctx);
  },
});
