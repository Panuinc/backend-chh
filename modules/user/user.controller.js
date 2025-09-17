import { NextResponse } from "next/server";
import { CreateUserUseCase } from "@/modules/user/usecases/createUser.usecase";
import { UpdateUserUseCase } from "@/modules/user/usecases/updateUser.usecase";
import { GetAllUserUseCase } from "@/modules/user/usecases/getAllUser.usecase";
import { GetUserByIdUseCase } from "@/modules/user/usecases/getUserById.usecase";
import { validateRequest } from "@/lib/validateRequest";
import { handleErrors, handleGetErrors } from "@/lib/errorHandler";
import { formatUserData } from "@/modules/user/user.schema";
import logger from "@/lib/logger";

export async function getAllUser(request) {
  let ip = "";
  try {
    ip = await validateRequest(request);
    logger.info({ message: "Incoming request", ip });
    logger.info({ message: "Secret token verified" });
    logger.info({ message: "Rate limit OK", ip });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "1000000", 10);

    logger.info({
      message: "Fetching all users",
      action: "getAllUser",
      page,
      limit,
    });

    const { users, total } = await GetAllUserUseCase(page, limit);

    logger.info({
      message: "Users retrieved",
      total,
      count: users.length,
      page,
      ip,
    });

    return NextResponse.json({
      message: "Successfully retrieved users",
      total,
      page,
      limit,
      user: formatUserData(users),
    });
  } catch (error) {
    return handleGetErrors(error, ip, "Failed to retrieve users");
  }
}

export async function getUserById(request, userId) {
  let ip = "";
  try {
    ip = await validateRequest(request);
    logger.info({ message: "Incoming request", ip });
    logger.info({ message: "Secret token verified" });
    logger.info({ message: "Rate limit OK", ip });

    logger.info({
      message: "Fetching user by ID",
      action: "getUserById",
      userId,
    });

    const user = await GetUserByIdUseCase(userId);

    logger.info({ message: "User found", userId, ip });

    return NextResponse.json({
      message: "Successfully retrieved user",
      user: formatUserData([user]),
    });
  } catch (error) {
    return handleGetErrors(error, ip, "Failed to retrieve user");
  }
}

export async function createUser(request) {
  let ip = "";
  try {
    if (request.method !== "POST") {
      return NextResponse.json(
        { error: "Method Not Allowed" },
        { status: 405 }
      );
    }

    ip = await validateRequest(request);
    logger.info({ message: "Incoming request", ip });

    let data = {};
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      data = await request.json();
    } else if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      data = Object.fromEntries(form.entries());

      if (form.get("file")) {
        data.file = form.get("file");
      }
    } else {
      return NextResponse.json(
        { error: "Unsupported Content-Type" },
        { status: 415 }
      );
    }

    const user = await CreateUserUseCase(data);

    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Failed to create user");
  }
}

export async function updateUser(request, userId) {
  let ip = "";
  try {
    if (request.method !== "PUT") {
      return NextResponse.json(
        { error: "Method Not Allowed" },
        { status: 405 }
      );
    }

    ip = await validateRequest(request);
    logger.info({ message: "Incoming request", ip });

    let data = {};
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      data = await request.json();
    } else if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      data = Object.fromEntries(form.entries());

      if (form.get("file")) {
        data.file = form.get("file");
      }
    } else {
      return NextResponse.json(
        { error: "Unsupported Content-Type" },
        { status: 415 }
      );
    }

    const user = await UpdateUserUseCase({ ...data, userId });

    return NextResponse.json(
      { message: "User updated successfully", user },
      { status: 200 }
    );
  } catch (error) {
    return handleErrors(error, ip, "Failed to update user");
  }
}
