"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaEnvelope,
  FaFilter,
  FaFolderOpen,
  FaInbox,
  FaPhoneAlt,
  FaSearch,
  FaWhatsapp,
} from "react-icons/fa";
import { AdminShell } from "@/components/admin/AdminShell";
import { EnquiryActionsMenu } from "@/components/admin/EnquiryActionsMenu";

type EnquiryStatus = "pending" | "opened" | "resolved";

type EnquiryItem = {
  id: string;
  name: string;
  mobile: string;
  email: string;
  message: string;
  category: string;
  source: "contact" | "popup" | "category" | "newspaper";
  status: EnquiryStatus;
  createdAt: string;
};

const PAGE_SIZE = 10;

const SOURCE_LABEL: Record<EnquiryItem["source"], string> = {
  contact: "Contact page",
  popup: "Popup",
  category: "Category popup",
  newspaper: "Newspaper page",
};

const STATUS_LABEL: Record<EnquiryStatus, string> = {
  pending: "Pending",
  opened: "Opened",
  resolved: "Resolved",
};

function statusClass(status: EnquiryStatus) {
  if (status === "pending") return "bg-maroon text-white";
  if (status === "opened") return "bg-amber-500/20 text-amber-200";
  return "bg-emerald-500/20 text-emerald-200";
}

const selectClass =
  "w-full rounded-lg border border-white/10 bg-[#141518] px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-maroon/50";

