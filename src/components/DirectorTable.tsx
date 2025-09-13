import { db } from "@/db/drizzle";
import { users as usersTable, events as eventsTable, attendances as attendancesTable } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

import UserAttendanceTableClient from "./UserAttendanceTableClient";

type DirectorTableProps = {
    category: string;
    title: string;
}

// Server Component
export default async function DirectorTable({ category, title }: DirectorTableProps) {
    // Fetch users, events filtered by category, and attendance from the database
    const users = await db.select().from(usersTable).orderBy(asc(usersTable.id));
    const events = await db
        .select()
        .from(eventsTable)
        .where(eq(eventsTable.category, category))
        .orderBy(asc(eventsTable.order));
    const attendanceRows = await db.select().from(attendancesTable);
    
    // Normalize attendance to match previous shape
    const attendance = attendanceRows.map(a => ({
        userId: a.userId,
        eventId: a.eventId,
        attended: a.attended,
    }));

    return (
        <div className="flex flex-col max-w-7xl mx-auto p-4 md:p-24">
            <div className="rounded-md border">
                <UserAttendanceTableClient 
                    users={users} 
                    events={events} 
                    attendance={attendance}
                    category={category}
                />
            </div>
        </div>
    );
}

