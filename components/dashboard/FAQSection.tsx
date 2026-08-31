"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

export default function FAQSection() {
  const faqs = [
    {
      question: "What is an ESG assessment?",
      answer:
        "An ESG assessment evaluates your organization's environmental, social, and governance performance using the sustainability data you provide.",
    },
    {
      question: "What documents can I upload?",
      answer:
        "You can upload documents such as electricity bills, water reports, employee data, CSR reports, and sustainability reports to an assessment.",
    },
    {
      question: "How is the ESG score calculated?",
      answer:
        "The platform extracts relevant metrics from your documents and evaluates your environmental, social, and governance performance to produce an overall ESG score.",
    },
    {
      question: "What happens to my uploaded documents?",
      answer:
        "Your documents are associated with the assessment you upload them to and are used to extract the relevant sustainability metrics for your ESG analysis.",
    },
    {
      question: "Can I create multiple assessments?",
      answer:
        "Yes. You can create separate assessments for different reporting years or reporting periods and upload the relevant documents to each one.",
    },
    {
      question: "Will I get recommendations along with my score?",
      answer:
        "Yes. The platform provides actionable recommendations based on the areas of your ESG performance that can be improved.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="border-t border-zinc-300 border-x bg-white">
      {/* Sticky Section Label */}
      <p className="sticky top-16 z-10 border-b border-zinc-200 bg-white px-8 py-3 text-xs uppercase tracking-[0.2em] text-zinc-400">
        FAQ
      </p>

      <div className="max-w-2xl px-8 pt-12">
        <h2 className="text-6xl font-medium tracking-tight text-zinc-900">
          Questions,
          <br />
          answered clearly.
        </h2>
      </div>
      <div className="mx-auto flex flex-col items-center px-8 py-2">
        {/* Header — centered */}

        {/* FAQ — centered as a block */}
        <div className="mt-24 w-full max-w-3xl border-t border-zinc-200">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className="border-b border-zinc-200 last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className={`flex w-full cursor-pointer items-center justify-between gap-8 rounded-md px-4 py-6 text-left transition-colors duration-300 ease-out ${
                    isOpen ? "bg-emerald-50" : "hover:bg-zinc-50"
                  }`}
                >
                  <span
                    className={`text-base font-medium tracking-tight transition-colors duration-300 ${
                      isOpen ? "text-emerald-700" : "text-zinc-900"
                    }`}
                  >
                    {faq.question}
                  </span>

                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className={`shrink-0 ${
                      isOpen ? "text-emerald-600" : "text-zinc-400"
                    }`}
                  >
                    <Plus className="h-5 w-5" strokeWidth={1.75} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { type: "spring", stiffness: 280, damping: 32 },
                        opacity: { duration: 0.2 },
                      }}
                      className="overflow-hidden bg-emerald-50"
                    >
                      <p className="px-4 pb-6 pr-12 text-sm leading-6 text-zinc-600">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
