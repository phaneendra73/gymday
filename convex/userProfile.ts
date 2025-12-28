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

    // If this user was pre-assigned as an owner via email, link gyms and set owner flag
    const email = identity.email?.toLowerCase();
    if (email && profile) {
      const pendingOwnerGyms = await ctx.db
        .query("gyms")
        .withIndex("by_ownerEmail", (q) => q.eq("ownerEmail", email))
        .collect();

      if (pendingOwnerGyms.length > 0) {
        // Mark user as a gym owner
        await ctx.db.patch(profile._id, { isGYMOwner: true });

        // Link all gyms that were assigned by email to this new profile
        for (const gym of pendingOwnerGyms) {
          await ctx.db.patch(gym._id, { ownerId: profile._id, ownerEmail: email });
        }
        // Refresh profile after patch
        profile = await ctx.db.get(profile._id);
      }
    }
  }

  if (!profile) {
    throw new Error("Failed to create user profile");
  }

  return profile;
}

export const initProfile = mutation({
  args: {},
  handler: async (ctx: MutationCtx) => {
    // Ensure profile exists
    let profile = await requireUserProfile(ctx);

    // Reconcile ownership: if any gyms were assigned via email, link them now
    const email = profile.email?.toLowerCase();
    if (email) {
      const pendingOwnerGyms = await ctx.db
        .query("gyms")
        .withIndex("by_ownerEmail", (q) => q.eq("ownerEmail", email))
        .collect();

      // Link gyms missing ownerId or linked to a different profile
      const toLink = pendingOwnerGyms.filter(
        (g) => !g.ownerId || g.ownerId !== profile._id
      );

      if (toLink.length > 0) {
        // Set owner flag on the profile
        await ctx.db.patch(profile._id, { isGYMOwner: true });
        for (const gym of toLink) {
          await ctx.db.patch(gym._id, { ownerId: profile._id, ownerEmail: email });
        }
        profile = (await ctx.db.get(profile._id))!;
      }
    }

    // If no email-assigned gyms were found/linked, but gyms already reference this profile, mark as owner
    const ownedGyms = await ctx.db
      .query("gyms")
      .withIndex("by_owner", (q) => q.eq("ownerId", profile._id))
      .collect();
    if (ownedGyms.length > 0 && !profile.isGYMOwner) {
      await ctx.db.patch(profile._id, { isGYMOwner: true });
      profile = (await ctx.db.get(profile._id))!;
    }

    return profile;
  },
});
