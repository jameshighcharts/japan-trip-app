import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/src/lib/mongodb";
import { ItineraryDay, DayUserData } from "@/app/lib/itinerary";

// Using a fixed user ID for now (single user app)
// Add auth later if needed for multiple users
const USER_ID = "default-user";

interface TripDocument {
  userId: string;
  customDays: ItineraryDay[];
  userDataMap: Record<string, DayUserData>;
  updatedAt: Date;
}

// GET - Load trip data
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection<TripDocument>("tripdata");

    const doc = await collection.findOne({ userId: USER_ID });

    if (!doc) {
      return NextResponse.json({
        customDays: [],
        userDataMap: {},
      });
    }

    return NextResponse.json({
      customDays: doc.customDays,
      userDataMap: doc.userDataMap,
    });
  } catch (error) {
    console.error("Failed to load trip data:", error);
    return NextResponse.json(
      { error: "Failed to load trip data" },
      { status: 500 }
    );
  }
}

// POST - Save trip data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customDays, userDataMap } = body as {
      customDays: ItineraryDay[];
      userDataMap: Record<string, DayUserData>;
    };

    const { db } = await connectToDatabase();
    const collection = db.collection<TripDocument>("tripdata");

    await collection.updateOne(
      { userId: USER_ID },
      {
        $set: {
          customDays,
          userDataMap,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save trip data:", error);
    return NextResponse.json(
      { error: "Failed to save trip data" },
      { status: 500 }
    );
  }
}
