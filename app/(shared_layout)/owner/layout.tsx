import { ProtectedRoute } from "@/components/web/protected-route";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
