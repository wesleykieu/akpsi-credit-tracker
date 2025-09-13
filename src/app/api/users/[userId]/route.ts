import { db } from "@/db/drizzle";
import { attendances, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: userIdString } = await params;
    const userId = parseInt(userIdString);
    if (!userId || isNaN(userId)) {
      return NextResponse.json({ error: "Valid User ID is required" }, { status: 400 });
    }

    // Ensure user exists
    const existing = await db.select().from(users).where(eq(users.id, userId));
    if (existing.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete attendance for this user
    await db.delete(attendances).where(eq(attendances.userId, userId));

    // Delete the user
    const deletedUser = await db.delete(users).where(eq(users.id, userId)).returning();

    return NextResponse.json({ message: "User deleted", user: deletedUser[0] }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}


