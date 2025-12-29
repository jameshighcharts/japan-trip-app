"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ItineraryDay } from "@/app/lib/itinerary";
import DayCard from "./DayCard";

interface DayCardStackProps {
  days: ItineraryDay[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  onDaySelect: (day: ItineraryDay, index: number) => void;
}

export default function DayCardStack({
  days,
  currentIndex,
  onIndexChange,
  onDaySelect,
}: DayCardStackProps) {
  const [[page, direction], setPage] = useState([currentIndex, 0]);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);

  const paginate = (newDirection: number) => {
    const newPage = page + newDirection;
    if (newPage >= 0 && newPage < days.length) {
      setPage([newPage, newDirection]);
      onIndexChange(newPage);
    }
  };

  // Sync with parent state
  if (page !== currentIndex) {
    setPage([currentIndex, currentIndex > page ? 1 : -1]);
  }

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const handleDragStart = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    isDragging.current = true;
    dragStartX.current = info.point.x;
  };

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const swipe = swipePower(info.offset.x, info.velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    }

    // Reset dragging state after a short delay to prevent click from firing
    setTimeout(() => {
      isDragging.current = false;
    }, 100);
  };

  const handleClick = () => {
    // Only open detail if we didn't drag
    if (!isDragging.current) {
      onDaySelect(days[page], page);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 350 : -350,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 350 : -350,
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <div className="relative h-[480px] w-full flex items-center justify-center overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
            scale: { type: "spring", stiffness: 400, damping: 35 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onClick={handleClick}
          className="absolute cursor-grab active:cursor-grabbing"
        >
          <DayCard
            day={days[page]}
            dayNumber={page + 1}
            totalDays={days.length}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation hints */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-4 pb-2 pointer-events-none">
        <motion.div
          animate={{ opacity: page > 0 ? 0.5 : 0 }}
          className="text-xs text-gray-400 flex items-center gap-1"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="m15 18-6-6 6-6" />
          </svg>
          Swipe
        </motion.div>
        <motion.div
          animate={{ opacity: page < days.length - 1 ? 0.5 : 0 }}
          className="text-xs text-gray-400 flex items-center gap-1"
        >
          Swipe
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="m9 18 6-6-6-6" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
