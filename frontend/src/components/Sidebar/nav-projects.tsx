import {
  // Folder,
  // Forward,
  MoreHorizontal,
  // Trash2,
  type LucideIcon,
} from "lucide-react"

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  // SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  // useSidebar,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "@/store/indexD"

export function NavProjects({
  
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
  }[]
  }) {
    const permission = useSelector((state: RootState) => state.BondCommand.User)
  

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden font-raleway">
      <SidebarGroupLabel>Plan de Travail</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
        (item.name === "Paramètres" && permission.role !== "responsable") ? null : (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <Link to={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
