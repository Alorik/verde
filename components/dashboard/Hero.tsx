
export default function HeroSection() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-25 z-10 flex justify-center pt-28">
      <div className="max-w-4xl px-6 text-center">
        <h1 className="pointer-events-auto inline-block mt-5 text-2xl tracking-tight text-zinc-900 md:text-6xl font-medium leading-[1.1] bg-white">
          Turn your sustainability <br /> data into a clear <br /> ESG report.
        </h1>

        <p className="pointer-events-auto inline-block my-8 max-w-2xl bg-white">
          Upload your ESG data, track key sustainability metrics, and <br />{" "}
          generate a clear report with actionable insights.
        </p>

        <div className="pointer-events-auto flex justify-center items-center gap-12">
          <button className="border-2 px-8 py-3 text-white bg-emerald-800 hover:bg-emerald-700 transition-all duration-200">
            Overview
          </button>

          <button className="border bg-white border-gray-400/70 px-6 py-3 hover:border-gray-800 transition-all duration-200">
            How we work
          </button>
        </div>
      </div>
    </div>
  );
}