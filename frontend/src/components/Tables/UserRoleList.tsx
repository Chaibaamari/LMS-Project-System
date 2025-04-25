
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Filter,
  Loader2,
  MoreHorizontal,
  UserCog,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getAuthToken } from "@/util/Auth"

interface User {
  name: string
  email: string
  role: string
  active: number
}


export default function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const { toast } = useToast();
    const token = getAuthToken();
  // Fetch users from API
    const fetchUsers = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await fetch("http://127.0.0.1:8000/api/allUsers", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            console.log(data.users)
            setUsers(data.users)
            setFilteredUsers(data.users)

            toast({
                title: "Users loaded successfully",
                description: `Loaded ${data.users.length} users from the system.`,
            })
        } catch (err) {
            console.error("Failed to fetch users:", err)
            setError(err instanceof Error ? err.message : "Failed to fetch users")

            toast({
                title: "Failed to load users",
                description: err instanceof Error ? err.message : "An unknown error occurred",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false)
        }
    };

  // Fetch users on component mount
    useEffect(() => {
        fetchUsers()
    }, []);

  // Apply filters when search term or filters change
    useEffect(() => {
        let result = users
        // Apply role filter
        if (roleFilter !== "all") {
            result = result.filter((user) => user.role === roleFilter)
        }

        // Apply status filter
        if (statusFilter !== "all") {
            const isActive = statusFilter === "active"
            result = result.filter((user) => (user.active === 1) === isActive)
        }

        setFilteredUsers(result)
    }, [users, roleFilter, statusFilter]);

  // Get unique roles for filter dropdown
    const uniqueRoles = Array.from(new Set(users.map((user) => user.role)));

  // Handle refresh button click
    const handleRefresh = () => {
        fetchUsers()
    };

    return (
        <Card className="w-full ">
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <UserCog className="h-5 w-5 text-primary" />
                            User Management
                        </CardTitle>
                        <CardDescription>View and manage system users</CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                            Refresh
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-4">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3">

                        <div className="flex gap-2">
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-[130px]">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    {uniqueRoles.map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {role}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[130px]">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-start gap-2">
                            <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium">Failed to load users</p>
                                <p className="text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Users table */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[80px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                                                <p className="text-muted-foreground">Loading users...</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <UserCog className="h-8 w-8 text-muted-foreground mb-2" />
                                                <p className="text-muted-foreground">No users found</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {user.active === 1 ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                                    >
                                                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                                        Active
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                                                    >
                                                        <XCircle className="h-3.5 w-3.5 mr-1" />
                                                        Inactive
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        {user.active === 1 ? (
                                                            <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem>Activate</DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Results summary */}
                    <div className="text-sm text-muted-foreground">
                        Showing {filteredUsers.length} of {users.length} users
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
