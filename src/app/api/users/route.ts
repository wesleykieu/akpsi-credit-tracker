import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { error } from "console";

export async function GET(request: Request) {
    try {
        const allUsers = await db.select().from(users);
        return NextResponse.json(allUsers);
    } catch {
        console.error("Error fetching users: ", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

// create a get request to get all users 
// create a post request to create a new user and test it with postman

export async function POST(request: Request) {
    try {
    const body = await request.json(); 
    const insertedUser = await db.insert(users).values(body).returning();
    return NextResponse.json(insertedUser[0], { status: 201 });
} catch {
    console.error("Error creating user: ", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
}
}