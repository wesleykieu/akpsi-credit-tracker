// This will be a Server Component (no 'use client')
import { db } from "@/db/drizzle";
import { users as usersTable, attendances as attendancesTable, events as eventsTable } from "@/db/schema";
import { eq, count, desc, sql } from "drizzle-orm";
import { ChartBarLabelCustom } from "./charts";

export default async function TopAttendeesChart() {
  // Fetch data here on the server
  const topAttendees = await db
    .select({
      userId: attendancesTable.userId,
      userName: usersTable.name,
      attendanceCount: count(attendancesTable.id),
      pmCount: sql<number>`count(case when ${attendancesTable.attended} = true and ${eventsTable.eventName} like '%PM%' then 1 end)`,
      cmCount: sql<number>`count(case when ${attendancesTable.attended} = true and ${eventsTable.eventName} like '%CM%' then 1 end)`
    })
    .from(attendancesTable)
    .innerJoin(usersTable, eq(attendancesTable.userId, usersTable.id))
    .innerJoin(eventsTable, eq(attendancesTable.eventId, eventsTable.id))
    .where(eq(attendancesTable.attended, true))
    .groupBy(attendancesTable.userId, usersTable.name)
    .orderBy(desc(count(attendancesTable.id)))
    .limit(5);
    

  return <ChartBarLabelCustom data={topAttendees} />;

  
}