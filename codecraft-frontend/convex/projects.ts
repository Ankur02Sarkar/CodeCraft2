import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Create a new project
export const createProject = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    userId: v.id("users"),
    files: v.optional(v.array(v.object({
      path: v.string(),
      content: v.string(),
      language: v.string(),
    }))),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Create the project
    const projectId = await ctx.db.insert("projects", {
      name: args.name,
      description: args.description,
      userId: args.userId,
      createdAt: now,
      updatedAt: now,
    });

    // Add files if provided
    if (args.files) {
      for (const file of args.files) {
        await ctx.db.insert("projectFiles", {
          projectId,
          path: file.path,
          content: file.content,
          language: file.language,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    return projectId;
  },
});

// Get a project by ID with files and chat messages
export const getProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) return null;

    // Get project files
    const files = await ctx.db
      .query("projectFiles")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    // Get chat messages
    const chatMessages = await ctx.db
      .query("chatMessages")
      .withIndex("by_project_timestamp", (q) => q.eq("projectId", args.projectId))
      .order("asc")
      .collect();

    return {
      ...project,
      files: files.map(file => ({
        path: file.path,
        content: file.content,
        language: file.language,
      })),
      chat_messages: chatMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp).toISOString(),
      })),
    };
  },
});

// Get all projects for a user
export const getUserProjects = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    // Get files and chat messages for each project
    const projectsWithDetails = await Promise.all(
      projects.map(async (project) => {
        const files = await ctx.db
          .query("projectFiles")
          .withIndex("by_project", (q) => q.eq("projectId", project._id))
          .collect();

        const chatMessages = await ctx.db
          .query("chatMessages")
          .withIndex("by_project", (q) => q.eq("projectId", project._id))
          .collect();

        return {
          id: project._id,
          name: project.name,
          description: project.description,
          created_at: new Date(project.createdAt).toISOString(),
          updated_at: new Date(project.updatedAt).toISOString(),
          files: files.map(file => ({
            path: file.path,
            content: file.content,
            language: file.language,
          })),
          chat_messages: chatMessages.map(msg => ({
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.timestamp).toISOString(),
          })),
        };
      })
    );

    return projectsWithDetails;
  },
});

// Update project files
export const updateProjectFiles = mutation({
  args: {
    projectId: v.id("projects"),
    files: v.array(v.object({
      path: v.string(),
      content: v.string(),
      language: v.string(),
    })),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Delete existing files
    const existingFiles = await ctx.db
      .query("projectFiles")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    for (const file of existingFiles) {
      await ctx.db.delete(file._id);
    }

    // Insert new files
    for (const file of args.files) {
      await ctx.db.insert("projectFiles", {
        projectId: args.projectId,
        path: file.path,
        content: file.content,
        language: file.language,
        createdAt: now,
        updatedAt: now,
      });
    }

    // Update project timestamp
    await ctx.db.patch(args.projectId, {
      updatedAt: now,
    });

    return true;
  },
});

// Add a chat message
export const addChatMessage = mutation({
  args: {
    projectId: v.id("projects"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const messageId = await ctx.db.insert("chatMessages", {
      projectId: args.projectId,
      role: args.role,
      content: args.content,
      timestamp: now,
      userId: args.userId,
    });

    // Update project timestamp
    await ctx.db.patch(args.projectId, {
      updatedAt: now,
    });

    return messageId;
  },
});

// Delete a project
export const deleteProject = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    // Delete project files
    const files = await ctx.db
      .query("projectFiles")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    for (const file of files) {
      await ctx.db.delete(file._id);
    }

    // Delete chat messages
    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    // Delete the project
    await ctx.db.delete(args.projectId);

    return true;
  },
});

// Generate code using AI (action that calls external API)
export const generateCode = mutation({
  args: {
    prompt: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // This will be implemented to call the backend API
    // For now, return a mock response
    const now = Date.now();
    
    // Create a new project with generated code
    const projectId = await ctx.db.insert("projects", {
      name: "Generated Project",
      description: "AI-generated project",
      userId: args.userId,
      createdAt: now,
      updatedAt: now,
    });

    // Add sample files (this will be replaced with actual AI generation)
    const sampleFiles = [
      {
        path: "/App.js",
        content: `import React from 'react';

function App() {
  return (
    <div className="App">
      <h1>Hello World!</h1>
      <p>This is a generated React app.</p>
    </div>
  );
}

export default App;`,
        language: "javascript",
      },
      {
        path: "/index.html",
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated App</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>`,
        language: "html",
      },
    ];

    for (const file of sampleFiles) {
      await ctx.db.insert("projectFiles", {
        projectId,
        path: file.path,
        content: file.content,
        language: file.language,
        createdAt: now,
        updatedAt: now,
      });
    }

    return {
      project_id: projectId,
      name: "Generated Project",
      description: "AI-generated project",
      files: sampleFiles,
    };
  },
});