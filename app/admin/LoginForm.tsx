"use client";

import { useState, useTransition } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    startTransition(async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
          setMessage(error.message);
          return;
        }

        window.location.reload();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to sign in.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md space-y-5 border border-[#102A4C]/10 bg-white p-8">
      <div>
        <h1 className="text-2xl font-extrabold text-[#071426]">Admin Login</h1>
        <p className="mt-2 text-sm leading-6 text-[#52657C]">
          Sign in with your Supabase admin account to edit portfolio content.
        </p>
      </div>
      <label className="block text-sm font-bold text-[#071426]">
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full border border-[#102A4C]/12 px-4 py-3 text-sm"
          required
        />
      </label>
      <label className="block text-sm font-bold text-[#071426]">
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full border border-[#102A4C]/12 px-4 py-3 text-sm"
          required
        />
      </label>
      {message ? <p className="text-sm font-semibold text-[#B91C1C]">{message}</p> : null}
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-12 items-center justify-center bg-[#0057D9] px-5 text-sm font-bold text-white disabled:opacity-60"
      >
        {isPending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}

