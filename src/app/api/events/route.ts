import { db } from "@/db/drizzle";
import { events } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";
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
        // Determine next order within the same category
        const category = body.category ?? "general";
        const lastInCategory = await db
            .select()
            .from(events)
            .where(eq(events.category, category))
            .orderBy(desc(events.order))
            .limit(1);

        const nextOrder = lastInCategory.length ? (lastInCategory[0].order ?? 0) + 1 : 1;

        const insertedEvent = await db
            .insert(events)
            .values({ ...body, category, order: nextOrder })
            .returning();
        return NextResponse.json(insertedEvent[0], { status: 201 });
    } catch (error) {
        console.error("Error creating event:", error);
        return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
    }
}


