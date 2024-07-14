import { z } from "zod";
import { DefaultSearchParams } from "./comman.schemas";


export const profileSchema = z.object({
  email:z.string().email().optional(),
  firstName: z.string().optional(),
  lastName:z.string().optional(),
  phone:z.string().optional(),  
  // fcmAndroidToken:z.string().optional().nullable(),  
})

export const AddUser = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email({ message: "Invalid email address" }),
});

export const SearchUser = DefaultSearchParams.extend({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});


export type profileSchemaType = z.infer<typeof profileSchema>;
export type UserSchema = z.infer<typeof AddUser>;
export type SearchUserSchema = z.infer<typeof SearchUser>;
