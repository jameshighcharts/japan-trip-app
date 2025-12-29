"use client";

import { motion } from "framer-motion";
import { ItineraryDay, formatDate, getLocationPhoto } from "@/app/lib/itinerary";
import TransportBadge from "./TransportBadge";

interface DayCardProps {
  day: ItineraryDay;
  dayNumber: number;
  totalDays: number;
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export default function DayCard({ day, dayNumber, totalDays }: DayCardProps) {
  const photoUrl = getLocationPhoto(day.location);

  return (
    <motion.div
      className="bg-white rounded-3xl w-[320px] overflow-hidden border border-gray-100"
      style={{
        boxShadow:
          "0 25px 50px -12px rgba(0, 0, 0, 0.08), 0 12px 24px -8px rgba(0, 0, 0, 0.04)",
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Photo Header */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={photoUrl}
          alt={day.location}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <h2 className="text-2xl font-bold text-white tracking-tight drop-shadow-lg">
            {day.location}
          </h2>
        </div>
        {/* Date Badge */}
        <span className="absolute top-3 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full tracking-wide uppercase">
          {formatDate(day.date)}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Day Counter */}
        <p className="text-sm text-gray-400 mb-4">
          Dag {dayNumber} av {totalDays}
        </p>

        {/* Transportation */}
        {day.transportation && (
          <div className="mb-3">
            <TransportBadge transport={day.transportation} compact />
          </div>
        )}

        {/* Accommodation Preview */}
        {day.accommodation && (
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" />
              <path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01M9 19h6" />
            </svg>
            <span className="truncate">
              {typeof day.accommodation === "string"
                ? day.accommodation.replace(" (continued)", "")
                : day.accommodation.name}
            </span>
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-400">Trykk for detaljer</p>
          <ChevronRightIcon className="w-5 h-5 text-gray-300" />
        </div>
      </div>
    </motion.div>
  );
}
