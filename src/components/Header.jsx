import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ShoppingCart, Search, Mic, Camera, User, Heart, Menu, ChevronDown, Bell, AlertCircle, CheckCircle2, X, Image, Tag, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { allProducts } from '../data/products';

const navCategories = [
  {
    label: 'Electronics',
    path: '/category/electronics',
    items: [
      { label: 'Mobiles & Tablets', path: '/category/electronics' },
      { label: 'Laptops & Computers', path: '/category/electronics' },
      { label: 'Cameras & Accessories', path: '/category/electronics' },
      { label: 'Headphones & Speakers', path: '/category/electronics' },
      { label: 'Smartwatches', path: '/category/electronics' },
    ],
  },
  {
    label: 'Fashion',
    path: '/category/fashion',
    items: [
      { label: 'Men\'s Clothing', path: '/category/fashion' },
      { label: 'Women\'s Clothing', path: '/category/fashion' },
      { label: 'Footwear', path: '/category/fashion' },
      { label: 'Sunglasses & Eyewear', path: '/category/fashion' },
      { label: 'Accessories & Bags', path: '/category/fashion' },
    ],
  },
  {
    label: 'Home & Furniture',
    path: '/category/home',
    items: [
      { label: 'Sofas & Seating', path: '/category/home' },
      { label: 'Beds & Mattresses', path: '/category/home' },
      { label: 'Kitchen & Dining', path: '/category/home' },
      { label: 'Decor & Lighting', path: '/category/home' },
      { label: 'Storage & Organisation', path: '/category/home' },
    ],
  },
  {
    label: 'Appliances',
    path: '/category/appliances',
    items: [
      { label: 'Air Conditioners', path: '/category/appliances' },
      { label: 'Washing Machines', path: '/category/appliances' },
      { label: 'Refrigerators', path: '/category/appliances' },
      { label: 'Microwaves & OTG', path: '/category/appliances' },
      { label: 'Air Fryers', path: '/category/appliances' },
    ],
  },
  {
    label: 'Beauty, Toys & More',
    path: '/category/beauty',
    items: [
      { label: 'Skincare & Serums', path: '/category/beauty' },
      { label: 'Makeup & Lipsticks', path: '/category/beauty' },
      { label: 'Perfumes & Fragrances', path: '/category/beauty' },
      { label: 'Toys & Games', path: '/category/toys' },
      { label: 'Sports Equipment', path: '/category/sports' },
    ],
  },
  {
    label: 'Mobiles',
    path: '/category/electronics',
    items: [
      { label: 'iPhones', path: '/category/electronics' },
      { label: 'Samsung Galaxy', path: '/category/electronics' },
      { label: 'Budget Phones', path: '/category/electronics' },
      { label: 'Refurbished Phones', path: '/category/electronics' },
      { label: 'Mobile Accessories', path: '/category/electronics' },
    ],
  },
];


