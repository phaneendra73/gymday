"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  Star,
  Dumbbell,
  ShieldCheck,
  Zap,
  Users,
  Clock,
  ArrowRight,
  TrendingUp,
  Award
} from "lucide-react";
import { useRef } from "react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden" ref={containerRef}>
      {/* Hero Section with Parallax */}
      <section className="relative flex items-center justify-center min-h-screen overflow-hidden">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="/hero.png"
            alt="Modern gym interior"
            fill
            className="object-cover scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background dark:from-background/70 dark:via-background/90 dark:to-background" />

          {/* Animated Glows */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] animate-pulse delay-700" />
        </motion.div>

        <div className="container relative z-10 px-4 md:px-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 dark:bg-primary/20 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-md">
              <Zap className="h-4 w-4 mr-2 fill-primary/50" />
              <span className="dark:text-white">No Contracts. No Hassle. Just Fitness.</span>
            </motion.div>

            <motion.h1
              variants={fadeIn}
              className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-8xl"
            >
              The Ultimate <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/50 drop-shadow-sm">
                Gym Pass
              </span>
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="text-xl text-muted-foreground md:text-2xl max-w-2xl mx-auto leading-relaxed"
            >
              Access the highest-rated gyms in your city with a single day pass.
              Pay only for the days you train.
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button size="lg" className="h-14 px-10 text-lg font-bold rounded-2xl shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1">
                Explore Gyms Near Me
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg rounded-2xl bg-background/50 backdrop-blur-md hover:bg-background/80 transition-all border-white/10">
                Become a Partner
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated Background Icons */}
        <div className="absolute inset-0 pointer-events-none opacity-5 overflow-hidden">
          <motion.div
            animate={{
              rotate: 360,
              x: [0, 100, 0],
              y: [0, 50, 0]
            }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 left-[10%]"
          >
            <Dumbbell size={120} />
          </motion.div>
          <motion.div
            animate={{
              rotate: -360,
              x: [0, -100, 0],
              y: [0, 100, 0]
            }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-40 right-[15%]"
          >
            <TrendingUp size={150} />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/20 backdrop-blur-sm -mt-20 relative z-20">
        <div className="container px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Partner Gyms", value: "850+" },
              { label: "Active Users", value: "24k" },
              { label: "Cities", value: "45" },
              { label: "Daily Passes Sold", value: "150k+" },
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-1">
                <p className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary">{stat.value}</p>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section with Better Visuals */}
      <section className="py-32 relative overflow-hidden" id="how-it-works">
        <div className="container px-4 md:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold tracking-tight md:text-5xl"
            >
              Workout on <span className="text-primary italic">your terms</span>
            </motion.h2>
            <p className="text-xl text-muted-foreground">
              We've stripped away the complexity of gym memberships. No sign-up fees, no induction meetings, no excuses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: MapPin,
                title: "Find your spot",
                desc: "Explore a curated selection of premium health clubs nearby. Filter by equipment or amenities.",
                color: "bg-blue-500",
                shadow: "shadow-blue-500/20"
              },
              {
                icon: Clock,
                title: "Buy a fast pass",
                desc: "Select a day or multi-day pass and checkout in seconds. Valid immediately after purchase.",
                color: "bg-primary",
                shadow: "shadow-primary/20"
              },
              {
                icon: ShieldCheck,
                title: "Scan & Sweat",
                desc: "Scan your QR code at the desk and you're in. Focus on hitting your PR, not the paperwork.",
                color: "bg-orange-500",
                shadow: "shadow-orange-500/20"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                <div className="p-8 rounded-[2rem] border border-border/50 bg-card hover:bg-card/50 transition-colors shadow-xl h-full flex flex-col items-center text-center">
                  <div className={`h-20 w-20 rounded-3xl ${step.color} ${step.shadow} flex items-center justify-center text-white mb-6 transform group-hover:rotate-6 transition-transform`}>
                    <step.icon className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {step.desc}
                  </p>

                  {index < 2 && (
                    <div className="hidden lg:block absolute top-1/2 -right-6 translate-x-1/2 -translate-y-1/2 z-0">
                      <ArrowRight className="h-8 w-8 text-muted/30" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
            <motion.div
              whileHover={{ scale: 0.99 }}
              className="md:col-span-8 rounded-[2.5rem] bg-card p-12 border border-border overflow-hidden relative group"
            >
              <div className="relative z-10 max-w-md">
                <Award className="h-12 w-12 text-primary mb-6" />
                <h3 className="text-3xl font-bold mb-4">The Premium Network</h3>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                  We don't just partner with any gym. Every facility on GymDay is quality-checked for equipment standards, cleanliness, and staff expertise.
                </p>
                <Button variant="outline" className="rounded-xl h-12 px-6">View Quality Standards</Button>
              </div>
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 group-hover:opacity-40 transition-opacity">
                <Image src="/hero.png" fill className="object-cover" alt="Quality" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 0.98 }}
              className="md:col-span-4 rounded-[2.5rem] bg-primary p-10 text-primary-foreground flex flex-col justify-between overflow-hidden relative shadow-2xl shadow-primary/20"
            >
              <div className="relative z-10">
                <Users className="h-10 w-10 mb-6 opacity-80" />
                <h3 className="text-2xl font-bold mb-2">Community First</h3>
                <p className="opacity-80">Join a network of 20,000+ workout enthusiasts.</p>
              </div>
              <div className="relative z-10 mt-8 bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/10">
                <p className="text-sm font-medium italic">"The only way I could stay fit while traveling for work. Essential app."</p>
                <p className="text-xs mt-2 opacity-60">— Marcus K., Tech Consultant</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 0.98 }}
              className="md:col-span-4 rounded-[2.5rem] bg-card p-10 border border-border flex flex-col justify-center items-center text-center group"
            >
              <div className="h-16 w-16 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Flexible Credits</h3>
              <p className="text-sm text-muted-foreground">Buy credits that never expire and use them at any gym in our network.</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 0.99 }}
              className="md:col-span-8 rounded-[2.5rem] bg-[url('/hero.png')] bg-cover bg-center p-12 relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors" />
              <div className="relative z-10 flex h-full flex-col justify-end">
                <h3 className="text-3xl font-bold text-white mb-2">Travel Without Limits</h3>
                <p className="text-white/70 max-w-sm">From NY to London, finds gyms that feel like home no matter where you landed.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section - The Big Finish */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10" />
        <div className="container relative z-10 px-4 md:px-8 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="p-16 md:p-24 rounded-[4rem] bg-card border-none shadow-2xl relative overflow-hidden"
          >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full -ml-32 -mb-32 blur-[80px]" />

            <div className="relative z-10 space-y-10">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                Your first workout is <br />
                <span className="text-primary italic">completely free.</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                No credit card required. Download the app, pick your gym, and hit the weights in less than 2 minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/auth/signup">
                  <Button size="lg" className="h-16 px-12 text-xl font-bold rounded-2xl w-full sm:w-auto shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all">
                    Claim Free Day Pass
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-16 px-12 text-xl font-bold rounded-2xl w-full sm:w-auto border-2 border-primary/20 hover:bg-muted transition-all">
                  Contact Sales
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div >
  );
}
