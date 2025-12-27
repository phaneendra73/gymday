"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, Calendar, MapPin, User, CheckCircle2, XCircle, Ticket } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function AdminBookingsPage() {
    const bookings = useQuery(api.bookings.listAllBookings);

    if (bookings === undefined) {
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
                    <h1 className="text-4xl font-black tracking-tight">All Transactions</h1>
                    <p className="text-muted-foreground mt-2 font-medium">History of all day-pass bookings across the platform.</p>
                </div>
                <div className="bg-primary/10 text-primary px-4 py-2 rounded-2xl border border-primary/20 text-sm font-bold">
                    TOTAL REVENUE: ₹{(bookings.length * 499).toLocaleString()}
                </div>
            </div>

            <div className="grid gap-4">
                {bookings.length === 0 ? (
                    <div className="text-center py-20 bg-card/20 rounded-3xl border border-dotted border-white/10">
                        <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <h3 className="text-xl font-bold">No bookings found</h3>
                        <p className="text-muted-foreground">The platform hasn't processed any passes yet.</p>
                    </div>
                ) : (
                    <div className="glass-premium rounded-3xl overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/5 font-bold text-xs uppercase tracking-widest text-muted-foreground">
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Gym</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Price</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {bookings.map((booking) => (
                                        <tr key={booking._id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                                        {booking.user?.name?.[0] || "U"}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm">{booking.user?.name || "Anonymous"}</span>
                                                        <span className="text-[10px] text-muted-foreground">{booking.user?.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-sm font-medium">{booking.gym?.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                                    {format(new Date(booking.bookingDay), "MMM dd, yyyy")}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={booking.status === "booked" ? "secondary" : "default"} className="text-[10px] font-black uppercase tracking-widest">
                                                    {booking.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-sm">
                                                ₹{(booking.gym?.passPrice ?? 0) / 100}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
