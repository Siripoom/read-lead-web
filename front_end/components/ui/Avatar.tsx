import Image from "next/image";

interface AvatarProps {
  src?: string;
  alt: string;
  size?: number;
  fallback?: string;
}

export default function Avatar({ src, alt, size = 40, fallback }: AvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="rounded-full object-cover"
      />
    );
  }
  const initials = fallback || alt.slice(0, 2).toUpperCase();
  return (
    <div
      className="rounded-full bg-primary-light text-primary flex items-center justify-center font-semibold text-sm"
      style={{ width: size, height: size }}
    >
      {initials}
    </div>
  );
}
