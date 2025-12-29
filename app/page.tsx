"use client";

import { useState, useEffect } from "react";
import tripData from "@/japan-trip.json";
import { TripData, ItineraryDay, DayUserData } from "@/app/lib/itinerary";
import TripHeader from "@/app/components/trip/TripHeader";
import DayCardStack from "@/app/components/trip/DayCardStack";
import DayDetailSheet from "@/app/components/trip/DayDetailSheet";
import AddDayForm from "@/app/components/trip/AddDayForm";

const initialData = tripData as TripData;

// Initialize empty user data for each day
const initializeUserData = (days: ItineraryDay[]): Record<string, DayUserData> => {
  const stored = typeof window !== "undefined" ? localStorage.getItem("tripUserData") : null;
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Invalid stored data, start fresh
    }
  }

  const initial: Record<string, DayUserData> = {};
  days.forEach((day) => {
    initial[day.date] = { notes: "", attachments: [] };
  });
  return initial;
};

// Load custom days from localStorage
const loadCustomDays = (): ItineraryDay[] => {
  const stored = typeof window !== "undefined" ? localStorage.getItem("customDays") : null;
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
};

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export default function Home() {
  const [currentDay, setCurrentDay] = useState(0);
  const [selectedDay, setSelectedDay] = useState<ItineraryDay | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [userDataMap, setUserDataMap] = useState<Record<string, DayUserData>>({});
  const [customDays, setCustomDays] = useState<ItineraryDay[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Combine initial data with custom days
  const allDays = [...initialData.itinerary, ...customDays].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Initialize on client side only
  useEffect(() => {
    const custom = loadCustomDays();
    setCustomDays(custom);
    setUserDataMap(initializeUserData([...initialData.itinerary, ...custom]));
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever userData changes
  useEffect(() => {
    if (isHydrated && Object.keys(userDataMap).length > 0) {
      localStorage.setItem("tripUserData", JSON.stringify(userDataMap));
    }
  }, [userDataMap, isHydrated]);

  // Save custom days to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("customDays", JSON.stringify(customDays));
    }
  }, [customDays, isHydrated]);

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

  const handleAddDay = (newDay: ItineraryDay) => {
    setCustomDays((prev) => [...prev, newDay]);
    // Initialize user data for new day
    setUserDataMap((prev) => ({
      ...prev,
      [newDay.date]: { notes: "", attachments: [] },
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
        trip={initialData.trip}
        currentDay={currentDay}
        totalDays={allDays.length}
        onDotClick={handleDotClick}
      />

      {/* Main content - Card Stack */}
      <main className="flex-1 flex items-center justify-center pt-28 pb-8 px-4">
        <DayCardStack
          days={allDays}
          currentIndex={currentDay}
          onIndexChange={setCurrentDay}
          onDaySelect={handleDaySelect}
        />
      </main>

      {/* Floating Add Button */}
      <button
        onClick={() => setIsAddFormOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors flex items-center justify-center z-30"
        aria-label="Add new day"
      >
        <PlusIcon className="w-6 h-6" />
      </button>

      {/* Detail Sheet */}
      <DayDetailSheet
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
        day={selectedDay}
        dayNumber={currentDay + 1}
        totalDays={allDays.length}
        userData={getCurrentUserData()}
        onUpdateUserData={(data) =>
          selectedDay && handleUpdateUserData(selectedDay.date, data)
        }
      />

      {/* Add Day Form */}
      <AddDayForm
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onAdd={handleAddDay}
      />
    </div>
  );
}
