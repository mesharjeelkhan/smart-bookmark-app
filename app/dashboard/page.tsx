import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BookmarkManager from "@/components/BookmarkManager";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch initial bookmarks server-side
  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <BookmarkManager
      user={user}
      initialBookmarks={bookmarks || []}
    />
  );
}
