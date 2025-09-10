import { db } from "@/db/drizzle";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const allEvents = await db.select().from(events);
        return NextResponse.json(allEvents);
    } catch (error) {
        console.error("Error fetching events: ", error);
        return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
    }   
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const insertedEvent = await db.insert(events).values(body).returning();
        return NextResponse.json(insertedEvent[0], { status: 201 });
    } catch (error) {
        console.error("Error creating event:", error);
        return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
    }
}

