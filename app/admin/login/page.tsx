"use client";

import Image from "next/image";
import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: String(form.get("username") ?? ""),
        password: String(form.get("password") ?? ""),
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not log in.");
      return;
    }
    const from = searchParams.get("from") || "/admin";
    router.replace(from.startsWith("/admin") ? from : "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-white/70">Username</span>
        <div className="relative">
          <FaUser className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2" color="#111111" />
          <input
            name="username"
            type="text"
            autoComplete="username"
            required
            className="w-full rounded-lg border border-white/20 bg-white py-2.5 pl-10 pr-3 text-sm text-ink outline-none placeholder:text-charcoal focus:ring-2 focus:ring-maroon/60"
            placeholder="admin"
          />
        </div>
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium text-white/70">Password</span>
        <div className="relative">
          <FaLock className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2" color="#111111" />
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className="w-full rounded-lg border border-white/20 bg-white py-2.5 pl-10 pr-11 text-sm text-ink outline-none placeholder:text-charcoal focus:ring-2 focus:ring-maroon/60"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-ink hover:bg-black/5"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <FaEyeSlash className="h-4 w-4" color="#111111" />
            ) : (
              <FaEye className="h-4 w-4" color="#111111" />
            )}
          </button>
        </div>
      </label>
      {error ? (
        <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-maroon py-3 text-sm font-semibold text-white hover:bg-maroon-deep disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1b1c20] p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white">
            <Image src="/logo.png" alt="AD2PRINT" width={56} height={56} className="h-12 w-12 object-contain" />
          </div>
          <h1 className="mt-5 font-display text-2xl">Admin login</h1>
          <p className="mt-2 text-sm text-white/55">Sign in to view contact and popup enquiries.</p>
        </div>
        <Suspense fallback={<p className="mt-8 text-center text-sm text-white/50">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
