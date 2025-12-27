"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Dumbbell, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/web/navbar";
import { Footer } from "@/components/web/footer";

export default function NotFound() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 flex items-center justify-center relative overflow-hidden py-20 px-4">
                {/* Background Decorations */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--primary)_0%,transparent_70%)] opacity-5 -z-10" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -z-10 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

                <div className="max-w-2xl w-full text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="relative inline-block"
                    >
                        <div className="text-[12rem] md:text-[16rem] font-black leading-none tracking-tighter opacity-10 select-none">
                            404
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                animate={{
                                    rotate: [0, 10, -10, 0],
                                    y: [0, -10, 0]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="bg-primary/20 p-8 rounded-[2.5rem] backdrop-blur-xl border border-primary/30 shadow-2xl shadow-primary/20"
                            >
                                <Dumbbell className="h-20 w-20 text-primary" strokeWidth={1.5} />
                            </motion.div>
                        </div>
                    </motion.div>

                    <div className="space-y-4">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-5xl font-black tracking-tight"
                        >
                            WORKOUT <span className="text-primary italic">HALTED</span>.
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-xl text-muted-foreground font-medium max-w-lg mx-auto"
                        >
                            The page you're searching for seems to have skipped leg day. It doesn't exist or has been relocated.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Button asChild size="lg" className="rounded-2xl px-8 font-bold text-lg h-14 shadow-xl shadow-primary/20">
                            <Link href="/">
                                <ArrowLeft className="mr-2 h-5 w-5" /> Back to Safety
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="rounded-2xl px-8 font-bold text-lg h-14 glass">
                            <Link href="/gyms">
                                <Search className="mr-2 h-5 w-5" /> Explore Gyms
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
