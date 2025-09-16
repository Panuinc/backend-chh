import { getUserById, updateUser } from "@/modules/user/user.controller";

export async function GET(request, context) {
  const { userId } = await context.params;
  return getUserById(request, userId);
}

export async function PUT(request, context) {
  const { userId } = await context.params;
  return updateUser(request, userId);
}

export const dynamic = "force-dynamic";
