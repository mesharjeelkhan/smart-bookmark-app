"use client";

import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState, useCallback, useRef } from "react";
import AddBookmarkForm from "./AddBookmarkForm";
import BookmarkCard from "./BookmarkCard";
import UserMenu from "./UserMenu";

type Bookmark = {
  id: string;
  url: string;
  title: string;
  user_id: string;
  created_at: string;
};

type Props = {
  user: User;
  initialBookmarks: Bookmark[];
};

export default function BookmarkManager({ user, initialBookmarks }: Props) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [realtimeStatus, setRealtimeStatus] = useState
    "connecting" | "connected" | "disconnected"
  >("connecting");
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;

  const handleRealtimeUpdate = useCallback((payload: any) => {
    if (payload.eventType === "INSERT") {
      setBookmarks((prev) => {
        if (prev.some((b) => b.id === payload.new.id)) return prev;
        return [payload.new, ...prev];
      });
    } else if (payload.eventType === "DELETE") {
      setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
    }
  }, []);

  useEffect(() => {
    let channel: any;

    try {
      channel = supabase
        .channel("bookmarks-changes")
        .on(
          "postgres_changes" as any,
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
            filter: `user_id=eq.${user.id}`,
          },
          handleRealtimeUpdate
        )
        .subscribe((status: string) => {
          if (status === "SUBSCRIBED") {
            setRealtimeStatus("connected");
          } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
            setRealtimeStatus("disconnected");
          }
        });
    } catch (err) {
      console.error("Realtime subscription error:", err);
      setRealtimeStatus("disconnected");
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user.id, handleRealtimeUpdate]);

  const addBookmark = async (url: string, title: string) => {
    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .insert([{ url, title, user_id: user.id }])
        .select()
        .single();

      if (!error && data) {
        setBookmarks((prev) => {
          if (prev.some((b) => b.id === data.id)) return prev;
          return [data, ...prev];
        });
      }

      return { error };
    } catch (err) {
      console.error("Add bookmark error:", err);
      return { error: err as Error };
    }
  };

  const deleteBookmark = async (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));

    try {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        const { data } = await supabase
          .from("bookmarks")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (data) setBookmarks(data);
      }
    } catch (err) {
      console.error("Delete bookmark error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-ink">
      <header
        className="glow-line sticky top-0 z-50 border-b"
        style={{
          borderColor: "rgba(240,240,248,0.06)",
          background: "rgba(10, 10, 15, 0.9)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--acid) 0%, var(--acid-dim) 100%)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 28 28" fill="none" className="text-ink">
                <path
                  d="M7 4H21C21.5523 4 22 4.44772 22 5V25L14 20L6 25V5C6 4.44772 6.44772 4 7 4Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span
              className="font-display font-bold text-ghost"
              style={{ fontWeight: 700, letterSpacing: "-0.02em" }}
            >
              Markd
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  realtimeStatus === "connected"
                    ? "animate-pulse-dot"
                    : realtimeStatus === "connecting"
                    ? "animate-pulse"
                    : ""
                }`}
                style={{
                  background:
                    realtimeStatus === "connected"
                      ? "var(--acid)"
                      : realtimeStatus === "connecting"
                      ? "#f0a020"
                      : "#f04040",
                }}
              />
              <span className="text-xs text-ghost-faint font-mono hidden sm:block">
                {realtimeStatus === "connected"
                  ? "live"
                  : realtimeStatus === "connecting"
                  ? "sync..."
                  : "offline"}
              </span>
            </div>
            <UserMenu user={user} />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <AddBookmarkForm onAdd={addBookmark} />

        <div className="mt-10">
          <div className="flex items-center justify-between mb-5">
            <h2
              className="font-display text-sm font-semibold text-ghost-dim uppercase"
              style={{ letterSpacing: "0.1em", fontSize: "11px" }}
            >
              Your Bookmarks
            </h2>
            <span
              className="font-mono text-xs px-2 py-0.5 rounded"
              style={{
                color: "var(--acid)",
                background: "rgba(200, 240, 76, 0.08)",
                border: "1px solid rgba(200, 240, 76, 0.15)",
              }}
            >
              {bookmarks.length}
            </span>
          </div>

          {bookmarks.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-2">
              {bookmarks.map((bookmark, i) => (
                <div
                  key={bookmark.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${i * 30}ms`, opacity: 0 }}
                >
                  <BookmarkCard bookmark={bookmark} onDelete={deleteBookmark} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="rounded-2xl border border-dashed p-12 flex flex-col items-center text-center"
      style={{ borderColor: "rgba(240, 240, 248, 0.08)" }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ background: "rgba(200, 240, 76, 0.06)" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 28 28"
          fill="none"
          style={{ color: "var(--acid)", opacity: 0.5 }}
        >
          <path
            d="M7 4H21C21.5523 4 22 4.44772 22 5V25L14 20L6 25V5C6 4.44772 6.44772 4 7 4Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <p className="text-sm font-medium text-ghost-dim mb-1">No bookmarks yet</p>
      <p className="text-xs text-ghost-faint leading-relaxed max-w-xs">
        Add your first bookmark above. It'll sync in real-time across all your open tabs.
      </p>
    </div>
  );
}