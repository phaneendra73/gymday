import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getProfile, requireUserProfile } from "./userProfile";

export const bookDayPass = mutation({
  args: {
    gymId: v.id("gyms"),
    bookingDay: v.string(), // "YYYY-MM-DD"
  },
  handler: async (ctx, args) => {
    const user = await requireUserProfile(ctx);

    // Check if gym exists and is active
    const gym = await ctx.db.get(args.gymId);
    if (!gym || !gym.isActive) throw new Error("Gym not available");

    // Prevent double booking for the same day
    const existing = await ctx.db
      .query("bookings")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("bookingDay"), args.bookingDay))
      .filter((q) => q.neq(q.field("status"), "cancelled"))
      .first();

    if (existing) throw new Error("You already have a pass for this day");

    const bookingId = await ctx.db.insert("bookings", {
      userId: user._id,
      gymId: args.gymId,
      bookingDay: args.bookingDay,
      status: "booked",
      createdAt: Date.now(),
    });

    return bookingId;
  },
});

export const listMyBookings = query({
  args: {},
  handler: async (ctx) => {
    const user = await getProfile(ctx);
    if (!user) return [];

    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    // Enrich with gym info
    return await Promise.all(
      bookings.map(async (b) => ({
        ...b,
        gym: await ctx.db.get(b.gymId),
      }))
    );
  },
});

export const listGymBookings = query({
  args: { gymId: v.id("gyms") },
  handler: async (ctx, args) => {
    const user = await getProfile(ctx);
    if (!user) throw new Error("Unauthorized");

    const gym = await ctx.db.get(args.gymId);
    if (!gym) throw new Error("Gym not found");

    if (!user.isAdmin && gym.ownerId !== user._id) {
      throw new Error("Unauthorized");
    }

    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_gym", (q) => q.eq("gymId", args.gymId))
      .order("desc")
      .collect();

    return await Promise.all(
      bookings.map(async (b) => ({
        ...b,
        user: await ctx.db.get(b.userId),
      }))
    );
  },
});

export const listAllBookings = query({
  args: {},
  handler: async (ctx) => {
    const user = await getProfile(ctx);
    if (!user) throw new Error("Unauthenticated");
    if (!user.isAdmin)
      throw new Error("Unauthorized: Admin privileges required");

    const bookings = await ctx.db.query("bookings").order("desc").collect();

    return await Promise.all(
      bookings.map(async (b) => ({
        ...b,
        user: await ctx.db.get(b.userId),
        gym: await ctx.db.get(b.gymId),
      }))
    );
  },
});

export const checkIn = mutation({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    const user = await requireUserProfile(ctx);
    const booking = await ctx.db.get(args.bookingId);
    if (!booking) throw new Error("Booking not found");

    const gym = await ctx.db.get(booking.gymId);
    if (!gym) throw new Error("Gym not found");

    if (!user.isAdmin && gym.ownerId !== user._id) {
      throw new Error("Unauthorized");
    }

    if (booking.status !== "booked") {
      throw new Error(`Cannot check in. Status is ${booking.status}`);
    }

    await ctx.db.patch(args.bookingId, {
      status: "checked-in",
      checkedInAt: Date.now(),
    });
  },
});

export const cancelBooking = mutation({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, args) => {
    const user = await requireUserProfile(ctx);
    const booking = await ctx.db.get(args.bookingId);
    if (!booking) throw new Error("Booking not found");

    if (booking.userId !== user._id && !user.isAdmin) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.bookingId, {
      status: "cancelled",
    });
  },
});
