"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import tripData from "@/japan-trip.json";
import { TripData, ItineraryDay, DayUserData } from "@/app/lib/itinerary";
import TripHeader from "@/app/components/trip/TripHeader";
import DayCardStack from "@/app/components/trip/DayCardStack";
import DayDetailSheet from "@/app/components/trip/DayDetailSheet";
import AddDayForm from "@/app/components/trip/AddDayForm";

const initialData = tripData as TripData;

// localStorage helpers for fast loading
const loadFromLocal = () => {
  if (typeof window === "undefined") return { customDays: [], userDataMap: {} };
  try {
    const customDays = JSON.parse(localStorage.getItem("customDays") || "[]");
    const userDataMap = JSON.parse(localStorage.getItem("tripUserData") || "{}");
    return { customDays, userDataMap };
  } catch {
    return { customDays: [], userDataMap: {} };
  }
};

const saveToLocal = (customDays: ItineraryDay[], userDataMap: Record<string, DayUserData>) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("customDays", JSON.stringify(customDays));
  localStorage.setItem("tripUserData", JSON.stringify(userDataMap));
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

function CloudIcon({ className, syncing, error }: { className?: string; syncing?: boolean; error?: boolean }) {
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
      {error && <path d="M12 8v4M12 16h.01" />}
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
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Combine initial data with custom days
  const allDays = [...initialData.itinerary, ...customDays].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Initialize from localStorage immediately (fast)
  useEffect(() => {
    const local = loadFromLocal();

    // Initialize empty state for all days
    const initial: Record<string, DayUserData> = {};
    initialData.itinerary.forEach((day) => {
      initial[day.date] = { notes: "", attachments: [] };
    });
    local.customDays.forEach((day: ItineraryDay) => {
      initial[day.date] = { notes: "", attachments: [] };
    });

    setCustomDays(local.customDays);
    setUserDataMap({ ...initial, ...local.userDataMap });
    setIsHydrated(true);

    // Then sync from MongoDB in background (don't block UI)
    fetch("/api/trip")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data && (data.customDays?.length > 0 || Object.keys(data.userDataMap || {}).length > 0)) {
          // Merge cloud data with local (cloud wins for conflicts)
          const cloudDays = data.customDays || [];
          const cloudUserData = data.userDataMap || {};

          setCustomDays(cloudDays);
          setUserDataMap((prev) => ({ ...prev, ...cloudUserData }));

          // Update local cache
          saveToLocal(cloudDays, { ...initial, ...cloudUserData });
        }
      })
      .catch((err) => {
        console.error("Failed to sync from cloud:", err);
        setSyncError(true);
      });
  }, []);

  // Save to both localStorage (instant) and MongoDB (background)
  const saveData = useCallback(async (days: ItineraryDay[], userData: Record<string, DayUserData>) => {
    // Save to localStorage immediately
    saveToLocal(days, userData);

    // Sync to MongoDB in background
    setIsSyncing(true);
    setSyncError(false);
    try {
      const res = await fetch("/api/trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customDays: days,
          userDataMap: userData,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
    } catch (error) {
      console.error("Failed to sync to cloud:", error);
      setSyncError(true);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Debounced save when data changes
  useEffect(() => {
    if (!isHydrated) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveData(customDays, userDataMap);
    }, 500); // Save 500ms after last change

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [customDays, userDataMap, saveData, isHydrated]);

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

      {/* Sync indicator */}
      <div className="fixed top-4 right-4 z-50">
        <CloudIcon
          className={`w-5 h-5 transition-colors ${
            syncError ? "text-red-500" : isSyncing ? "text-blue-500" : "text-green-500"
          }`}
          syncing={isSyncing}
          error={syncError}
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
