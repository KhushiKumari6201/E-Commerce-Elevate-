import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, Shield, Truck, RotateCcw, Heart, Share2, ShoppingCart, Zap, Play, X, PlayCircle } from 'lucide-react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { allProducts } from '../data/products';
import ColorVariantPicker from '../components/ColorVariantPicker';

export default function ProductDetail() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const colorQuery = searchParams.get('color');
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const product = allProducts.find(p => p.id === id) || allProducts[0];
  const isWishlisted = isInWishlist(product?.id);

  // Dynamic fallback videos so all products have video content
  const productVideos = useMemo(() => {
    return product?.videos && product.videos.length > 0
      ? product.videos
      : [
          {
            id: 'v-default',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            type: 'mp4',
            thumbnail: product?.image,
            duration: '0:15'
          }
        ];
  }, [product]);

  // Helper to retrieve initial active color
  const getInitialColor = () => {
    if (!product || !product.colors || product.colors.length === 0) return null;
    
    // 1. Try matching with the URL query parameter
    if (colorQuery) {
      const matchedColor = product.colors.find(c => c.name.toLowerCase() === colorQuery.toLowerCase());
      if (matchedColor) return matchedColor;
    }
    
    // 2. Default to the first available variant
    const firstAvailable = product.colors.find(c => c.isAvailable !== false);
    if (firstAvailable) return firstAvailable;
    
    // 3. Fallback to the first variant overall
    return product.colors[0];
  };

  const [activeColor, setActiveColor] = useState(getInitialColor());
  const [activeImage, setActiveImage] = useState(activeColor?.image || product?.image || '/headphone.png');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Rating & Review state hooks
  const [currentRating, setCurrentRating] = useState(product ? product.rating : 4.5);
  const [currentReviewsCount, setCurrentReviewsCount] = useState(product ? product.reviews : 150);
  const [hasUserRated, setHasUserRated] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [userRatingStars, setUserRatingStars] = useState(0);
  const [hoverRatingStars, setHoverRatingStars] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const playVideoQuery = searchParams.get('playVideo') === 'true';

  useEffect(() => {
    if (playVideoQuery && product && productVideos.length > 0) {
      setActiveVideo(productVideos[0]);
      setShowVideoModal(true);
    }
  }, [playVideoQuery, product, productVideos]);

  const handleCloseVideoModal = () => {
    setShowVideoModal(false);
    setActiveVideo(null);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('playVideo');
    setSearchParams(newParams);
  };

  useEffect(() => {
    if (showVideoModal || isRatingModalOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [showVideoModal, isRatingModalOpen]);

  // Sync state when product or query parameter changes
  useEffect(() => {
    if (product) {
      const initialColor = getInitialColor();
      setActiveColor(initialColor);
      setActiveImage(initialColor?.image || product.image);
      
      // Load user rating from localStorage if it exists
      const storedRatings = JSON.parse(localStorage.getItem('elevate_user_ratings') || '{}');
      const userRating = storedRatings[product.id];
      
      if (userRating) {
        setHasUserRated(true);
        setUserRatingStars(userRating.stars);
        setReviewComment(userRating.comment || '');
        
        // Calculate rating details incorporating user rating
        const newReviewsCount = product.reviews + 1;
        const newRating = ((product.rating * product.reviews) + userRating.stars) / newReviewsCount;
        setCurrentRating(newRating);
        setCurrentReviewsCount(newReviewsCount);
      } else {
        setHasUserRated(false);
        setUserRatingStars(0);
        setReviewComment('');
        setCurrentRating(product.rating);
        setCurrentReviewsCount(product.reviews);
      }
    }
  }, [product, colorQuery]);

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }

  const isSelectedColorAvailable = !activeColor || activeColor.isAvailable !== false;

  const handleColorSelect = (color) => {
    if (color.isAvailable === false) return;
    setActiveColor(color);
    if (color.image) {
      setActiveImage(color.image);
    }
    setSearchParams({ color: color.name });
  };

  const handleAddToCart = () => {
    if (!isSelectedColorAvailable) return;
    addToCart(product, quantity, activeColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!isSelectedColorAvailable) return;
    navigate('/checkout', {
      state: {
        checkoutItems: [{
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          mrp: product.mrp,
          discount: product.discount,
          image: activeImage,
          category: product.category,
          quantity: quantity,
          selectedColor: activeColor
        }]
      }
    });
  };

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    if (userRatingStars === 0) {
      alert("Please select at least 1 star to submit your rating.");
      return;
    }

    const storedRatings = JSON.parse(localStorage.getItem('elevate_user_ratings') || '{}');
    const wasAlreadyRated = !!storedRatings[product.id];
    
    // Save to localStorage
    storedRatings[product.id] = {
      stars: userRatingStars,
      comment: reviewComment
    };
    localStorage.setItem('elevate_user_ratings', JSON.stringify(storedRatings));

    // Dynamic rating average update (re-calculate incorporating current stars selection)
    const newReviewsCount = product.reviews + 1;
    const newRating = ((product.rating * product.reviews) + userRatingStars) / newReviewsCount;

    setCurrentRating(newRating);
    setCurrentReviewsCount(newReviewsCount);
    setHasUserRated(true);
    setIsRatingModalOpen(false);

    // Show success toast
    setToastMessage(wasAlreadyRated ? "Your rating has been updated successfully!" : "Thank you! Your rating has been submitted successfully.");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Compile unique images list dynamically from product and variants
  const getProductImages = () => {
    const images = [product.image];
    if (product.colors) {
      product.colors.forEach(c => {
        if (c.image && !images.includes(c.image)) {
          images.push(c.image);
        }
      });
    }
    return images;
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
            <div className="relative group cursor-crosshair overflow-hidden rounded-2xl h-[400px] flex items-center justify-center bg-white border border-gray-50">
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                <button 
                  onClick={() => toggleWishlist(product)}
                  className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                  title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
                <button className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-gray-400 hover:text-brand-blue transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  src={activeImage} 
                  alt={product.name}
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                />
              </AnimatePresence>
            </div>
            
            {/* Dynamic Thumbnails */}
            <div className="flex gap-3 mt-6 overflow-x-auto hide-scrollbar py-2">
              {getProductImages().map((img, i) => (
                <button 
                  key={i}
                  onClick={() => {
                    setActiveImage(img);
                    const matchingColor = product.colors?.find(c => c.image === img && c.isAvailable !== false);
                    if (matchingColor) {
                      setActiveColor(matchingColor);
                      setSearchParams({ color: matchingColor.name });
                    }
                  }}
                  className={`w-20 h-20 rounded-xl border-2 p-2 bg-white flex-shrink-0 transition-all ${
                    activeImage === img 
                      ? 'border-brand-blue ring-2 ring-brand-blue/20 scale-105 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={img} className="w-full h-full object-contain mix-blend-multiply" />
                </button>
              ))}

              {productVideos.map((vid, idx) => (
                <button 
                  key={`vid-${idx}`}
                  onClick={() => {
                    setActiveVideo(vid);
                    setShowVideoModal(true);
                  }}
                  className="w-20 h-20 rounded-xl border-2 border-gray-200 hover:border-brand-blue p-2 bg-white flex-shrink-0 relative overflow-hidden group shadow-sm flex items-center justify-center transition-all"
                  title="Play Product Video"
                >
                  <img src={vid.thumbnail || product.image} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105" />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors group-hover:bg-black/50">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md transform transition-transform group-hover:scale-110">
                      <Play className="w-4 h-4 text-brand-orange fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-1 right-1 bg-black/75 px-1.5 py-0.5 rounded text-[9px] font-bold font-mono text-white tracking-wider">
                    {vid.duration}
                  </div>
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
            
            <div className="flex items-center gap-3.5 mb-6">
              <button 
                onClick={() => setIsRatingModalOpen(true)}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm font-bold transition-colors shadow-sm active:scale-95 cursor-pointer"
                title="Click to rate this product"
              >
                {hasUserRated ? userRatingStars.toFixed(1) : currentRating.toFixed(1)} <Star className="w-3.5 h-3.5 ml-1 fill-current text-white" />
              </button>
              <span className="text-gray-500 text-sm">{currentReviewsCount.toLocaleString()} Ratings & {Math.floor(currentReviewsCount / 10)} Reviews</span>
              <button 
                onClick={() => setIsRatingModalOpen(true)}
                className="text-brand-orange border border-brand-orange/20 hover:bg-brand-orange hover:text-white bg-brand-orange/5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1"
              >
                Rate Product
              </button>
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
            {product.colors && product.colors.length > 1 && (
              <div className="mt-8 mb-6">
                <h3 className="font-medium text-gray-900 mb-3 font-heading">
                  Color: <span className="text-brand-blue font-bold">{activeColor?.name || 'Default'}</span>
                </h3>
                <ColorVariantPicker
                  colors={product.colors}
                  selectedColor={activeColor}
                  onColorSelect={handleColorSelect}
                  size="lg"
                />
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-6 mb-8 mt-8">
              <span className="font-medium text-gray-900">Quantity</span>
              <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg font-bold" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg font-bold" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              
              {/* Dynamic Availability/Stock Notice */}
              {!isSelectedColorAvailable ? (
                <span className="text-red-600 text-sm font-extrabold bg-red-50 border border-red-100 px-3 py-1 rounded-lg">
                  Temporarily Out of Stock
                </span>
              ) : (
                <span className="text-red-500 text-sm font-medium">Only 3 left in stock!</span>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={handleAddToCart}
                disabled={!isSelectedColorAvailable}
                className={`flex-1 font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors ${
                  !isSelectedColorAvailable 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                    : isAdded 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : 'bg-brand-yellow hover:bg-yellow-400 text-brand-navy'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-6 h-6" /> Added to Cart
                  </>
                ) : !isSelectedColorAvailable ? (
                  <>Out of Stock</>
                ) : (
                  <>
                    <ShoppingCart className="w-6 h-6" /> Add to Cart
                  </>
                )}
              </button>
              <button 
                onClick={handleBuyNow}
                disabled={!isSelectedColorAvailable}
                className={`flex-1 font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors ${
                  !isSelectedColorAvailable
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                    : 'bg-brand-orange hover:bg-orange-600 text-white'
                }`}
              >
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

      {/* Video Player Modal */}
      <AnimatePresence>
        {showVideoModal && activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-brand-navy rounded-3xl overflow-hidden shadow-2xl w-full max-w-4xl border border-white/10 flex flex-col relative aspect-video"
            >
              {/* Close Button */}
              <button 
                onClick={handleCloseVideoModal}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors border border-white/10"
                title="Close Player"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Video Content */}
              <div className="flex-1 w-full h-full relative bg-black flex items-center justify-center">
                {activeVideo.type === 'youtube' ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${
                      activeVideo.url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1] || ''
                    }?autoplay=1&rel=0&modestbranding=1`}
                    title="Product Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <video
                    src={activeVideo.url}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              
              {/* Bottom Bar Info */}
              <div className="bg-brand-navy/90 p-4 border-t border-white/10 flex items-center justify-between text-white">
                <div>
                  <h4 className="font-heading font-bold text-sm truncate max-w-md">{product.name}</h4>
                  <p className="text-xs text-gray-400">Duration: {activeVideo.duration}</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-brand-orange bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full">
                  <PlayCircle className="w-4 h-4 fill-current" /> {activeVideo.type === 'youtube' ? 'YouTube Stream' : 'HD Native Playback'}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification for rating success */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-brand-navy text-white text-xs font-bold px-5 py-3 rounded-full shadow-lg z-50 flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-green-400 stroke-[3px]" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rating & Review Modal */}
      <AnimatePresence>
        {isRatingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md border border-gray-100 shadow-2xl relative text-left"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsRatingModalOpen(false)}
                className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-700 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-heading font-extrabold text-xl text-brand-navy mb-4 pr-6">
                Rate & Review Product
              </h3>

              {/* Product Info Summary */}
              <div className="flex items-center gap-3 bg-gray-50 p-3.5 rounded-2xl mb-6">
                <img src={product.image} className="w-12 h-12 object-contain bg-white rounded-lg p-1 border border-gray-100 flex-shrink-0" alt={product.name} />
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-brand-navy truncate">{product.name}</h4>
                  <p className="text-[10px] text-gray-400 font-medium">Brand: {product.brand}</p>
                </div>
              </div>

              <form onSubmit={handleRatingSubmit} className="space-y-5">
                {/* Star Rating selector */}
                <div className="text-center space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Your Rating</span>
                  <div className="flex justify-center items-center gap-2 py-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star 
                        key={i}
                        onClick={() => setUserRatingStars(i)}
                        onMouseEnter={() => setHoverRatingStars(i)}
                        onMouseLeave={() => setHoverRatingStars(0)}
                        className={`w-8 h-8 cursor-pointer transition-all ${
                          i <= (hoverRatingStars || userRatingStars)
                            ? 'text-amber-400 fill-current scale-110'
                            : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  {userRatingStars > 0 && (
                    <span className="text-xs font-bold text-brand-orange animate-pulse">
                      {userRatingStars === 1 && "Poor 😞"}
                      {userRatingStars === 2 && "Fair 😐"}
                      {userRatingStars === 3 && "Good 🙂"}
                      {userRatingStars === 4 && "Very Good 😀"}
                      {userRatingStars === 5 && "Excellent! 😍"}
                    </span>
                  )}
                </div>

                {/* Review Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Write a Review (Optional)</label>
                  <textarea
                    placeholder="Tell us what you like or dislike about this product..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full border border-gray-200 px-4 py-3 text-sm rounded-xl focus:outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15 transition-all bg-gray-50/50 h-24 resize-none font-medium"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md shadow-brand-orange/10 active:scale-99"
                >
                  Submit Rating
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
