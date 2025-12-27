"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash, MapPin, Mail, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation } from "convex/react";

export default function AdminGymsPage() {
    const gyms = useQuery(api.gyms.listAdminGyms);
    const deleteGym = useMutation(api.gyms.deleteGym);
    const router = useRouter();

    const handleDelete = async (id: any) => {
        if (confirm("Are you sure you want to delete this gym?")) {
            try {
                await deleteGym({ gymId: id });
                toast.success("Gym deleted");
            } catch (error) {
                toast.error("Failed to delete gym");
            }
        }
    };

    if (gyms === undefined) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Manage Gyms</h1>
                    <p className="text-muted-foreground mt-2">Create, update and manage your gym locations.</p>
                </div>
                <Button onClick={() => router.push("/admin/gyms/new")} className="gap-2">
                    <Plus className="h-4 w-4" /> Add New Gym
                </Button>
            </div>

            <div className="grid gap-6">
                {gyms?.length === 0 ? (
                    <Card className="bg-card/60 backdrop-blur-md border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                            <MapPin className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                            <h3 className="text-xl font-semibold">No gyms found</h3>
                            <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                                Get started by creating your first gym location.
                            </p>
                            <Button variant="outline" className="mt-6" onClick={() => router.push("/admin/gyms/new")}>
                                <Plus className="h-4 w-4 mr-2" /> Add Your First Gym
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {gyms?.map((gym) => (
                            <Card key={gym._id} className="group overflow-hidden glass hover:shadow-2xl hover:border-primary/30 transition-all duration-500">
                                <CardHeader className="relative pb-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <CardTitle className="text-xl group-hover:text-primary transition-colors">{gym.name}</CardTitle>
                                            <CardDescription className="flex items-center gap-1.5">
                                                <MapPin className="h-3.5 w-3.5" /> {gym.address}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail className="h-4 w-4" />
                                        {gym.ownerEmail || "No owner email"}
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="flex-1 gap-2"
                                            onClick={() => router.push(`/admin/gyms/${gym._id}/edit`)}
                                        >
                                            <Edit className="h-3.5 w-3.5" /> Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="px-3"
                                            onClick={() => handleDelete(gym._id)}
                                        >
                                            <Trash className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
