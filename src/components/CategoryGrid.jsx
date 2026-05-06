import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Smartphone, Shirt, ShoppingBasket, Home as HomeIcon, Sparkles, ToyBrick, Dumbbell, MonitorPlay, BookOpen } from 'lucide-react';

const categories = [
  { name: 'Electronics', icon: Smartphone, color: 'bg-blue-100 text-blue-600' },
  { name: 'Fashion', icon: Shirt, color: 'bg-pink-100 text-pink-600' },
  { name: 'Grocery', icon: ShoppingBasket, color: 'bg-green-100 text-green-600' },
  { name: 'Home', icon: HomeIcon, color: 'bg-orange-100 text-orange-600' },
  { name: 'Beauty', icon: Sparkles, color: 'bg-purple-100 text-purple-600' },
  { name: 'Toys', icon: ToyBrick, color: 'bg-red-100 text-red-600' },
  { name: 'Sports', icon: Dumbbell, color: 'bg-yellow-100 text-yellow-600' },
  { name: 'Appliances', icon: MonitorPlay, color: 'bg-teal-100 text-teal-600' },
  { name: 'Books', icon: BookOpen, color: 'bg-indigo-100 text-indigo-600' },
];

export default function CategoryGrid() {
  return (
    <section className="py-8 bg-white shadow-sm mb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center overflow-x-auto hide-scrollbar gap-6 pb-4">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Link to={`/category/${cat.name.toLowerCase()}`} key={cat.name}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="flex flex-col items-center gap-3 cursor-pointer min-w-[80px] group perspective-1000"
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${cat.color} transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] group-hover:rotate-y-12 preserve-3d`}>
                    <Icon className="w-8 h-8 translate-z-10" />
                  </div>
                  <span className="font-medium text-sm text-gray-700 group-hover:text-brand-blue transition-colors text-center">
                    {cat.name}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
