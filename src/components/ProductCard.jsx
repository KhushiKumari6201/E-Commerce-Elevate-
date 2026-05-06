import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Heart, Star, ShoppingCart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, aiBadge = false }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-4 transition-all duration-300 hover:shadow-3d-hover hover:-translate-y-2 group relative border border-gray-100 h-full flex flex-col">
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.discount > 0 && (
          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
            {product.discount}% OFF
          </span>
        )}
        {aiBadge && (
          <span className="bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> AI Pick
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          setIsWishlisted(!isWishlisted);
        }}
        className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm"
      >
        <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
      </button>

      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative w-full pt-[100%] mb-4 overflow-hidden rounded-xl bg-gray-50">
        <motion.img 
          src={product.image} 
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
        />
      </Link>

      {/* Content */}
      <div className="flex-grow flex flex-col">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center bg-green-100 px-1.5 py-0.5 rounded text-green-700 text-xs font-bold">
            {product.rating} <Star className="w-3 h-3 ml-0.5 fill-current" />
          </div>
          <span className="text-gray-400 text-xs">({product.reviews})</span>
          {product.assured && (
            <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="Assured" className="h-4 ml-auto" />
          )}
        </div>

        {/* Title */}
        <Link to={`/product/${product.id}`} className="block group-hover:text-brand-blue transition-colors">
          <h3 className="font-medium text-brand-navy line-clamp-2 mb-1">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-500 mb-3">{product.brand}</p>

        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl font-bold text-brand-navy font-mono">₹{product.price.toLocaleString()}</span>
            {product.mrp > product.price && (
              <span className="text-sm text-gray-400 line-through font-mono">₹{product.mrp.toLocaleString()}</span>
            )}
          </div>
          
          {/* Add to Cart Button (Slide up on hover) */}
          <div className="overflow-hidden h-10 relative rounded-xl">
            <motion.button 
              initial={{ y: "100%" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className={`absolute inset-0 w-full h-full font-bold flex items-center justify-center gap-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ${isAdded ? 'bg-green-500 text-white' : 'bg-brand-yellow text-brand-navy'}`}
            >
              {isAdded ? (
                <>
                  <Check className="w-5 h-5" /> Added!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </>
              )}
            </motion.button>
            <Link 
              to={`/product/${product.id}`}
              className="absolute inset-0 w-full h-full border border-gray-200 text-brand-navy font-medium flex items-center justify-center group-hover:-translate-y-full transition-transform duration-300 rounded-xl bg-gray-50 hover:bg-gray-100"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
