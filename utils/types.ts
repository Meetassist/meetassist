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

export const CreateMeetingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  duration: z
    .number()
    .min(15, "Duration must be at least 15 minutes")
    .max(480, "Duration cannot exceed 8 hours"),
  maxParticipants: z
    .number()
    .min(1, "At least 1 participant required")
    .max(1000, "Maximum 1000 participants allowed"),
  url: z.string(),
  videoCallSoftware: z.string().min(1, "Please select a video platform"),
});

export const BookingFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  guestEmail: z.email("Email address is requird"),
  guestEmails: z.array(z.email()).optional(),
  userEmail: z.string(),
  eventTypeId: z.string(),
  fromTime: z.string(),
  eventDate: z.string(),
});

export type TBookingFormSchema = z.infer<typeof BookingFormSchema>;
export type TCreateMeetingSchema = z.infer<typeof CreateMeetingSchema>;
export type TSignUpSchema = z.infer<typeof SignupSchema>;
export type TForgetPasswordSchema = z.infer<typeof ForgetPasswordSchema>;
export type TResetPasswordSchema = z.infer<typeof ResetPasswordSchema>;
