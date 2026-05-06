import { motion } from 'framer-motion';

const brands = [
  "Apple", "Samsung", "Sony", "Nike", "Adidas", "Puma", "Levi's", "boAt", "Dell", "HP", "Asus"
];

export default function BrandShowcase() {
  return (
    <section className="py-10 bg-white border-y border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <h3 className="text-xl font-heading font-bold text-gray-400 text-center uppercase tracking-widest">
          Trusted by Top Brands
        </h3>
      </div>
      
      {/* Marquee effect */}
      <div className="relative flex overflow-x-hidden">
        {/* Left Gradient */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
          className="flex whitespace-nowrap items-center gap-16 px-8"
        >
          {/* Double the array for seamless looping */}
          {[...brands, ...brands].map((brand, i) => (
            <div 
              key={i} 
              className="text-3xl font-heading font-bold text-gray-300 hover:text-brand-blue transition-colors cursor-pointer select-none"
            >
              {brand}
            </div>
          ))}
        </motion.div>
        
        {/* Right Gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
      </div>
    </section>
  );
}
