"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaEllipsisV } from "react-icons/fa";

type EnquiryStatus = "pending" | "opened" | "resolved";

const STATUS_LABEL: Record<EnquiryStatus, string> = {
  pending: "Pending",
  opened: "Opened",
  resolved: "Resolved",
};

export function EnquiryActionsMenu({
  open,
  currentStatus,
  onToggle,
  onClose,
  onView,
  onStatus,
  onDelete,
}: {
  open: boolean;
  currentStatus: EnquiryStatus;
  onToggle: () => void;
  onClose: () => void;
  onView: () => void;
  onStatus: (status: EnquiryStatus) => void;
  onDelete: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, up: false });

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const width = 160;
    const up = rect.bottom + 200 > window.innerHeight;
    setCoords({
      top: up ? rect.top - 4 : rect.bottom + 4,
      left: Math.max(8, Math.min(rect.right - width, window.innerWidth - width - 8)),
      up,
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      const target = e.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onClose, true);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onClose, true);
    };
  }, [open, onClose]);

  const items: { label: string; onClick: () => void; danger?: boolean; active?: boolean }[] = [
    {
      label: "View",
      onClick: () => {
        onView();
        onClose();
      },
    },
    ...(["pending", "opened", "resolved"] as const).map((value) => ({
      label: STATUS_LABEL[value],
      active: currentStatus === value,
      onClick: () => {
        onStatus(value);
        onClose();
      },
    })),
    {
      label: "Delete",
      danger: true,
      onClick: () => {
        onClose();
        onDelete();
      },
    },
  ];

  return (
    <div ref={rootRef} className="flex justify-end">
      <button
        ref={buttonRef}
        type="button"
        aria-label="Actions"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={`flex h-8 w-8 items-center justify-center rounded-md text-white/50 hover:bg-white/10 hover:text-white ${
          open ? "bg-white/10 text-white" : ""
        }`}
      >
        <FaEllipsisV className="h-3.5 w-3.5" />
      </button>
      {open
        ? createPortal(
            <div
              ref={menuRef}
              role="menu"
              style={{
                top: coords.top,
                left: coords.left,
                transform: coords.up ? "translateY(-100%)" : undefined,
              }}
              className="fixed z-80 w-40 rounded-lg border border-white/10 bg-[#16171b] py-1 text-sm shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {items.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  onClick={item.onClick}
                  className={`block w-full px-3 py-1.5 text-left ${
                    item.danger
                      ? "text-red-300 hover:bg-white/5"
                      : item.active
                        ? "text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
