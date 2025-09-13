// This should be in: /app/api/events/[eventId]/route.ts
// NOT in: /app/api/events/route.ts

import { db } from "@/db/drizzle";
import { events, attendances } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        console.log("DELETE function called!");
        
        // Await params in Next.js 15
        const { eventId: eventIdString } = await params;
        console.log("Event ID from params:", eventIdString);
        
        const eventId = parseInt(eventIdString);
    
        if (!eventId || isNaN(eventId)) {
            return NextResponse.json({ error: "Valid Event ID is required" }, { status: 400 });
        }

        // Check if event exists first
        const existingEvent = await db.select().from(events).where(eq(events.id, eventId));
        
        if (existingEvent.length === 0) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        // First, delete all attendance records for this event
        await db.delete(attendances).where(eq(attendances.eventId, eventId));
        console.log("Deleted attendance records for event:", eventId);

        // Then delete the event
        const deletedEvent = await db.delete(events)
            .where(eq(events.id, eventId))
            .returning();
           
        return NextResponse.json({ 
            message: "Event deleted successfully", 
            deletedEvent: deletedEvent[0] 
        }, { status: 200 });
        
    } catch (error) {
        console.error("Error deleting event:", error);
        return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const { eventId: eventIdString } = await params;
        const eventId = parseInt(eventIdString);
        const { order } = await request.json();

        if (!eventId || isNaN(eventId)) {
            return NextResponse.json({ error: "Valid Event ID is required" }, { status: 400 });
        }

        const updatedEvent = await db
            .update(events)
            .set({ order })
            .where(eq(events.id, eventId))
            .returning();

        return NextResponse.json(updatedEvent[0], { status: 200 });
    } catch (error) {
        console.error("Error updating event:", error);
        return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
    }
}