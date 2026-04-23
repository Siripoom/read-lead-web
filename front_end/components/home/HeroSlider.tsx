"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    id: "1",
    title: "The Obsidian Chronicles",
    subtitle: "Featured Anthology",
    description:
      "In a world where shadows hold memories, one young archivist discovers a forbidden tome that could rewrite history—or erase it.",
    image: "https://placehold.co/1200x400/2D1B69/white?text=.",
    readHref: "/reader",
    detailHref: "/detail",
  },
  {
    id: "2",
    title: "Beyond the Pale",
    subtitle: "Top Manga",
    description:
      "An action-packed adventure across forgotten kingdoms, where every blade has a story and every shadow hides a secret.",
    image: "https://placehold.co/1200x400/4a1a1a/white?text=.",
    readHref: "/reader",
    detailHref: "/detail",
  },
  {
    id: "3",
    title: "The Forest Whispers",
    subtitle: "Most Read This Week",
    description:
      "Deep within an enchanted forest, a young herbalist unravels the language of ancient trees—and a prophecy older than the kingdom itself.",
    image: "https://placehold.co/1200x400/0a2e1a/white?text=.",
    readHref: "/reader",
    detailHref: "/detail",
  },
];

const ACTIVE_RATIO = 0.65;
const GAP = 20;
const SLIDE_HEIGHT = 280;

export default function HeroSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeTimerRef = useRef<number | undefined>(undefined);
  const dragStartX = useRef<number | null>(null);
  const didDrag = useRef(false);

  const [containerWidth, setContainerWidth] = useState(0);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  // Measure container width, update on resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setIsResizing(true);
      clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = window.setTimeout(
        () => setIsResizing(false),
        150
      );
      setContainerWidth(el.getBoundingClientRect().width);
    });
    ro.observe(el);
    setContainerWidth(el.getBoundingClientRect().width);
    return () => {
      ro.disconnect();
      clearTimeout(resizeTimerRef.current);
    };
  }, []);

  // Autoplay — pauses on hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(
      () => setCurrent((c) => (c + 1) % SLIDES.length),
      5000
    );
    return () => clearInterval(timer);
  }, [isPaused]);

  const goTo = useCallback((index: number) => {
    setCurrent((index + SLIDES.length) % SLIDES.length);
  }, []);

  const prev = () => goTo(current - 1);
  const next = () => goTo(current + 1);

  // Drag / swipe support
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStartX.current = e.clientX;
    didDrag.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return;
    if (Math.abs(e.clientX - dragStartX.current) > 6) didDrag.current = true;
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(delta) > 60) {
      setCurrent(
        (c) => (c + (delta < 0 ? 1 : -1) + SLIDES.length) % SLIDES.length
      );
    }
  };

  // Carousel geometry
  const slideWidth = containerWidth * ACTIVE_RATIO;
  const peekWidth = (containerWidth - slideWidth) / 2 - GAP;
  const trackWidth =
    SLIDES.length * slideWidth + (SLIDES.length - 1) * GAP;
  const translateX =
    containerWidth > 0
      ? -(current * (slideWidth + GAP)) + peekWidth + GAP
      : 0;

  return (
    <div
      className="relative w-full select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Track */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden"
        style={{ height: SLIDE_HEIGHT }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        <div
          className="flex absolute inset-y-0 left-0"
          style={{
            width: trackWidth > 0 ? trackWidth : "100%",
            gap: GAP,
            transform: `translateX(${translateX}px)`,
            transition:
              containerWidth > 0 && !isResizing
                ? "transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                : "none",
          }}
        >
          {SLIDES.map((slide, i) => {
            const isActive = i === current;
            return (
              <div
                key={slide.id}
                className="relative shrink-0 rounded-[24px] overflow-hidden shadow-lg"
                style={{
                  width: slideWidth > 0 ? slideWidth : "65%",
                  transform: isActive ? "scale(1)" : "scale(0.92)",
                  opacity: isActive ? 1 : 0.7,
                  transition: "transform 500ms ease, opacity 500ms ease",
                  cursor: isActive ? "default" : "pointer",
                }}
                onClick={() =>
                  !isActive && !didDrag.current && goTo(i)
                }
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={i === 0}
                />

                {/* Gradient for text legibility */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transition: "opacity 500ms ease",
                  }}
                />

                {/* Text content */}
                <div
                  className="absolute inset-0 flex flex-col justify-end p-6"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transition: "opacity 400ms ease",
                  }}
                >
                  <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-1.5">
                    {slide.subtitle}
                  </p>
                  <h2 className="text-white text-2xl font-bold leading-tight mb-2 max-w-xs">
                    {slide.title}
                  </h2>
                  <p className="text-white/75 text-xs max-w-sm mb-4 leading-relaxed hidden sm:block">
                    {slide.description}
                  </p>
                  {/* Stop click propagation so Links don't conflict with drag */}
                  <div
                    className="flex gap-2.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link
                      href={slide.readHref}
                      className="bg-primary text-white text-xs font-semibold px-5 py-2 rounded-full hover:bg-primary-hover transition-colors"
                    >
                      อ่านเลย
                    </Link>
                    <Link
                      href={slide.detailHref}
                      className="bg-white/20 backdrop-blur text-white text-xs font-semibold px-5 py-2 rounded-full border border-white/30 hover:bg-white/30 transition-colors"
                    >
                      ดูรายละเอียด
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prev button */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg text-gray-600 hover:text-gray-900 rounded-full flex items-center justify-center transition-all"
        style={{ top: SLIDE_HEIGHT / 2, transform: "translateY(-50%)" }}
      >
        <ChevronLeft size={18} />
      </button>

      {/* Next button */}
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg text-gray-600 hover:text-gray-900 rounded-full flex items-center justify-center transition-all"
        style={{ top: SLIDE_HEIGHT / 2, transform: "translateY(-50%)" }}
      >
        <ChevronRight size={18} />
      </button>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-4 pb-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? "w-5 h-2 bg-gray-800"
                : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
