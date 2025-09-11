'use client'

import { ChartLineMultiple } from "./linechart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { CardAction } from "./ui/card"
import { TrendingUp } from "lucide-react"
import { ChartContainer } from "./ui/chart"
import { LineChart } from "recharts"
import { CartesianGrid } from "recharts"
import { XAxis } from "recharts"
import { ChartTooltip } from "./ui/chart"
import { ChartTooltipContent } from "./ui/chart"
import { Line } from "recharts"

export default function AllEventsLineChart() {
    const chartConfig = {
        PM: {
            label: "PM",
            color: "var(--chart-1)",
        },
        CM: {
            label: "CM",
            color: "var(--chart-2)",
        },
        Fundraising: {
            label: "Fundraising",
            color: "var(--chart-3)",
        },
        Brotherhood: {
            label: "Brotherhood",
            color: "var(--chart-4)",
        },
        Service: {
            label: "Service",
            color: "var(--chart-5)",
        },
        Other: {
            label: "Other",
            color: "var(--chart-6)",
        },
    }
    const chartData = [
        { month: "Week 1", PM: 24, CM: 23, Fundraising: 10,  Brotherhood: 9,  Service: 4,  Other: 3 },
        { month: "Week 2", PM: 24, CM: 22, Fundraising: 8,  Brotherhood: 7,  Service: 5,  Other: 4 },
        { month: "Week 3", PM: 20, CM: 26, Fundraising: 10, Brotherhood: 6,  Service: 7,  Other: 2 },
        { month: "Week 4", PM: 18, CM: 30, Fundraising: 12, Brotherhood: 8,  Service: 6,  Other: 5 },
        { month: "Week 5", PM: 26, CM: 20, Fundraising: 9,  Brotherhood: 11, Service: 4,  Other: 6 },
        { month: "Week 6", PM: 24, CM: 24, Fundraising: 11, Brotherhood: 7,  Service: 8,  Other: 3 },
        { month: "Week 7", PM: 22, CM: 23, Fundraising: 7,  Brotherhood: 10, Service: 5,  Other: 4 },
        { month: "Week 8", PM: 22, CM: 21, Fundraising: 13, Brotherhood: 6,  Service: 9,  Other: 2 },
    ]
  return (
    <div>
        <Card>
            <CardHeader>
                <CardTitle>All Events Line Chart</CardTitle>
                <CardDescription>All Events Line Chart (maybe all events)</CardDescription>
                <CardAction>
                    <Button>
                        <TrendingUp />
                        +12.5%
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="w-full h-[200px]">
                        <LineChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                              left: 12,
                              right: 12,
                              bottom: 0,
                            }}
                          >
                            <CartesianGrid vertical={false} />  
                            <XAxis
                              dataKey="month"
                              tickLine={false}
                              axisLine={false}
                              tickMargin={8}
                              interval={0}
                              padding={{ left: 10, right: 10 }}
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Line dataKey="PM" type="monotone" stroke="var(--color-PM)" strokeWidth={2} dot={false} />
                            <Line dataKey="CM" type="monotone" stroke="var(--color-CM)" strokeWidth={2} dot={false} />
                            <Line dataKey="Fundraising" type="monotone" stroke="var(--color-Fundraising)" strokeWidth={2} dot={false} />
                            <Line dataKey="Brotherhood" type="monotone" stroke="var(--color-Brotherhood)" strokeWidth={2} dot={false} />
                            <Line dataKey="Service" type="monotone" stroke="var(--color-Service)" strokeWidth={2} dot={false} />
                            <Line dataKey="Other" type="monotone" stroke="var(--color-Other)" strokeWidth={2} dot={false} />
                          </LineChart>
                    </ChartContainer>
            </CardContent>
        </Card>
     
    </div>
  )
}