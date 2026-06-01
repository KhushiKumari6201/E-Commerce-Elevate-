import { motion } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Wishlist() {
  const { wishlistItems } = useWishlist();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-brand-navy font-medium mb-6 hover:text-brand-blue transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-extrabold text-brand-navy">
            My Wishlist
          </h1>
          <p className="text-gray-500 mt-2">
            {wishlistItems.length === 0 
              ? 'No items saved' 
              : `Showing ${wishlistItems.length} saved item${wishlistItems.length > 1 ? 's' : ''}`
            }
          </p>
        </div>

        {/* Wishlist Content */}
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {wishlistItems.map((product, i) => (
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
          <div className="bg-white rounded-2xl p-12 shadow-sm text-center border border-gray-100 max-w-lg mx-auto">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-rose-500 stroke-[1.5]" />
            </div>
            <h2 className="text-xl font-bold text-brand-navy mb-2">Your wishlist is empty!</h2>
            <p className="text-gray-500 mb-6">Explore our products and tap the heart icon to save things you love.</p>
            <Link 
              to="/" 
              className="bg-brand-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors inline-block"
            >
              Discover Products
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}
