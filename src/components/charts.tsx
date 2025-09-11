"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

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

export const description = "A bar chart with a custom label"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Total Events",
    color: "var(--chart-2)",
  },
  pmCount: {
    label: "PM Events",
    color: "var(--chart-3)",
  },
  cmCount: {
    label: "CM Events", 
    color: "var(--chart-4)",
  },
  label: {
    color: "var(--background)",
  },
} satisfies ChartConfig

interface ChartProps {
  data?: AttendanceData[];
}

interface AttendanceData {
  userId: number;
  userName: string;
  attendanceCount: number;
  pmCount: number;
  cmCount: number;
}


// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border rounded-lg p-3 shadow-md">
        <p className="font-medium">{label}</p>
        <div className="flex gap-4 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm">PM: {data.pmCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm">CM: {data.cmCount}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Total: {data.desktop} events
        </p>
      </div>
    );
  }
  return null;
};

export function ChartBarLabelCustom({ data }: ChartProps) {
  const chartData = data ? data.map(item => ({
    month: item.userName,
    desktop: item.attendanceCount, // Total events
    pmCount: item.pmCount,
    cmCount: item.cmCount
  })) : [
    { month: "John", desktop: 7, pmCount: 3, cmCount: 4 },
    { month: "Jane", desktop: 5, pmCount: 2, cmCount: 3 },
    { month: "Bob", desktop: 4, pmCount: 1, cmCount: 3 },
    { month: "Alice", desktop: 3, pmCount: 2, cmCount: 1 },
    { month: "Charlie", desktop: 2, pmCount: 1, cmCount: 1 },
  ]
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Attendees</CardTitle>
        <CardDescription>August 2025 - December 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full h-[200px]">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="desktop" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<CustomTooltip />}
            />
            <Bar
              dataKey="desktop"
              layout="vertical"
              fill="var(--color-desktop)"
              radius={4}
            >
              <LabelList
                dataKey="month"
                position="insideLeft"
                offset={8}
                className="fill-(--color-label)"
                fontSize={12}
              />
              <LabelList
                dataKey="desktop"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: any, entry: any) => `${value}`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          (AI Insights input here) <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          (and here)
        </div>
      </CardFooter>
    </Card>
  )
}

