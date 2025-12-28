"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { GymFormValues } from "@/app/schemas/gym";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useTransition } from "react";

import { GymForm } from "@/components/gym/gym-form";

export default function NewGymPage() {
    const router = useRouter();
    const createGym = useMutation(api.gyms.createGym);
    const [isPending, startTransition] = useTransition();

    const onSubmit = async (data: GymFormValues) => {
        startTransition(async () => {
            try {
                await createGym({
                    ...data,
                    ownerEmail: data.ownerEmail || undefined,
                    googleMapsUrl: data.googleMapsUrl || undefined,
                    image: data.image || undefined,
                    description: data.description || undefined,
                });
                toast.success("Gym created successfully");
                router.push("/admin/gyms");
            } catch (error: any) {
                toast.error(error.message || "Failed to create gym");
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
            <div className="mb-8">
                <Button
                    variant="ghost"
                    className="-ml-4 gap-2 text-muted-foreground hover:text-foreground hover:bg-transparent"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Gyms
                </Button>
            </div>

            <Card className="glass-premium">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Add New Gym</CardTitle>
                    <CardDescription>
                        Fill in the details to list a new gym in the system.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <GymForm onSubmit={onSubmit} isPending={isPending} buttonLabel="Create Gym" />
                </CardContent>
            </Card>
        </div>
    );
}
