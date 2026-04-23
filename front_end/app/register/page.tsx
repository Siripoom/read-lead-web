"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRole } from "@/context/RoleContext";

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

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setRole } = useRole();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setLoading(true);
    // Mock register: set role to "user" and redirect
    setTimeout(() => {
      setRole("user");
      router.push("/");
    }, 800);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(160deg, #F5EDE8 0%, #EDE0D8 60%, #F7EEE8 100%)" }}
    >
      <AuthNavbar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-24 gap-10">

        {/* Logo Block */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-primary italic tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
            ReadLead
          </h1>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-[0.3em] mt-2">
            The Curated Anthology
          </p>
        </div>

        {/* Card */}
        <div className="w-full max-w-[380px] bg-white rounded-2xl shadow-lg px-8 py-10">
          <h2 className="text-2xl font-bold text-text-primary text-center mb-1" style={{ fontFamily: "Georgia, serif" }}>
            Join the Circle
          </h2>
          <p className="text-sm text-text-muted text-center mb-7">Begin your literary journey today.</p>

          <form onSubmit={handleSubmit} className="space-y-4" data-testid="register-form">
            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Arthur Quiller-Couch"
                className="w-full px-4 py-2.5 text-sm border border-primary/20 bg-primary/[0.03] rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-muted/40"
                required
                data-testid="register-name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="editor@readlead.com"
                className="w-full px-4 py-2.5 text-sm border border-primary/20 bg-primary/[0.03] rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-muted/40"
                required
                data-testid="register-email"
              />
            </div>

            {/* Password + Confirm (side by side) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••••"
                  className="w-full px-4 py-2.5 text-sm border border-primary/20 bg-primary/[0.03] rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-muted/40"
                  required
                  data-testid="register-password"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1.5">
                  Confirm
                </label>
                <input
                  type="password"
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder="••••••••••"
                  className="w-full px-4 py-2.5 text-sm border border-primary/20 bg-primary/[0.03] rounded-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-muted/40"
                  required
                  data-testid="register-confirm"
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer group mt-1">
              <div className="relative mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="sr-only peer"
                  data-testid="register-terms"
                />
                <div className="w-4 h-4 border-2 border-primary/30 rounded peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                  {agreed && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs text-text-muted leading-relaxed">
                I agree to the{" "}
                <Link href="/" className="text-primary hover:underline font-medium">Terms of Service</Link>
                {" "}and{" "}
                <Link href="/" className="text-primary hover:underline font-medium">Privacy Policy</Link>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !agreed}
              className="w-full bg-primary text-white text-sm font-bold uppercase tracking-widest py-3.5 rounded-lg hover:bg-primary-hover transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-1"
              data-testid="register-submit"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Login link */}
          <p className="text-sm text-text-muted text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Log In
            </Link>
          </p>
        </div>

        {/* Quote */}
        <div className="text-center max-w-xs">
          <p className="text-primary text-2xl mb-2">&ldquo;</p>
          <p className="text-sm italic text-text-muted leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
            &ldquo;To read is to fly; it is to explore the landscapes of the human soul.&rdquo;
          </p>
        </div>
      </div>

      <AuthFooter />
    </div>
  );
}
