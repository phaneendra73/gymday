"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, Users, CheckCircle2, QrCode, TrendingUp, MapPin, Activity } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { Doc } from "@/convex/_generated/dataModel";

import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { formatINR } from "@/lib/utils";

export default function OwnerDashboardPage() {
    const { data: session } = authClient.useSession();
    const myGyms = useQuery(api.gyms.listMyGyms);
    const ownerStats = useQuery(api.bookings.ownerTodayStats);

    // Show loading until session and query state settle
    if (session === undefined || myGyms === undefined) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }
console.log(session, myGyms);
    // If logged out or not an owner, show guidance
    if (!session?.user || myGyms.length === 0) {
        return (
            <div className="container py-20 text-center space-y-4">
                <h1 className="text-3xl font-bold">No Gyms Found</h1>
                <p className="text-muted-foreground">You are not registered as an owner of any gym yet. Please contact admin.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tight">Owner Dashboard</h1>
                <p className="text-muted-foreground font-medium">Manage check-ins and track performance for your facilities.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-premium border-primary/20">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider opacity-60">Total Passes Today</p>
                            <p className="text-3xl font-black">{ownerStats?.totalToday ?? 0}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-secondary/5 border-secondary/20 backdrop-blur-xl">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider opacity-60">Checked In</p>
                            <p className="text-3xl font-black">{ownerStats?.checkedInToday ?? 0}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="glass-premium border-white/5">
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider opacity-60">Est. Payout</p>
                            <p className="text-3xl font-black">{formatINR(ownerStats?.payoutCents ?? 0)}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-8">
                {myGyms.map(gym => (
                    <GymManagementSection key={gym._id} gym={gym} />
                ))}
            </div>
        </div>
    );
}

function GymManagementSection({ gym }: { gym: Doc<"gyms"> }) {
    const bookings = useQuery(api.bookings.listGymBookings, { gymId: gym._id });
    const checkIn = useMutation(api.bookings.checkIn);

    const handleCheckIn = async (id: Doc<"bookings">["_id"]) => {
        try {
            await checkIn({ bookingId: id });
            toast.success("User checked in successfully!");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (er) {
            toast.error("Failed to check in");
        }
    };

    const todayStr = format(new Date(), "yyyy-MM-dd");
    const todaysBookings = bookings?.filter(b => b.bookingDay === todayStr) || [];

    return (
        <Card className="glass-premium overflow-hidden">
            <CardHeader className="bg-white/5 border-b border-white/5 flex flex-row items-center justify-between">
                <div className="space-y-1">
                    <CardTitle className="text-2xl font-bold">{gym.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {gym.address}
                    </CardDescription>
                </div>
                <Badge variant={gym.isActive ? "default" : "secondary"}>
                    {gym.isActive ? "ACTIVE" : "INACTIVE"}
                </Badge>
            </CardHeader>

            <CardContent className="p-0">
                <div className="p-6 bg-primary/5 flex items-center justify-between">
                    <h3 className="font-bold flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" /> Today&#39;s Check-ins
                    </h3>
                    <span className="text-xs font-medium text-muted-foreground">{format(new Date(), "MMMM dd, yyyy")}</span>
                </div>

                <div className="divide-y divide-white/5">
                    {bookings === undefined ? (
                        <div className="p-10 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>
                    ) : todaysBookings.length === 0 ? (
                        <div className="p-20 text-center text-muted-foreground">No bookings found for today.</div>
                    ) : (
                        todaysBookings.map(booking => (
                            <div key={booking._id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center font-bold text-lg">
                                        {booking.user?.name?.[0] || "U"}
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">{booking.user?.name || "Anonymous User"}</p>
                                        <p className="text-xs text-muted-foreground">{booking.user?.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right font-mono text-xs md:text-sm">
                                        <p className="text-muted-foreground uppercase opacity-60">ID</p>
                                        <p>#{booking._id.slice(-6).toUpperCase()}</p>
                                    </div>

                                    {booking.status === "booked" ? (
                                        <Button onClick={() => handleCheckIn(booking._id)} className="gap-2 font-bold shadow-lg shadow-primary/20">
                                            <QrCode className="h-4 w-4" /> MARK CHECKED-IN
                                        </Button>
                                    ) : (
                                        <div className="flex items-center gap-2 text-secondary-foreground font-bold text-sm bg-secondary px-4 py-2 rounded-xl border border-secondary/20">
                                            <CheckCircle2 className="h-4 w-4" /> CHECKED IN
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

