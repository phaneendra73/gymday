import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4 md:p-8">
            <Link
                href="/"
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "absolute left-4 top-4 md:left-8 md:top-8"
                )}
            >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
            </Link>
            <div className="w-full max-w-md space-y-4">
                {children}
            </div>
        </div>
    );
}