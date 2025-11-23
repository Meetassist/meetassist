import { LoginForm } from "@/components/authForms/LoginForm";
import { Authside } from "@/components/Authside";

export default function Page() {
  return (
    <main className="flex w-full" aria-label="Login page">
      <LoginForm />
      <Authside />
    </main>
  );
}
