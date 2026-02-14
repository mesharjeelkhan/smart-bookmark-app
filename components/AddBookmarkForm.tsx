"use client";

import { useState } from "react";

type Props = {
  onAdd: (
    url: string,
    title: string
  ) => Promise<{ error: Error | null }>;
};

export default function AddBookmarkForm({ onAdd }: Props) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [urlFocused, setUrlFocused] = useState(false);
  const [titleFocused, setTitleFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic URL validation
    let processedUrl = url.trim();
    if (!processedUrl) return;

    if (!/^https?:\/\//i.test(processedUrl)) {
      processedUrl = "https://" + processedUrl;
    }

    try {
      new URL(processedUrl);
    } catch {
      setError("Please enter a valid URL");
      return;
    }

    const processedTitle = title.trim() || processedUrl;

    setLoading(true);
    const { error: addError } = await onAdd(processedUrl, processedTitle);
    setLoading(false);

    if (addError) {
      setError("Failed to add bookmark. Please try again.");
    } else {
      setUrl("");
      setTitle("");
    }
  };

  return (
    <div
      className="rounded-2xl p-5 border"
      style={{
        background: "rgba(20, 20, 30, 0.6)",
        borderColor: "rgba(240, 240, 248, 0.07)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
      }}
    >
      <h1
        className="font-display text-xl font-bold text-ghost mb-5"
        style={{ fontWeight: 700, letterSpacing: "-0.025em" }}
      >
        Add Bookmark
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* URL Field */}
        <div className="relative">
          <label
            className="block text-xs text-ghost-faint font-mono mb-1.5"
            style={{ letterSpacing: "0.06em" }}
          >
            URL *
          </label>
          <div className="relative flex items-center">
            <div
              className="absolute left-3.5 pointer-events-none"
              style={{ color: urlFocused ? "var(--acid)" : "var(--ghost-faint)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onFocus={() => setUrlFocused(true)}
              onBlur={() => setUrlFocused(false)}
              placeholder="https://example.com"
              className="w-full rounded-xl pl-9 pr-4 py-3 text-sm text-ghost placeholder-ghost-faint outline-none transition-all duration-200"
              style={{
                background: "rgba(10, 10, 15, 0.8)",
                border: `1px solid ${
                  urlFocused
                    ? "rgba(200, 240, 76, 0.3)"
                    : "rgba(240, 240, 248, 0.08)"
                }`,
                boxShadow: urlFocused
                  ? "0 0 0 3px rgba(200, 240, 76, 0.06)"
                  : "none",
              }}
              required
            />
          </div>
        </div>

        {/* Title Field */}
        <div className="relative">
          <label
            className="block text-xs text-ghost-faint font-mono mb-1.5"
            style={{ letterSpacing: "0.06em" }}
          >
            TITLE{" "}
            <span style={{ color: "var(--ghost-faint)", opacity: 0.6 }}>
              (optional)
            </span>
          </label>
          <div className="relative flex items-center">
            <div
              className="absolute left-3.5 pointer-events-none"
              style={{
                color: titleFocused ? "var(--acid)" : "var(--ghost-faint)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 6h16M4 12h16M4 18h7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setTitleFocused(true)}
              onBlur={() => setTitleFocused(false)}
              placeholder="Give it a name..."
              className="w-full rounded-xl pl-9 pr-4 py-3 text-sm text-ghost placeholder-ghost-faint outline-none transition-all duration-200"
              style={{
                background: "rgba(10, 10, 15, 0.8)",
                border: `1px solid ${
                  titleFocused
                    ? "rgba(200, 240, 76, 0.3)"
                    : "rgba(240, 240, 248, 0.08)"
                }`,
                boxShadow: titleFocused
                  ? "0 0 0 3px rgba(200, 240, 76, 0.06)"
                  : "none",
              }}
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p className="text-xs text-red-400 flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            {error}
          </p>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
          style={{
            background:
              loading || !url.trim()
                ? "rgba(200, 240, 76, 0.3)"
                : "var(--acid)",
            color: "var(--ink)",
            fontWeight: 600,
          }}
          onMouseEnter={(e) => {
            if (!loading && url.trim()) {
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--acid-dim)";
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(-1px)";
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--acid)";
            (e.currentTarget as HTMLButtonElement).style.transform =
              "translateY(0)";
          }}
        >
          {loading ? (
            <>
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
              Saving...
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
              Save Bookmark
            </>
          )}
        </button>
      </form>
    </div>
  );
}
