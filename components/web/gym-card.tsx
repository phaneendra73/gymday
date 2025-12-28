"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, Star, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Doc } from "@/convex/_generated/dataModel";
import { getGoogleMapsLink } from "@/lib/maps";
import { formatINR } from "@/lib/utils";
import Image from "next/image";

interface GymCardProps {
    gym: Doc<"gyms">;
    distance?: number | null;
}

export function GymCard({ gym, distance }: GymCardProps) {
    const hasLocation = !!gym.location && typeof gym.location.lat === "number" && typeof gym.location.lng === "number";
    const googleMapsUrl = hasLocation ? getGoogleMapsLink(gym.location.lat, gym.location.lng) : undefined;

    return (
        <Card className="group overflow-hidden bg-card/40 backdrop-blur-xl border-border/40 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
            <div className="relative h-48 overflow-hidden">
                {gym.image ? (
                    <Image
                        src={gym.image}
                        alt={gym.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        fill
                    />
                ) : (
                    <Image
                        src="/hero.png"
                        alt="Gym placeholder"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        fill
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />

                <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <div className="bg-background/80 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium border border-border/40 shadow-sm">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span>{gym.rating?.toFixed(1) || "4.5"}</span>
                    </div>
                    {distance !== null && distance !== undefined && (
                        <div className="bg-primary/90 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold border border-primary/40 shadow-sm text-primary-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{distance} km</span>
                        </div>
                    )}
                </div>

                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="bg-primary px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider text-primary-foreground shadow-lg">
                        Day Pass {(gym.passPrice ?? 0) > 0 ? formatINR(gym.passPrice!) : "FREE"}
                    </span>
                </div>

                {googleMapsUrl && (
                    <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-md p-2 rounded-full border border-border/40 hover:bg-primary hover:text-primary-foreground transition-all shadow-sm group/map"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ExternalLink className="h-3 w-3" />
                    </a>
                )}
            </div>

            <CardHeader className="pb-2">
                <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1">{gym.name}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-xs line-clamp-1">
                    <MapPin className="h-3 w-3 text-primary" />
                    {gym.address}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {gym.description || "No description available for this gym location."}
                </p>
            </CardContent>

            <CardFooter className="pt-0">
                <Button asChild className="w-full group/btn" variant="outline">
                    <Link href={`/gyms/${gym._id}`} className="flex items-center justify-center gap-2">
                        View Details
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
