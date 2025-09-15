import { z } from "zod";

export const userPostSchema = z.object({
  userEmail: z.string().email(),
  userPassword: z.string().min(6),
  userFirstName: z.string(),
  userLastName: z.string(),
});

export const userPutSchema = z.object({
  userId: z.string().optional(),
  userEmail: z.string().email().optional(),
  userPassword: z.string().min(6).optional(),
  userFirstName: z.string().optional(),
  userLastName: z.string().optional(),
});
