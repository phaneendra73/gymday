"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

interface GymMapProps {
    lat: number;
    lng: number;
    name: string;
    zoom?: number;
}

export function GymMap({ lat, lng, name, zoom = 15 }: GymMapProps) {
    useEffect(() => {
        // Fix for default marker icon in Next.js
        delete (Icon.Default.prototype as any)._getIconUrl;
        Icon.Default.mergeOptions({
            iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });
    }, []);

    return (
        <MapContainer
            center={[lat, lng]}
            zoom={zoom}
            scrollWheelZoom={false}
            className="h-full w-full rounded-xl z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[lat, lng]}>
                <Popup>{name}</Popup>
            </Marker>
        </MapContainer>
    );
}
