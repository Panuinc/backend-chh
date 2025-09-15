import { z } from "zod";
import {
  preprocessString,
  preprocessStringOptional,
  preprocessInt,
  formatData,
} from "@/lib/zodSchema";

export const userPostSchema = z.object({
  userEmail: preprocessString("Please provide a valid email").email(
    "Invalid email format"
  ),
  userPassword: preprocessString("Please provide a password").min(
    6,
    "Password must be at least 6 characters"
  ),
  userFirstName: preprocessString("Please provide first name"),
  userLastName: preprocessString("Please provide last name"),
});

export const userPutSchema = z.object({
  userId: preprocessStringOptional("User ID must be a string"),
  userEmail: preprocessStringOptional("Please provide a valid email").email(
    "Invalid email format"
  ),
  userPassword: preprocessStringOptional("Please provide a password").min(
    6,
    "Password must be at least 6 characters"
  ),
  userFirstName: preprocessStringOptional("Please provide first name"),
  userLastName: preprocessStringOptional("Please provide last name"),
});

export const formatUserData = (users) =>
  formatData(users, [], ["userCreatedAt", "userUpdatedAt"]);
