import HeroSection from "@/components/dashboard/Hero";
import BubblePage from "../../../components/buble/bublePage";
import FooterSection from "@/components/dashboard/Footer";
import HowWeWorkSection from "@/components/dashboard/HowWorkSection";
import WhyUsSection from "@/components/dashboard/WhyUs";
import FAQSection from "@/components/dashboard/FAQSection";
import Flowgraph from "@/components/FlowGraph";

export default function Dashboard() {
  return (
    <div className="px-12 border-x border-emerald-700/30">
      <div className="relative overflow-hidden  h-[850px] border-x border-emerald-700/30">
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
