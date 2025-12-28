"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Loader2, MapPin, Calendar, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { use, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format, addDays, startOfToday } from "date-fns";
import { formatINR } from "@/lib/utils";
import Image from "next/image";

export default function BookGymPage({ params }: { params: Promise<{ gymId: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const gym = useQuery(api.gyms.getGym, { gymId: resolvedParams.gymId as Id<"gyms"> });
    const bookDayPass = useMutation(api.bookings.bookDayPass);

    const [selectedDate, setSelectedDate] = useState<string>(format(startOfToday(), "yyyy-MM-dd"));
    const [isBooking, setIsBooking] = useState(false);

    // Generate next 14 days
    const availableDates = Array.from({ length: 14 }, (_, i) => {
        const date = addDays(startOfToday(), i);
        return {
            value: format(date, "yyyy-MM-dd"),
            label: format(date, "EEE, MMM d"),
            isToday: i === 0,
        };
    });

    const handleBooking = async () => {
        if (!gym) return;

        setIsBooking(true);
        try {
            await bookDayPass({
                gymId: gym._id,
                bookingDay: selectedDate,
            });
            toast.success("Booking confirmed! 🎉");
            router.push("/my-bookings");
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message || "Failed to book gym");
            } else {
                toast.error("Failed to book gym");
            }
        } finally {
            setIsBooking(false);
        }
    };

    if (gym === undefined) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="relative">
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                </div>
                <p className="text-xl font-medium text-muted-foreground animate-pulse tracking-wide">
                    Loading gym details...
                </p>
            </div>
        );
    }

    if (gym === null) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center">
                    <MapPin className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold">Gym not found</h3>
                <p className="text-muted-foreground">This gym may have been removed or doesn&apos;t exist.</p>
                <Button asChild>
                    <Link href="/">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
            {/* Back Button */}
            <Button asChild variant="ghost" size="sm">
                <Link href={`/gyms/${gym._id}`}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Gym Details
                </Link>
            </Button>

            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tight">Book Day Pass</h1>
                <p className="text-muted-foreground text-lg">Reserve your spot at {gym.name}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Booking Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Date Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                Select Date
                            </CardTitle>
                            <CardDescription>Choose when you want to visit</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {availableDates.map((date) => (
                                    <button
                                        key={date.value}
                                        onClick={() => setSelectedDate(date.value)}
                                        className={`
                      relative p-4 rounded-xl border-2 transition-all text-left
                      ${selectedDate === date.value
                                                ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                                                : "border-border hover:border-primary/40 hover:bg-muted/50"
                                            }
                    `}
                                    >
                                        {selectedDate === date.value && (
                                            <div className="absolute top-2 right-2">
                                                <Check className="h-4 w-4 text-primary" />
                                            </div>
                                        )}
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">{date.label}</p>
                                            {date.isToday && (
                                                <span className="text-xs text-primary font-bold">TODAY</span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Confirmation */}
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle>Booking Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Gym:</span>
                                <span className="font-semibold">{gym.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Date:</span>
                                <span className="font-semibold">
                                    {format(new Date(selectedDate), "EEEE, MMMM d, yyyy")}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Pass Type:</span>
                                <span className="font-semibold">Day Pass</span>
                            </div>
                            <div className="border-t border-primary/20 pt-4 flex justify-between items-center">
                                <span className="text-lg font-bold">Total:</span>
                                <span className="text-2xl font-black text-primary">
                                    {(gym.passPrice ?? 0) > 0 ? formatINR(gym.passPrice!) : "FREE"}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Book Button */}
                    <Button
                        onClick={handleBooking}
                        disabled={isBooking}
                        className="w-full h-14 text-lg font-bold"
                        size="lg"
                    >
                        {isBooking ? (
                            <>
                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                Booking...
                            </>
                        ) : (
                            <>
                                <Check className="h-5 w-5 mr-2" />
                                Confirm Booking
                            </>
                        )}
                    </Button>
                </div>

                {/* Right: Gym Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Gym Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {gym.image && (
                                <Image
                                    src={gym.image}
                                    alt={gym.name}
                                    className="w-full aspect-video object-cover rounded-lg"
                                />
                            )}
                            <div>
                                <h3 className="font-bold text-xl mb-2">{gym.name}</h3>
                                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                                    <p>{gym.address}</p>
                                </div>
                            </div>
                            {gym.description && (
                                <p className="text-sm text-muted-foreground">{gym.description}</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-muted/50">
                        <CardHeader>
                            <CardTitle className="text-sm">What&apos;s Included</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Full day access</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>All equipment</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Locker facilities</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Shower access</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
