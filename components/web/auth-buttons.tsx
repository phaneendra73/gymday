"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useConvexAuth } from "convex/react";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AuthButtonsProps {
    onItemClick?: () => void;
    className?: string;
}

export function AuthButtons({ onItemClick, className }: AuthButtonsProps) {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const router = useRouter();
    
    if (isLoading) {
        return (
            <div className="flex items-center gap-4 animate-pulse">
                <div className="hidden md:block w-16 h-10 bg-muted/30 rounded-xl" />
                <div className="w-24 h-10 bg-primary/10 rounded-xl" />
            </div>
        );
    }

    if (isAuthenticated) {
        return (
            <div className="animate-in fade-in duration-300">
            <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                    await authClient.signOut({
                        fetchOptions: {
                            onSuccess: () => {
                                toast.success("Logged out Sucessfully")
                                router.push("/")
                            },
                            onError: (er) => {
                                toast.error(er.error.message)
                            }
                        }
                    });
                    onItemClick?.();
                }}
                className={cn(
                    "rounded-xl font-semibold gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all",
                    "w-full md:w-auto h-11 md:h-10",
                    className
                )}
            >
                <LogOut className="h-4 w-4" />
                Log Out
            </Button>
            </div>
        );
    }

    return (
        <div className={cn("flex flex-col md:flex-row items-center gap-3 md:gap-4 w-full md:w-auto animate-in fade-in duration-300", className)}>
            <Link
                href="/auth/login"
                onClick={onItemClick}
                className={cn(
                    "text-sm md:text-md font-semibold text-muted-foreground transition-colors hover:text-primary",
                    "w-full md:w-auto h-11 md:h-auto flex items-center justify-center border md:border-none border-border rounded-xl md:rounded-none"
                )}
            >
                Login
            </Link>
            <Link
                href="/auth/signup"
                onClick={onItemClick}
                className={cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                    "font-semibold rounded-xl shadow-md shadow-primary/20 w-full md:w-auto h-11 md:h-10 px-8"
                )}
            >
                Sign Up
            </Link>
        </div>
    );
}
