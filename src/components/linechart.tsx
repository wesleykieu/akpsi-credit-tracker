"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A multiple line chart"

interface AttendanceLineData {
  eventName: string;
  pmAttendance: number;
  cmAttendance: number;
}

interface ChartProps {
  data?: AttendanceLineData[];
}

const chartConfig = {
  pmAttendance: {
    label: "PM Events",
    color: "var(--chart-1)",
  },
  cmAttendance: {
    label: "CM Events",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartLineMultiple({ data }: ChartProps) {
  const chartData = data || [
    { eventName: "Event 1", pmAttendance: 5, cmAttendance: 3 },
    { eventName: "Event 2", pmAttendance: 8, cmAttendance: 6 },
    { eventName: "Event 3", pmAttendance: 6, cmAttendance: 4 },
    { eventName: "Event 4", pmAttendance: 4, cmAttendance: 7 },
    { eventName: "Event 5", pmAttendance: 7, cmAttendance: 5 },
    { eventName: "Event 6", pmAttendance: 9, cmAttendance: 8 },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Trends</CardTitle>
        <CardDescription>PM vs CM Attendance Over Time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-[200px]">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 8,
              bottom: 0,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="eventName"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              angle={-45}
              textAnchor="end"
              height={40}
              fontSize={10}
              interval={0}
              padding={{ left: 12, right: 12 }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="pmAttendance"
              type="monotone"
              stroke="var(--color-pmAttendance)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="cmAttendance"
              type="monotone"
              stroke="var(--color-cmAttendance)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              AI Insights here <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              AI Insights here
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
