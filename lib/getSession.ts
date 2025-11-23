import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "./auth";
export const getUserSession = cache(async () => {
  try {
    return await auth.api.getSession({ headers: await headers() });
  } catch (error) {
    console.error("Session fetch error:", error);
    return null;
  }
});
