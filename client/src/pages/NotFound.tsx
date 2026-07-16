import { useLocation } from "wouter";
import { Button, Eyebrow, LineageNode } from "@/components/ui-v2";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ background: "var(--ink-950)" }}>
      <div className="v2-container max-w-xl text-center flex flex-col items-center py-24">
        <LineageNode />
        <Eyebrow className="mt-6" index="RECORD">Not found</Eyebrow>
        <h1 className="v2-display mt-5">404</h1>
        <p className="v2-body mt-4" style={{ maxWidth: "36ch" }}>
          This page does not exist. It may have been moved or deleted.
        </p>
        <div className="mt-8">
          <Button variant="brass" onClick={() => setLocation("/")}>Back to the home page</Button>
        </div>
      </div>
    </div>
  );
}
