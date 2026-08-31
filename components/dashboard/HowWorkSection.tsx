export default function HowWeWorkSection() {
  const steps = [
    {
      number: "01",
      title: "Upload your data",
      description:
        "Add your ESG documents to an assessment. Electricity bills, water reports, employee data, CSR documents, and more.",
    },
    {
      number: "02",
      title: "We extract the metrics",
      description:
        "Relevant sustainability data is extracted from your documents and organized into structured ESG metrics.",
    },
    {
      number: "03",
      title: "Calculate your ESG score",
      description:
        "Your environmental, social, and governance performance is evaluated to produce an overall ESG score.",
    },
    {
      number: "04",
      title: "Get your report",
      description:
        "Review your ESG performance through a structured report with clear insights and actionable recommendations.",
    },
  ];

  return (
    <section className="min-h-screen border-zinc-300 border-x bg-white">
      {/* Sticky label bar — the only sticky element in this section */}
      <p className="sticky top-16 z-10 border-b border-emerald-700/30 bg-white px-8 py-3 text-xs uppercase tracking-[0.2em] text-zinc-900 font-medium">
        How we work
      </p>

      <div className="mx-auto px-8 py-16">
        {/* Header — normal flow, scrolls away like the rest of the content */}
        <div className="max-w-2xl">
          <h2 className="text-5xl font-medium tracking-tight text-zinc-900">
            From raw data
            <br />
            to ESG insight.
          </h2>

          <p className="mt-6 max-w-xl text-sm leading-6 text-zinc-500">
            Turn your sustainability documents into structured ESG data,
            measurable performance, and recommendations for improvement.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid border-t border-zinc-200 md:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="border-b border-zinc-200 py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0"
            >
              <p className="text-xs text-zinc-400">{step.number}</p>

              <h3 className="mt-8 text-lg font-medium tracking-tight text-zinc-900">
                {step.title}
              </h3>

              <p className="mt-4 text-sm leading-6 text-zinc-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
