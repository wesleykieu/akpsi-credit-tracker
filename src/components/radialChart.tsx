"use client"

import { TrendingUp } from "lucide-react"
import { RadialBar, RadialBarChart, Legend } from "recharts"

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

export const description = "A radial chart with a label"

const chartData = [
  { browser: "PM", visitors: 320, fill: "var(--chart-1)" },
  { browser: "CM", visitors: 280, fill: "var(--chart-2)" },
  { browser: "Brotherhood", visitors: 245, fill: "var(--chart-3)" },
  { browser: "Service", visitors: 198, fill: "var(--chart-4)" },
  { browser: "Fundraising", visitors: 165, fill: "var(--chart-5)" },
  { browser: "Education", visitors: 142, fill: "#8b5cf6" },
  { browser: "Rush", visitors: 98, fill: "#f59e0b" },
  { browser: "Pro Credits", visitors: 75, fill: "#10b981" },
]

const chartConfig = {
  visitors: {
    label: "Credits",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartRadialLabel() {
  const pmValue = chartData.find((d) => d.browser === "PM")?.visitors ?? 0
  const cmValue = chartData.find((d) => d.browser === "CM")?.visitors ?? 0
  const pmBase = pmValue + cmValue || 1
  const pmPercent = Math.round((pmValue / pmBase) * 100)
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Most Credit Brother</CardTitle>
        <CardDescription>August - December 2025</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <ChartContainer
              config={chartConfig}
              className="aspect-square h-[200px] w-[200px]"
            >
              <RadialBarChart
                data={chartData}
                startAngle={-90}
                endAngle={380}
                innerRadius={30}
                outerRadius={100}
              >
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel nameKey="browser" />}
                />
                <RadialBar dataKey="visitors" cornerRadius={6} background />
              </RadialBarChart>
            </ChartContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-sm font-semibold">{pmPercent}%</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {chartData.map((item) => (
              <div key={item.browser} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-sm">{item.browser}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Wesley Kieu <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Shows each category
        </div>
      </CardFooter>
    </Card>
  )
}
