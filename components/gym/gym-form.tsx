"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gymSchema, GymFormValues } from "@/app/schemas/gym";
import { Field, FieldLabel, FieldGroup, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Save, Plus } from "lucide-react";
import { useEffect } from "react";

interface GymFormProps {
    defaultValues?: Partial<GymFormValues>;
    onSubmit: (data: GymFormValues) => Promise<void>;
    isPending: boolean;
    buttonLabel?: string;
}

export function GymForm({ defaultValues, onSubmit, isPending, buttonLabel }: GymFormProps) {
    const form = useForm<GymFormValues>({
        resolver: zodResolver(gymSchema) as any,
        defaultValues: {
            name: "",
            description: "",
            address: "",
            location: { lat: 0, lng: 0 },
            ownerEmail: "",
            isActive: true,
            ...defaultValues,
        } as any, // Use any briefly to avoid the complex deep-partial union mismatch
    });

    useEffect(() => {
        if (defaultValues) {
            form.reset({
                ...form.getValues(),
                ...defaultValues,
            });
        }
    }, [defaultValues, form]);

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field className="space-y-1">
                                <FieldLabel>Gym Name</FieldLabel>
                                <Input
                                    placeholder="e.g. Iron Paradise"
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="passPrice"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field className="space-y-1">
                                <FieldLabel>Pass Price (in Paisa/Cents)</FieldLabel>
                                <Input
                                    type="number"
                                    placeholder="49900"
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                </div>

                <Controller
                    name="image"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field className="space-y-1">
                            <FieldLabel>Image URL</FieldLabel>
                            <Input
                                placeholder="https://images.unsplash.com/..."
                                {...field}
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="description"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field className="space-y-1">
                            <FieldLabel>Description (Optional)</FieldLabel>
                            <Input
                                placeholder="What makes this gym special?"
                                {...field}
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="address"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field className="space-y-1">
                            <FieldLabel>Full Address</FieldLabel>
                            <Input
                                placeholder="Street, City, ZIP"
                                {...field}
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Controller
                        name="location.lat"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field className="space-y-1">
                                <FieldLabel>Latitude</FieldLabel>
                                <Input
                                    type="number"
                                    step="any"
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <Controller
                        name="location.lng"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field className="space-y-1">
                                <FieldLabel>Longitude</FieldLabel>
                                <Input
                                    type="number"
                                    step="any"
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                </div>

                <Controller
                    name="ownerEmail"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field className="space-y-1">
                            <FieldLabel>Owner Email (Required to link account)</FieldLabel>
                            <Input
                                type="email"
                                placeholder="owner@example.com"
                                {...field}
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            </FieldGroup>

            <Button className="w-full font-bold gap-2" size="lg" type="submit" disabled={isPending}>
                {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : buttonLabel?.includes("Save") ? (
                    <Save className="h-4 w-4" />
                ) : (
                    <Plus className="h-4 w-4" />
                )}
                {isPending ? "Processing..." : buttonLabel || "Submit"}
            </Button>
        </form>
    );
}
