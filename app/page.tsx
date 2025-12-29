"use client";

import { useState, useEffect } from "react";
import tripData from "@/japan-trip.json";
import { TripData, ItineraryDay, DayUserData } from "@/app/lib/itinerary";
import TripHeader from "@/app/components/trip/TripHeader";
import DayCardStack from "@/app/components/trip/DayCardStack";
import DayDetailSheet from "@/app/components/trip/DayDetailSheet";

const data = tripData as TripData;

// Initialize empty user data for each day
const initializeUserData = (): Record<string, DayUserData> => {
  const stored = typeof window !== "undefined" ? localStorage.getItem("tripUserData") : null;
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Invalid stored data, start fresh
    }
  }

  const initial: Record<string, DayUserData> = {};
  data.itinerary.forEach((day) => {
    initial[day.date] = { notes: "", attachments: [] };
  });
  return initial;
};

export default function Home() {
  const [currentDay, setCurrentDay] = useState(0);
  const [selectedDay, setSelectedDay] = useState<ItineraryDay | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [userDataMap, setUserDataMap] = useState<Record<string, DayUserData>>({});
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize on client side only
  useEffect(() => {
    setUserDataMap(initializeUserData());
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever userData changes
  useEffect(() => {
    if (isHydrated && Object.keys(userDataMap).length > 0) {
      localStorage.setItem("tripUserData", JSON.stringify(userDataMap));
    }
  }, [userDataMap, isHydrated]);

  const handleDaySelect = (day: ItineraryDay, index: number) => {
    setSelectedDay(day);
    setCurrentDay(index);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
  };

  const handleDotClick = (index: number) => {
    setCurrentDay(index);
  };

  const handleUpdateUserData = (dayDate: string, data: DayUserData) => {
    setUserDataMap((prev) => ({
      ...prev,
      [dayDate]: data,
    }));
  };

  const getCurrentUserData = (): DayUserData => {
    if (!selectedDay) return { notes: "", attachments: [] };
    return userDataMap[selectedDay.date] || { notes: "", attachments: [] };
  };

  if (!isHydrated) {
    return (
      <div className="min-h-dvh bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-white flex flex-col max-w-md mx-auto">
      {/* Header */}
      <TripHeader
        trip={data.trip}
        currentDay={currentDay}
        totalDays={data.itinerary.length}
        onDotClick={handleDotClick}
      />

      {/* Main content - Card Stack */}
      <main className="flex-1 flex items-center justify-center pt-28 pb-8 px-4">
        <DayCardStack
          days={data.itinerary}
          currentIndex={currentDay}
          onIndexChange={setCurrentDay}
          onDaySelect={handleDaySelect}
        />
      </main>

      {/* Detail Sheet */}
      <DayDetailSheet
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
        day={selectedDay}
        dayNumber={currentDay + 1}
        totalDays={data.itinerary.length}
        userData={getCurrentUserData()}
        onUpdateUserData={(data) =>
          selectedDay && handleUpdateUserData(selectedDay.date, data)
        }
      />
    </div>
  );
}
