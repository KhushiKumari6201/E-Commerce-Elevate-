import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Shield, Truck, RotateCcw, Heart, Share2, ShoppingCart, Zap } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { allProducts } from '../data/products';

export default function ProductDetail() {
  const { id } = useParams();
  const product = allProducts.find(p => p.id === id) || allProducts[0];
  const [activeImage, setActiveImage] = useState(product?.image || '/headphone.png');
  const [activeColor, setActiveColor] = useState(product?.colors?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      setActiveColor(product.colors?.[0] || null);
    }
  }, [product]);

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-500 mb-6">
          <ol className="flex items-center space-x-2">
            <li><Link to="/" className="hover:text-brand-blue">Home</Link></li>
            <li>/</li>
            <li><Link to="#" className="hover:text-brand-blue">{product.category}</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Column - Images */}
          <div className="md:w-5/12 p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-100">
            <div className="relative group cursor-crosshair">
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                <button className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-gray-400 hover:text-brand-blue transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
              <motion.img 
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={activeImage} 
                alt="Product" 
                className="w-full h-[400px] object-contain mix-blend-multiply group-hover:scale-125 transition-transform duration-500"
              />
            </div>
            
            <div className="flex gap-4 mt-6 overflow-x-auto hide-scrollbar">
              {[product.image, '/headphone.png', '/shoes.png', '/hero.png'].map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl border-2 p-2 flex-shrink-0 ${activeImage === img ? 'border-brand-blue' : 'border-gray-200'}`}
                >
                  <img src={img} className="w-full h-full object-contain mix-blend-multiply" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="md:w-7/12 p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-brand-navy mb-2">
              {product.name}
            </h1>
            <p className="text-gray-500 text-lg mb-4">By {product.brand}</p>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center bg-green-600 text-white px-2 py-1 rounded text-sm font-bold">
                {product.rating} <Star className="w-4 h-4 ml-1 fill-current" />
              </div>
              <span className="text-gray-500 text-sm">{product.reviews.toLocaleString()} Ratings & {Math.floor(product.reviews / 10)} Reviews</span>
              {product.assured && (
                <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" className="h-5" alt="Assured" />
              )}
            </div>

            <div className="text-green-600 font-bold text-sm mb-1">Extra 10% Off on Bank Cards</div>
            <div className="flex items-end gap-4 mb-2">
              <span className="text-4xl font-mono font-bold text-brand-navy">₹{product.price.toLocaleString()}</span>
              {product.mrp > product.price && (
                <span className="text-lg text-gray-400 line-through font-mono mb-1">₹{product.mrp.toLocaleString()}</span>
              )}
              {product.discount > 0 && (
                <span className="text-lg text-green-600 font-bold mb-1">{product.discount}% off</span>
              )}
            </div>
            
            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-8 mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Color: {activeColor?.name}</h3>
                <div className="flex gap-3">
                  {product.colors.map((color, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveColor(color)}
                      className={`w-10 h-10 rounded-full ${color.class} ring-2 ring-offset-2 transition-all ${activeColor?.name === color.name ? 'ring-brand-blue scale-110' : 'ring-transparent hover:scale-105'}`}
                    ></button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-6 mb-8">
              <span className="font-medium text-gray-900">Quantity</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <span className="text-red-500 text-sm font-medium">Only 3 left in stock!</span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={handleAddToCart}
                className={`flex-1 font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors ${isAdded ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-brand-yellow hover:bg-yellow-400 text-brand-navy'}`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-6 h-6" /> Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-6 h-6" /> Add to Cart
                  </>
                )}
              </button>
              <button className="flex-1 bg-brand-orange hover:bg-orange-600 text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors">
                <Zap className="w-6 h-6 fill-current" /> Buy Now
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2">
                  <Shield className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium">1 Year Warranty</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-2">
                  <RotateCcw className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium">7 Days Replacement</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-2">
                  <Truck className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium">Free Delivery</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
