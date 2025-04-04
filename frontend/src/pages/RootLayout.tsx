import { AppSidebar } from "@/components/Sidebar/app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { getTokenExpiration } from "@/util/Auth"
import { useEffect } from "react"
import { Outlet, useRouteLoaderData, useSubmit } from "react-router-dom"

export default function Sidebar() {
  const token = useRouteLoaderData("root");
  const submit = useSubmit();
  useEffect(() => { 
      if (!token) {
        return;
    }
    if (token === 'EXPIRED') {
      submit(null, { method: "post", action: "/logout" });
    }

    const expirationTime = getTokenExpiration();


    setTimeout(() => {
      submit(null, { method: "post", action: "/logout" });
    }, expirationTime); // 1 hour in milliseconds
  }, [token , submit]);
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4 overflow-hidden">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/homePage">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            </div>
          </header>
          {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div> */}
          <div className="flex flex-1 flex-col gap-4 p-4 ">
            <Outlet />
          </div>

      </SidebarInset>
    </SidebarProvider>
  );
}