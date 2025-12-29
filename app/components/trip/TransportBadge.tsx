"use client";

import { Transportation } from "@/app/lib/itinerary";

interface TransportBadgeProps {
  transport: Transportation;
  compact?: boolean;
}

function PlaneIcon({ className }: { className?: string }) {
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
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </svg>
  );
}

function TrainIcon({ className }: { className?: string }) {
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
      <rect width="16" height="16" x="4" y="3" rx="2" />
      <path d="M4 11h16" />
      <path d="M12 3v8" />
      <path d="m8 19-2 3" />
      <path d="m18 22-2-3" />
      <path d="M8 15h.01" />
      <path d="M16 15h.01" />
    </svg>
  );
}

function BusIcon({ className }: { className?: string }) {
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
      <path d="M8 6v6" />
      <path d="M16 6v6" />
      <path d="M2 12h20" />
      <path d="M17 18H7" />
      <rect width="16" height="16" x="4" y="3" rx="2" />
      <circle cx="8" cy="18" r="2" />
      <circle cx="16" cy="18" r="2" />
    </svg>
  );
}

export default function TransportBadge({
  transport,
  compact = false,
}: TransportBadgeProps) {
  const getStyles = () => {
    switch (transport.type) {
      case "flight":
      case "arrival":
        return "text-violet-600 bg-violet-50";
      case "train":
        return "text-emerald-600 bg-emerald-50";
      case "bus":
        return "text-amber-600 bg-amber-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getIcon = () => {
    const iconClass = "w-4 h-4";
    switch (transport.type) {
      case "flight":
      case "arrival":
        return <PlaneIcon className={iconClass} />;
      case "train":
        return <TrainIcon className={iconClass} />;
      case "bus":
        return <BusIcon className={iconClass} />;
      default:
        return null;
    }
  };

  const getLabel = () => {
    switch (transport.type) {
      case "flight":
        return transport.departure
          ? `Departs ${transport.departure}`
          : "Flight";
      case "arrival":
        return transport.arrival ? `Arrives ${transport.arrival}` : "Arrival";
      case "train":
        return transport.departure
          ? `Train ${transport.departure}`
          : "Train";
      case "bus":
        return transport.departure
          ? `Bus ${transport.departure}`
          : "Bus";
      default:
        return transport.type;
    }
  };

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${getStyles()}`}
      >
        {getIcon()}
        <span>{getLabel()}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl ${getStyles()}`}>
      {getIcon()}
      <div className="flex flex-col">
        <span className="text-sm font-medium">{getLabel()}</span>
        {transport.route && (
          <span className="text-xs opacity-75">{transport.route}</span>
        )}
      </div>
    </div>
  );
}
