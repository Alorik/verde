import BubblePage from "../../../components/buble/bublePage";

export default function Dashboard() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <BubblePage />

      {/* Hero content */}
      <div className="absolute inset-x-0 top-0 z-10 flex justify-center pt-28">
        <div className="max-w-4xl px-6 text-center">
          <p className="text-6xl font-medium uppercase tracking-tight text-zinc-900">
            ESG REPORTING PLATFORM
          </p>

          <h1 className="mt-5 text-2xl tracking-tight text-zinc-900 md:text-2xl">
            Turn your sustainability data into a clear ESG report.
          </h1>
          <p>
            Upload your environmental, social, and governance data. We extract
            the relevant metrics, calculate your ESG score, and turn your data
            into a structured report with actionable recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}
