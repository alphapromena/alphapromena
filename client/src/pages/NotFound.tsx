import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";
import { Footer, Grain, Navbar } from "@/components/ui-v4";

export default function NotFound() {
  const [, setLocation] = useLocation();


  return (
    <div className="v4 flex min-h-screen flex-col">
      <Grain />
      <Navbar />

      <main id="main" className="flex flex-1 items-center px-6 py-40 lg:px-10">
        <div className="mx-auto w-full max-w-[1300px]">
          <p className="v4-eyebrow">Record not found</p>
          <h1 className="v4-display mt-6" style={{ fontSize: "clamp(4rem, 16vw, 12rem)" }}>
            4<span className="v4-rose">0</span>4
          </h1>
          <p className="v4-lead mt-6">
            This page does not exist. It may have been moved or deleted.
          </p>
          <button className="v4-pill mt-10" onClick={() => setLocation("/")}>
            Back to the home page <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
