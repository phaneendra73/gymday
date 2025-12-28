"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { GymCard } from "@/components/web/gym-card";
import {
  Loader2,
  Zap,
  Shield,
  Search,
  MapPin,
  Navigation,
  Clock,
  CreditCard,
  Smartphone,
  Users,
  Star,
  TrendingUp,
  Award,
  Heart,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, easeInOut } from "framer-motion";
import { calculateDistance } from "@/lib/maps";
import { toast } from "sonner";

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const float = {
  y: ["-10%", "10%"],
  transition: {
    y: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: easeInOut,
    },
  },
};

interface UserLocation {
  lat: number;
  lng: number;
}

export default function HomePage() {
  const gyms = useQuery(api.gyms.listActiveGyms);
  const [search, setSearch] = useState("");
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        toast.success("Location detected! Showing nearby gyms");
        setIsLoadingLocation(false);
      },
      () => {
        toast.error("Unable to get your location");
        setIsLoadingLocation(false);
      }
    );
  };

  // Calculate distance and filter gyms
  const processedGyms = gyms?.map((gym) => ({
    ...gym,
    distance: userLocation
      ? calculateDistance(
          userLocation.lat,
          userLocation.lng,
          gym.location.lat,
          gym.location.lng
        )
      : null,
  }));

  // Filter by search
  const filteredGyms = processedGyms?.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.address.toLowerCase().includes(search.toLowerCase())
  );

  // Sort by distance if location is available
  const sortedGyms = filteredGyms?.sort((a, b) => {
    if (a.distance !== null && b.distance !== null) {
      return a.distance - b.distance;
    }
    return 0;
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-primary/10 via-background to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent -z-10" />

        {/* Animated floating elements */}
        <motion.div
          animate={float}
          className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            ...float,
            transition: {
              ...float.transition,
              y: { ...float.transition.y, delay: 0.5 },
            },
          }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            ...float,
            transition: {
              ...float.transition,
              y: { ...float.transition.y, delay: 1 },
            },
          }}
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary/3 rounded-full blur-3xl"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest"
          >
            <Zap className="h-4 w-4 text-primary" /> The Ultimate Workout
            Network
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9]"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              TRAIN{" "}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="text-primary italic"
            >
              WITHOUT
            </motion.span>{" "}
            <br />
            <motion.span
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-outline text-transparent"
            >
              BOUNDARIES
            </motion.span>
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 200 }}
            >
              .
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium"
          >
            Unlock instant access to premier gym facilities. Book your day pass
            in seconds and never miss a session again.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto space-y-4"
          >
            <div className="relative">
              <Input
                placeholder="Search gyms by name or location..."
                className="h-16 bg-card/60 backdrop-blur-2xl border-2 border-border/40 focus:border-primary/60 focus:ring-4 focus:ring-primary/10 rounded-2xl text-lg shadow-2xl pl-6 pr-6"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Button
              onClick={requestLocation}
              disabled={isLoadingLocation}
              variant="outline"
              size="lg"
              className="w-full h-14 gap-2 bg-card/60 backdrop-blur-2xl border-2 border-border/40 hover:border-primary/60 hover:bg-primary/5 rounded-2xl text-base font-bold shadow-lg"
            >
              {isLoadingLocation ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Getting location...
                </>
              ) : userLocation ? (
                <>
                  <Navigation className="h-5 w-5 text-primary" />
                  Location Enabled - Showing Nearby Gyms
                </>
              ) : (
                <>
                  <Navigation className="h-5 w-5" />
                  Find Nearby Gyms
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Main Listings */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold tracking-tight">
              {userLocation ? "Nearby Facilities" : "All Facilities"}
            </h2>
            <p className="text-muted-foreground">
              {userLocation
                ? "Sorted by distance from your location"
                : "Highest-rated gyms available for instant booking"}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 px-4 py-2 rounded-xl border border-primary/20">
            <MapPin className="h-4 w-4" />
            {sortedGyms?.length || 0} LOCATIONS READY
          </div>
        </div>

        {gyms === undefined ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6">
            <div className="relative">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
            </div>
            <p className="text-xl font-medium text-muted-foreground animate-pulse tracking-wide">
              Syncing gym network...
            </p>
          </div>
        ) : sortedGyms?.length === 0 ? (
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
              We&apos;re constantly expanding. Try a different location or check
              back soon!
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {sortedGyms?.map((gym) => (
              <motion.div key={gym._id} variants={fadeIn}>
                <GymCard gym={gym} distance={gym.distance} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* How It Works Section */}
      <section className="py-24 bg-linear-to-b from-background via-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-5xl md:text-6xl font-black tracking-tight">
              How It <span className="text-primary">Works</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started with your fitness journey in 3 simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                icon: Search,
                title: "Find Your Gym",
                description:
                  "Browse premium gyms near you. Filter by location, facilities, and ratings to find your perfect match.",
              },
              {
                step: "02",
                icon: CreditCard,
                title: "Book Instantly",
                description:
                  "Select your date and pay securely. Get instant confirmation and QR code pass on your device.",
              },
              {
                step: "03",
                icon: Smartphone,
                title: "Scan & Workout",
                description:
                  "Show your QR code at the gym entrance. Check-in instantly and start your workout session.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                <div className="relative overflow-hidden bg-card/60 backdrop-blur-xl border border-border/40 rounded-3xl p-8 hover:border-primary/40 transition-all hover:shadow-2xl hover:shadow-primary/10">
                  <div className="absolute bottom-2 right-4 z-0 pointer-events-none select-none text-5xl sm:text-6xl md:text-8xl font-black text-primary/5 group-hover:text-primary/10 transition-colors">
                    {item.step}
                  </div>
                  <div className="relative z-10 h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                    <item.icon className="h-8 w-8" />
                  </div>
                  <h3 className="relative z-10 text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="relative z-10 text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-primary/5 border-y border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { value: "500+", label: "Partner Gyms", icon: MapPin },
              { value: "50K+", label: "Active Users", icon: Users },
              { value: "4.8", label: "Average Rating", icon: Star },
              { value: "100K+", label: "Workouts Done", icon: TrendingUp },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring" }}
                className="text-center space-y-2 group"
              >
                <div className="flex justify-center mb-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="text-5xl font-black text-primary">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-5xl md:text-6xl font-black tracking-tight">
              Why Choose <span className="text-primary">GymDay</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience fitness freedom with unmatched flexibility and quality
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Clock,
                title: "No Commitments",
                description:
                  "Pay only when you workout. No annual contracts or hidden fees.",
              },
              {
                icon: Award,
                title: "Premium Access",
                description:
                  "Access to top-rated gyms with best-in-class equipment and facilities.",
              },
              {
                icon: Shield,
                title: "Secure Payments",
                description:
                  "Bank-grade encryption for all transactions. Your data is safe with us.",
              },
              {
                icon: Heart,
                title: "24/7 Support",
                description:
                  "Dedicated support team ready to help you anytime, anywhere.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl p-6 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/10 h-full">
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-primary/5 to-transparent" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
              Ready to Start Your{" "}
              <span className="text-primary">Fitness Journey?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of fitness enthusiasts who train smarter with
              GymDay. No commitments, just results.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="h-16 px-12 text-lg font-bold rounded-2xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all"
              >
                Explore Gyms Near You
                <Navigation className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-card/30 border-y border-white/10 py-24 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Built for <span className="text-primary">Modern Athletes</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-4 group"
            >
              <div className="h-16 w-16 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500 border border-primary/20">
                <Zap className="h-8 w-8" />
              </div>
              <h4 className="text-2xl font-bold">Instant Activation</h4>
              <p className="text-muted-foreground leading-relaxed">
                Book your pass and get scanned at the reception immediately. No
                paperwork required.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-4 group"
            >
              <div className="h-16 w-16 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500 border border-primary/20">
                <Shield className="h-8 w-8" />
              </div>
              <h4 className="text-2xl font-bold">Verified Quality</h4>
              <p className="text-muted-foreground leading-relaxed">
                Every gym is manually inspected to ensure locker rooms,
                equipment, and hygiene meet our standards.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="space-y-4 group"
            >
              <div className="h-16 w-16 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500 border border-primary/20">
                <MapPin className="h-8 w-8" />
              </div>
              <h4 className="text-2xl font-bold">Global Portability</h4>
              <p className="text-muted-foreground leading-relaxed">
                Traveling? Your account works across all cities. Use your
                credits anywhere you go.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .text-outline {
          -webkit-text-stroke: 2px rgba(2, 132, 199, 0.3);
          text-shadow: 0 0 40px rgba(2, 132, 199, 0.1);
        }
      `}</style>
    </div>
  );
}
