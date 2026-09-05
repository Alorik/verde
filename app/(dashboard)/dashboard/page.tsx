import HeroSection from "@/components/dashboard/Hero";
import BubblePage from "../../../components/buble/bublePage";
import FooterSection from "@/components/dashboard/Footer";
import HowWeWorkSection from "@/components/dashboard/HowWorkSection";
import WhyUsSection from "@/components/dashboard/WhyUs";
import FAQSection from "@/components/dashboard/FAQSection";

export default function Dashboard() {
  return (
    <div className="border-x border-emerald-700/30 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="relative h-[700px] overflow-hidden border-x border-emerald-700/30 sm:h-[750px] md:h-[800px] lg:h-[850px]">
        {/* Background */}
        <BubblePage />

        {/* Hero content */}
        <HeroSection />
      </div>

      <HowWeWorkSection />
      <WhyUsSection />
      <FAQSection />

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
