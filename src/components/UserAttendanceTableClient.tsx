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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    arrayMove,
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type User = {
    id: number;
    name: string;
};

type Event = {
    id: number;
    eventName: string;
    category: string;
    order: number;
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
    category?: string;
};

export default function UserAttendanceTableClient({ users: initialUsers, events: initialEvents, attendance: initialAttendance, category }: Props) {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [events, setEvents] = useState<Event[]>(initialEvents);
    const [attendance, setAttendance] = useState<Attendance[]>(initialAttendance);
    const sensors = useSensors(useSensor(PointerSensor));
    const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
    const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
    const [newUserName, setNewUserName] = useState("");
    const [newEventName, setNewEventName] = useState("");
    const [selectedEventID, setSelectedEventID] = useState<string>("");
    const [selectedUserID, setSelectedUserID] = useState<string>("");
    const [isManageDeleteOpen, setIsManageDeleteOpen] = useState(false);
    
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
                body: JSON.stringify({ 
                    eventName: newEventName,
                    category: category || "general"
                }),
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

    // Header column drag handlers (drag to reorder columns)
    const handleHeaderDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = events.findIndex((e) => e.id === active.id);
        const newIndex = events.findIndex((e) => e.id === over.id);
        const next = arrayMove(events, oldIndex, newIndex).map((e, idx) => ({ ...e, order: (idx + 1) }));
        setEvents(next);
        try {
            await Promise.all(
                next.map((e) =>
                    fetch(`/api/events/${e.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ order: e.order })
                    })
                )
            );
        } catch (err) {
            console.error("Failed to persist column order", err);
        }
    };

    function SortableHeaderCell({ event }: { event: Event }) {
        const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: event.id });
        const style: React.CSSProperties = {
            transform: CSS.Transform.toString(transform),
            transition,
            cursor: "grab",
            whiteSpace: "nowrap",
        };
        return (
            <TableHead
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className="sticky top-0 z-10 bg-background truncate text-center px-3"
                title={event.eventName}
            >
                {event.eventName}
            </TableHead>
        );
    }

    // Removed auxiliary reorder dialog handlers

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

    const handleDeleteUser = async (userId: number) => {
        if(!userId || isNaN(userId)) {
            alert("Please select a valid user to delete");
            return;
        }
        try {
            const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
            if (res.ok) {
                setUsers(prev => prev.filter(u => u.id !== userId));
                setAttendance(prev => prev.filter(a => a.userId !== userId));
                setSelectedUserID("");
                setIsManageDeleteOpen(false);
            } else {
                const errorData = await res.json();
                alert(`Failed to delete user: ${errorData.error}`);
            }
        } catch (e) {
            console.error(e);
            alert("Network error occurred");
        }
    };

    // Single delete action: deletes event, user, or both based on selections
    const handleCombinedDelete = async () => {
        const hasEvent = !!selectedEventID;
        const hasUser = !!selectedUserID;
        if (!hasEvent && !hasUser) return;
        if (hasEvent) {
            await handleDeleteEvent(parseInt(selectedEventID));
        }
        if (hasUser) {
            await handleDeleteUser(parseInt(selectedUserID));
        }
        setIsManageDeleteOpen(false);
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
                {/* Single Delete dialog (Event/User/Both) */}
                <Dialog open={isManageDeleteOpen} onOpenChange={setIsManageDeleteOpen}>
                    <DialogTrigger asChild>
                        <Button type="button">
                            <Trash className="w-4 h-4"/>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[520px]">
                        <DialogHeader>
                            <DialogTitle>Delete Items</DialogTitle>
                            <DialogDescription>Select an event and/or a user to delete.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-2">
                            <div className="grid gap-2">
                                <Label>Event</Label>
                                <Select value={selectedEventID} onValueChange={(v) => setSelectedEventID(v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an event" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {events.map((e) => (
                                            <SelectItem key={e.id} value={e.id.toString()}>
                                                {e.eventName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                
                            </div>

                            <div className="grid gap-2">
                                <Label>User</Label>
                                <Select value={selectedUserID} onValueChange={(v) => setSelectedUserID(v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a user" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((u) => (
                                            <SelectItem key={u.id} value={u.id.toString()}>
                                                {u.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                
                            </div>

                            <div className="flex gap-2 justify-end">
                                <Button onClick={handleCombinedDelete} disabled={!selectedEventID && !selectedUserID}>
                                    Delete
                                </Button>
                            </div>
                        </div>
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

                {/* Column drag-and-drop handles reordering; dialog removed */}
            </div>
        
            {/* Drag-and-drop context moved OUTSIDE the table to avoid invalid <div> inside <tr> */} 
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleHeaderDragEnd}>
            <SortableContext items={events.map((e) => e.id)} strategy={horizontalListSortingStrategy}>
            <ScrollArea className="h-[500px] max-h-[500px]">
                <Table className="min-w-max"> 
                    <TableCaption>A list of your recent invoices.</TableCaption> 
                    <TableHeader className="sticky top-0 z-30 bg-background">  
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead className="sticky left-0 z-30 bg-background">Name</TableHead> 
                            {events.map((event) => (
                                <SortableHeaderCell key={event.id} event={event} />
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell className="sticky left-0 z-20 bg-background">{user.name}</TableCell>  
                                {events.map((event) => (
                                    <TableCell key={event.id} className="text-center">
                                        <div className="inline-flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={attendance.some(a => a.userId === user.id && a.eventId === event.id)}
                                                onChange={e =>
                                                    handleAttendanceChange(user.id, event.id, e.target.checked)
                                                }
                                            />
                                        </div>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            </SortableContext>
            </DndContext>
        </div>
    
    );
}