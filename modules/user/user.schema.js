import { z } from "zod";
import { preprocessString, preprocessEnum, formatData } from "@/lib/zodSchema";

export const userPostSchema = z.object({
  userFirstName: preprocessString("Please provide the first name"),
  userLastName: preprocessString("Please provide the last name"),
  userEmail: preprocessString("Please provide the email"),
  userCreateBy: preprocessString("Please provide the creator's user ID"),
});

export const userPutSchema = z.object({
  userId: preprocessString("Please provide the user ID to update"),
  userFirstName: preprocessString("Please provide the first name"),
  userLastName: preprocessString("Please provide the last name"),
  userEmail: preprocessString("Please provide the email"),
  userStatus: preprocessEnum(["Enable", "Disable"], "Please provide status"),
  userUpdateBy: preprocessString("Please provide the updater's user ID"),
});

export const formatUserData = (users) =>
  formatData(users, [], ["userCreateAt", "userUpdateAt"]);
