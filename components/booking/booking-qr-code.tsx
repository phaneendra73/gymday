"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

interface BookingQRCodeProps {
    bookingId: string;
    gymName: string;
    bookingDay: string;
    userName?: string;
}

export function BookingQRCode({ bookingId, gymName, bookingDay, userName }: BookingQRCodeProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isGenerating, setIsGenerating] = useState(true);

    useEffect(() => {
        if (!canvasRef.current) return;

        const generateQR = async () => {
            try {
                // Create QR code data with booking information
                const qrData = JSON.stringify({
                    bookingId,
                    gymName,
                    bookingDay,
                    userName: userName || "Guest",
                    timestamp: Date.now(),
                });

                await QRCode.toCanvas(canvasRef.current, qrData, {
                    width: 300,
                    margin: 2,
                    color: {
                        dark: "#000000",
                        light: "#FFFFFF",
                    },
                });

                setIsGenerating(false);
            } catch (error) {
                console.error("Failed to generate QR code:", error);
                setIsGenerating(false);
            }
        };

        generateQR();
    }, [bookingId, gymName, bookingDay, userName]);

    const downloadQR = () => {
        if (!canvasRef.current) return;

        const url = canvasRef.current.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `gym-pass-${bookingId}.png`;
        link.href = url;
        link.click();
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="relative">
                {isGenerating && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
                <canvas
                    ref={canvasRef}
                    className="rounded-lg border-4 border-primary shadow-lg"
                />
            </div>

            <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                    Show this QR code at the gym entrance
                </p>
                <Button onClick={downloadQR} variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download QR Code
                </Button>
            </div>
        </div>
    );
}
