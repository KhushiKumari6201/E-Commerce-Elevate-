import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: 'Next-Gen Audio Experience',
    subtitle: 'Sony WH-1000XM5',
    discount: 'Up to 40% OFF',
    image: '/hero.png', // The generated one
    color: 'from-[#0A0F2E] to-[#1a237e]',
    item: '/headphone.png'
  },
  {
    id: 2,
    title: 'Step Into The Future',
    subtitle: 'Nike Air Max Pro',
    discount: 'Flat 50% OFF',
    image: '/hero.png',
    color: 'from-[#FB641B] to-[#e65100]',
    item: '/shoes.png'
  }
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ h: 12, m: 45, s: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
        return { h: 24, m: 0, s: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden group perspective-1000">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className={`absolute inset-0 bg-gradient-to-r ${slides[current].color}`}
        >
          {/* Background Image with Parallax */}
          <motion.div 
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 opacity-40 mix-blend-overlay"
            style={{ 
              backgroundImage: `url(${slides[current].image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />

          <div className="max-w-7xl mx-auto px-4 h-full flex items-center relative z-10">
            <div className="w-full md:w-1/2 text-white">
              <motion.span 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-3 py-1 bg-brand-yellow text-brand-navy font-bold rounded-full text-sm mb-4"
              >
                {slides[current].discount}
              </motion.span>
              
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl font-heading font-extrabold mb-2 leading-tight"
              >
                {slides[current].title}
              </motion.h1>
              
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-white/80 mb-8"
              >
                {slides[current].subtitle}
              </motion.p>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4"
              >
                <button className="bg-white text-brand-navy px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-3d-hover">
                  Shop Now
                </button>
                
                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                  <span className="text-sm text-white/80">Ends in</span>
                  <div className="flex gap-1 font-mono font-bold text-brand-yellow">
                    <span>{String(timeLeft.h).padStart(2, '0')}</span>:
                    <span>{String(timeLeft.m).padStart(2, '0')}</span>:
                    <span>{String(timeLeft.s).padStart(2, '0')}</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* 3D Floating Product Image */}
            <div className="hidden md:flex w-1/2 h-full items-center justify-center relative preserve-3d">
              <motion.img 
                key={`img-${current}`}
                initial={{ x: 100, opacity: 0, rotateY: -30 }}
                animate={{ 
                  x: 0, 
                  opacity: 1, 
                  rotateY: 0,
                  y: [0, -20, 0] // floating effect
                }}
                transition={{ 
                  x: { type: "spring", stiffness: 100, damping: 20 },
                  opacity: { duration: 0.8 },
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
                src={slides[current].item}
                alt="Product"
                className="max-h-[80%] object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] translate-z-20"
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <button 
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      
      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button 
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              current === i ? 'bg-white w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
