"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import {
  getActiveAds,
  type AdCampaign,
  type AdPlacement,
} from "@/lib/monetization";

interface AdPlacementBannerProps {
  placement: AdPlacement;
  theme?: "dark" | "light";
  className?: string;
}

export default function AdPlacementBanner({
  placement,
  theme = "light",
  className = "",
}: AdPlacementBannerProps) {
  const [ads, setAds] = useState<AdCampaign[]>([]);

  useEffect(() => {
    setAds(getActiveAds(placement));
  }, [placement]);

  const ad = ads[ads.length - 1];
  if (!ad) return null;

  const dark = theme === "dark";

  return (
    <section
      data-testid={`ad-placement-${placement}`}
      className={`overflow-hidden rounded-xl border ${
        dark ? "border-white/10 bg-dark-surface" : "border-border bg-white"
      } ${className}`}
    >
      <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_280px]">
        <div className="p-5">
          <p
            className={`text-xs font-semibold uppercase tracking-wide ${
              dark ? "text-primary" : "text-primary"
            }`}
          >
            Sponsored
          </p>
          <h3
            className={`mt-1 text-lg font-bold ${
              dark ? "text-white" : "text-text-primary"
            }`}
          >
            {ad.title}
          </h3>
          <p
            className={`mt-2 text-sm leading-6 ${
              dark ? "text-white/60" : "text-text-muted"
            }`}
          >
            {ad.body}
          </p>
          <Link
            href={ad.href}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            {ad.ctaLabel}
            <ExternalLink size={14} />
          </Link>
        </div>
        <div className={dark ? "bg-white/5" : "bg-accent"}>
          {/* eslint-disable-next-line @next/next/no-img-element -- Admin-managed mock ad URLs can be arbitrary. */}
          <img
            src={ad.imageUrl}
            alt={ad.title}
            className="h-full min-h-36 w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
