'use client';
import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CalendarPlus, DeleteIcon, Plus, Trash, UserPlus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

type User = {
    id: number;
    name: string;
};

type Event = {
    id: number;
    eventName: string;
};

type Attendance = {
    userId: number;
    eventId: number;
    attended: boolean;
};

type Props = {
    users: User[];
    events: Event[];
    attendance: Attendance[];
};

export default function UserAttendanceTableClient({ users: initialUsers, events: initialEvents, attendance: initialAttendance }: Props) {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [events, setEvents] = useState<Event[]>(initialEvents);
    const [attendance, setAttendance] = useState<Attendance[]>(initialAttendance);
    const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
    const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
    const [newUserName, setNewUserName] = useState("");
    const [newEventName, setNewEventName] = useState("");
    const [selectedEventID, setSelectedEventID] = useState<string>("");
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    // Handle adding a new user
    const handleAddUser = async () => {
        if (!newUserName.trim()) return;

        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newUserName }),
            });

            if (res.ok) {
                const newUser = await res.json();
                setUsers(prev => [...prev, newUser]);
                setNewUserName("");
                setIsUserDialogOpen(false);
            } else {
                alert("Failed to add user");
            }
        } catch (error) {
            console.error("Error adding user:", error);
            alert("Failed to add user");
        }
    };

    // Handle adding a new event
    const handleAddEvent = async () => {
        if (!newEventName.trim()) return;

        try {
            const res = await fetch("/api/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventName: newEventName }),
            });

            if (res.ok) {
                const newEvent = await res.json();
                setEvents(prev => [...prev, newEvent]);
                setNewEventName("");
                setIsEventDialogOpen(false);
            } else {
                alert("Failed to add event");
            }
        } catch (error) {
            console.error("Error adding event:", error);
            alert("Failed to add event");
        }
    };

    // Handle attendance change for each user and event in the table using the API route to update the database 
    const handleAttendanceChange = async (userId: number, eventId: number, attended: boolean) => {
        if (attended) {
            // Add attendance (POST)
            const res = await fetch("/api/attendance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, eventId }),
            });
            if (res.ok) {
                setAttendance(prev => {
                    if (!prev.some(a => a.userId === userId && a.eventId === eventId)) {
                        return [...prev, { userId, eventId, attended: true }];
                    }
                    return prev;
                });
            }
        } else {
            // Remove attendance (DELETE)
            const res = await fetch("/api/attendance", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, eventId }),
            });
            if (res.ok) {
                setAttendance(prev => prev.filter(a => !(a.userId === userId && a.eventId === eventId)));
            }
        }
    };
    const handleDeleteEvent = async (eventId: number) => {
        console.log("=== DELETE DEBUG START ===");
        console.log("eventId:", eventId);
        console.log("selectedEventID:", selectedEventID);
        
        if(!eventId || isNaN(eventId)) {
            alert("Please select a valid event to delete");
            return;
        }
    
        try {
            console.log("Making request to:", `/api/events/${eventId}`);
            
            const res = await fetch(`/api/events/${eventId}`, {
                method: "DELETE",
            });
            
            console.log("Response status:", res.status);
            console.log("Response ok:", res.ok);
            
            if (res.ok) {
                const responseData = await res.json();
                console.log("Success data:", responseData);
                
                // Update local state
                setEvents(prev => prev.filter(e => e.id !== eventId));
                
                // Remove attendance records for this event
                setAttendance(prev => prev.filter(a => a.eventId !== eventId));
                
                // Reset form and close dialog
                setSelectedEventID("");
                setIsDeleteDialogOpen(false);
                
             
            } else {
                const errorData = await res.json();
                console.log("Error data:", errorData);
                alert(`Failed to delete event: ${errorData.error}`);
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("Network error occurred");
        }
        
        console.log("=== DELETE DEBUG END ===");
    };

    
        

    return (
        <div>
            <div className="p-4 border-b flex gap-2">
                <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setIsUserDialogOpen(true)}>
                            <UserPlus className="w-4 h-4"/>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New User</DialogTitle>
                            <DialogDescription>
                                Enter the name of the new user you want to add to the system.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    value={newUserName}
                                    onChange={(e) => setNewUserName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddUser();
                                        }
                                    }}
                                    placeholder="Enter user name"
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="button" onClick={handleAddUser}>
                                Add User
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setIsEventDialogOpen(true)}>
                            <CalendarPlus className="w-4 h-4"/>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Event</DialogTitle>
                            <DialogDescription>
                                Enter the name of the new event you want to add to the system.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="eventName" className="text-right">
                                    Event Name
                                </Label>
                                <Input
                                    id="eventName"
                                    value={newEventName}
                                    onChange={(e) => setNewEventName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddEvent();
                                        }
                                    }}
                                    placeholder="Enter event name"
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEventDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="button" onClick={handleAddEvent}>
                                Add Event
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogTrigger asChild>
                        <Button type="button">
                            <Trash className="w-4 h-4"/>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Delete Event</DialogTitle>
                            <DialogDescription>Which event do you want to delete?</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <Select value={selectedEventID} 
                                onValueChange={(value) => {
                                setSelectedEventID(value);
                                console.log("selected event: ", value);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an event" />
                                </SelectTrigger>
                                <SelectContent>
                                    {events.map((events) => (
                                        <SelectItem key={events.id} value={events.id.toString()}>
                                            {events.eventName}
                                    
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button
                                onClick={() => handleDeleteEvent(parseInt(selectedEventID))}
                                disabled={!selectedEventID} 
                                variant="destructive"
                            >
                            Delete Event
                            </Button>

                        </div>
                    </DialogContent>


                </Dialog>
            </div>
            <ScrollArea className="h-[500px] max-h-[500px]">
                <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[10px]">ID</TableHead>
                            <TableHead>Name</TableHead>
                            {events.map((event) => (
                                <TableHead key={event.id}>{event.eventName}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.name}</TableCell>  
                                {events.map((event) => (
                                    <TableCell key={event.id}>
                                        <input
                                            type="checkbox"
                                            checked={attendance.some(a => a.userId === user.id && a.eventId === event.id)}
                                            onChange={e =>
                                                handleAttendanceChange(user.id, event.id, e.target.checked)
                                            }
                                        /> 
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
    );
}