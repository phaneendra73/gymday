import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  userProfile: defineTable({
    authId: v.string(), // linked to BetterAuth
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    isGYMOwner: v.boolean(),
    isAdmin: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_authId", ["authId"])
    .index("by_email", ["email"]),

  gyms: defineTable({
    ownerId: v.optional(v.id("userProfile")), // The profile that owns this gym
    ownerEmail: v.optional(v.string()), // For initial invitation/assignment

    name: v.string(),
    description: v.optional(v.string()),
    address: v.string(),
    location: v.object({
      lat: v.number(),
      lng: v.number(),
    }),

    image: v.optional(v.string()), // Added for detail page visual
    passPrice: v.optional(v.number()), // Price in cents

    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_ownerEmail", ["ownerEmail"]),

  bookings: defineTable({
    userId: v.id("userProfile"),
    gymId: v.id("gyms"),

    bookingDay: v.string(), // Format "YYYY-MM-DD"
    status: v.union(
      v.literal("booked"),
      v.literal("checked-in"),
      v.literal("cancelled")
    ),

    checkedInAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_gym", ["gymId"])
    .index("by_gym_and_day", ["gymId", "bookingDay"]),
});
