import { ProtectedRoute } from "@/components/web/protected-route";

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
