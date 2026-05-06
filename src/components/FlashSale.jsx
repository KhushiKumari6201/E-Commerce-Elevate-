import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Timer, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { flashProducts } from '../data/products';

export default function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({ h: 5, m: 23, s: 45 });

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

  return (
    <section className="py-8 bg-gradient-to-b from-[#fdf2f2] to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div className="flex items-center gap-6">
            <div>
              <h2 className="text-3xl font-heading font-extrabold text-brand-navy mb-1 flex items-center gap-2">
                Deal of the Day <span className="text-xl">⚡</span>
              </h2>
              <p className="text-gray-500 text-sm">Grab them before they are gone!</p>
            </div>
            
            <div className="hidden md:flex items-center gap-2 bg-red-100 px-4 py-2 rounded-lg">
              <Timer className="w-5 h-5 text-red-600" />
              <div className="flex gap-1 font-mono font-bold text-red-600 text-lg">
                <span>{String(timeLeft.h).padStart(2, '0')}</span>:
                <span>{String(timeLeft.m).padStart(2, '0')}</span>:
                <span>{String(timeLeft.s).padStart(2, '0')}</span>
              </div>
              <span className="text-red-500 text-sm ml-1 font-sans font-medium uppercase tracking-wider">Left</span>
            </div>
          </div>
          
          <Link to="/deals" className="flex items-center gap-1 text-brand-blue font-bold hover:text-blue-700 transition-colors bg-blue-50 px-4 py-2 rounded-lg w-fit">
            View All Offers <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Timer */}
        <div className="md:hidden flex items-center gap-2 bg-red-100 px-4 py-2 rounded-lg mb-6 w-fit">
          <Timer className="w-4 h-4 text-red-600" />
          <div className="flex gap-1 font-mono font-bold text-red-600">
            <span>{String(timeLeft.h).padStart(2, '0')}</span>:
            <span>{String(timeLeft.m).padStart(2, '0')}</span>:
            <span>{String(timeLeft.s).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Products Scroll */}
        <div className="flex overflow-x-auto gap-4 md:gap-6 pb-6 hide-scrollbar snap-x">
          {flashProducts.map((product) => (
            <div key={product.id} className="min-w-[240px] md:min-w-[280px] snap-start flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
