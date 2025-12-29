"use client";

import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ItineraryDay, DayUserData } from "@/app/lib/itinerary";
import DayDetail from "./DayDetail";

interface DayDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  day: ItineraryDay | null;
  dayNumber: number;
  totalDays: number;
  userData: DayUserData;
  onUpdateUserData: (data: DayUserData) => void;
}

function XIcon({ className }: { className?: string }) {
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
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export default function DayDetailSheet({
  isOpen,
  onClose,
  day,
  dayNumber,
  totalDays,
  userData,
  onUpdateUserData,
}: DayDetailSheetProps) {
  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.velocity.y > 500 || info.offset.y > 150) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && day && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-hidden z-50"
            style={{
              boxShadow: "0 -10px 40px -10px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Header with drag handle and close button */}
            <div className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-10 border-b border-gray-100">
              <div className="w-10" /> {/* Spacer */}
              <div className="w-12 h-1.5 bg-gray-300 rounded-full cursor-grab active:cursor-grabbing" />
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Close"
              >
                <XIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-52px)] scrollbar-hide">
              <DayDetail
                day={day}
                dayNumber={dayNumber}
                totalDays={totalDays}
                userData={userData}
                onUpdateUserData={onUpdateUserData}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
