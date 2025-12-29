"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ItineraryDay } from "@/app/lib/itinerary";

interface AddDayFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (day: ItineraryDay) => void;
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

export default function AddDayForm({ isOpen, onClose, onAdd }: AddDayFormProps) {
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [transportType, setTransportType] = useState<string>("");
  const [transportTime, setTransportTime] = useState("");
  const [transportRoute, setTransportRoute] = useState("");
  const [accommodationName, setAccommodationName] = useState("");
  const [accommodationNights, setAccommodationNights] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !location) {
      alert("Please fill in date and location");
      return;
    }

    const newDay: ItineraryDay = {
      date,
      location,
      transportation: transportType
        ? {
            type: transportType as "flight" | "train" | "bus",
            departure: transportTime || undefined,
            route: transportRoute || undefined,
          }
        : null,
      accommodation: accommodationName
        ? {
            name: accommodationName,
            nights: accommodationNights ? parseInt(accommodationNights) : undefined,
          }
        : null,
    };

    onAdd(newDay);

    // Reset form
    setDate("");
    setLocation("");
    setTransportType("");
    setTransportTime("");
    setTransportRoute("");
    setAccommodationName("");
    setAccommodationNights("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Form Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-hidden z-50"
            style={{
              boxShadow: "0 -10px 40px -10px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Add New Day</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <XIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-70px)]">
              <div className="space-y-4">
                {/* Date */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    required
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Tokyo, Osaka, Kyoto"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    required
                  />
                </div>

                {/* Transportation Section */}
                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Transportation (optional)
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {["flight", "train", "bus"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setTransportType(transportType === type ? "" : type)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium capitalize transition-colors ${
                          transportType === type
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {transportType && (
                    <div className="space-y-3 mt-3">
                      <input
                        type="text"
                        value={transportTime}
                        onChange={(e) => setTransportTime(e.target.value)}
                        placeholder="Departure time (e.g., 08:30)"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={transportRoute}
                        onChange={(e) => setTransportRoute(e.target.value)}
                        placeholder="Route (e.g., Tokyo - Osaka)"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>

                {/* Accommodation Section */}
                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Accommodation (optional)
                  </label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={accommodationName}
                      onChange={(e) => setAccommodationName(e.target.value)}
                      placeholder="Hotel name"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                    {accommodationName && (
                      <input
                        type="number"
                        value={accommodationNights}
                        onChange={(e) => setAccommodationNights(e.target.value)}
                        placeholder="Number of nights"
                        min="1"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-6 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
              >
                Add Day
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
