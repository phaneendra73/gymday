"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Loader2, MapPin, ExternalLink, Calendar, IndianRupee, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import dynamic from "next/dynamic";
import { getGoogleMapsLink, getStaticMapUrl } from "@/lib/maps";
import { use } from "react";
import { formatINR } from "@/lib/utils";

// Dynamically import the map component to avoid SSR issues
const GymMap = dynamic(() => import("@/components/gym/gym-map").then(mod => mod.GymMap), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full flex items-center justify-center bg-muted rounded-xl">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    ),
});

export default function GymDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const gym = useQuery(api.gyms.getGym, { gymId: resolvedParams.id as Id<"gyms"> });

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
                <p className="text-muted-foreground">This gym may have been removed or doesn't exist.</p>
                <Button asChild>
                    <Link href="/">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Link>
                </Button>
            </div>
        );
    }

    const googleMapsUrl = getGoogleMapsLink(gym.location.lat, gym.location.lng);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
            {/* Back Button */}
            <Button asChild variant="ghost" size="sm">
                <Link href="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Gyms
                </Link>
            </Button>

            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Image or Map */}
                <div className="space-y-4">
                    {gym.image ? (
                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-border/40">
                            <img
                                src={gym.image}
                                alt={gym.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-border/40">
                            <img
                                src="/hero.png"
                                alt="Gym placeholder"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Interactive Map */}
                    <div className="h-80 rounded-2xl overflow-hidden border border-border/40">
                        <GymMap lat={gym.location.lat} lng={gym.location.lng} name={gym.name} />
                    </div>
                </div>

                {/* Right: Details */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-5xl font-black tracking-tight mb-4">{gym.name}</h1>
                        <div className="flex items-start gap-2 text-muted-foreground">
                            <MapPin className="h-5 w-5 text-primary mt-0.5" />
                            <p className="text-lg">{gym.address}</p>
                        </div>
                    </div>

                    {gym.description && (
                        <p className="text-lg text-muted-foreground leading-relaxed">{gym.description}</p>
                    )}

                    {/* Price Card */}
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <IndianRupee className="h-6 w-6 text-primary" />
                                Day Pass Pricing
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold text-primary">
                                {(gym.passPrice ?? 0) > 0 ? formatINR(gym.passPrice!) : "FREE"}
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">Per day access</p>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Button asChild className="w-full h-14 text-lg font-bold" size="lg">
                            <Link href={`/book/${gym._id}`}>
                                <Calendar className="h-5 w-5 mr-2" />
                                Book Day Pass
                            </Link>
                        </Button>

                        <Button asChild variant="outline" className="w-full h-14 text-lg font-bold" size="lg">
                            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-5 w-5 mr-2" />
                                Open in Google Maps
                            </a>
                        </Button>
                    </div>

                    {/* Location Info */}
                    <Card className="bg-card/40 backdrop-blur-xl border-border/40">
                        <CardHeader>
                            <CardTitle className="text-lg">Location Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Latitude:</span>
                                <span className="font-mono font-medium">{gym.location.lat.toFixed(6)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Longitude:</span>
                                <span className="font-mono font-medium">{gym.location.lng.toFixed(6)}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
