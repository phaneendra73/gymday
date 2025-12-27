"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { Doc } from "@/convex/_generated/dataModel";

interface GymCardProps {
    gym: Doc<"gyms">;
}

export function GymCard({ gym }: GymCardProps) {
    return (
        <Card className="group overflow-hidden bg-card/40 backdrop-blur-xl border-border/40 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
            <div className="relative h-48 overflow-hidden">
                {gym.image ? (
                    <img
                        src={gym.image}
                        alt={gym.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <MapPin className="h-10 w-10 text-primary/40" />
                    </div>
                )}
                <div className="absolute top-3 right-3">
                    <div className="bg-background/80 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium border border-border/40">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span>4.9</span>
                    </div>
                </div>
                <div className="absolute bottom-3 left-3">
                    <span className="bg-primary px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider text-primary-foreground">
                        Day Pass {(gym.passPrice ?? 0) > 0 ? `₹${(gym.passPrice! / 100).toFixed(0)}` : "FREE"}
                    </span>
                </div>
            </div>

            <CardHeader className="pb-2">
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{gym.name}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-xs">
                    <MapPin className="h-3 w-3" />
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
