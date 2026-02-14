"use client";

import { useState } from "react";

type Bookmark = {
  id: string;
  url: string;
  title: string;
  user_id: string;
  created_at: string;
};

type Props = {
  bookmark: Bookmark;
  onDelete: (id: string) => Promise<void>;
};

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

function getFaviconUrl(url: string) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return null;
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function BookmarkCard({ bookmark, onDelete }: Props) {
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const domain = getDomain(bookmark.url);
  const faviconUrl = getFaviconUrl(bookmark.url);

  const handleDelete = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000);
      return;
    }
    setDeleting(true);
    await onDelete(bookmark.id);
  };

  return (
    <div
      className="bookmark-card rounded-xl border flex items-start gap-4 px-4 py-3.5 group"
      style={{
        background: "rgba(20, 20, 30, 0.5)",
        borderColor: "rgba(240, 240, 248, 0.07)",
      }}
    >
      {/* Favicon */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden"
        style={{ background: "rgba(10, 10, 15, 0.8)" }}
      >
        {faviconUrl ? (
          <img
            src={faviconUrl}
            alt=""
            width={16}
            height={16}
            className="w-4 h-4"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove(
                "hidden"
              );
            }}
          />
        ) : null}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          className={faviconUrl ? "hidden" : ""}
          style={{ color: "var(--ghost-faint)" }}
        >
          <path
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <p
            className="text-sm font-medium text-ghost truncate hover:text-acid transition-colors duration-150"
            style={{ fontWeight: 500 }}
          >
            {bookmark.title}
          </p>
        </a>
        <div className="flex items-center gap-2 mt-0.5">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-ghost-faint truncate max-w-[200px] hover:text-ghost-dim transition-colors duration-150 font-mono"
          >
            {domain}
          </a>
          <span
            className="w-0.5 h-0.5 rounded-full flex-shrink-0"
            style={{ background: "var(--ghost-faint)" }}
          />
          <span className="text-xs text-ghost-faint flex-shrink-0">
            {formatDate(bookmark.created_at)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0">
        {/* Open in new tab */}
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-150"
          style={{ color: "var(--ghost-faint)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background =
              "rgba(200, 240, 76, 0.08)";
            (e.currentTarget as HTMLAnchorElement).style.color = "var(--acid)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background =
              "transparent";
            (e.currentTarget as HTMLAnchorElement).style.color =
              "var(--ghost-faint)";
          }}
          title="Open link"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>

        {/* Delete */}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="h-7 rounded-lg flex items-center justify-center transition-all duration-150 px-2 text-xs gap-1"
          style={{
            color: showConfirm ? "#f87171" : "var(--ghost-faint)",
            background: showConfirm ? "rgba(248, 113, 113, 0.1)" : "transparent",
            border: showConfirm
              ? "1px solid rgba(248, 113, 113, 0.2)"
              : "1px solid transparent",
          }}
          onMouseEnter={(e) => {
            if (!showConfirm) {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(248, 113, 113, 0.08)";
              (e.currentTarget as HTMLButtonElement).style.color = "#f87171";
            }
          }}
          onMouseLeave={(e) => {
            if (!showConfirm) {
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--ghost-faint)";
            }
          }}
          title={showConfirm ? "Click again to confirm" : "Delete"}
        >
          {deleting ? (
            <svg
              className="animate-spin"
              width="12"
              height="12"
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
          ) : showConfirm ? (
            <>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
              Confirm
            </>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
