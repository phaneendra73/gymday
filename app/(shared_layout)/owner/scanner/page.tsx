"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { QrCode, CheckCircle2, XCircle, Scan } from "lucide-react";
import { toast } from "sonner";

export default function ScannerPage() {
    const [bookingId, setBookingId] = useState("");
    const [isScanning, setIsScanning] = useState(false);
    const checkIn = useMutation(api.bookings.checkIn);

    const handleCheckIn = async () => {
        if (!bookingId.trim()) {
            toast.error("Please enter a booking ID");
            return;
        }

        setIsScanning(true);
        try {
            // Try to parse QR code data if it's JSON
            let parsedBookingId = bookingId;
            try {
                const qrData = JSON.parse(bookingId);
                if (qrData.bookingId) {
                    parsedBookingId = qrData.bookingId;
                }
            } catch {
                // If not JSON, use as-is
            }

            await checkIn({ bookingId: parsedBookingId as Id<"bookings"> });
            toast.success("Check-in successful! ✅");
            setBookingId("");
        } catch (error: any) {
            toast.error(error.message || "Check-in failed");
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-black tracking-tight">QR Scanner</h1>
                <p className="text-muted-foreground">Scan customer QR codes to check them in</p>
            </div>

            <Card className="glass-premium">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Scan className="h-5 w-5 text-primary" />
                        Check-In Scanner
                    </CardTitle>
                    <CardDescription>
                        Scan the QR code from the customer's booking or enter the booking ID manually
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Booking ID or QR Code Data</label>
                            <Input
                                placeholder="Paste booking ID or scan QR code..."
                                value={bookingId}
                                onChange={(e) => setBookingId(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleCheckIn();
                                    }
                                }}
                                className="font-mono"
                            />
                            <p className="text-xs text-muted-foreground">
                                Press Enter or click the button below to check in
                            </p>
                        </div>

                        <Button
                            onClick={handleCheckIn}
                            disabled={isScanning || !bookingId.trim()}
                            className="w-full h-14 text-lg font-bold gap-2"
                            size="lg"
                        >
                            {isScanning ? (
                                <>
                                    <QrCode className="h-5 w-5 animate-pulse" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-5 w-5" />
                                    Check In Customer
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="border-t border-border/40 pt-6 space-y-4">
                        <h3 className="font-bold text-sm">How to use:</h3>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <div className="flex items-start gap-3">
                                <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                    1
                                </div>
                                <p>Ask the customer to show their QR code from "My Bookings"</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                    2
                                </div>
                                <p>Use a QR scanner app to scan the code, or manually enter the booking ID</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                    3
                                </div>
                                <p>Paste the scanned data or booking ID into the field above</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                    4
                                </div>
                                <p>Click "Check In Customer" to complete the process</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-xl space-y-2">
                        <div className="flex items-center gap-2 text-sm font-bold">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>Valid Check-In</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Customer has a valid booking for today
                        </p>

                        <div className="flex items-center gap-2 text-sm font-bold mt-4">
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span>Invalid Check-In</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Booking not found, already checked in, or cancelled
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
