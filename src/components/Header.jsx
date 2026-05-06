import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Mic, Camera, User, Heart, Menu, ChevronDown, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-3d py-2' : 'bg-brand-navy py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 sm:gap-8">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xl ${
                isScrolled ? 'bg-brand-blue text-white' : 'bg-brand-yellow text-brand-navy'
              }`}
            >
              E
            </motion.div>
            <span className={`font-heading font-bold text-2xl tracking-tight hidden sm:block ${
              isScrolled ? 'text-brand-navy' : 'text-white'
            }`}>
              Elevate
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl relative group">
            <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none`}>
              <Search className={`h-5 w-5 ${isScrolled ? 'text-gray-400' : 'text-brand-navy/60'}`} />
            </div>
            <input
              type="text"
              className={`block w-full pl-10 pr-14 py-2.5 rounded-xl border-0 focus:ring-2 focus:ring-brand-blue transition-all duration-300 ${
                isScrolled 
                  ? 'bg-gray-100 text-gray-900 placeholder-gray-500' 
                  : 'bg-white/95 text-brand-navy placeholder-brand-navy/50 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
              }`}
              placeholder="Search for products, brands and more"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
              <button className={`p-1 rounded-md hover:bg-gray-200 transition-colors ${isScrolled ? 'text-gray-500' : 'text-brand-navy/70'}`}>
                <Mic className="h-4 w-4" />
              </button>
              <button className={`p-1 rounded-md hover:bg-gray-200 transition-colors ${isScrolled ? 'text-gray-500' : 'text-brand-navy/70'}`}>
                <Camera className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right Nav */}
          <div className="flex items-center gap-2 sm:gap-6">
            <button 
              className={`hidden md:flex items-center gap-1 font-medium text-sm px-3 py-2 rounded-lg transition-colors ${
                isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
            >
              <User className="h-5 w-5" />
              <span>Login</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            <Link 
              to="/cart"
              className={`relative p-2 flex items-center gap-1 rounded-lg transition-colors ${
                isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="hidden sm:block font-medium text-sm">Cart</span>
              {cartCount > 0 && (
                <motion.span 
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 sm:right-auto sm:left-6 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-yellow text-[10px] font-bold text-brand-navy shadow-sm"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            <button 
              className={`hidden lg:flex items-center gap-1 font-medium text-sm px-4 py-2 rounded-lg transition-all ${
                isScrolled 
                  ? 'border border-gray-200 text-gray-700 hover:bg-gray-50' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Become a Seller
            </button>
          </div>
        </div>

        {/* Category Nav - Only show on desktop when scrolled, or as sub-header */}
        <AnimatePresence>
          {!isScrolled && (
            <motion.nav 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="hidden lg:flex items-center justify-between pt-4 pb-1"
            >
              {['Electronics', 'Fashion', 'Home & Furniture', 'Appliances', 'Beauty, Toys & More', 'Mobiles'].map((cat, i) => (
                <div 
                  key={cat}
                  className="relative group"
                  onMouseEnter={() => setShowMegaMenu(i)}
                  onMouseLeave={() => setShowMegaMenu(null)}
                >
                  <button className="flex items-center gap-1 text-white/90 hover:text-white font-medium text-sm py-2">
                    {cat}
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  
                  {/* Simple Mega Menu Dropdown */}
                  {showMegaMenu === i && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-3d-hover py-2 z-50 text-brand-navy"
                    >
                      {['View All', 'Trending', 'New Arrivals'].map(item => (
                        <a href="#" key={item} className="block px-4 py-2 text-sm hover:bg-gray-50 hover:text-brand-blue transition-colors">
                          {item}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
