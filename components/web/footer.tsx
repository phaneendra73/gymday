"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dumbbell, Twitter, Instagram, Linkedin, Github } from "lucide-react";

export function Footer() {
    return (
        <footer className="pt-32 pb-12 border-t bg-muted/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-12 gap-12 mb-20">
                    <div className="md:col-span-4 space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary p-2 rounded-xl text-white shadow-lg shadow-primary/20">
                                <Dumbbell className="h-6 w-6" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-foreground">
                                GYM<span className="text-primary">/</span>Day
                            </span>
                        </div>
                        <p className="text-base text-muted-foreground leading-relaxed">
                            The leading marketplace for flexible fitness. We're building a world
                            where physical wellness is accessible to everyone, everywhere.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { Icon: Twitter, href: "#", label: "Twitter" },
                                { Icon: Instagram, href: "#", label: "Instagram" },
                                { Icon: Linkedin, href: "#", label: "LinkedIn" },
                                { Icon: Github, href: "#", label: "GitHub" },
                            ].map((social, i) => (
                                <Link
                                    key={i}
                                    href={social.href}
                                    className="h-10 w-10 rounded-full bg-card border border-border flex items-center justify-center hover:text-primary hover:border-primary transition-colors cursor-pointer shadow-sm"
                                    aria-label={social.label}
                                >
                                    <social.Icon className="h-5 w-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <h4 className="text-lg font-bold">Platform</h4>
                        <ul className="space-y-4 text-muted-foreground font-semibold">
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors">
                                    Find a Gym
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors">
                                    Mobile App
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors">
                                    For Gym Owners
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <h4 className="text-lg font-bold">Company</h4>
                        <ul className="space-y-4 text-muted-foreground font-semibold">
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors">
                                    Story
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors">
                                    News
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-primary transition-colors">
                                    Impact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="md:col-span-4 space-y-6">
                        <h4 className="text-lg font-bold">News & Training Tips</h4>
                        <p className="text-muted-foreground">
                            Get weekly workouts and gym drops in your inbox.
                        </p>
                        <div className="flex gap-2">
                            <input
                                placeholder="you@email.com"
                                className="flex-1 h-12 bg-card rounded-xl border border-border px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            />
                            <Button className="h-12 rounded-xl">Join</Button>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground font-semibold">
                    <p>© 2025 GymDay Global Inc. Built with passion for athletes.</p>
                    <div className="flex gap-8">
                        <Link href="#" className="hover:text-foreground transition-colors">
                            Privacy
                        </Link>
                        <Link href="#" className="hover:text-foreground transition-colors">
                            Terms
                        </Link>
                        <Link href="#" className="hover:text-foreground transition-colors">
                            Sitemap
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
