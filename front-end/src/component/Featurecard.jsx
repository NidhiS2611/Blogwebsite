import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: 'Ultimate Guide to Acing Your Exams',
    excerpt: 'Master effective study techniques and ace your final exams with proven strategies.',
    category: 'Study Tips',
    image: 'https://images.unsplash.com/photo-1456325955601-cffa82d50f0a?w=1200&h=400&fit=crop',
    tag: '📚 Featured',
  },
  {
    id: 2,
    title: 'Career Path Planning for Tech Students',
    excerpt: 'Navigate your career in tech with insights on different roles and how to land them.',
    category: 'Career',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop',
    tag: '💼 Popular',
  },
  {
    id: 3,
    title: 'Productivity Hacks Every Student Needs',
    excerpt: 'Learn time management tricks that will transform your academic performance.',
    category: 'Life Hacks',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&h=400&fit=crop',
    tag: '⚡ Trending',
  },
];

export default function Featuredcard() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index) => setCurrent(index);

  const slide = slides[current];

  return (
    <div className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden group">
      {/* Slide Image */}
      <img
        src={slide.image}
        alt={slide.title}
        className="w-full h-full object-cover smooth-transition"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 smooth-transition" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 text-white">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
              {slide.category}
            </span>
            <span className="px-3 py-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full text-sm font-semibold">
              {slide.tag}
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight font-display">
            {slide.title}
          </h2>
          <p className="text-gray-100 text-lg max-w-2xl">{slide.excerpt}</p>
          <button className="btn-primary w-fit">Read Article →</button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prev}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-2 rounded-full smooth-transition opacity-0 group-hover:opacity-100 z-10"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-2 rounded-full smooth-transition opacity-0 group-hover:opacity-100 z-10"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dot Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full smooth-transition ${
              index === current
                ? 'bg-white w-8 h-2'
                : 'bg-white/50 w-2 h-2 hover:bg-white/75'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
