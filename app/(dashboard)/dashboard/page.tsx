import HeroSection from "@/components/dashboard/Hero";
import BubblePage from "../../../components/buble/bublePage";
import FooterSection from "@/components/dashboard/Footer";


export default function Dashboard() {
  return (
    <div className=" overflow-hidden px-12 ">
      <div className="border-x border-zinc-300 h-[850px] ">
        {/* Background */}
        <BubblePage />
        {/* Hero content */}
        <HeroSection />
      </div>
      {/* footer */}
      <FooterSection />
    </div>
  );
}
