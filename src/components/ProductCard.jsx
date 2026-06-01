import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Heart, Star, ShoppingCart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ColorVariantPicker from './ColorVariantPicker';

export default function ProductCard({ product, aiBadge = false }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();

  // Initialize active color with the first available color, or the first color in the list, or null
  const [activeColor, setActiveColor] = useState(() => {
    if (product.colors && product.colors.length > 1) {
      return product.colors.find(c => c.isAvailable !== false) || product.colors[0];
    }
    return null;
  });

  const [activeImage, setActiveImage] = useState(activeColor?.image || product.image);

  const handleColorSelect = (color) => {
    if (color.isAvailable === false) return;
    setActiveColor(color);
    if (color.image) {
      setActiveImage(color.image);
    }
  };

  const hasColors = product.colors && product.colors.length > 0;
  const isOutOfStock = hasColors && product.colors.every(c => c.isAvailable === false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addToCart(product, 1, activeColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const detailsUrl = activeColor 
    ? `/product/${product.id}?color=${encodeURIComponent(activeColor.name)}`
    : `/product/${product.id}`;

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
          toggleWishlist(product);
        }}
        className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm"
      >
        <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
      </button>

      {/* Image */}
      <Link to={detailsUrl} className="block relative w-full pt-[100%] mb-4 overflow-hidden rounded-xl bg-gray-50">
        <motion.img 
          key={activeImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          src={activeImage} 
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
        <Link to={detailsUrl} className="block group-hover:text-brand-blue transition-colors">
          <h3 className="font-medium text-brand-navy line-clamp-2 mb-1">
            {product.name}
          </h3>
        </Link>
        
        {/* Brand & Selected Color Label */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="text-sm text-gray-500">{product.brand}</p>
          {activeColor && (
            <span className="text-[10px] text-gray-400 font-bold tracking-wide bg-gray-100 px-1.5 py-0.5 rounded truncate max-w-[100px]" title={activeColor.name}>
              {activeColor.name}
            </span>
          )}
        </div>

        {/* Color swatches */}
        {product.colors && product.colors.length > 1 && (
          <div className="mb-3">
            <ColorVariantPicker
              colors={product.colors}
              selectedColor={activeColor}
              onColorSelect={handleColorSelect}
              size="sm"
            />
          </div>
        )}

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
              whileHover={!isOutOfStock ? { scale: 1.02 } : {}}
              whileTap={!isOutOfStock ? { scale: 0.98 } : {}}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`absolute inset-0 w-full h-full font-bold flex items-center justify-center gap-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ${
                isOutOfStock 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : isAdded 
                    ? 'bg-green-500 text-white' 
                    : 'bg-brand-yellow text-brand-navy'
              }`}
            >
              {isOutOfStock ? (
                <>Out of Stock</>
              ) : isAdded ? (
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
              to={detailsUrl}
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
