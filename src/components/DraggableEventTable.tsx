// src/components/DraggableEventTable.tsx
"use client";

import React from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type EventItem = { id: number; eventName: string; order: number };

type Props = {
  events: EventItem[];
  onReorder: (next: EventItem[]) => void;
};

function SortableRow({ event }: { event: EventItem }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: event.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="w-10">
        <button aria-label="Drag handle" className="cursor-grab" {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>
      <TableCell className="font-medium">{event.eventName}</TableCell>
    </TableRow>
  );
}

export default function DraggableEventTable({ events, onReorder }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = events.findIndex((item) => item.id === active.id);
      const newIndex = events.findIndex((item) => item.id === over.id);
      const next = arrayMove(events, oldIndex, newIndex).map((e, idx) => ({ ...e, order: idx + 1 }));
      onReorder(next);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={events.map((e) => e.id)} strategy={verticalListSortingStrategy}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Event</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((e) => (
              <SortableRow key={e.id} event={e} />
            ))}
          </TableBody>
        </Table>
      </SortableContext>
    </DndContext>
  );
}