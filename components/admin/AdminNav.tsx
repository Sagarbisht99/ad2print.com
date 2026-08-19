"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaExternalLinkAlt, FaInbox, FaSignOutAlt } from "react-icons/fa";

export function AdminNav({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={logout}
        className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
      >
        <FaSignOutAlt className="h-3 w-3" color="#ffffff" />
        Log out
      </button>
    );
  }

  const onInbox = pathname === "/admin";

  return (
    <nav className="flex flex-1 flex-col p-3">
      <Link
        href="/admin"
        className={`inline-flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${
          onInbox ? "bg-maroon text-white shadow-[0_8px_20px_rgba(178,31,45,0.35)]" : "text-white/75 hover:bg-white/5 hover:text-white"
        }`}
      >
        <FaInbox className="h-4 w-4" color="#ffffff" />
        Enquiries
      </Link>
      <Link
        href="/"
        target="_blank"
        rel="noreferrer"
        className="mt-1 inline-flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white"
      >
        <FaExternalLinkAlt className="h-3.5 w-3.5" color="#d0d1d3" />
        View website
      </Link>
      <button
        type="button"
        onClick={logout}
        className="mt-auto inline-flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-white/70 hover:bg-white/5 hover:text-white"
      >
        <FaSignOutAlt className="h-4 w-4" color="#d0d1d3" />
        Log out
      </button>
    </nav>
  );
}
