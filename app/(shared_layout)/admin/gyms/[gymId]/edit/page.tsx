"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter, useParams } from "next/navigation";
import { GymFormValues } from "@/app/schemas/gym";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useTransition, useEffect } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";

import { GymForm } from "@/components/gym/gym-form";

export default function EditGymPage() {
    const params = useParams();
    const gymId = params.gymId as Id<"gyms">;
    const router = useRouter();
    const gym = useQuery(api.gyms.getGym, { gymId });
    const updateGym = useMutation(api.gyms.updateGym);
    const [isPending, startTransition] = useTransition();

    const onSubmit = async (data: GymFormValues) => {
        startTransition(async () => {
            try {
                await updateGym({
                    gymId,
                    ...data,
                    ownerEmail: data.ownerEmail || undefined,
                });
                toast.success("Gym updated successfully");
                router.back();
            } catch (error: any) {
                toast.error(error.message || "Failed to update gym");
            }
        });
    };

    if (gym === undefined) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (gym === null) {
        return <div className="container py-20 text-center">Gym not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
            <div className="mb-8">
                <Button
                    variant="ghost"
                    className="mb-6 -ml-4 gap-2 text-muted-foreground hover:text-foreground"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4" /> Back
                </Button>

                <Card className="glass-premium">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold">Edit Gym</CardTitle>
                        <CardDescription>
                            Modify the details for {gym.name}.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <GymForm
                            defaultValues={{
                                name: gym.name,
                                description: gym.description || "",
                                address: gym.address,
                                location: gym.location,
                                ownerEmail: gym.ownerEmail || "",
                                isActive: gym.isActive,
                            }}
                            onSubmit={onSubmit}
                            isPending={isPending}
                            buttonLabel="Save Changes"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
