"use client"
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How does this even work?",
    answer:
      "Super simple! Browse services, pick what you need, book it. We connect you with verified campus providers. That's it, no complicated stuff.",
    color: "bg-cyan-200",
    rotation: "rotate-1",
  },
  {
    question: "Is it actually safe tho?",
    answer:
      "100%! Every provider is verified by campus admin. We run background checks and only work with trusted peeps. Your safety = our priority.",
    color: "bg-pink-200",
    rotation: "-rotate-1",
  },
  {
    question: "What about payment?",
    answer:
      "Multiple options! Cash, UPI, cards - whatever works for you. Payments are secure and you only pay after the service. No shady business here.",
    color: "bg-yellow-200",
    rotation: "rotate-1",
  },
  {
    question: "Can I cancel if plans change?",
    answer:
      "Yep! Cancel anytime before the service starts. No questions asked. We get it, student life is unpredictable.",
    color: "bg-lime-200",
    rotation: "-rotate-1",
  },
  {
    question: "How fast is 'fast'?",
    answer:
      "Most services are same-day or next-day. Laundry? 24hrs. Tech repair? Depends on the issue. We'll always give you a realistic timeline upfront.",
    color: "bg-purple-200",
    rotation: "rotate-1",
  },
  {
    question: "Do you have student discounts?",
    answer:
      "Absolutely! All our prices are student-friendly. Plus, we run special deals every month. Follow us to stay updated on the latest offers.",
    color: "bg-orange-200",
    rotation: "-rotate-1",
  },
];

function FAQItem({ faq }: { faq: (typeof faqs)[0] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`${faq.color} border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden ${faq.rotation} hover:rotate-0 transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex items-center justify-between gap-4 font-black text-lg"
      >
        <span>{faq.question}</span>
        <div className="shrink-0 w-10 h-10 bg-black border-2 border-black flex items-center justify-center">
          {isOpen ? (
            <Minus className="text-white" size={20} />
          ) : (
            <Plus className="text-white" size={20} />
          )}
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6">
          <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-bold text-base leading-relaxed">{faq.answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <section className="py-24 bg-linear-to-br from-blue-100 to-purple-100 border-b-8 border-black relative overflow-hidden">
      {/* Decorative stickers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 bg-yellow-300 border-4 border-black px-4 py-2 font-black text-sm rotate-12 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          FAQ!
        </div>
        <div className="absolute bottom-20 left-10 bg-pink-400 border-4 border-black px-4 py-2 font-black text-sm -rotate-12 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          ANSWERS!
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="inline-block text-5xl sm:text-6xl font-black mb-4 bg-white border-6 border-black px-8 py-4 -rotate-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            GOT QUESTIONS?
          </h2>
          <p className="text-xl font-bold mt-8">
            We got answers! Check these out
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} />
          ))}
        </div>

        {/* Still have questions CTA */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-gradient-linear-to-r from-pink-300 to-orange-300 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-1">
            <p className="font-black text-xl mb-4">Still got questions?</p>
            <a
              href="#"
              className="inline-block bg-black text-white px-6 py-3 font-black border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] transition-all active:translate-y-0.5"
            >
              HIT US UP
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
