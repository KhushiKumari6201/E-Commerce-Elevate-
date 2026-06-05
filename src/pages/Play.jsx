import { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  PlayCircle, 
  Tag, 
  User, 
  ShoppingCart, 
  Volume2, 
  VolumeX, 
  Heart, 
  MessageCircle, 
  Share2, 
  Eye, 
  Check, 
  Sparkles,
  ShoppingBag,
  Search,
  Coins,
  Play as PlayIcon
} from 'lucide-react';
import { playReels, allProducts } from '../data/products';
import { useCart } from '../context/CartContext';

export default function Play() {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  
  // Reels and interaction states
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  
  const [likes, setLikes] = useState(playReels.map(r => r.likes));
  const [likedStates, setLikedStates] = useState(playReels.map(() => false));
  const [followingStates, setFollowingStates] = useState(playReels.map(() => false));
  
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const containerRef = useRef(null);
  const videoRefs = useRef([]);

  // Trigger toast notification
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Scroll listener to update active video based on scroll position
  const handleScroll = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    
    let activeIndex = activeReelIndex;
    let minDiff = Infinity;
    
    videoRefs.current.forEach((video, idx) => {
      if (video) {
        const videoCard = video.closest('.video-card-container');
        if (videoCard) {
          const cardTop = videoCard.offsetTop;
          const cardCenter = cardTop + videoCard.clientHeight / 2;
          const viewportCenter = scrollTop + container.clientHeight / 2;
          const diff = Math.abs(cardCenter - viewportCenter);
          if (diff < minDiff) {
            minDiff = diff;
            activeIndex = idx;
          }
        }
      }
    });

    if (activeIndex !== activeReelIndex) {
      setActiveReelIndex(activeIndex);
      setIsPlaying(true); // Auto-play the new active reel
      setProgress(0); // Reset progress bar
    }
  };

  // Track video progress
  const handleTimeUpdate = (e) => {
    const video = e.target;
    if (video && video.duration) {
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  // Control video playback based on active index and play state
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (video) {
        if (idx === activeReelIndex && isPlaying) {
          video.play().catch(err => {
            console.log("Autoplay blocked, playing muted:", err);
            setIsMuted(true);
            video.muted = true;
            video.play().catch(e => console.log("Play failed:", e));
          });
        } else {
          video.pause();
        }
      }
    });
  }, [activeReelIndex, isPlaying]);

  const togglePlay = () => {
    const activeVideo = videoRefs.current[activeReelIndex];
    if (activeVideo) {
      if (isPlaying) {
        activeVideo.pause();
      } else {
        activeVideo.play().catch(e => console.log(e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRefs.current.forEach(video => {
      if (video) video.muted = nextMuted;
    });
  };

  const handleLike = (index) => {
    const newLiked = [...likedStates];
    newLiked[index] = !newLiked[index];
    setLikedStates(newLiked);

    const newLikes = [...likes];
    newLikes[index] = newLiked[index] ? newLikes[index] + 1 : newLikes[index] - 1;
    setLikes(newLikes);

    if (newLiked[index]) {
      triggerToast("Added to likes!");
    }
  };

  const handleFollow = (index) => {
    const newFollow = [...followingStates];
    newFollow[index] = !newFollow[index];
    setFollowingStates(newFollow);
    triggerToast(newFollow[index] ? `Following ${playReels[index].creator}` : `Unfollowed ${playReels[index].creator}`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    triggerToast("Video link copied to clipboard!");
  };

  const handleCircleClick = (index) => {
    setActiveReelIndex(index);
    setIsPlaying(true);
    setProgress(0);
    
    const targetVideo = videoRefs.current[index];
    if (targetVideo) {
      const videoCard = targetVideo.closest('.video-card-container');
      if (videoCard && containerRef.current) {
        containerRef.current.scrollTo({
          top: videoCard.offsetTop,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-6 px-4 select-none">
      
      {/* Custom Styles for Glow and Scrollbar */}
      <style>{`
        @keyframes borderGlow {
          0% { border-color: #FFC200; box-shadow: 0 0 5px rgba(255, 194, 0, 0.4); }
          50% { border-color: #FB641B; box-shadow: 0 0 15px rgba(251, 100, 27, 0.85); }
          100% { border-color: #FFC200; box-shadow: 0 0 5px rgba(255, 194, 0, 0.4); }
        }
        .animate-border-glow {
          animation: borderGlow 1.5s infinite alternate;
        }
        .story-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .story-scrollbar::-webkit-scrollbar-track {
          background: #09090b;
          border-radius: 10px;
        }
        .story-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .story-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #FB641B;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 bg-brand-orange text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg z-50 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen Wrapper (Centered Mobile Screen Mockup on Desktop, Full Bleed on Mobile) */}
      <div className="w-full max-w-[420px] bg-zinc-950 rounded-[40px] border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden h-[780px] relative">
        
        {/* Top Header */}
        <div className="absolute top-0 inset-x-0 z-40 bg-gradient-to-b from-black/90 via-black/40 to-transparent px-6 pt-6 pb-4 flex items-center justify-between border-none">
          <h1 className="text-2xl font-heading font-extrabold text-white tracking-wide">
            Play
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-red-500 animate-pulse">Live</span>
            </div>
            <button 
              onClick={() => navigate('/search')}
              className="p-1 hover:bg-zinc-800 rounded-full transition-colors text-white"
              title="Search products"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Container (Reels & Top Section) */}
        <div 
          ref={containerRef}
          onScroll={handleScroll}
          className="relative w-full h-full overflow-y-auto snap-y snap-mandatory scroll-smooth hide-scrollbar"
        >
          
          {/* Top Section Area (Scrolls away) */}
          <div className="snap-start snap-always flex flex-col pt-20">
            
            {/* Horizontal scrollable story circles */}
            <div className="px-4 py-4 border-b border-zinc-900 bg-zinc-950/40">
              <div className="flex gap-4 overflow-x-auto story-scrollbar pb-2">
                {playReels.map((reel, idx) => (
                  <button
                    key={reel.id}
                    onClick={() => handleCircleClick(idx)}
                    className="flex flex-col items-center flex-shrink-0 focus:outline-none group"
                  >
                    <div className={`w-16 h-16 rounded-full p-[2.5px] transition-transform duration-300 group-hover:scale-105 ${
                      activeReelIndex === idx 
                        ? 'border-2 border-[#F3722C] animate-border-glow scale-105' 
                        : 'border-2 border-red-600/70 hover:border-red-500'
                    }`}>
                      <img 
                        src={reel.thumbnail} 
                        className="w-full h-full object-cover rounded-full border border-black" 
                        alt={reel.category} 
                      />
                    </div>
                    <span className="bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full -mt-2.5 z-10 border border-zinc-950 scale-90">
                      {reel.discountLabel}
                    </span>
                    <span className={`text-[10px] font-medium mt-1 text-center truncate w-16 transition-colors ${
                      activeReelIndex === idx ? 'text-[#F3722C] font-bold' : 'text-zinc-400 group-hover:text-zinc-200'
                    }`}>
                      {reel.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Promotional Banner Card */}
            <div className="px-4 py-3">
              <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 p-4 rounded-3xl relative overflow-hidden shadow-md">
                {/* Background Shapes and Floating Icons */}
                <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
                <div className="absolute right-4 top-2 text-white/20 animate-bounce" style={{ animationDuration: '3s' }}>
                  <Coins className="w-5 h-5 text-amber-200 fill-amber-300/60" />
                </div>
                <div className="absolute left-1/3 bottom-1.5 text-white/25 animate-pulse">
                  <Sparkles className="w-4 h-4 text-pink-100" />
                </div>
                
                <div className="flex justify-between items-center relative z-10">
                  <div className="max-w-[200px]">
                    <span className="bg-white/20 text-white text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1 w-fit">
                      <Sparkles className="w-3 h-3 fill-current" /> CREATORHOOD
                    </span>
                    <h3 className="text-white font-heading font-extrabold text-sm mt-1 leading-snug">
                      Why Just Scroll When You Can Earn?
                    </h3>
                    <p className="text-white/80 text-[10px] font-medium mt-0.5">is officially yours!</p>
                  </div>
                  <button 
                    onClick={() => triggerToast("Launching Creator Studio...")}
                    className="bg-teal-500 hover:bg-teal-600 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-1"
                  >
                    Sign up now
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* TikTok / Instagram Reels Style Vertically Scrollable Feed */}
          <div className="flex flex-col">
            {playReels.map((reel, idx) => {
              const taggedProduct = allProducts.find(p => p.id === reel.taggedProductId);
              const isLiked = likedStates[idx];
              const isFollowing = followingStates[idx];
              const likesCount = likes[idx];
              
              return (
                <div 
                  key={reel.id} 
                  className="video-card-container w-full snap-start snap-always relative flex flex-col justify-between"
                  style={{ height: '780px' }}
                >
                  <div className="relative w-full h-full bg-zinc-950 overflow-hidden group">
                    
                    {/* Instagram Stories Style Segmented Progress Bar */}
                    <div className="absolute top-3 inset-x-0 h-1 z-50 flex gap-1.5 px-4 pointer-events-none">
                      {playReels.map((r, pIdx) => (
                        <div key={r.id} className="h-full bg-white/20 rounded-full flex-1 overflow-hidden">
                          <div 
                            className="h-full bg-[#F3722C] transition-all duration-75 ease-linear"
                            style={{ 
                              width: 
                                pIdx < activeReelIndex 
                                  ? '100%' 
                                  : pIdx === activeReelIndex 
                                    ? `${progress}%` 
                                    : '0%' 
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Video Element */}
                    <video
                      ref={el => videoRefs.current[idx] = el}
                      src={reel.videoUrl}
                      poster={reel.thumbnail}
                      loop
                      muted={isMuted}
                      playsInline
                      onClick={togglePlay}
                      onTimeUpdate={activeReelIndex === idx ? handleTimeUpdate : null}
                      className="w-full h-full object-cover cursor-pointer"
                    />

                    {/* Mute Overlay Button (Top Left) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                      }}
                      className="absolute top-[72px] left-4 z-20 w-9 h-9 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white border border-white/10 transition-colors"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    {/* View Count Badge (Top Right) */}
                    <div className="absolute top-[72px] right-4 z-20 bg-black/60 border border-white/10 px-3 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-xs">
                      <Eye className="w-3.5 h-3.5 text-white" />
                      <span className="text-[10px] font-bold text-white tracking-wide">{reel.views}</span>
                    </div>

                    {/* Creator Details Overlay (Top Left - Shifted to avoid overlap) */}
                    <div className="absolute inset-x-0 top-[124px] p-4 flex items-center justify-between pointer-events-none z-20">
                      <div className="flex items-center gap-2 pointer-events-auto">
                        <img 
                          src={reel.creatorAvatar} 
                          className="w-9 h-9 rounded-full border border-[#F3722C] object-cover shadow" 
                          alt={reel.creator} 
                        />
                        <div>
                          <h4 className="text-white text-xs font-bold">{reel.creator}</h4>
                          <span className="text-[9px] text-zinc-400 font-medium">Product Creator</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFollow(idx);
                          }}
                          className={`ml-2 px-3 py-1 rounded-lg text-[10px] font-extrabold transition-all border ${
                            isFollowing 
                              ? 'bg-zinc-800 text-zinc-300 border-zinc-700' 
                              : 'bg-[#F3722C] text-white border-[#F3722C] hover:bg-[#d95d1c]'
                          }`}
                        >
                          {isFollowing ? 'Following' : 'Follow'}
                        </button>
                      </div>
                    </div>

                    {/* Play/Pause Center Indicator */}
                    <AnimatePresence>
                      {!isPlaying && activeReelIndex === idx && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          onClick={togglePlay}
                          className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer bg-black/20"
                        >
                          <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center border border-white/10">
                            <PlayIcon className="w-8 h-8 text-white fill-current ml-1" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Sidebar Interaction Icons (Right side, white icons/text) */}
                    <div className="absolute right-4 bottom-32 z-20 flex flex-col gap-5 items-center">
                      
                      {/* Like */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(idx);
                        }}
                        className="flex flex-col items-center gap-1 group animate-none"
                      >
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center bg-black/60 border border-white/10 hover:bg-black/80 text-white transition-all ${
                          isLiked ? 'text-red-500 scale-105' : 'text-white'
                        }`}>
                          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                        </div>
                        <span className="text-[10px] font-extrabold text-white font-mono shadow-sm">{likesCount}</span>
                      </button>

                      {/* Comment */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerToast("Comments panel under review!");
                        }}
                        className="flex flex-col items-center gap-1"
                      >
                        <div className="w-11 h-11 rounded-full flex items-center justify-center bg-black/60 border border-white/10 hover:bg-black/80 text-white transition-all">
                          <MessageCircle className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-extrabold text-white font-mono shadow-sm">18</span>
                      </button>

                      {/* Share */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare();
                        }}
                        className="flex flex-col items-center gap-1"
                      >
                        <div className="w-11 h-11 rounded-full flex items-center justify-center bg-black/60 border border-white/10 hover:bg-black/80 text-white transition-all">
                          <Share2 className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-extrabold text-white shadow-sm">Share</span>
                      </button>
                    </div>

                    {/* Video Description & Tagged Product Overlay (Bottom Area - shifted up to clear bottom nav) */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent px-4 pb-20 pt-6 flex flex-col gap-1.5 pointer-events-none z-10">
                      <div className="bg-[#F3722C] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md w-fit tracking-wide mb-1 flex items-center gap-1 uppercase">
                        <Sparkles className="w-3 h-3 fill-current" /> Flipkart Find
                      </div>
                      <p className="text-white text-xs font-bold leading-relaxed drop-shadow-md pr-16 mb-2">
                        {reel.title} — check this awesome design! 🔥
                      </p>

                      {/* Tagged Product shopping card (Small thumbnail, description, orange Shop Now button) */}
                      {taggedProduct && (
                        <div className="bg-zinc-950/90 border border-zinc-800 p-3 rounded-2xl flex items-center justify-between gap-3 pointer-events-auto backdrop-blur-md shadow-2xl">
                          <div className="flex items-center gap-2 min-w-0">
                            <img src={taggedProduct.image} className="w-11 h-11 object-contain p-1 bg-white rounded-lg flex-shrink-0" alt={taggedProduct.name} />
                            <div className="min-w-0">
                              <h5 className="text-white text-xs font-bold truncate w-32">{taggedProduct.name}</h5>
                              <p className="text-[10px] text-zinc-400 truncate">{taggedProduct.brand}</p>
                              <span className="text-xs font-bold font-mono text-[#F3722C]">₹{taggedProduct.price.toLocaleString()}</span>
                            </div>
                          </div>
                          
                          <Link
                            to={`/product/${taggedProduct.id}`}
                            className="bg-[#F3722C] hover:bg-[#d95d1c] text-white font-extrabold text-[10px] px-3.5 py-2 rounded-xl flex items-center gap-1 transition-all active:scale-95 shadow"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            Shop Now
                          </Link>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Sticky App Bottom Navigation Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-zinc-950/85 backdrop-blur-md border-t border-zinc-900 grid grid-cols-5 py-2.5 z-40">
          
          <Link to="/" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-200">
            <Home className="w-5 h-5" />
            <span className="text-[9px] font-medium">Home</span>
          </Link>

          <Link to="/play" className="flex flex-col items-center gap-1 text-[#F3722C] font-bold relative">
            <PlayCircle className="w-5 h-5 animate-pulse" />
            <span className="text-[9px]">Play</span>
            <span className="absolute -bottom-1 w-1.5 h-1.5 bg-[#F3722C] rounded-full" />
          </Link>

          <Link to="/search?q=" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-200">
            <Tag className="w-5 h-5" />
            <span className="text-[9px] font-medium">Top Deals</span>
          </Link>

          <Link to="/account" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-200">
            <User className="w-5 h-5" />
            <span className="text-[9px] font-medium">Account</span>
          </Link>

          <Link to="/cart" className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-200 relative">
            <ShoppingCart className="w-5 h-5" />
            <span className="text-[9px] font-medium">Cart</span>
            {cartCount > 0 && (
              <span className="absolute top-0 right-3 bg-[#F3722C] text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-zinc-950 shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>
          
        </div>

      </div>
    </div>
  );
}
