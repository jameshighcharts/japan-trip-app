"use client";

interface ProgressDotsProps {
  total: number;
  current: number;
  onDotClick?: (index: number) => void;
}

export default function ProgressDots({
  total,
  current,
  onDotClick,
}: ProgressDotsProps) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick?.(i)}
          className={`rounded-full transition-all duration-300 ${
            i === current
              ? "w-6 h-2 bg-gray-900"
              : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
          }`}
          aria-label={`Gå til dag ${i + 1}`}
        />
      ))}
    </div>
  );
}
