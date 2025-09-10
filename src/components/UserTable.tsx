import { db } from "@/db/drizzle";
import { users as usersTable, events as eventsTable, attendances as attendancesTable } from "@/db/schema";

import UserAttendanceTableClient from "./UserAttendanceTableClient";

// Server Component
export default async function UserTable() {
    // Fetch users, events, and attendance from the database
    const users = await db.select().from(usersTable);
    const events = await db.select().from(eventsTable);
    const attendanceRows = await db.select().from(attendancesTable);
    // Normalize attendance to match previous shape
    const attendance = attendanceRows.map(a => ({
        userId: a.userId,
        eventId: a.eventId,
        attended: a.attended,
    }));

    return (
        <div className="rounded-md border">
            <UserAttendanceTableClient users={users} events={events} attendance={attendance} />
           
        </div>


    );
}
