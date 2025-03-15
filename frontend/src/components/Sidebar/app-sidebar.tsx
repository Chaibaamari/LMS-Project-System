import * as React from "react"
import {
  BookOpen,
  Bot,
  Frame,
  Map,
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
      logo: "Sonatrach.svg",
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: "Sonatrach.svg",
      plan: "Startup",
    },
  ],
  navMain: [
    {
      title: "Accueil",
      url: "#",
      icon: HousePlus,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Formation",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Intern",
          url: "#",
        },
        {
          title: "Extern",
          url: "#",
        },
      ],
    },
    {
      title: "Employee",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Liste Employee",
          url: "#",
        }
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Plan Prévision",
      url: "#",
      icon: Frame,
    },
    {
      name: "Plan Notifié",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Bon de Command",
      url: "#",
      icon: Map,
    },
    {
      name: "TBF",
      url: "#",
      icon: Map,
    },
    {
      name: "Bilan",
      url: "#",
      icon: Map,
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
