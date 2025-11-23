import * as z from "zod";

//Login types
export const LoginSchema = z.object({
  email: z.email("Please enter a valid email").max(50),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters")
    .max(20),
});

//Signup Types
export const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters")
    .max(20),
});

//forgetpassword types
export const ForgetPasswordSchema = z.object({
  email: z.email("Please enter a valid email address").max(50),
});

export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(10, "Password must be at least 10 characters")
      .max(20),
    confirmPassword: z
      .string()
      .min(10, "Password must be at least 10 characters")
      .max(20),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match!",
    path: ["confirmPassword"],
  });
export type TSignUpSchema = z.infer<typeof SignupSchema>;
export type TForgetPasswordSchema = z.infer<typeof ForgetPasswordSchema>;
export type TResetPasswordSchema = z.infer<typeof ResetPasswordSchema>;
