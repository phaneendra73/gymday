import { ProtectedRoute } from "@/components/web/protected-route";

export default function MyBookingsLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
