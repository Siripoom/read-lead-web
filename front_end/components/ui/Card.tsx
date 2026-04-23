import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export default function Card({ glass, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl shadow-sm",
        glass ? "glass" : "bg-white",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
