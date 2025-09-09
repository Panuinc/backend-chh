import { NextResponse } from "next/server";

export async function GET() {
  const docs = {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "Auto-generated documentation for Users API"
    },
    paths: {
      "/api/users": {
        get: { summary: "List all users", responses: { "200": { description: "OK" } } },
        post: { summary: "Create a new user" }
      },
      "/api/users/{id}": {
        get: { summary: "Get user by ID" },
        put: { summary: "Update user by ID" },
        delete: { summary: "Delete user by ID" }
      }
    }
  };
  return NextResponse.json(docs);
}
