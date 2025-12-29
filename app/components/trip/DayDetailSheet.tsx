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
            {/* Drag Handle */}
            <div className="flex justify-center py-3 cursor-grab active:cursor-grabbing bg-white sticky top-0 z-10">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-28px)] scrollbar-hide">
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
