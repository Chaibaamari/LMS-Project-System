"use client"

import UserManagement from "@/components/Auth/UserManagement"
import UserList from "@/components/Tables/UserRoleList"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import TabChange from "@/components/Tools/TabsChange"
import NotificationError from "@/components/Error/NotificationError"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/indexD"
import { useEffect } from "react"
import { SettingActions } from "@/store/setting"

export default function AppSettings() {

    const { IsVisible, status, message } = useSelector((state: RootState) => state.Setting.Notification);
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        if (IsVisible) {
            setTimeout(() => {
                dispatch(SettingActions.ClearNotification());
            }, 5000)
        }
    }, [dispatch, IsVisible]);

    return (
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
                <div className="flex flex-col md:flex-row items-center mb-8">
                    <div className="flex items-center mb-4 md:mb-0">
                        <img src="/Sonatrach.svg" alt="Sonatrach Logo" className="h-16 mr-4" />
                    </div>
                    <div className="text-center md:text-start font-raleway">
                        <h1 className="text-3xl md:text-3xl font-bold  tracking-tight">
                        Paramètres 
                        </h1>
                    </div>
                </div>
            </div>

            <TabChange
                tabs={[
                    {
                        label: "Gestion des utlisateurs",
                        content:
                            <Card className="border-none">
                            <CardHeader>
                                <CardTitle className="font-raleway ">Gestion des utilisateurs</CardTitle>
                                <CardDescription className="font-raleway">Gérer les comptes utilisateurs, les rôles et les permissions</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 font-raleway">
                                <div className="space-y-4 font-raleway">
                                    <h3 className="text-lg font-medium font-raleway">Rôles des utilisateurs</h3>
                                    <UserList />
                                </div>
    
                                <Separator />
    
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium font-raleway">Administration des utilisateurs</h3>
                                    <UserManagement />
                                </div>
                            </CardContent>
                        </Card>
                    },
                ]}
            />
            <NotificationError
                isVisible={IsVisible}
                status={status}
                message={message}
            />
        </div>
    );
}
