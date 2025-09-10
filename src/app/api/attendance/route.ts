import { db } from "@/db/drizzle";
import { attendances } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, eventId } = body;
        const insertedAttendance = await db.insert(attendances).values({ userId, eventId, attended: true }).returning();
        return NextResponse.json(insertedAttendance[0], { status: 201 });
    } catch (error) {
        console.error("Error creating attendance:", error);
        return NextResponse.json({ error: "Failed to create attendance" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const { userId, eventId } = body;
        const deletedAttendance = await db.delete(attendances)
        .where(and(eq(attendances.userId, userId), eq(attendances.eventId, eventId)))
        .returning();
        return NextResponse.json(deletedAttendance[0], { status: 200 });
    } catch (error) {
        console.error("Error deleting attendance:", error);
        return NextResponse.json({ error: "Failed to delete attendance" }, { status: 500 });
    }
}