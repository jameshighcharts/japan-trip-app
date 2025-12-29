"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import tripData from "@/japan-trip.json";
import { TripData, ItineraryDay, DayUserData } from "@/app/lib/itinerary";
import TripHeader from "@/app/components/trip/TripHeader";
import DayCardStack from "@/app/components/trip/DayCardStack";
import DayDetailSheet from "@/app/components/trip/DayDetailSheet";
import AddDayForm from "@/app/components/trip/AddDayForm";

const initialData = tripData as TripData;

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

function CloudIcon({ className, syncing }: { className?: string; syncing?: boolean }) {
  return (
    <svg
      className={`${className} ${syncing ? "animate-pulse" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      {syncing && <path d="M12 13v4M12 17l-2-2M12 17l2-2" />}
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoad = useRef(true);

  // Combine initial data with custom days
  const allDays = [...initialData.itinerary, ...customDays].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Load data from MongoDB on mount
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/trip");
        if (res.ok) {
          const data = await res.json();
          setCustomDays(data.customDays || []);

          // Merge loaded data with initial empty state for all days
          const initial: Record<string, DayUserData> = {};
          initialData.itinerary.forEach((day) => {
            initial[day.date] = { notes: "", attachments: [] };
          });
          (data.customDays || []).forEach((day: ItineraryDay) => {
            initial[day.date] = { notes: "", attachments: [] };
          });

          setUserDataMap({ ...initial, ...(data.userDataMap || {}) });
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
        isInitialLoad.current = false;
      }
    }
    loadData();
  }, []);

  // Save to MongoDB with debounce
  const saveToDb = useCallback(async (days: ItineraryDay[], userData: Record<string, DayUserData>) => {
    setIsSyncing(true);
    try {
      await fetch("/api/trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customDays: days,
          userDataMap: userData,
        }),
      });
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Debounced save when data changes
  useEffect(() => {
    if (isInitialLoad.current || isLoading) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveToDb(customDays, userDataMap);
    }, 1000); // Save 1 second after last change

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [customDays, userDataMap, saveToDb, isLoading]);

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
    setCustomDays((prev) => {
      const updated = [...prev, newDay];
      // Calculate new position after sorting
      const allSorted = [...initialData.itinerary, ...updated].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      const newIndex = allSorted.findIndex((d) => d.date === newDay.date);
      if (newIndex !== -1) {
        setCurrentDay(newIndex);
      }
      return updated;
    });
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

  if (isLoading) {
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

      {/* Sync indicator */}
      <div className="fixed top-4 right-4 z-50">
        <CloudIcon
          className={`w-5 h-5 transition-colors ${isSyncing ? "text-blue-500" : "text-gray-300"}`}
          syncing={isSyncing}
        />
      </div>

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
        aria-label="Legg til ny dag"
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
