import { Star, CheckCircle } from "lucide-react";

const testimonials = [
  {
    name: "Priya S.",
    role: "CS Student",
    quote: "This app is literally a lifesaver! No cap",
    rating: 5,
    color: "bg-pink-200",
    rotation: "rotate-1",
  },
  {
    name: "Rahul V.",
    role: "Business Major",
    quote: "Finally, someone gets what students need fr fr",
    rating: 5,
    color: "bg-cyan-200",
    rotation: "-rotate-2",
  },
  {
    name: "Ananya P.",
    role: "Engineering",
    quote: "Best decision I made this semester",
    rating: 5,
    color: "bg-yellow-200",
    rotation: "rotate-2",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-orange-100 border-b-8 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="inline-block text-5xl sm:text-6xl font-black mb-4 bg-pink-300 border-6 border-black px-8 py-4 rotate-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            STUDENT LOVE
          </h2>
          <p className="text-xl font-bold mt-8">
            Real talk from real students
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="relative group">
              <div
                className={`${testimonial.color} border-6 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all ${testimonial.rotation} hover:rotate-0`}
              >
                {/* Quote */}
                <div className="bg-white border-4 border-black p-6 mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <p className="font-bold text-lg leading-relaxed">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-black bg-white flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black text-xl">
                      {testimonial.name[0]}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-300 border-3 border-black rounded-full flex items-center justify-center rotate-12">
                      <CheckCircle size={16} className="text-black" />
                    </div>
                  </div>
                  <div>
                    <div className="font-black text-lg">{testimonial.name}</div>
                    <div className="font-bold text-sm">{testimonial.role}</div>
                    <div className="flex gap-1 mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={14} className="fill-black text-black" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {index === 1 && (
                <div className="absolute -top-4 -right-4 bg-lime-300 border-4 border-black px-3 py-1 font-black text-sm rotate-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  BEST!
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