export default function AdminDashboardPage() {
  const [items, setItems] = useState<EnquiryItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<"all" | EnquiryItem["source"]>("all");
  const [status, setStatus] = useState<"all" | EnquiryStatus>("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<EnquiryItem | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<EnquiryItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/enquiries", { cache: "no-store" });
    if (!res.ok) {
      setError("Could not load enquiries. Check MongoDB connection.");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setItems(data.items ?? []);
    setError("");
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [query, source, status]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (source !== "all" && item.source !== source) return false;
      if (status !== "all" && item.status !== status) return false;
      if (!q) return true;
      return [item.name, item.email, item.mobile, item.message, item.category]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [items, query, source, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const pendingCount = items.filter((item) => item.status === "pending").length;
  const openedCount = items.filter((item) => item.status === "opened").length;
  const resolvedCount = items.filter((item) => item.status === "resolved").length;

  async function setItemStatus(item: EnquiryItem, next: EnquiryStatus) {
    await fetch(`/api/admin/enquiries/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setItems((prev) => prev.map((row) => (row.id === item.id ? { ...row, status: next } : row)));
    setSelected((cur) => (cur?.id === item.id ? { ...cur, status: next } : cur));
  }

  function askDelete(item: EnquiryItem) {
    setMenuId(null);
    setToDelete(item);
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    await fetch(`/api/admin/enquiries/${toDelete.id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((row) => row.id !== toDelete.id));
    setSelected((cur) => (cur?.id === toDelete.id ? null : cur));
    setToDelete(null);
    setDeleting(false);
  }

  return (
    <AdminShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-3">
          <span className="mt-1 flex h-11 w-11 items-center justify-center rounded-xl bg-maroon text-white">
            <FaInbox className="h-5 w-5" color="#ffffff" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-maroon-soft">Inbox</p>
            <h1 className="mt-1 font-display text-3xl">Enquiries</h1>
            <p className="mt-2 text-sm text-white/55">
              Contact page, popup, category, and newspaper form submissions.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Pending" value={pendingCount} accent icon={<FaClock color="#ffffff" />} />
          <Stat label="Opened" value={openedCount} icon={<FaFolderOpen color="#ffffff" />} />
          <Stat label="Resolved" value={resolvedCount} icon={<FaCheckCircle color="#ffffff" />} />
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px]">
          <div className="relative">
            <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2" color="#d0d1d3" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, mobile, email, message…"
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm outline-none placeholder:text-white/30 focus:ring-2 focus:ring-maroon/50"
            />
          </div>
          <div className="relative">
            <FaFilter className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2" color="#d0d1d3" />
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as typeof source)}
              className={`${selectClass} pl-9`}
              aria-label="Filter by source"
            >
            <option value="all">All sources</option>
            <option value="contact">Contact page</option>
            <option value="popup">Popup</option>
            <option value="category">Category popup</option>
            <option value="newspaper">Newspaper page</option>
            </select>
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className={selectClass}
            aria-label="Filter by status"
          >
            <option value="all">All status</option>
            <option value="pending">Pending</option>
            <option value="opened">Opened</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {error ? (
          <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        ) : null}

        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1b1c20]">
          {loading ? (
            <p className="px-5 py-10 text-center text-sm text-white/50">Loading enquiries…</p>
          ) : filtered.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-white/50">No enquiries yet.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[920px] text-left text-sm">
                  <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-white/45">
                    <tr>
                      <th className="px-4 py-3 font-medium">When</th>
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Mobile</th>
                      <th className="px-4 py-3 font-medium">Email</th>
                      <th className="px-4 py-3 font-medium">Message</th>
                      <th className="px-4 py-3 font-medium">Source</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="w-14 px-3 py-3 font-medium">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => {
                          setMenuId(null);
                          setSelected(item);
                        }}
                        className={`cursor-pointer border-b border-white/5 hover:bg-white/5 ${
                          item.status === "pending" ? "bg-maroon/10 font-medium text-white" : "text-white/75"
                        }`}
                      >
                        <td className="whitespace-nowrap px-4 py-3.5">
                          {new Date(item.createdAt).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="max-w-[160px] px-4 py-3.5 break-words">{item.name}</td>
                        <td className="whitespace-nowrap px-4 py-3.5">{item.mobile}</td>
                        <td className="max-w-[220px] px-4 py-3.5 break-all">{item.email}</td>
                        <td className="max-w-[280px] px-4 py-3.5 text-white/70">
                          <span className="line-clamp-2">{item.message}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <p>{SOURCE_LABEL[item.source]}</p>
                          {item.category ? (
                            <p className="mt-0.5 text-xs font-normal text-white/45">{item.category}</p>
                          ) : null}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(item.status)}`}>
                            {STATUS_LABEL[item.status]}
                          </span>
                        </td>
                        <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <EnquiryActionsMenu
                            open={menuId === item.id}
                            currentStatus={item.status}
                            onToggle={() => setMenuId((id) => (id === item.id ? null : item.id))}
                            onClose={() => setMenuId(null)}
                            onView={() => setSelected(item)}
                            onStatus={(next) => void setItemStatus(item, next)}
                            onDelete={() => askDelete(item)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                page={currentPage}
                pageCount={pageCount}
                total={filtered.length}
                onPage={setPage}
              />
            </>
          )}
        </div>
      </div>

      {toDelete ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-4 sm:items-center">
          <div className="absolute inset-0" onClick={() => !deleting && setToDelete(null)} />
          <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#1b1c20] p-6 shadow-2xl">
            <h2 className="font-display text-xl">Delete enquiry?</h2>
            <p className="mt-2 text-sm text-white/60">
              This will remove the enquiry from {toDelete.name}. This cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setToDelete(null)}
                className="rounded-full border border-white/15 px-4 py-2 text-sm hover:bg-white/5 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => void confirmDelete()}
                className="rounded-full bg-maroon px-4 py-2 text-sm font-semibold text-white hover:bg-maroon-deep disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
          <div className="absolute inset-0" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#1b1c20] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-maroon-soft">
                  {SOURCE_LABEL[selected.source]}
                </p>
                <h2 className="mt-2 font-display text-2xl break-words">{selected.name}</h2>
                <p className="mt-1 text-sm text-white/50">
                  {new Date(selected.createdAt).toLocaleString("en-IN")}
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(selected.status)}`}>
                {STATUS_LABEL[selected.status]}
              </span>
            </div>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-white/45">Mobile</dt>
                <dd className="flex items-center gap-2">
                  <a href={`tel:${selected.mobile}`} className="text-maroon-soft hover:underline">
                    {selected.mobile}
                  </a>
                  <a
                    href={`https://wa.me/91${selected.mobile.replace(/\D/g, "").slice(-10)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#25D366]"
                    aria-label="WhatsApp"
                  >
                    <FaWhatsapp className="h-4 w-4" />
                  </a>
                  <a href={`tel:${selected.mobile}`} className="text-white/50" aria-label="Call">
                    <FaPhoneAlt className="h-3.5 w-3.5" />
                  </a>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-white/45">Email</dt>
                <dd className="flex items-center gap-2">
                  <a href={`mailto:${selected.email}`} className="break-all text-maroon-soft hover:underline">
                    {selected.email}
                  </a>
                  <FaEnvelope className="h-3.5 w-3.5 shrink-0 text-white/40" />
                </dd>
              </div>
              {selected.category ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-white/45">Category / paper</dt>
                  <dd className="text-right">{selected.category}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-white/45">Message</dt>
                <dd className="mt-1 whitespace-pre-wrap break-words text-white/90">{selected.message}</dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              {(["pending", "opened", "resolved"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => void setItemStatus(selected, value)}
                  className={`rounded-full px-4 py-2 text-sm ${
                    selected.status === value
                      ? "bg-maroon font-semibold text-white"
                      : "border border-white/15 hover:bg-white/5"
                  }`}
                >
                  {STATUS_LABEL[value]}
                </button>
              ))}
              <button
                type="button"
                onClick={() => askDelete(selected)}
                className="rounded-full border border-red-400/30 px-4 py-2 text-sm text-red-200 hover:bg-red-500/10"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="ml-auto rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/15"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminShell>
  );
}

function Pagination({
  page,
  pageCount,
  total,
  onPage,
}: {
  page: number;
  pageCount: number;
  total: number;
  onPage: (page: number) => void;
}) {
  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="flex flex-col gap-3 border-t border-white/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-white/45">
        Showing {from}–{to} of {total}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className="inline-flex items-center gap-1 rounded-lg border border-white/15 px-3 py-1.5 text-sm disabled:opacity-30"
        >
          <FaChevronLeft className="h-3 w-3" color="#ffffff" />
          Previous
        </button>
        <span className="min-w-16 text-center text-sm text-white/70">
          {page} / {pageCount}
        </span>
        <button
          type="button"
          disabled={page >= pageCount}
          onClick={() => onPage(page + 1)}
          className="inline-flex items-center gap-1 rounded-lg border border-white/15 px-3 py-1.5 text-sm disabled:opacity-30"
        >
          Next
          <FaChevronRight className="h-3 w-3" color="#ffffff" />
        </button>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: number;
  accent?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border px-5 py-4 ${accent ? "border-maroon/40 bg-maroon/15" : "border-white/10 bg-[#1b1c20]"}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-white/45">{label}</p>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${accent ? "bg-maroon" : "bg-white/10"}`}>
          {icon}
        </span>
      </div>
      <p className="mt-2 font-display text-3xl">{value}</p>
    </div>
  );
}
