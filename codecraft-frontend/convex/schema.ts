import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  projects: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    userId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_created_at", ["createdAt"]),

  projectFiles: defineTable({
    projectId: v.id("projects"),
    path: v.string(),
    content: v.string(),
    language: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_project_path", ["projectId", "path"]),

  chatMessages: defineTable({
    projectId: v.id("projects"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    timestamp: v.number(),
    userId: v.optional(v.id("users")),
  })
    .index("by_project", ["projectId"])
    .index("by_project_timestamp", ["projectId", "timestamp"]),
});