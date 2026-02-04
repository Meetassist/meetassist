"use client";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
type ErrorBoundary = {
  error: Error;
  reset: () => void;
};

export default function ErrorBoundary({ error, reset }: ErrorBoundary) {
  console.error(error);
  const router = useRouter();
  function reload() {
    startTransition(() => {
      router.refresh();
      reset();
    });
  }
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-4">
      <p className="font-inter text-center text-xl text-red-500">
        Oops, something went wrong. But don&apos;t worry — it&apos;s not your
        fault.
      </p>
      <button
        onClick={reload}
        className="font-secondary cursor-pointer rounded-sm border-2 border-red-500 px-5 py-2 text-base text-black uppercase hover:scale-[1.2]"
      >
        Retry
      </button>
    </div>
  );
}
