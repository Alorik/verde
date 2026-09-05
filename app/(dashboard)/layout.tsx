import FooterSection from "@/components/dashboard/Footer";
import Navbar from "@/components/layout/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="">{children}</main>
      <FooterSection />
    </>
  );
}
