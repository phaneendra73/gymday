"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="h-10 w-20 bg-accent/20 animate-pulse rounded-md" />
    }

    const isDark = resolvedTheme === "dark"

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={cn(
                "relative flex h-11 w-20 items-center p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 ring-offset-background border border-primary/20 shadow-sm rounded-md overflow-hidden",
                isDark ? "bg-slate-950" : "bg-blue-50/50"
            )}
            aria-label="Toggle theme"
        >
            {/* Background elements - tucked behind the slider */}
            <div className="absolute inset-x-0 inset-y-0 flex justify-between items-center px-3.5 text-[10px] pointer-events-none z-0">
                <Sun className={cn("h-4 w-4", !isDark ? "text-primary/30" : "text-muted-foreground/20")} />
                <Moon className={cn("h-4 w-4", isDark ? "text-blue-400/30" : "text-muted-foreground/20")} />
            </div>

            <motion.div
                className={cn(
                    "relative z-10 flex h-9 w-9 items-center justify-center shadow-lg rounded-sm transition-colors",
                    isDark ? "bg-primary text-white" : "bg-white text-orange-500 border border-primary/10"
                )}
                animate={{
                    x: isDark ? 36 : 0,
                    rotate: isDark ? 0 : 90,
                }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                }}
            >
                {isDark ? (
                    <Moon className="h-5 w-5 fill-current" />
                ) : (
                    <Sun className="h-5 w-5 fill-none stroke-[2.5px] drop-shadow-[0_0_3px_rgba(249,115,22,0.3)]" />
                )}
            </motion.div>
        </button>
    )
}
