export interface Transportation {
  type: "flight" | "train" | "bus" | "arrival";
  departure?: string;
  arrival?: string;
  route?: string;
  airline?: string;
  operator?: string;
  busNumber?: string;
  ticketReference?: string;
  passengers?: number;
  bookingUrl?: string;
  notes?: string;
}

export interface AlternateBooking {
  source: string;
  reference: string;
  roomType: string;
  breakfast: boolean;
}

export interface HannaRoom {
  dates: string;
  reference: string;
  pin: string;
}

export interface Accommodation {
  name: string;
  bookingSource?: string;
  confirmationNumber?: string;
  pin?: string;
  roomType?: string;
  breakfast?: boolean;
  prepaid?: boolean;
  nights?: number;
  checkIn?: string;
  checkOut?: string;
  beds?: number;
  notes?: string;
  alternateBooking?: AlternateBooking;
  hannaRoom?: HannaRoom;
}

export interface ItineraryDay {
  date: string;
  location: string;
  transportation: Transportation | null;
  accommodation: Accommodation | string | null;
}

export interface Trip {
  name: string;
  startDate: string;
  endDate: string;
  flightBookingRef: string;
}

export interface TripData {
  trip: Trip;
  itinerary: ItineraryDay[];
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatFullDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function getTransportIcon(type: string): string {
  switch (type) {
    case "flight":
      return "plane";
    case "train":
      return "train";
    case "bus":
      return "bus";
    case "arrival":
      return "plane-arrival";
    default:
      return "circle";
  }
}

// Google Maps links for accommodations
export const accommodationMaps: Record<string, string> = {
  "THE KNOT TOKYO Shinjuku": "https://maps.google.com/?q=4-31-1+Nishi-shinjuku,+Shinjuku-ku+Tokyo,+160-0023,+Japan",
  "Winery Hotel and Condominium HITOHANA": "https://maps.google.com/?q=23-10+Kitanomine,+Furano,+Hokkaido+076-0034,+Japan",
  "Keio Plaza Hotel Sapporo": "https://maps.google.com/?q=2-1+North+5+West+7,+Chuo-ku,+Sapporo,+Hokkaido+060-0005,+Japan",
  "Hotel Kanronomori": "https://maps.google.com/?q=415+Niseko,+Niseko-cho,+Abuta-gun,+Hokkaido+048-1511,+Japan",
  "KOKO STAY Chitose (formerly Hotel Wing International Chitose)": "https://maps.google.com/?q=2-2-10+Chiyoda-cho,+Chitose,+Hokkaido,+Japan",
};

// Location Google Maps links
export const locationMaps: Record<string, string> = {
  "Tokyo": "https://maps.google.com/?q=Shinjuku,+Tokyo,+Japan",
  "Tykyo": "https://maps.google.com/?q=Shinjuku,+Tokyo,+Japan",
  "Furano": "https://maps.google.com/?q=Furano,+Hokkaido,+Japan",
  "Sapporo": "https://maps.google.com/?q=Sapporo,+Hokkaido,+Japan",
  "Niseko": "https://maps.google.com/?q=Niseko,+Hokkaido,+Japan",
};

export function getAccommodationMapUrl(name: string): string | null {
  for (const [key, url] of Object.entries(accommodationMaps)) {
    if (name.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(name.toLowerCase())) {
      return url;
    }
  }
  return null;
}

export function getLocationMapUrl(location: string): string | null {
  for (const [key, url] of Object.entries(locationMaps)) {
    if (location.toLowerCase().includes(key.toLowerCase())) {
      return url;
    }
  }
  return `https://maps.google.com/?q=${encodeURIComponent(location)},+Japan`;
}

// Beautiful location photos from Unsplash
export const locationPhotos: Record<string, string> = {
  "Tokyo": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
  "Tykyo": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
  "Travel to Tokyo": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
  "Furano": "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800&q=80",
  "Sapporo": "https://images.unsplash.com/photo-1583834610905-f4e5c159a510?w=800&q=80",
  "Niseko": "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80",
  "Travel to Niseko": "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80",
  "travel to Sapporo": "https://images.unsplash.com/photo-1583834610905-f4e5c159a510?w=800&q=80",
  "to Sappoho airport/CTS": "https://images.unsplash.com/photo-1583834610905-f4e5c159a510?w=800&q=80",
  "To Bergen": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
  "Return to Bergen": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
};

export function getLocationPhoto(location: string): string {
  // Try exact match first
  if (locationPhotos[location]) {
    return locationPhotos[location];
  }

  // Try partial match
  const locationLower = location.toLowerCase();
  for (const [key, url] of Object.entries(locationPhotos)) {
    if (locationLower.includes(key.toLowerCase()) || key.toLowerCase().includes(locationLower)) {
      return url;
    }
  }

  // Default fallback - beautiful Japan landscape
  return "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80";
}

// Types for user data
export interface DayUserData {
  notes: string;
  attachments: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: "pdf" | "image";
  addedAt: string;
}
