"use client";

import { Accommodation, getAccommodationMapUrl } from "@/app/lib/itinerary";

interface AccommodationCardProps {
  accommodation: Accommodation | string;
  compact?: boolean;
}

function HotelIcon({ className }: { className?: string }) {
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
      <path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" />
      <path d="M9 7h.01" />
      <path d="M15 7h.01" />
      <path d="M9 11h.01" />
      <path d="M15 11h.01" />
      <path d="M9 15h.01" />
      <path d="M15 15h.01" />
      <path d="M9 19h6" />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
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
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export default function AccommodationCard({
  accommodation,
  compact = false,
}: AccommodationCardProps) {
  const getName = () => {
    if (typeof accommodation === "string") {
      return accommodation.replace(" (continued)", "");
    }
    return accommodation.name;
  };

  const mapUrl = getAccommodationMapUrl(getName());

  if (typeof accommodation === "string") {
    if (compact) {
      return (
        <div className="flex items-center gap-2 text-gray-600">
          <HotelIcon className="w-4 h-4" />
          <span className="text-sm truncate">{getName()}</span>
        </div>
      );
    }
    return (
      <div className="p-4 bg-gray-50 rounded-2xl">
        <div className="flex items-center gap-2 text-gray-600 mb-1">
          <HotelIcon className="w-4 h-4" />
          <span className="text-xs font-medium uppercase tracking-wider">
            Overnatting
          </span>
        </div>
        <p className="text-sm text-gray-900">{accommodation}</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="p-3 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-2 mb-1">
          <HotelIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-900 truncate">
            {accommodation.name}
          </span>
        </div>
        {accommodation.nights && (
          <p className="text-xs text-gray-500 ml-6">
            {accommodation.nights} natt{accommodation.nights > 1 ? "er" : ""}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 rounded-2xl">
      <div className="flex items-center gap-2 text-gray-600 mb-3">
        <HotelIcon className="w-4 h-4" />
        <span className="text-xs font-medium uppercase tracking-wider">
          Accommodation
        </span>
      </div>

      <h4 className="text-base font-semibold text-gray-900 mb-2">
        {accommodation.name}
      </h4>

      {/* Google Maps Link */}
      {mapUrl && (
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-3 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors"
        >
          <MapPinIcon className="w-3.5 h-3.5" />
          Åpne i Google Maps
        </a>
      )}

      <div className="space-y-2 text-sm">
        {accommodation.nights && (
          <div className="flex justify-between">
            <span className="text-gray-500">Varighet</span>
            <span className="text-gray-900 font-medium">
              {accommodation.nights} natt{accommodation.nights > 1 ? "er" : ""}
            </span>
          </div>
        )}

        {accommodation.roomType && (
          <div className="flex justify-between">
            <span className="text-gray-500">Rom</span>
            <span className="text-gray-900">{accommodation.roomType}</span>
          </div>
        )}

        {accommodation.beds && (
          <div className="flex justify-between">
            <span className="text-gray-500">Senger</span>
            <span className="text-gray-900">{accommodation.beds}</span>
          </div>
        )}

        {accommodation.confirmationNumber && (
          <div className="flex justify-between">
            <span className="text-gray-500">Bekreftelse</span>
            <span className="text-gray-900 font-mono text-xs">
              {accommodation.confirmationNumber}
            </span>
          </div>
        )}

        {accommodation.pin && (
          <div className="flex justify-between">
            <span className="text-gray-500">PIN</span>
            <span className="text-gray-900 font-mono text-xs">
              {accommodation.pin}
            </span>
          </div>
        )}

        {accommodation.prepaid !== undefined && (
          <div className="flex justify-between">
            <span className="text-gray-500">Betaling</span>
            <span
              className={`${
                accommodation.prepaid ? "text-emerald-600" : "text-gray-900"
              }`}
            >
              {accommodation.prepaid ? "Forhåndsbetalt" : "Betal på hotellet"}
            </span>
          </div>
        )}

        {accommodation.breakfast !== undefined && (
          <div className="flex justify-between">
            <span className="text-gray-500">Frokost</span>
            <span className="text-gray-900">
              {accommodation.breakfast ? "Inkludert" : "Ikke inkludert"}
            </span>
          </div>
        )}

        {accommodation.notes && (
          <div className="pt-2 mt-2 border-t border-gray-200">
            <p className="text-xs text-gray-600">{accommodation.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
