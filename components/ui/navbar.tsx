import Link from "next/link";
import { Button } from "../ui/button";
import { Menu, Dumbbell } from "lucide-react";

export function Navbar() {
    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "Classes", href: "#classes" },
        { name: "Pricing", href: "#pricing" },
        { name: "About", href: "#about" },
    ];

    return (
        <div className="fixed top-4 left-0 right-0 z-50 flex justify-center">
            <nav className="relative w-[95%] max-w-4xl rounded-full border border-gray-200 bg-white/80 py-2 px-4 shadow-lg backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80 md:px-6">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
                            <Dumbbell className="h-4 w-4" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                            GYM
                            <span className="mx-1 text-rose-600 font-normal">/</span>
                            <span className="text-blue-600">Day</span>
                        </span>

                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-6 md:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Buttons */}
                    <div className="hidden items-center gap-3 md:flex">
                        <Button variant="ghost" size="sm" className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                            Sign In
                        </Button>
                        <Button size="sm" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                            Join Now
                        </Button>
                    </div>

                    {/* Mobile Menu Toggle (CSS Hack) */}
                    <div className="flex md:hidden">
                        <label
                            htmlFor="mobile-menu-toggle"
                            className="group inline-flex cursor-pointer items-center justify-center rounded-full p-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                        >
                            <span className="sr-only">Open main menu</span>
                            <Menu className="h-5 w-5" />
                        </label>
                        <input type="checkbox" id="mobile-menu-toggle" className="peer hidden" />

                        {/* Mobile Menu Overlay */}
                        <div className="hidden peer-checked:flex absolute top-14 left-0 right-0 mt-2 flex-col gap-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/95">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="rounded-xl px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-blue-400"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="mt-2 flex flex-col gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                                <Button variant="outline" className="w-full justify-center rounded-xl">
                                    Sign In
                                </Button>
                                <Button className="w-full justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
                                    Join Now
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}