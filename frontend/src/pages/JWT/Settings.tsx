import YearSelector from "@/components/YearSelector"
import UserManagement from "@/components/Auth/UserManagement"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { CalendarClock, Users, SettingsIcon } from "lucide-react"
import UserList from "@/components/Tables/UserRoleList";

export default function Settings() {
    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-2 text-center">Settings</h1>
            <p className="text-muted-foreground mb-8 text-center">Configure your application preferences</p>

            <Tabs defaultValue="time" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="time" className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4" />
                        <span className="hidden sm:inline">Time Period</span>
                    </TabsTrigger>
                    <TabsTrigger value="users" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span className="hidden sm:inline">User Management</span>
                    </TabsTrigger>
                    <TabsTrigger value="other" className="flex items-center gap-2">
                        <SettingsIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Other Settings</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="time" className="mt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* YearSelector takes 1/4 of the space on large screens */}
                        <div className="lg:col-span-1">
                            <YearSelector onYearChange={(year) => console.log(`Year changed to: ${year}`)} />
                        </div>

                        {/* UserList takes 3/4 of the space on large screens */}
                        <div className="lg:col-span-3">
                            <UserList />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="users" className="mt-0">
                    <div className="max-w-2xl mx-auto">
                        <UserManagement />
                    </div>
                </TabsContent>

                <TabsContent value="other" className="mt-0">
                    <div className="max-w-2xl mx-auto border rounded-lg p-6 bg-card">
                        <h2 className="text-xl font-semibold mb-4">Other Settings</h2>
                        <p className="text-muted-foreground">
                            Additional settings will appear here. Configure application preferences and other options.
                        </p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
