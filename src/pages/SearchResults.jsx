import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  SlidersHorizontal, 
  Star, 
  Search,
  ChevronDown,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  X
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { allProducts, featuredProducts } from '../data/products';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  // States for filters & sorting
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [maxPrice, setMaxPrice] = useState(250000);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState(query);

  // Sync search input value with URL query
  useEffect(() => {
    setSearchInputValue(query);
  }, [query]);

  // Handle local form submission in search results page
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInputValue.trim()) {
      setSearchParams({ q: searchInputValue.trim() });
    }
  };

  // Find all matches based on name, brand, or category
  const allMatches = allProducts.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.brand.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  // Get dynamic categories and brands from matching results for filters
  const categories = ['All', ...new Set(allMatches.map(p => p.category))];
  const brands = ['All', ...new Set(allMatches.map(p => p.brand))];
  const highestPrice = allMatches.length > 0 ? Math.max(...allMatches.map(p => p.price)) : 250000;

  // Reset max price when query changes to fit matching items
  useEffect(() => {
    if (allMatches.length > 0) {
      setMaxPrice(highestPrice);
    }
  }, [query, highestPrice]);

  // Apply filtering
  let displayProducts = allMatches.filter(p => {
    const categoryMatch = selectedCategory === 'All' || p.category === selectedCategory;
    const brandMatch = selectedBrand === 'All' || p.brand === selectedBrand;
    const priceMatch = p.price <= maxPrice;
    return categoryMatch && brandMatch && priceMatch;
  });

  // Apply sorting
  if (sortBy === 'price-low-high') {
    displayProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high-low') {
    displayProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating-desc') {
    displayProducts.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'discount-desc') {
    displayProducts.sort((a, b) => b.discount - a.discount);
  }

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    setMaxPrice(highestPrice);
    setSortBy('relevance');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation back and inline search bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-brand-navy font-semibold hover:text-brand-blue transition-colors self-start">
            <ArrowLeft className="w-5 h-5" /> Back to Home
          </Link>
          
          <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full">
            <input 
              type="text" 
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              placeholder="Search again..."
              className="w-full px-4 py-2.5 pl-10 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue bg-white shadow-sm text-sm"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <button 
              type="submit" 
              className="absolute right-2 top-1.5 px-3 py-1 bg-brand-blue text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Heading section */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-3xl font-heading font-extrabold text-brand-navy">
              Search Results
            </h1>
            <p className="text-gray-500 mt-1">
              {allMatches.length > 0 
                ? `Showing ${displayProducts.length} of ${allMatches.length} products matching "${query}"`
                : `No results found for "${query}"`
              }
            </p>
          </div>

          {allMatches.length > 0 && (
            <div className="flex items-center gap-4 self-end sm:self-auto">
              <button 
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>

              {/* Sorting selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 hidden sm:inline">Sort By:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm font-semibold text-brand-navy shadow-sm focus:ring-2 focus:ring-brand-blue focus:border-transparent cursor-pointer"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="rating-desc">Customer Rating</option>
                    <option value="discount-desc">Biggest Discount</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Content */}
        {allMatches.length > 0 ? (
          <div className="flex gap-8 items-start">
            
            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block w-64 flex-shrink-0 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading font-extrabold text-brand-navy flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-brand-blue" /> Filters
                </h3>
                <button 
                  onClick={handleClearFilters}
                  className="text-xs font-bold text-gray-400 hover:text-brand-orange transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                {/* Categories filter */}
                <div>
                  <h4 className="font-semibold text-sm text-brand-navy mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          selectedCategory === cat
                            ? 'bg-brand-navy text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brands filter */}
                <div>
                  <h4 className="font-semibold text-sm text-brand-navy mb-3">Brands</h4>
                  <div className="space-y-2">
                    {brands.map(b => (
                      <button
                        key={b}
                        onClick={() => setSelectedBrand(b)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          selectedBrand === b
                            ? 'bg-brand-navy text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price range filter */}
                {highestPrice > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-sm text-brand-navy">Max Price</h4>
                      <span className="text-xs font-bold font-mono text-brand-blue">₹{maxPrice.toLocaleString()}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max={highestPrice} 
                      value={maxPrice} 
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-brand-blue h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-bold font-mono mt-1">
                      <span>₹0</span>
                      <span>₹{highestPrice.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </aside>

            {/* Product Grid Area */}
            <div className="flex-1">
              {displayProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {displayProducts.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 max-w-lg mx-auto">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No matching filtered products</h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Try broadening your filters or clearing them to see all results matching "{query}".
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="px-6 py-2.5 bg-brand-navy hover:bg-navy-800 text-white rounded-xl text-sm font-bold shadow-md transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

          </div>
        ) : (
          /* Empty State - No search matches found anywhere */
          <div className="mt-8">
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 max-w-2xl mx-auto mb-16">
              <div className="w-20 h-20 rounded-full bg-orange-50 text-brand-orange flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-heading font-extrabold text-brand-navy mb-3">
                No matches found for "{query}"
              </h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                We couldn't find any products, brands, or categories matching your search. Please check your spelling or try search terms like "iPhone", "Nike", "Sofa", or "Jacket".
              </p>

              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 text-left">
                <h4 className="font-heading font-bold text-sm text-brand-navy mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-yellow fill-brand-yellow" /> Helpful Search Tips:
                </h4>
                <ul className="text-xs text-gray-600 space-y-2 list-disc list-inside">
                  <li>Double check spelling and typo errors.</li>
                  <li>Use broader keywords (e.g. search "shoes" instead of "running leather shoes").</li>
                  <li>Try searching by category or brand name.</li>
                </ul>
              </div>
            </div>

            {/* Recommended Products for context */}
            <div>
              <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-3">
                <TrendingUp className="w-5 h-5 text-brand-blue" />
                <h3 className="text-xl font-heading font-extrabold text-brand-navy">
                  Popular Recommendations
                </h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {featuredProducts.slice(0, 4).map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Mobile Filters Drawer Modal */}
      <AnimatePresence>
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-xs">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="bg-white w-full max-w-sm h-full shadow-2xl p-6 flex flex-col overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <h3 className="font-heading font-extrabold text-lg text-brand-navy flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-brand-blue" /> Filters
                </h3>
                <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-brand-navy transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-grow space-y-6">
                {/* Categories filter */}
                <div>
                  <h4 className="font-bold text-sm text-brand-navy mb-3">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                          selectedCategory === cat
                            ? 'bg-brand-navy text-white border-brand-navy shadow-sm'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brands filter */}
                <div>
                  <h4 className="font-bold text-sm text-brand-navy mb-3">Brands</h4>
                  <div className="flex flex-wrap gap-2">
                    {brands.map(b => (
                      <button
                        key={b}
                        onClick={() => setSelectedBrand(b)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                          selectedBrand === b
                            ? 'bg-brand-navy text-white border-brand-navy shadow-sm'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price range filter */}
                {highestPrice > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-sm text-brand-navy">Max Price</h4>
                      <span className="text-xs font-bold font-mono text-brand-blue">₹{maxPrice.toLocaleString()}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max={highestPrice} 
                      value={maxPrice} 
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-brand-blue h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-bold font-mono mt-1">
                      <span>₹0</span>
                      <span>₹{highestPrice.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100 flex gap-4">
                <button
                  onClick={() => {
                    handleClearFilters();
                    setShowMobileFilters(false);
                  }}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-colors shadow-md shadow-brand-blue/20"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
