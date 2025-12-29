"use client";

import { Trip } from "@/app/lib/itinerary";
import ProgressDots from "./ProgressDots";

interface TripHeaderProps {
  trip: Trip;
  currentDay: number;
  totalDays: number;
  onDotClick?: (index: number) => void;
}

export default function TripHeader({
  trip,
  currentDay,
  totalDays,
  onDotClick,
}: TripHeaderProps) {
  const formatDateRange = () => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const startStr = start.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const endStr = end.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return `${startStr} - ${endStr}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-md mx-auto px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
              {trip.name}
            </h1>
            <p className="text-sm text-gray-500">{formatDateRange()}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {currentDay + 1}
              <span className="text-sm font-normal text-gray-400">
                /{totalDays}
              </span>
            </p>
          </div>
        </div>
        <ProgressDots
          total={totalDays}
          current={currentDay}
          onDotClick={onDotClick}
        />
      </div>
    </header>
  );
}
