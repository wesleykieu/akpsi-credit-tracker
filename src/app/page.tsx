
import AttendanceLineChart from "@/components/AttendanceLineChart";
import { ChartRadialLabel } from "@/components/radialChart";
import { Card, CardHeader, CardDescription, CardTitle, CardAction, CardFooter, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";
import AllEventsLineChart from "@/components/AllEventsLineChart";
import Countdown from "@/components/Countdown";
import { ChartBarLabelCustom } from "@/components/charts";

export default function Dashboard() {
  return (
    <div className="space-y-4 mt-4">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Omega Phi Balance</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              $6,000.00
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <TrendingUp />
                +12.5%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Trending up this month <TrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Profit for the last 6 months
            </div>
          </CardFooter>
        </Card>
        
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Marketing</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[200px]/card:text-3xl">
              1,209
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="gap-1">
                <TrendingUp className="size-4" />
                +15% past month
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="text-sm text-muted-foreground">
            Instagram Followers
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Active Members</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              41
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <Users />
                +12.5%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-row items-start gap-2 text-sm">
            <div className="w-fit bg-accent rounded-md p-2 text-sm truncate flex gap-2 font-medium">
              1 In-Active <Users className="size-4" />
            </div>
            <div className="w-fit bg-accent rounded-md p-2 text-sm truncate flex gap-2 font-medium">
              1 Student Alumni <Users className="size-4" />
            </div>
          </CardFooter>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Court of Honor</CardDescription>
          </CardHeader>
          <CardContent className="-mt-2">
            <Countdown target={"2025-11-22T00:00:00-08:00"} />
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <div className="col-span-1">
          <AttendanceLineChart />
        </div>
        <div className="col-span-1">
          <ChartBarLabelCustom />
        </div>
        <div className="col-span-1">
          <ChartRadialLabel />
        </div>
      </div>
      <div className="w-full h-full">
        <div className="w-full h-full">
          <AllEventsLineChart />
        </div>
      </div>
    </div>
  );
}