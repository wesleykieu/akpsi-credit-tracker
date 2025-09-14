import { db } from "@/db/drizzle";
import { attendances, events, users } from "@/db/schema";
import { and, count, desc, eq, sum, sql } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
    try { 
        const topAttendees = await db
            .select({
                userId: users.id,
                userName: users.name,
                attendanceCount: count(attendances.id),
                pmCount: sum(
                    sql`CASE WHEN ${events.eventName} ILIKE '%PM%' THEN 1 ELSE 0 END`
                ),
                cmCount: sum(
                    sql`CASE WHEN ${events.eventName} ILIKE '%CM%' THEN 1 ELSE 0 END`
                )
            })
            .from(users)
            .innerJoin(attendances, eq(users.id, attendances.userId))
            .innerJoin(events, eq(attendances.eventId, events.id))
            .where(eq(attendances.attended, true))
            .groupBy(users.id, users.name)
            .orderBy(desc(count(attendances.id)))
            .limit(5);
        return NextResponse.json(topAttendees);
    } catch (error) {
        console.log("Error fetching top attendees", error);
        return NextResponse.json({ error: "Failed to fetch top attendees" }, { status: 500 });
    }
}