"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, Ticket, MapPin, Calendar, CheckCircle2, QrCode } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";

export default function MyBookingsPage() {
    const bookings = useQuery(api.bookings.listMyBookings);

    if (bookings === undefined) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tight">My Passes</h1>
                <p className="text-muted-foreground font-medium">Manage your active and previous gym day-passes.</p>
            </div>

            {bookings.length === 0 ? (
                <Card className="bg-card/40 backdrop-blur-2xl border-dashed border-white/10 py-20">
                    <CardContent className="flex flex-col items-center justify-center space-y-4">
                        <div className="bg-muted h-20 w-20 rounded-full flex items-center justify-center">
                            <Ticket className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <div className="text-center space-y-1">
                            <h3 className="text-xl font-bold">No passes found</h3>
                            <p className="text-muted-foreground">You haven't booked any day passes yet.</p>
                        </div>
                        <Link href="/" className="text-primary font-bold hover:underline">Explore Gyms Near You →</Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking) => (
                        <Card key={booking._id} className="overflow-hidden glass-premium shadow-xl group transition-all hover:shadow-2xl hover:border-primary/20">
                            <div className="bg-primary/5 p-4 border-b border-white/5 flex justify-between items-center">
                                <Badge
                                    variant={booking.status === "booked" ? "default" : booking.status === "checked-in" ? "secondary" : "outline"}
                                    className="capitalize font-bold"
                                >
                                    {booking.status}
                                </Badge>
                                <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                    PASS #{booking._id.slice(-6)}
                                </span>
                            </div>

                            <CardHeader>
                                <CardTitle className="text-xl">{booking.gym?.name}</CardTitle>
                                <CardDescription className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> {booking.gym?.address}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-xl border border-white/5">
                                    <div className="bg-background h-12 w-12 rounded-lg flex items-center justify-center">
                                        <Calendar className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Session Date</p>
                                        <p className="font-bold">{format(new Date(booking.bookingDay), "EEEE, MMMM do")}</p>
                                    </div>
                                </div>

                                {booking.status === "booked" && (
                                    <div className="space-y-3 pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-2 text-xs font-bold text-primary group">
                                            <QrCode className="h-4 w-4" />
                                            SHOW THIS AT THE GYM COUNTER
                                        </div>
                                        <div className="grid grid-cols-4 gap-1 py-1">
                                            {[...Array(20)].map((_, i) => (
                                                <div key={i} className="h-1 bg-border/20 rounded-full" />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {booking.status === "checked-in" && (
                                    <div className="flex items-center gap-2 text-xs font-bold text-secondary">
                                        <CheckCircle2 className="h-4 w-4" />
                                        CHECKED IN AT {format(new Date(booking.checkedInAt!), "HH:mm")}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
