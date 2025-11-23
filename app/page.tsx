import Link from "next/link";
export default async function Home() {
  return (
    <div className="bg-secondary h-dvh w-full">
      <h1>Hello</h1>
      <Link href={"/dashboard"}>dashboard home</Link>
      <Link href={"/login"}>Login</Link>
    </div>
  );
}
