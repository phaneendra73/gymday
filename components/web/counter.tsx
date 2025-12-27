"use client";

import { useEffect, useRef } from "react";
import { useInView, motion, useMotionValue, useSpring, useTransform, animate } from "framer-motion";

interface CounterProps {
    value: number;
    direction?: "up" | "down";
    duration?: number;
    delay?: number;
    className?: string;
}

export function Counter({
    value,
    direction = "up",
    duration = 2,
    delay = 0,
    className,
}: CounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(direction === "down" ? value : 0);
    const springValue = useSpring(motionValue, {
        damping: 30,
        stiffness: 100,
    });
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            const timeout = setTimeout(() => {
                animate(motionValue, direction === "down" ? 0 : value, {
                    duration: duration,
                });
            }, delay * 1000);
            return () => clearTimeout(timeout);
        }
    }, [motionValue, isInView, delay, value, direction, duration]);

    useEffect(() => {
        springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Intl.NumberFormat("en-US").format(
                    Math.floor(latest)
                );
            }
        });
    }, [springValue]);

    return <span ref={ref} className={className} />;
}
