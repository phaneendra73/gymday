"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Menu, Dumbbell, X, Ticket, LayoutDashboard, Settings } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/web/theme-toggle";
import { cn } from "@/lib/utils";
import { AuthButtons } from "./auth-buttons";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session } = authClient.useSession();
    const userProfile = useQuery(api.auth.getCurrentUser);
    const initProfile = useMutation(api.userProfile.initProfile);

    useEffect(() => {
        // Ensure a profile exists and reconcile owner linkage if needed
        if (session?.user && (userProfile === null || userProfile?.isGYMOwner === false)) {
            initProfile();
        }
    }, [session, userProfile, initProfile]);

    const navLinks = [
        { name: "Explore", href: "/" },
        { name: "My Passes", href: "/my-bookings", icon: Ticket },
    ];

    if (userProfile?.isAdmin) {
        navLinks.push({ name: "Gyms", href: "/admin/gyms", icon: Settings });
        navLinks.push({ name: "Bookings", href: "/admin/bookings", icon: Ticket });
    }

    if (userProfile?.isGYMOwner) {
        navLinks.push({ name: "Owner", href: "/owner/dashboard", icon: LayoutDashboard });
    }

    const isNavLoading = session === undefined || (session?.user && userProfile === undefined);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group" onClick={() => setIsOpen(false)}>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
                            <Dumbbell className="h-5 w-5" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-foreground">
                            GYM<span className="text-primary">/</span>Day
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-2">
                        {isNavLoading ? (
                            <div className="flex items-center gap-2 animate-pulse">
                                <div className="h-8 w-20 bg-muted/30 rounded-md" />
                                <div className="h-8 w-24 bg-muted/30 rounded-md" />
                            </div>
                        ) : (
                            navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    buttonVariants({ variant: "ghost", size: "sm" }),
                                    "text-sm font-bold transition-colors hover:text-primary flex items-center gap-2"
                                )}
                            >
                                {link.icon && <link.icon className="h-4 w-4" />}
                                {link.name}
                            </Link>
                        ))
                        )}
                    </nav>

                    {/* Desktop Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <ThemeToggle />
                        <AuthButtons />
                    </div>


                    {/* Mobile Menu Toggle */}
                    <button
                        className="flex md:hidden items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <span className="sr-only">Toggle menu</span>
                        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {isOpen && (
                    <div className="md:hidden border-t border-border/40 bg-background">
                        <div className="container mx-auto px-4 py-4 space-y-4">
                            <nav className="flex flex-col space-y-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={cn(
                                            buttonVariants({ variant: "ghost" }),
                                            "w-full justify-start font-bold h-12 flex items-center gap-3"
                                        )}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.icon && <link.icon className="h-5 w-5" />}
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>
                            <div className="flex flex-col gap-3 pt-4 border-t border-border/40">
                                <AuthButtons onItemClick={() => setIsOpen(false)} />
                                <div className="flex items-center justify-center py-2">
                                    <ThemeToggle />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
