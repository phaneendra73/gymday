"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Menu, Dumbbell, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/web/theme-toggle";
import { cn } from "@/lib/utils";
import { AuthButtons } from "./auth-buttons";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "Classes", href: "#classes" },
        { name: "Pricing", href: "#pricing" },
        { name: "About", href: "#about" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 w-full items-center justify-between px-4 md:px-8">
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
                <nav className="hidden md:flex items-center gap-5">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                buttonVariants({ variant: "ghost", size: "sm" }),
                                "text-md font-semibold transition-colors hover:text-primary"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <AuthButtons />
                    <ThemeToggle />
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
                                        "w-full justify-start font-semibold h-12"
                                    )}
                                    onClick={() => setIsOpen(false)}
                                >
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
        </header>
    );
}