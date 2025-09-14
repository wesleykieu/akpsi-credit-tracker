"use client"

import useSWR from "swr"
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



const chartConfig = {
  attendanceCount: {
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
}

interface AttendanceData {
  userId: number;
  userName: string;
  attendanceCount: number;
  pmCount: number;
  cmCount: number;
}

const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then(res => res.json())

export function ChartBarLabelCustom() {
  

  const { data , error , isLoading} = useSWR<AttendanceData[]>("/api/attendance/top-attendees", fetcher);
  
  // Add Loading and Error State (will make UI better)
  if (isLoading) {
    return <div>Loading...</div>;
   
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
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
            data={data}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="userName"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="attendanceCount" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<CustomTooltip />}
            />
            <Bar
              dataKey="attendanceCount"
              layout="vertical"
              fill="var(--color-attendanceCount)"
              radius={4}
            >
              <LabelList
                dataKey="userName"
                position="insideLeft"
                offset={8}
                className="fill-(--color-label)"
                fontSize={12}
              />
              <LabelList
                dataKey="attendanceCount"
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

