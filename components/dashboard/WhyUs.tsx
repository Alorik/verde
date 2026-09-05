export default function WhyUsSection() {
  const reasons = [
    {
      number: "01",
      title: "Built around your data",
      description:
        "Your ESG assessment starts with the data you already have. Upload your documents and let the platform organize the relevant information.",
    },
    {
      number: "02",
      title: "From documents to metrics",
      description:
        "Instead of manually going through every report, relevant sustainability metrics are extracted and structured for your assessment.",
    },
    {
      number: "03",
      title: "One clear ESG score",
      description:
        "Environmental, social, and governance metrics come together to give you a clear view of your organization's overall ESG performance.",
    },
    {
      number: "04",
      title: "Know what to improve",
      description:
        "Go beyond a score. Get clear insights and recommendations that help identify areas where your organization can improve.",
    },
  ];

  return (
    <section className="border-x border-emerald-700/30 bg-white">
      {/* Sticky label */}
      <p className="sticky top-16 z-10 border-b border-emerald-700/30 bg-white px-4 py-3 text-xs font-medium uppercase tracking-[0.2em] text-zinc-900 sm:px-6 md:px-8">
        Why Us?
      </p>

      <div className="mx-auto px-4 py-12 sm:px-6 sm:py-14 md:px-8 md:py-16">
        {/* Header */}
        <div className="max-w-2xl">
          <h2 className="text-4xl font-medium tracking-tight text-zinc-900 sm:text-5xl">
            ESG reporting
            <br />
            without the complexity.
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-6 text-zinc-500 sm:mt-6">
            We turn scattered sustainability data into structured metrics,
            meaningful insights, and a clear path toward better ESG performance.
          </p>
        </div>

        {/* Reasons */}
        <div className="mt-16 grid border-t border-emerald-700/30 sm:mt-20 md:mt-24 md:grid-cols-4">
          {reasons.map((reason, index) => (
            <div
              key={reason.number}
              className={[
                "border-emerald-700/30 py-7 sm:py-8",
                "md:border-r md:px-6 lg:px-8",
                "md:first:pl-0 md:last:border-r-0",
                index > 0 ? "border-t md:border-t-0" : "",
              ].join(" ")}
            >
              <p className="text-xs text-zinc-400">{reason.number}</p>

              <h3 className="mt-6 text-lg font-medium tracking-tight text-zinc-900 sm:mt-8">
                {reason.title}
              </h3>

              <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500 sm:mt-4">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
