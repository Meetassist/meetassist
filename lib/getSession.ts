import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "./auth";

export const getUserSession = cache(async () => {
  try {
    const headersList = await headers();
    return await auth.api.getSession({ headers: headersList });
  } catch (error) {
    console.error("Session fetch error:", error);
    return null;
  }
});
