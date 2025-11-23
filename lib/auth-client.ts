import { createAuthClient } from "better-auth/react";
import { lastLoginMethodClient } from "better-auth/client/plugins";
if (!process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
  throw new Error("NEXT_PUBLIC_BETTER_AUTH_URL environment variable is required");
}
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [lastLoginMethodClient()],
});

export const {
  useSession,
  signIn,
  signOut,
  signUp,
  isLastUsedLoginMethod,
  getLastUsedLoginMethod,
} = authClient;
