"use client";

import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  user: User;
};

export default function UserMenu({ user }: Props) {
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const avatarUrl = user.user_metadata?.avatar_url;
  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "User";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors duration-150"
        style={{
          border: "1px solid rgba(240, 240, 248, 0.08)",
          background: open ? "rgba(240, 240, 248, 0.05)" : "transparent",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "rgba(240, 240, 248, 0.05)";
        }}
        onMouseLeave={(e) => {
          if (!open) {
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
          }
        }}
      >
        {/* Avatar */}
        <div
          className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(200, 240, 76, 0.15)" }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              width={24}
              height={24}
              className="w-full h-full object-cover"
            />
          ) : (
            <span
              className="text-xs font-mono font-medium"
              style={{ color: "var(--acid)" }}
            >
              {name[0]?.toUpperCase()}
            </span>
          )}
        </div>

        <span className="text-xs text-ghost-dim hidden sm:block max-w-[100px] truncate">
          {name}
        </span>

        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          className="text-ghost-faint"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute right-0 top-full mt-2 w-52 rounded-xl border z-50 overflow-hidden"
            style={{
              background: "rgba(20, 20, 30, 0.98)",
              borderColor: "rgba(240, 240, 248, 0.1)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* User info */}
            <div
              className="px-4 py-3 border-b"
              style={{ borderColor: "rgba(240, 240, 248, 0.06)" }}
            >
              <p className="text-xs font-medium text-ghost truncate">{name}</p>
              <p className="text-xs text-ghost-faint truncate mt-0.5">
                {user.email}
              </p>
            </div>

            {/* Sign out */}
            <div className="p-1.5">
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors duration-150 disabled:opacity-50"
                style={{ color: "#f87171" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(248, 113, 113, 0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
                }}
              >
                {signingOut ? (
                  <svg
                    className="animate-spin"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                {signingOut ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
