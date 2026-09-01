import HeroSection from "@/components/dashboard/Hero";
import BubblePage from "../../../components/buble/bublePage";
import FooterSection from "@/components/dashboard/Footer";
import HowWeWorkSection from "@/components/dashboard/HowWorkSection";
import WhyUsSection from "@/components/dashboard/WhyUs";
import FAQSection from "@/components/dashboard/FAQSection";

export default function Dashboard() {
  return (
    <div className="px-12">
      <div className="mx-12 relative overflow-hidden border-x border-zinc-300 h-[850px]">
        {/* Background */}
        <BubblePage />
        {/* Hero content */}
        <HeroSection />
      </div>
      <HowWeWorkSection />
      <WhyUsSection />
      <FAQSection />
      {/* footer */}
      <FooterSection />
    </div>
  );
}
