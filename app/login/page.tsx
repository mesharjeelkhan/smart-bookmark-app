import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LoginButton from "@/components/LoginButton";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(200, 240, 76, 1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200, 240, 76, 1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(200, 240, 76, 0.06) 0%, transparent 70%)",
        }}
      />

      {/* Glow orb */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(200, 240, 76, 0.05) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10 w-full max-w-sm mx-auto px-6">
        {/* Logo mark */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--acid) 0%, var(--acid-dim) 100%)",
                boxShadow:
                  "0 0 40px rgba(200, 240, 76, 0.25), 0 8px 32px rgba(0,0,0,0.4)",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                className="text-ink"
              >
                <path
                  d="M7 4H21C21.5523 4 22 4.44772 22 5V25L14 20L6 25V5C6 4.44772 6.44772 4 7 4Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            {/* Dot indicator */}
            <div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse-dot"
              style={{ background: "var(--acid)" }}
            />
          </div>

          <h1
            className="font-display text-3xl font-800 tracking-tight text-ghost mb-2"
            style={{ fontWeight: 800, letterSpacing: "-0.03em" }}
          >
            Markd
          </h1>
          <p className="text-sm text-ghost-dim text-center leading-relaxed">
            Your private bookmark space.
            <br />
            Minimal. Fast. Real-time.
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-6 border"
          style={{
            background: "rgba(20, 20, 30, 0.8)",
            borderColor: "rgba(240, 240, 248, 0.08)",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 24px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(240,240,248,0.05)",
          }}
        >
          <p
            className="text-xs text-ghost-faint mb-4 font-mono uppercase tracking-widest"
            style={{ letterSpacing: "0.12em" }}
          >
            Sign in to continue
          </p>

          <LoginButton />

          <p className="text-xs text-ghost-faint text-center mt-4 leading-relaxed">
            By signing in, you agree that your bookmarks are private and only
            visible to you.
          </p>
        </div>

        {/* Footer hint */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <div
            className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
            style={{ background: "var(--acid)", animationDelay: "0.5s" }}
          />
          <p className="text-xs text-ghost-faint font-mono">
            Real-time sync across all tabs
          </p>
        </div>
      </div>
    </div>
  );
}
