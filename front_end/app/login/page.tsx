"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

function AuthNavbar() {
  return (
    <header className="h-14 flex items-center justify-between px-8 bg-transparent absolute top-0 left-0 right-0 z-10">
      <Link href="/" className="text-primary font-bold text-xl italic tracking-tight">
        ReadLead
      </Link>
      <nav className="hidden md:flex items-center gap-8">
        <Link href="/" className="text-sm text-text-muted hover:text-text-primary transition-colors">Library</Link>
        <Link href="/" className="text-sm text-text-muted hover:text-text-primary transition-colors">Explore</Link>
        <Link href="/" className="text-sm text-text-muted hover:text-text-primary transition-colors">Journal</Link>
      </nav>
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-sm font-medium text-primary hover:underline transition-colors">
          Login
        </Link>
        <Link
          href="/register"
          className="bg-primary text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-primary-hover transition-colors"
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
}

function AuthFooter() {
  return (
    <footer className="bg-white border-t border-border py-8 px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-text-primary">ReadLead Anthology</p>
          <p className="text-xs text-text-muted mt-0.5">© 2024 READLEAD ANTHOLOGY. ALL RIGHTS RESERVED.</p>
        </div>
        <nav className="flex items-center gap-6">
          {["Privacy Policy", "Terms of Service", "Editorial Guidelines", "Contact"].map((item) => (
            <Link key={item} href="/" className="text-xs text-text-muted hover:text-text-primary uppercase tracking-wide transition-colors">
              {item}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setRole } = useRole();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock login: set role to "user" and redirect
    setTimeout(() => {
      setRole("user");
      router.push("/");
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #F5EDE8 0%, #EDE0D8 50%, #F0E6E0 100%)" }}>
      <AuthNavbar />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-[820px] bg-white rounded-2xl shadow-xl overflow-hidden flex min-h-[480px]">

          {/* Left Panel — Dark Image */}
          <div
            className="hidden md:flex w-[45%] shrink-0 flex-col justify-end p-8 relative overflow-hidden"
            style={{
              background: "linear-gradient(160deg, #8B1A1A 0%, #5C0D0D 40%, #3D0808 100%)",
            }}
          >
            {/* Decorative texture overlay */}
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)",
              }}
            />
            {/* Book image placeholder */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <svg width="120" height="160" viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="10" width="80" height="140" rx="4" fill="white" />
                <rect x="20" y="25" width="60" height="6" rx="2" fill="#8B1A1A" />
                <rect x="20" y="38" width="45" height="4" rx="2" fill="#8B1A1A" opacity="0.5" />
                <rect x="20" y="55" width="60" height="80" rx="2" fill="#8B1A1A" opacity="0.2" />
                <rect x="90" y="10" width="12" height="140" rx="2" fill="rgba(255,255,255,0.3)" />
              </svg>
            </div>
            {/* Quote */}
            <div className="relative z-10">
              <p className="text-white/90 text-xl italic font-serif leading-snug mb-4">
                &quot;The journey of a thousand stories begins with a single page.&quot;
              </p>
              <p className="text-white/50 text-xs uppercase tracking-[0.2em] font-medium">
                Volume IV &bull; The Anthology
              </p>
            </div>
          </div>

          {/* Right Panel — Form */}
          <div className="flex-1 flex flex-col justify-center px-10 py-12">
            <h1 className="text-3xl font-bold text-text-primary mb-1" style={{ fontFamily: "Georgia, serif" }}>
              Welcome Back
            </h1>
            <p className="text-sm text-text-muted mb-8">Continue your literary exploration.</p>

            <form onSubmit={handleSubmit} className="space-y-5" data-testid="login-form">
              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">
                  Email or Username
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. reader@anthology.com"
                  className="w-full px-4 py-3 text-sm border border-primary/20 bg-primary/[0.03] rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-muted/50"
                  required
                  data-testid="login-email"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full px-4 py-3 text-sm border border-primary/20 bg-primary/[0.03] rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-muted/50 pr-11"
                    required
                    data-testid="login-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                    data-testid="login-password-toggle"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-semibold py-3.5 rounded-lg hover:bg-primary-hover transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
                data-testid="login-submit"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Sign In <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-border" />
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Register link */}
            <p className="text-sm text-text-muted text-center">
              New to the anthology?{" "}
              <Link href="/register" className="text-primary font-semibold hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>

      <AuthFooter />
    </div>
  );
}
