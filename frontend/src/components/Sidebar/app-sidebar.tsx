import * as React from "react"
import {
  BookOpen,
  Bot,
  // Frame,
  FolderKanban,
  Map,
  EthernetPort,
  PieChart,
  Settings2,
  HousePlus 
} from "lucide-react"

import { NavMain } from "@/components/Sidebar/nav-main"
import { NavProjects } from "@/components/Sidebar/nav-projects"
import { NavUser } from "@/components/Sidebar/nav-user"
import { TeamSwitcher } from "@/components/Sidebar/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
// import { getAuthEmail } from "@/util/Auth"
// const emailUser = getAuthEmail()

// This is sample data.
const data = {
  user: {
    name: "amari chaiba",
    email: "chaibaamari2@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Sonatrach",
      logo: "/Sonatrach.svg",
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: "/Sonatrach.svg",
      plan: "Startup",
    },
  ],
  navMain: [
    {
      title: "Formation",
      url: "/homePage",
      icon: HousePlus,
      isActive: true,
      items: [
        {
          title: "Liste Formation",
          url: "/homePage",
        }
      ],
    },
    {
      title: "Agent",
      url: "Employee",
      icon: BookOpen,
      items: [
        {
          title: "Liste Employee",
          url: "Employee",
        },
      ],
    },
    {
      title: "Liste Direction",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Direction",
          url: "Direction",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Plan Prévision",
      url: "planPrevision",
      icon: EthernetPort,
    },
    {
      name: "Plan Notifié",
      url: "planNotifie",
      icon: PieChart,
    },
    {
      name: "Bon de Command",
      url: "bondCommand",
      icon: Map,
    },
    {
      name: "TBF",
      url: "TBF",
      icon: FolderKanban,
    },
    {
      name: "Bilan",
      url: "#",
      icon: Map,
    },
    {
      name: "Settings",
      url: "Settings",
      icon: Settings2,
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
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
