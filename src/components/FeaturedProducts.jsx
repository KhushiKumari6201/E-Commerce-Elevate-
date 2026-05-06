import { useState } from 'react';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'];

import { featuredProducts as allProducts } from '../data/products';

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(false);

  const filteredProducts = activeTab === 'All' 
    ? allProducts 
    : allProducts.filter(p => p.category === activeTab);

  const handleTabChange = (tab) => {
    setLoading(true);
    setActiveTab(tab);
    setTimeout(() => setLoading(false), 500); // simulate network request
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-extrabold text-brand-navy mb-4">
            Recommended For You
          </h2>
          
          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleTabChange(cat)}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeTab === cat 
                    ? 'bg-brand-navy text-white shadow-md' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-blue hover:text-brand-blue'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {loading ? (
            // Skeleton Loader
            Array(8).fill(0).map((_, i) => (
              <div key={`skel-${i}`} className="bg-white rounded-2xl p-4 border border-gray-100 h-[380px] animate-pulse flex flex-col">
                <div className="w-full pt-[100%] bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="mt-auto h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))
          ) : (
            filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <ProductCard product={product} aiBadge={i < 2 && activeTab === 'All'} />
              </motion.div>
            ))
          )}
        </div>

        <div className="mt-10 text-center">
          <button className="bg-white border-2 border-brand-navy text-brand-navy font-bold px-8 py-3 rounded-xl hover:bg-brand-navy hover:text-white transition-colors">
            Load More Products
          </button>
        </div>
      </div>
    </section>
  );
}