export default function Header() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  // User Auth states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const accountDropdownRef = useRef(null);

  // Search & Speech Recognition States
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const [showErrorToast, setShowErrorToast] = useState(false);

  // Camera Visual Search States
  const [isScanning, setIsScanning] = useState(false);
  const [cameraImagePreview, setCameraImagePreview] = useState(null);
  const [scanningStatus, setScanningStatus] = useState('uploading'); // uploading, detecting, matching
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successToastMessage, setSuccessToastMessage] = useState('');

  // Live Camera & Gallery selection states
  const [showCameraOptions, setShowCameraOptions] = useState(false);
  const [showLiveCamera, setShowLiveCamera] = useState(false);

  const searchContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const cameraVideoRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const cameraOptionsRef = useRef(null);

  // Check user details from localStorage
  const checkAuth = () => {
    let logged = localStorage.getItem('elevate_is_logged_in');
    if (logged === null) {
      // Auto-login default user on first load
      localStorage.setItem('elevate_is_logged_in', 'true');
      localStorage.setItem('elevate_user', JSON.stringify({
        name: 'Khushi Kumari',
        email: 'khushi@elevate.com',
        phone: '9876543210',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
        gender: 'Female'
      }));
      logged = 'true';
    }
    const isLogged = logged === 'true';
    setIsLoggedIn(isLogged);
    if (isLogged) {
      const stored = localStorage.getItem('elevate_user');
      setUser(stored ? JSON.parse(stored) : { name: 'Khushi Kumari' });
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener('authChange', checkAuth);
    // Also listen to storage events (e.g. from other tabs or pages updating localStorage)
    window.addEventListener('storage', checkAuth);
    return () => {
      window.removeEventListener('authChange', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // Auto close suggestions, camera options, and account dropdown on clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (cameraOptionsRef.current && !cameraOptionsRef.current.contains(e.target)) {
        setShowCameraOptions(false);
      }
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(e.target)) {
        setShowAccountDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Cleanup speech recognition and camera stream on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleMicClick = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setSpeechError('Speech recognition is not supported in this browser. Try Chrome or Safari.');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 4000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError('');
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setShowSuggestions(true);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission denied. Please enable microphone access in your browser settings.');
        } else if (event.error === 'no-speech') {
          setSpeechError('No speech detected. Please speak clearly.');
        } else {
          setSpeechError(`Speech recognition error: ${event.error}`);
        }
        setShowErrorToast(true);
        setTimeout(() => setShowErrorToast(false), 4000);
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognition.start();
    } catch (err) {
      console.error('Error starting recognition:', err);
      setSpeechError('Failed to access microphone. Please try again.');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 4000);
      setIsListening(false);
      recognitionRef.current = null;
    }
  };

  const handleStartLiveCamera = async () => {
    setShowLiveCamera(true);
    
    // Slight delay to allow video element to mount
    setTimeout(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } } 
        });
        if (cameraVideoRef.current) {
          cameraVideoRef.current.srcObject = stream;
        }
        cameraStreamRef.current = stream;
      } catch (err) {
        console.error("Error accessing camera:", err);
        setSpeechError('Camera access denied or unavailable. Please check permissions.');
        setShowErrorToast(true);
        setTimeout(() => setShowErrorToast(false), 4000);
        setShowLiveCamera(false);
      }
    }, 150);
  };

  const handleStopLiveCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(track => track.stop());
      cameraStreamRef.current = null;
    }
    setShowLiveCamera(false);
  };

  const handleCapturePhoto = () => {
    if (!cameraVideoRef.current) return;

    try {
      const video = cameraVideoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCameraImagePreview(dataUrl);

      // Stop camera stream instantly (turn off light)
      handleStopLiveCamera();

      // Start search scan simulator
      setIsScanning(true);
      setScanningStatus('uploading');

      // Timeline simulation
      setTimeout(() => {
        setScanningStatus('detecting');
      }, 1000);

      setTimeout(() => {
        setScanningStatus('matching');
      }, 2000);

      setTimeout(() => {
        setIsScanning(false);
        const matchedText = "Nike Air Force 1 '07";
        setSearchQuery(matchedText);
        setShowSuggestions(true);
        
        setSuccessToastMessage(`Found visual match for "${matchedText}"!`);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 4000);
      }, 3000);

    } catch (err) {
      console.error("Capture photo error:", err);
      setSpeechError('Failed to capture photo. Please try again.');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 4000);
      handleStopLiveCamera();
    }
  };

  const detectProductFromFilename = (filename) => {
    const name = filename.toLowerCase();
    if (name.includes('phone') || name.includes('iphone') || name.includes('mobile')) return 'Apple iPhone 15 Pro Max';
    if (name.includes('jacket') || name.includes('denim') || name.includes('jean')) return "Zara Men's Denim Jacket";
    if (name.includes('sofa') || name.includes('couch') || name.includes('velvet')) return 'Modern Velvet Sofa';
    if (name.includes('headphone') || name.includes('sony') || name.includes('earphone')) return 'Sony WH-1000XM5';
    if (name.includes('shoe') || name.includes('sneaker') || name.includes('nike') || name.includes('run')) return "Nike Air Force 1 '07";
    if (name.includes('watch') || name.includes('samsung')) return 'Samsung Galaxy Watch 6 Classic';
    if (name.includes('mouse') || name.includes('logitech')) return 'Logitech MX Master 3S Mouse';
    if (name.includes('glass') || name.includes('ray') || name.includes('aviator')) return 'Ray-Ban Classic Aviator';
    if (name.includes('vacuum') || name.includes('dyson')) return 'Dyson V15 Detect Vacuum';
    if (name.includes('laptop') || name.includes('dell') || name.includes('xps')) return 'Dell XPS 15 Laptop';
    if (name.includes('speaker') || name.includes('jbl')) return 'JBL Charge 5 Speaker';
    
    // Fallback: clean up filename extension
    return filename.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
  };

  const handleCameraFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a local preview URL
    const previewUrl = URL.createObjectURL(file);
    setCameraImagePreview(previewUrl);
    
    // Reset file input value so same file can be uploaded again
    e.target.value = '';

    // Open scanner modal
    setIsScanning(true);
    setScanningStatus('uploading');

    // Simulate scanning timeline
    setTimeout(() => {
      setScanningStatus('detecting');
    }, 1000);

    setTimeout(() => {
      setScanningStatus('matching');
    }, 2000);

    setTimeout(() => {
      setIsScanning(false);
      const matchedText = detectProductFromFilename(file.name);
      setSearchQuery(matchedText);
      setShowSuggestions(true);
      
      setSuccessToastMessage(`Found visual match for "${matchedText}"!`);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 4000);
    }, 3000);
  };

  const suggestions = allProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

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
          <form 
            onSubmit={handleSearchSubmit} 
            ref={searchContainerRef} 
            className="flex-1 max-w-2xl relative group"
          >
            <button 
              type="submit"
              className="absolute inset-y-0 left-0 pl-3 flex items-center transition-transform hover:scale-105 active:scale-95"
              title="Search"
            >
              <Search className={`h-5 w-5 ${isScrolled ? 'text-gray-400 hover:text-brand-blue' : 'text-brand-navy/60 hover:text-brand-blue'}`} />
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className={`block w-full pl-10 pr-20 py-2.5 rounded-xl border-0 focus:ring-2 focus:ring-brand-blue transition-all duration-300 ${
                isScrolled 
                  ? 'bg-gray-100 text-gray-900 placeholder-gray-500' 
                  : 'bg-white/95 text-brand-navy placeholder-brand-navy/50 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
              }`}
              placeholder="Search for products, brands and more"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
              {/* Mic Icon Button */}
              <button 
                type="button"
                onClick={handleMicClick}
                className={`p-1.5 rounded-lg transition-all duration-300 relative ${
                  isListening 
                    ? 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]' 
                    : isScrolled 
                      ? 'text-gray-500 hover:bg-gray-200' 
                      : 'text-brand-navy/70 hover:bg-gray-200'
                }`}
                title={isListening ? "Listening... Click to stop" : "Search by voice"}
              >
                {isListening && (
                  <span className="absolute inset-0 rounded-lg bg-red-500/40 animate-ping pointer-events-none" />
                )}
                <Mic className={`h-4 w-4 ${isListening ? 'animate-pulse scale-110' : ''}`} />
              </button>

              {/* Camera Options & Icon Button Wrapper */}
              <div ref={cameraOptionsRef} className="relative flex items-center">
                <button 
                  type="button"
                  onClick={() => setShowCameraOptions(!showCameraOptions)}
                  className={`p-1.5 rounded-lg transition-all duration-300 ${
                    showCameraOptions 
                      ? 'bg-brand-blue text-white shadow-sm scale-105' 
                      : isScrolled 
                        ? 'text-gray-500 hover:bg-gray-200' 
                        : 'text-brand-navy/70 hover:bg-gray-200'
                  }`}
                  title="Search by image"
                >
                  <Camera className="h-4 w-4" />
                </button>

                {/* Camera Options Dropdown Menu */}
                <AnimatePresence>
                  {showCameraOptions && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-1.5 z-50 text-left"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setShowCameraOptions(false);
                          if (fileInputRef.current) fileInputRef.current.click();
                        }}
                        className="w-full px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 hover:text-brand-blue transition-colors flex items-center gap-2 font-medium"
                      >
                        <Image className="w-3.5 h-3.5" />
                        Choose from Gallery
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCameraOptions(false);
                          handleStartLiveCamera();
                        }}
                        className="w-full px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 hover:text-brand-blue transition-colors flex items-center gap-2 font-medium"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        Take Photo (Camera)
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Hidden file input for camera scan */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleCameraFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            {/* Autocomplete Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && searchQuery && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 py-3 z-50 text-left"
                >
                  <div className="px-4 py-1.5 text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1 border-b border-gray-50 flex justify-between items-center">
                    <span>Suggestions ({suggestions.length})</span>
                    <div className="flex items-center gap-3">
                      {searchQuery.trim() && (
                        <button
                          type="button"
                          onClick={() => {
                            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                            setShowSuggestions(false);
                          }}
                          className="text-brand-blue hover:underline font-bold text-xs uppercase tracking-wider"
                        >
                          See all
                        </button>
                      )}
                      <button 
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setShowSuggestions(false);
                        }} 
                        className="hover:text-red-500 font-bold text-xs"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  {suggestions.length > 0 ? (
                    <div className="divide-y divide-gray-50 max-h-[300px] overflow-y-auto">
                      {suggestions.map(p => (
                        <Link 
                          key={p.id}
                          to={`/product/${p.id}`}
                          onClick={() => {
                            setSearchQuery('');
                            setShowSuggestions(false);
                          }}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand-navy/5 transition-colors group"
                        >
                          <img src={p.image} className="w-10 h-10 object-contain p-1 bg-gray-50 rounded mix-blend-multiply flex-shrink-0" alt={p.name} />
                          <div className="flex-grow min-w-0">
                            <p className="text-sm font-semibold text-brand-navy group-hover:text-brand-blue truncate">{p.name}</p>
                            <p className="text-xs text-gray-400">{p.brand} | {p.category}</p>
                          </div>
                          <span className="font-mono text-sm font-bold text-brand-navy flex-shrink-0">₹{p.price.toLocaleString()}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-400 text-sm">
                      No matching products found
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Right Nav */}
          <div className="flex items-center gap-2 sm:gap-6">
            <Link
              to="/"
              className={`p-2 flex items-center gap-1 rounded-lg transition-colors ${
                isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
              title="Home"
            >
              <Home className="h-6 w-6" />
              <span className="hidden sm:block font-medium text-sm">Home</span>
            </Link>

            <Link
              to="/account"
              className={`flex items-center gap-1 font-medium text-sm px-2 py-2 sm:px-3 rounded-lg transition-colors ${
                isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
            >
              <User className="h-6 w-6 sm:h-5 sm:w-5" />
              <span className="hidden md:inline">
                {isLoggedIn ? `Account (${user?.name?.split(' ')[0] || 'User'})` : 'Account'}
              </span>
            </Link>

            <Link 
              to="/wishlist"
              className={`relative p-2 flex items-center gap-1 rounded-lg transition-colors ${
                isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
            >
              <Heart className="h-6 w-6" />
              <span className="hidden sm:block font-medium text-sm">Wishlist</span>
              {wishlistCount > 0 && (
                <motion.span 
                  key={wishlistCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 sm:right-auto sm:left-6 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </Link>

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

            <Link
              to="/become-seller"
              className={`hidden lg:flex items-center gap-1 font-medium text-sm px-4 py-2 rounded-lg transition-all ${
                isScrolled 
                  ? 'border border-gray-200 text-gray-700 hover:bg-gray-50' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Become a Seller
            </Link>
          </div>
        </div>

        {/* Category Nav */}
        <AnimatePresence>
          {!isScrolled && (
            <motion.nav 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="hidden lg:flex items-center justify-between pt-4 pb-1"
            >
              {navCategories.map((cat, i) => (
                <div 
                  key={cat.label}
                  className="relative group"
                  onMouseEnter={() => setShowMegaMenu(i)}
                  onMouseLeave={() => setShowMegaMenu(null)}
                >
                  <Link
                    to={cat.path}
                    className="flex items-center gap-1 text-white/90 hover:text-white font-medium text-sm py-2"
                  >
                    {cat.label}
                    <ChevronDown className="h-3 w-3" />
                  </Link>
                  
                  {showMegaMenu === i && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] py-3 z-50 text-brand-navy border border-gray-100"
                    >
                      <p className="px-4 py-1 text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">{cat.label}</p>
                      {cat.items.map(({ label, path }) => (
                        <Link
                          to={path}
                          key={label}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-brand-navy/5 hover:text-brand-blue transition-colors"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow flex-shrink-0" />
                          {label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      {/* Live Camera View Modal */}
      <AnimatePresence>
        {showLiveCamera && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-md border border-gray-200 flex flex-col"
            >
              {/* Modal Header */}
              <div className="bg-brand-navy p-5 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-brand-yellow" />
                  <h3 className="font-heading font-bold text-lg">Live Camera Capture</h3>
                </div>
                <button 
                  onClick={handleStopLiveCamera}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Camera Video Stream Panel */}
              <div className="p-6 flex flex-col items-center gap-6">
                <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-gray-700 shadow-md">
                  <video 
                    ref={cameraVideoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover" 
                  />
                  {/* Subtle target box overlay */}
                  <div className="absolute inset-8 border-2 border-dashed border-white/40 rounded-xl pointer-events-none flex items-center justify-center">
                    <span className="text-white/20 text-xs font-bold font-heading uppercase tracking-widest text-center">Align Product Here</span>
                  </div>
                </div>

                {/* Capture & Cancel Action buttons */}
                <div className="flex gap-4 w-full">
                  <button
                    type="button"
                    onClick={handleStopLiveCamera}
                    className="flex-1 py-3 px-6 rounded-xl border border-gray-300 font-bold text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCapturePhoto}
                    className="flex-1 py-3 px-6 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-bold transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Capture Photo
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Visual Search Scanning Modal */}
      <AnimatePresence>
        {isScanning && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl overflow-hidden shadow-3d w-full max-w-md border border-gray-100 flex flex-col"
            >
              {/* Modal Header */}
              <div className="bg-brand-navy p-5 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-brand-yellow" />
                  <h3 className="font-heading font-bold text-lg">Visual Search Scanner</h3>
                </div>
                <button 
                  onClick={() => setIsScanning(false)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scanner Preview */}
              <div className="p-6 w-full flex flex-col items-center">
                <div className="relative w-64 h-64 bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 shadow-inner flex items-center justify-center p-2">
                  {cameraImagePreview ? (
                    <>
                      <img 
                        src={cameraImagePreview} 
                        className="w-full h-full object-contain rounded-xl" 
                        alt="Scanning Preview" 
                      />
                      {/* Scanning Line overlay */}
                      <motion.div 
                        animate={{ y: [-10, 240, -10] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="absolute left-2 right-2 h-1 bg-brand-blue shadow-[0_0_12px_rgba(40,116,240,0.8)] rounded pointer-events-none"
                      />
                    </>
                  ) : (
                    <div className="text-gray-300 flex flex-col items-center gap-2">
                      <Camera className="w-12 h-12 stroke-[1.5]" />
                      <span className="text-xs">No image loaded</span>
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-6 relative">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "linear" }}
                    className="h-full bg-brand-blue"
                  />
                </div>

                {/* Status message */}
                <div className="mt-4 text-center">
                  <p className="font-bold text-brand-navy text-sm font-heading">
                    {scanningStatus === 'uploading' && "Uploading image to server..."}
                    {scanningStatus === 'detecting' && "Running neural network classification..."}
                    {scanningStatus === 'matching' && "Matching identified visual features..."}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Please keep this window open</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
        {/* Error Toast */}
        <AnimatePresence>
          {showErrorToast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl shadow-3d flex items-start gap-3 w-full"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-sm font-heading">Voice Search Issue</p>
                <p className="text-xs text-red-700 mt-1 font-medium">{speechError}</p>
              </div>
              <button 
                onClick={() => setShowErrorToast(false)}
                className="text-red-400 hover:text-red-600 font-bold text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Toast */}
        <AnimatePresence>
          {showSuccessToast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-2xl shadow-3d flex items-start gap-3 w-full"
            >
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-sm font-heading">Search Result Matched</p>
                <p className="text-xs text-green-700 mt-1 font-medium">{successToastMessage}</p>
              </div>
              <button 
                onClick={() => setShowSuccessToast(false)}
                className="text-green-400 hover:text-green-600 font-bold text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
