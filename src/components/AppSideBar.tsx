"use client"

import * as React from "react"
import Image from "next/image"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Alpha Kappa Psi",
      logo: () => <Image src="/akpsilogo.jpg" alt="AKPsi Logo" width={30} height={30} className="rounded-4xl" />,
      plan: "Omega Phi Chapter",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Analytics",
          url: "#",
        },
        {
          title: "Finance",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Directors",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Brotherhood",
          url: "/directors/brotherhood",
        },
        {
          title: "Education",
          url: "/directors/education",
        },
        {
          title: "Service",
          url: "/directors/service",
        },
        {
          title: "Fundraising",
          url: "/directors/fundraising",
        },
        {
          title: "Rush",
          url: "/directors/rush",
        },
        {
          title: "Pro Credits",
          url: "/directors/procredits",
        }
      ],
    },
    {
      title: "Documents",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Credit Requirements",
          url: "#",
        },
        {
          title: "CM Notes",
          url: "#",
        },
        {
          title: "Master Calendar",
          url: "#",
        },
        {
          title: "Chapter Forms",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
