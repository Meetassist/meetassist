"use server";

import { headers } from "next/headers";
import { auth } from "../auth";

export async function SignInWithGoogle() {
  try {
    const result = await auth.api.signInSocial({
      body: {
        provider: "google",
        callbackURL: "/dashboard",
      },
      headers: await headers(),
    });

    return {
      url: result.url,
      success: true,
      message: "Redirecting to Google...",
    };
  } catch (error) {
    console.error("Google sign-in error:", error);
    return {
      success: false,
      message: "Failed to initiate Google sign-in",
    };
  }
}

export async function SignInWithMicrosoft() {
  try {
    const result = await auth.api.signInSocial({
      headers: await headers(),
      body: {
        provider: "microsoft",
        callbackURL: "/dashboard",
      },
    });

    return {
      success: true,
      url: result.url,
      message: "Redirecting to Microsoft...",
    };
  } catch (error) {
    console.error("Microsoft sign-in error:", error);
    return {
      success: false,
      message: "Failed to initiate Microsoft sign-in",
    };
  }
}
export async function Logout() {
  try {
    await auth.api.signOut({ headers: await headers() });
    return { success: true, message: "Log out successful" };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "There is an error with log out",
    };
  }
}
