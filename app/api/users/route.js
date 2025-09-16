import {
  getAllUser,
  createUser,
} from "@/modules/user/user.controller";

export async function GET(request) {
  return getAllUser(request);
}

export async function POST(request) {
  return createUser(request);
}

export const dynamic = "force-dynamic";
