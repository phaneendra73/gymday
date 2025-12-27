"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { GymCard } from "@/components/web/gym-card";
import { Loader2, Zap, Shield, Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion } from "framer-motion";
import { convexToJson } from "convex/values";

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function HomePage() {
  const gyms = useQuery(api.gyms.listActiveGyms);
  const [search, setSearch] = useState("");

  const filteredGyms = gyms?.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest"
          >
            <Zap className="h-4 w-4 fill-primary" /> The Ultimate Workout Network
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9]"
          >
            TRAIN <span className="text-primary italic">WITHOUT</span> <br />
            <span className="text-outline text-transparent">BOUNDARIES</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium"
          >
            Unlock instant access to premier gym facilities. Book your day pass in seconds and never miss a session again.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto relative group"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Where do you want to train today?"
              className="pl-12 h-16 bg-card/40 backdrop-blur-2xl border-white/10 focus:border-primary/40 focus:ring-primary/10 rounded-2xl text-lg shadow-2xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </motion.div>
        </div>
      </section>

      {/* Main Listings */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold tracking-tight">Nearby Facilities</h2>
            <p className="text-muted-foreground">Highest-rated gyms available for instant booking.</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 px-4 py-2 rounded-xl border border-primary/20">
            <MapPin className="h-4 w-4" />
            {filteredGyms?.length || 0} LOCATIONS READY
          </div>
        </div>

        {gyms === undefined ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="relative">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
            </div>
            <p className="text-xl font-medium text-muted-foreground animate-pulse tracking-wide">Syncing gym network...</p>
          </div>
        ) : filteredGyms?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 bg-card/20 rounded-[3rem] border border-dashed border-white/10 backdrop-blur-sm"
          >
            <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold">No gyms found in this area</h3>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              We're constantly expanding. Try a different location or check back soon!
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {filteredGyms?.map((gym) => (
              <motion.div key={gym._id} variants={fadeIn}>
                <GymCard gym={gym} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Features Grid */}
      <section className="bg-card/30 border-y border-white/10 py-24 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-4 group">
            <div className="h-16 w-16 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500 border border-primary/20">
              <Zap className="h-8 w-8 fill-primary" />
            </div>
            <h4 className="text-2xl font-bold">Instant Activation</h4>
            <p className="text-muted-foreground leading-relaxed">Book your pass and get scanned at the reception immediately. No paperwork required.</p>
          </div>
          <div className="space-y-4 group">
            <div className="h-16 w-16 rounded-[2rem] bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform duration-500 border border-secondary/20">
              <Shield className="h-8 w-8 fill-secondary" />
            </div>
            <h4 className="text-2xl font-bold">Verified Quality</h4>
            <p className="text-muted-foreground leading-relaxed">Every gym is manually inspected to ensure locker rooms, equipment, and hygiene meet our standards.</p>
          </div>
          <div className="space-y-4 group">
            <div className="h-16 w-16 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500 border border-primary/20">
              <MapPin className="h-8 w-8" />
            </div>
            <h4 className="text-2xl font-bold">Global Portability</h4>
            <p className="text-muted-foreground leading-relaxed">Traveling? Your account works across all cities. Use your credits anywhere you go.</p>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .text-outline {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
