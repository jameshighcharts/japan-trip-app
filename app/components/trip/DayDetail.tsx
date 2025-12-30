"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ItineraryDay,
  formatFullDate,
  getLocationPhoto,
  getLocationMapUrl,
  DayUserData,
  Attachment,
} from "@/app/lib/itinerary";
import TransportBadge from "./TransportBadge";
import AccommodationCard from "./AccommodationCard";

interface DayDetailProps {
  day: ItineraryDay;
  dayNumber: number;
  totalDays: number;
  userData: DayUserData;
  onUpdateUserData: (data: DayUserData) => void;
}

function PlusIcon({ className }: { className?: string }) {
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
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function FileIcon({ className }: { className?: string }) {
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
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function ImageIcon({ className }: { className?: string }) {
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
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
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
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function CameraIcon({ className }: { className?: string }) {
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
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

export default function DayDetail({
  day,
  dayNumber,
  totalDays,
  userData,
  onUpdateUserData,
}: DayDetailProps) {
  const photoUrl = getLocationPhoto(day.location);
  const locationMapUrl = getLocationMapUrl(day.location);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Ensure attachments array exists (migration from old pdfs format)
  const attachments = userData.attachments || [];

  const handleNotesChange = (notes: string) => {
    onUpdateUserData({ ...userData, notes });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const isPdf = file.type === "application/pdf";
    const isImage = file.type.startsWith("image/");

    if (!isPdf && !isImage) {
      alert("Last opp en PDF- eller bildefil");
      return;
    }

    // Check file size (limit to 50MB for Vercel Blob)
    if (file.size > 50 * 1024 * 1024) {
      alert("Filen er for stor. Maks 50MB.");
      return;
    }

    setIsUploading(true);

    try {
      // Upload to Vercel Blob
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      const { url, name } = data;

      const newAttachment: Attachment = {
        id: Date.now().toString(),
        name: name,
        url: url,
        type: isPdf ? "pdf" : "image",
        addedAt: new Date().toISOString(),
      };

      onUpdateUserData({
        ...userData,
        attachments: [...attachments, newAttachment],
      });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Kunne ikke laste opp filen. Prøv igjen.");
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteAttachment = (id: string) => {
    onUpdateUserData({
      ...userData,
      attachments: attachments.filter((a) => a.id !== id),
    });
  };

  return (
    <div className="pb-8">
      {/* Hero Photo */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={photoUrl}
          alt={day.location}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-6 right-6">
          <p className="text-white/80 text-sm mb-1">{formatFullDate(day.date)}</p>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {day.location}
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-white/70 text-sm">
              Dag {dayNumber} av {totalDays}
            </p>
            {locationMapUrl && (
              <a
                href={locationMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full hover:bg-white/30 transition-colors"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Kart
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 pt-6">
        {/* Transportation Section */}
        {day.transportation && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Transport
            </h3>
            <div className="bg-gray-50 rounded-2xl p-4">
              <TransportBadge transport={day.transportation} />

              {/* Additional transport details */}
              <div className="mt-4 space-y-2 text-sm">
                {day.transportation.route && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Rute</span>
                    <span className="text-gray-900 text-right max-w-[60%]">
                      {day.transportation.route}
                    </span>
                  </div>
                )}

                {day.transportation.airline && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Flyselskap</span>
                    <span className="text-gray-900">
                      {day.transportation.airline}
                    </span>
                  </div>
                )}

                {day.transportation.operator && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Operatør</span>
                    <span className="text-gray-900">
                      {day.transportation.operator}
                    </span>
                  </div>
                )}

                {day.transportation.busNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Buss</span>
                    <span className="text-gray-900 font-mono text-xs">
                      {day.transportation.busNumber}
                    </span>
                  </div>
                )}

                {day.transportation.ticketReference && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Referanse</span>
                    <span className="text-gray-900 font-mono text-xs">
                      {day.transportation.ticketReference}
                    </span>
                  </div>
                )}

                {day.transportation.passengers && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Passasjerer</span>
                    <span className="text-gray-900">
                      {day.transportation.passengers}
                    </span>
                  </div>
                )}

                {day.transportation.notes && (
                  <div className="pt-2 mt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-600">
                      {day.transportation.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Accommodation Section */}
        {day.accommodation && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Hvor du bor
            </h3>
            <AccommodationCard accommodation={day.accommodation} />
          </div>
        )}

        {/* Notes Section */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Mine notater
          </h3>
          <div className="bg-gray-50 rounded-2xl p-4">
            {isEditingNotes ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <textarea
                  value={userData.notes}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  placeholder="Skriv dine notater for denne dagen..."
                  className="w-full h-32 bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  autoFocus
                />
                <button
                  onClick={() => setIsEditingNotes(false)}
                  className="mt-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Ferdig
                </button>
              </motion.div>
            ) : (
              <div
                onClick={() => setIsEditingNotes(true)}
                className="cursor-pointer min-h-[60px]"
              >
                {userData.notes ? (
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {userData.notes}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 flex items-center gap-2">
                    <PlusIcon className="w-4 h-4" />
                    Trykk for å legge til notater...
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Attachments Section */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Bilder og dokumenter
          </h3>
          <div className="space-y-2">
            {/* Image Grid */}
            {attachments.filter((a) => a.type === "image").length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {attachments
                  .filter((a) => a.type === "image")
                  .map((attachment) => (
                    <motion.div
                      key={attachment.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative aspect-square rounded-xl overflow-hidden group"
                    >
                      <img
                        src={attachment.url}
                        alt={attachment.name}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setPreviewImage(attachment.url)}
                      />
                      <button
                        onClick={() => handleDeleteAttachment(attachment.id)}
                        className="absolute top-1 right-1 p-1.5 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <TrashIcon className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
              </div>
            )}

            {/* PDF List */}
            {attachments
              .filter((a) => a.type === "pdf")
              .map((attachment) => (
                <motion.div
                  key={attachment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between bg-gray-50 rounded-xl p-3"
                >
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileIcon className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {attachment.name}
                      </p>
                      <p className="text-xs text-gray-500">PDF-dokument</p>
                    </div>
                  </a>
                  <button
                    onClick={() => handleDeleteAttachment(attachment.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}

            {/* Upload Buttons */}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
            {isUploading ? (
              <div className="flex items-center justify-center gap-2 p-4 bg-gray-50 rounded-xl">
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                <span className="text-sm text-gray-500">Laster opp...</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept = "image/*";
                      fileInputRef.current.capture = "environment";
                      fileInputRef.current.click();
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-gray-300 hover:text-gray-600 transition-colors"
                >
                  <CameraIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Bilde</span>
                </button>
                <button
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.accept = "application/pdf";
                      fileInputRef.current.removeAttribute("capture");
                      fileInputRef.current.click();
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-gray-300 hover:text-gray-600 transition-colors"
                >
                  <FileIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">PDF</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
