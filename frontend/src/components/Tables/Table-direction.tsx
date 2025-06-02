"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit2, Mail, User } from "lucide-react"
import { Direction } from "@/assets/modelData"
import { getAuthToken } from "@/util/Auth"
import { DirectionsActions } from "@/store/Directions"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store/indexD"
import { useNavigate } from "react-router-dom"


interface DirectionsTableProps {
    data: Direction[]
}


export function DirectionCards({ data = [] }: DirectionsTableProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const token = getAuthToken();
    const dispatch = useDispatch<AppDispatch>();
    const permission = useSelector((state: RootState) => state.BondCommand.User)
    const navigate =  useNavigate();
    const [editData, setEditData] = useState<{ NomResponsable : string; Email: string }>({
        NomResponsable : "",
        Email: "",
    });

    const handleEdit = (direction: Direction) => {
        setEditingId(direction.Id_direction)
        setEditData({
            NomResponsable : direction.NomResponsable || "",
            Email: direction.Email || "",
        })
    };

    const handleSave = async (id: string) => {
        const encodedId = encodeURIComponent(id);
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/directions/responsable/${encodedId}`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(editData),
            })
            if (!response.ok) {
                dispatch(
                    DirectionsActions.ShowNotification({
                        IsVisible: true,
                        status: 'failed',
                        message: "veuillez verifier les champs de la direction",
                    }),
    
                );
                dispatch(DirectionsActions.ReferchLatestData(true));
            
                return navigate("/homePage/directions");
            }
            dispatch(
                DirectionsActions.ShowNotification({
                    IsVisible: true,
                    status: 'success',
                    message: "Direction mis à jour avec succès",
                }),
            )
            dispatch(DirectionsActions.ReferchLatestData(true));
        } catch (error) {
            dispatch(
                DirectionsActions.ShowNotification({
                    IsVisible: true,
                    status: "failed",
                    message: `Erreur lors de la mise à jour du direction${error}`,
                }),
            )
        }
        setEditingId(null)
    };

    const handleCancel = () => {
        setEditingId(null)
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.map((direction , index) => (
                <Card
                    key={index}
                    className="overflow-hidden border-l-4 border-l-blue-500"
                >
                    <CardHeader className="bg-slate-50 dark:bg-slate-800 pb-2">
                        <CardTitle className="text-xl">{direction.Id_direction}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="bg-blue-100 dark:bg-blue-900 p-1.5 rounded-full">
                                    <User className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                                </div>
                                {editingId === direction.Id_direction ? (
                                    <Input
                                        value={editData.NomResponsable}
                                        onChange={(e) => setEditData({ ...editData, NomResponsable: e.target.value })}
                                        placeholder="Enter responsible person"
                                        className="h-8"
                                    />
                                ) : (
                                    <p className="text-sm">{direction.NomResponsable || "No responsible person assigned"}</p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="bg-blue-100 dark:bg-blue-900 p-1.5 rounded-full">
                                    <Mail className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                                </div>
                                {editingId === direction.Id_direction ? (
                                    <Input
                                        value={editData.Email}
                                        onChange={(e) => setEditData({ ...editData, Email: e.target.value })}
                                        placeholder="Enter email address"
                                        className="h-8"
                                        type="email"
                                    />
                                ) : (
                                    <p className="text-sm">{direction.Email || "No email address available"}</p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="bg-blue-100 dark:bg-blue-900 p-1.5 rounded-full">
                                    <svg className="h-4 w-4 text-blue-600 dark:text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
                                        <path d="M7 12h10v2H7z" />
                                        <path d="M7 8h10v2H7z" />
                                        <path d="M7 16h7v2H7z" />
                                    </svg>
                                </div>
                                <p className="text-sm">{direction.Structure}</p>
                            </div>
                        </div>
                    </CardContent>
                    {(permission.role === "responsable" || permission.role === "gestionnaire") && (
                        <CardFooter className="bg-slate-50 dark:bg-slate-800 flex justify-end gap-2 pt-2">
                            {editingId === direction.Id_direction ? (
                                <>
                                    <Button size="sm" variant="outline" onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                    <Button size="sm"
                                        onClick={() => handleSave(direction.Id_direction)}
                                    >
                                        Save
                                    </Button>
                                </>
                            ) : (
                                <Button size="sm" variant="ghost" onClick={() => handleEdit(direction)}>
                                    <Edit2 className="h-4 w-4 mr-1" /> Modifier
                                </Button>
                            )}
                        </CardFooter>
                    )}
                </Card>
            ))}
        </div>
    );
}
