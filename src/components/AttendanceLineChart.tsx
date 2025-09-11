// This will be a Server Component (no 'use client')
import { db } from "@/db/drizzle";
import { users as usersTable, attendances as attendancesTable, events as eventsTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { ChartLineMultiple } from "./linechart";

export default async function AttendanceLineChart() {
  // Fetch PM and CM attendance data by event
  const attendanceData = await db
    .select({
      eventName: eventsTable.eventName,
      pmAttendance: sql<number>`count(case when ${attendancesTable.attended} = true and ${eventsTable.eventName} like '%PM%' then 1 end)`,
      cmAttendance: sql<number>`count(case when ${attendancesTable.attended} = true and ${eventsTable.eventName} like '%CM%' then 1 end)`
    })
    .from(attendancesTable)
    .innerJoin(eventsTable, eq(attendancesTable.eventId, eventsTable.id))
    .where(eq(attendancesTable.attended, true))
    .groupBy(eventsTable.eventName)
    .orderBy(eventsTable.eventName);

  return <ChartLineMultiple data={attendanceData} />;
}
