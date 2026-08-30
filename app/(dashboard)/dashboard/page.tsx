import HeroSection from "@/components/dashboard/Hero";
import BubblePage from "../../../components/buble/bublePage";

export default function Dashboard() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <BubblePage />

      {/* Hero content */}
      <HeroSection />
    </div>
  );
}
