import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, ShoppingBag, Heart, Tag, HelpCircle, LogOut, 
  MapPin, Phone, Mail, Check, Copy, Trash2, Plus, 
  Camera, Send, ChevronRight, MessageSquare, AlertCircle, 
  Clock, Package, Truck, Home, ShieldCheck, CheckCircle2,
  Calendar, CreditCard, ChevronDown, Edit2, ArrowRight
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

// Default mock data to populate if localStorage is empty
const defaultUser = {
  name: 'Khushi Kumari',
  email: 'khushi@elevate.com',
  phone: '9876543210',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
  gender: 'Female'
};

const defaultAddresses = [
  {
    id: 'addr-1',
    name: 'Khushi Kumari',
    phone: '9876543210',
    pincode: '560102',
    locality: 'HSR Layout Sector 2',
    address: 'Flat 304, Green Glen Apartments, 12th Main Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    type: 'Home',
    isDefault: true
  },
  {
    id: 'addr-2',
    name: 'Khushi Kumari (Office)',
    phone: '9876543210',
    pincode: '560103',
    locality: 'Outer Ring Road',
    address: 'Eco Space, Block 4, 3rd Floor, Bellandur',
    city: 'Bengaluru',
    state: 'Karnataka',
    type: 'Work',
    isDefault: false
  }
];

const mockHistoricalOrders = [
  {
    id: 'OD1209384756201938',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    items: [
      {
        id: 1,
        name: 'Sony WH-1000XM5 Wireless Headphones',
        price: 29999,
        mrp: 34999,
        image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/headphone/5/y/f/-original-imagq4y2wfddgr94.jpeg?q=70',
        quantity: 1,
        selectedColor: { name: 'Silver' }
      }
    ],
    totalPayable: 30028,
    address: {
      name: 'Khushi Kumari',
      phone: '9876543210',
      locality: 'HSR Layout Sector 2',
      address: 'Flat 304, Green Glen Apartments, 12th Main Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560102'
    },
    paymentMode: 'card',
    status: 'Delivered',
    estimatedDelivery: 'May 30th'
  },
  {
    id: 'OD7283946283920198',
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    items: [
      {
        id: 2,
        name: "Zara Men's Denim Jacket",
        price: 3499,
        mrp: 4999,
        image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/jacket/e/d/b/m-no-denim-jacket-jacket-denim-denimjacket-menjacket-darkdenim-original-imahf8yey3wep3qj.jpeg?q=70',
        quantity: 1,
        selectedColor: { name: 'Blue Denim' }
      },
      {
        id: 3,
        name: 'Modern Velvet Throw Cushion',
        price: 499,
        mrp: 999,
        image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/cushion/v/k/h/40-cushion-cover-soft-velvet-cushion-cover-for-sofa-decor-grey-original-imahfnyffuaf7shz.jpeg?q=70',
        quantity: 2
      }
    ],
    totalPayable: 4526,
    address: {
      name: 'Khushi Kumari',
      phone: '9876543210',
      locality: 'Outer Ring Road',
      address: 'Eco Space, Block 4, 3rd Floor, Bellandur',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103'
    },
    paymentMode: 'upi',
    status: 'Delivered',
    estimatedDelivery: 'May 20th'
  }
];

const couponsList = [
  { code: 'WELCOME200', discount: '₹200 OFF', desc: 'Get ₹200 off on your first order. Minimum value ₹599.', validUntil: 'Dec 31, 2026', type: 'cash' },
  { code: 'ELEVATE50', discount: '50% OFF', desc: '50% off on premium audio products. Up to ₹150.', validUntil: 'Jun 30, 2026', type: 'percent' },
  { code: 'FESTIVE15', discount: '15% OFF', desc: '15% discount on all fashion and accessories items.', validUntil: 'Oct 15, 2026', type: 'percent' },
  { code: 'FREESHIP', discount: 'FREE DELIVERY', desc: 'Enjoy free shipping on orders above ₹199.', validUntil: 'Dec 31, 2026', type: 'shipping' }
];

const faqCategories = [
  {
    title: 'Orders & Tracking',
    questions: [
      { q: 'How do I track my order?', a: 'Go to the "Orders History" tab, click "Track Order" on the corresponding card to see the real-time shipping progress.' },
      { q: 'Can I change my delivery address after placing an order?', a: 'Once an order is confirmed, the shipping address cannot be changed. Please cancel the order and place a new one with the correct address.' },
      { q: 'What is the estimated delivery time?', a: 'Standard shipping takes 3-5 business days. Express shipping delivers within 1-2 business days. Estimated delivery date is shown on each order card.' }
    ]
  },
  {
    title: 'Refunds & Returns',
    questions: [
      { q: 'What is your return policy?', a: 'We offer a 10-day return policy for most items. Items must be in their original packaging with tags intact. Go to your Orders history and click "Return Item" if eligible.' },
      { q: 'How long does a refund take?', a: 'Once the returned item passes quality check, refund is initiated within 2 business days. It takes 3-7 bank days to reflect in your original payment mode.' },
      { q: 'Can I exchange an item instead of a refund?', a: 'Yes, select the "Exchange" option during the return process and choose your preferred size or color variant.' }
    ]
  },
  {
    title: 'Payments & Promotions',
    questions: [
      { q: 'What payment modes are accepted?', a: 'We accept Credit/Debit Cards, UPI, Net Banking, and Cash on Delivery (COD).' },
      { q: 'Why is my coupon code not working?', a: 'Ensure that your cart meets the minimum value requirement of the coupon and that the coupon is not expired. Check the "My Coupons" tab for terms.' },
      { q: 'Is my payment secure?', a: 'Yes, all transactions are processed through 256-bit SSL encrypted secure payment gateways.' }
    ]
  }
];

export default function Account() {
  const navigate = useNavigate();
  const location = useLocation();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  // Tab states: profile, orders, coupons, wishlist, help
  const [activeTab, setActiveTab] = useState('profile');

  // Set tab from navigation state (like from header dropdown)
  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);
  
  // User Authentication / Details
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(defaultUser);
  const [addresses, setAddresses] = useState(defaultAddresses);
  const [orders, setOrders] = useState([]);
  
  // Edit Profile Mode
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState(defaultUser);

  // Address Form Mode
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    name: '', phone: '', pincode: '', locality: '',
    address: '', city: '', state: '', type: 'Home'
  });
  const [addressFormError, setAddressFormError] = useState('');

  // Expandable Order Details in Orders list
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Copy Coupon State
  const [copiedCouponCode, setCopiedCouponCode] = useState('');

  // Chatbot State in Help Center
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hi! I am Elevate, your customer support assistant. How can I help you today? You can ask me about tracking orders, active coupons, returns, or support contacts!' }
  ]);
  const [chatIsTyping, setChatIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  // Load state from localStorage on Mount
  useEffect(() => {
    // Session Setup
    const loggedIn = localStorage.getItem('elevate_is_logged_in') === 'true';
    if (!loggedIn && localStorage.getItem('elevate_is_logged_in') === null) {
      // Default auto-login user
      localStorage.setItem('elevate_is_logged_in', 'true');
      localStorage.setItem('elevate_user', JSON.stringify(defaultUser));
      setIsLoggedIn(true);
      setUser(defaultUser);
      setProfileForm(defaultUser);
    } else if (loggedIn) {
      setIsLoggedIn(true);
      const storedUser = localStorage.getItem('elevate_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setProfileForm(parsed);
      }
    } else {
      setIsLoggedIn(false);
    }

    // Load Addresses
    const storedAddresses = localStorage.getItem('elevate_addresses');
    if (storedAddresses) {
      setAddresses(JSON.parse(storedAddresses));
    } else {
      localStorage.setItem('elevate_addresses', JSON.stringify(defaultAddresses));
    }

    // Load Orders
    const storedOrders = localStorage.getItem('elevate_orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    } else {
      localStorage.setItem('elevate_orders', JSON.stringify(mockHistoricalOrders));
      setOrders(mockHistoricalOrders);
    }

    // Check for auth state changes on custom event
    const handleAuthChange = () => {
      const logged = localStorage.getItem('elevate_is_logged_in') === 'true';
      setIsLoggedIn(logged);
      if (logged) {
        const u = localStorage.getItem('elevate_user');
        if (u) {
          const parsed = JSON.parse(u);
          setUser(parsed);
          setProfileForm(parsed);
        }
      }
    };
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  // Sync scroll for chatbot
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatIsTyping]);

  const handleLogout = () => {
    localStorage.setItem('elevate_is_logged_in', 'false');
    setIsLoggedIn(false);
    window.dispatchEvent(new Event('authChange'));
    navigate('/login');
  };

  // Profile Save
  const handleProfileSave = (e) => {
    e.preventDefault();
    setUser(profileForm);
    localStorage.setItem('elevate_user', JSON.stringify(profileForm));
    setIsEditingProfile(false);
  };

  // Address Book Logic
  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const { name, phone, pincode, locality, address, city, state } = addressForm;
    if (!name || !phone || !pincode || !locality || !address || !city || !state) {
      setAddressFormError('All address fields are required');
      return;
    }
    if (phone.length !== 10 || isNaN(phone)) {
      setAddressFormError('Enter a valid 10-digit mobile number');
      return;
    }

    let updated;
    if (editingAddressId) {
      updated = addresses.map(addr => addr.id === editingAddressId ? { ...addr, ...addressForm } : addr);
    } else {
      const newAddr = {
        id: `addr-${Date.now()}`,
        ...addressForm,
        isDefault: addresses.length === 0
      };
      updated = [...addresses, newAddr];
    }

    setAddresses(updated);
    localStorage.setItem('elevate_addresses', JSON.stringify(updated));
    setShowAddressForm(false);
    setEditingAddressId(null);
    setAddressForm({ name: '', phone: '', pincode: '', locality: '', address: '', city: '', state: '', type: 'Home' });
    setAddressFormError('');
  };

  const handleEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      name: addr.name, phone: addr.phone, pincode: addr.pincode, locality: addr.locality,
      address: addr.address, city: addr.city, state: addr.state, type: addr.type
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (id) => {
    const updated = addresses.filter(addr => addr.id !== id);
    // If deleted the default, set first one as default
    if (updated.length > 0 && !updated.some(a => a.isDefault)) {
      updated[0].isDefault = true;
    }
    setAddresses(updated);
    localStorage.setItem('elevate_addresses', JSON.stringify(updated));
  };

  const handleSetDefaultAddress = (id) => {
    const updated = addresses.map(addr => ({ ...addr, isDefault: addr.id === id }));
    setAddresses(updated);
    localStorage.setItem('elevate_addresses', JSON.stringify(updated));
  };

  // Order Operations
  const handleCancelOrder = (id) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      const updated = orders.map(o => o.id === id ? { ...o, status: 'Cancelled' } : o);
      setOrders(updated);
      localStorage.setItem('elevate_orders', JSON.stringify(updated));
    }
  };

  const handleReorder = (order) => {
    order.items.forEach(item => {
      addToCart(item, item.quantity, item.selectedColor);
    });
    alert('Products added to cart successfully!');
    navigate('/cart');
  };

  // Clipboard Copier
  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCouponCode(code);
    setTimeout(() => setCopiedCouponCode(''), 3000);
  };

  // Chatbot responder
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setChatIsTyping(true);

    setTimeout(() => {
      setChatIsTyping(false);
      let reply = "";
      const text = userText.toLowerCase();

      // Smart order tracking
      if (text.includes('order') || text.includes('track') || text.includes('where is')) {
        const latestOrder = orders[0];
        if (latestOrder) {
          const itemsList = latestOrder.items.map(i => `${i.name} (x${i.quantity})`).join(', ');
          reply = `I found your latest order **${latestOrder.id}** placed on **${new Date(latestOrder.date).toLocaleDateString()}** containing: ${itemsList}.\n\nThe current status is: **${latestOrder.status}**.\nEstimated Delivery: **${latestOrder.estimatedDelivery || 'May 28th'}**.`;
        } else {
          reply = "I couldn't find any orders placed on your account. To place an order, add items to your cart and complete checkout.";
        }
      } 
      // Coupon query
      else if (text.includes('coupon') || text.includes('offer') || text.includes('discount')) {
        reply = `We have several active promotions! You can use:\n- **WELCOME200**: ₹200 off (orders > ₹599)\n- **ELEVATE50**: 50% off on audio gear\n- **FREESHIP**: Free shipping on orders > ₹199\n\nCopy them from the "My Coupons" section and paste them on checkout.`;
      } 
      // Return query
      else if (text.includes('return') || text.includes('refund') || text.includes('exchange')) {
        reply = "Our policy allows returns within 10 days of delivery. Go to your **Orders History** tab, locate the delivered order, and click **Return Item** to request a return label.";
      } 
      // Contact query
      else if (text.includes('contact') || text.includes('support') || text.includes('phone') || text.includes('email') || text.includes('call')) {
        reply = `You can get in touch with us through:\n📞 Phone Support: **1800-123-456** (9 AM - 9 PM)\n✉️ Email Support: **support@elevate.com**\n\nAlternatively, you can raise support tickets right here in the help section.`;
      } 
      // Hi/Hello
      else if (text.match(/\b(hi|hello|hey|greetings|hola)\b/)) {
        reply = `Hello ${user.name}! I hope you're having a wonderful day. How can I assist you with your Elevate account?`;
      } 
      // Default
      else {
        reply = "I'm sorry, I didn't quite get that. I've logged your message for our support agents. You can also contact us directly at support@elevate.com or check our structured FAQs below.";
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 1200);
  };

  // If not logged in, show login redirection card
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-3d border border-gray-100 text-center">
          <div className="w-20 h-20 bg-brand-navy/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-brand-navy stroke-[1.5]" />
          </div>
          <h2 className="text-2xl font-heading font-extrabold text-brand-navy mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-6">You need to sign in to access your dashboard, order history, coupons and addresses.</p>
          <Link 
            to="/login"
            className="w-full bg-[#2874F0] hover:bg-blue-600 text-white font-bold py-3.5 px-6 rounded-xl transition-colors block text-sm shadow-md"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50/50 py-8 text-left"
    >
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Breadcrumb / Top Info bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-heading font-extrabold text-brand-navy">My Account</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your profile, track shipments, check rewards and get help.</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 pr-4">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-10 h-10 rounded-xl object-cover" 
            />
            <div>
              <p className="text-sm font-bold text-brand-navy leading-none">{user.name}</p>
              <p className="text-xs text-gray-400 mt-1">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Dashboard grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Sidebar menu */}
          <div className="lg:col-span-3 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            
            {/* Sidebar header banner */}
            <div className="bg-brand-navy p-6 text-white text-center flex flex-col items-center border-b border-white/5 relative">
              <div className="relative group">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white/10 group-hover:opacity-85 transition-all shadow-md"
                />
                <button className="absolute bottom-0 right-0 bg-[#2874F0] p-1.5 rounded-lg text-white hover:scale-105 transition-transform" title="Upload Photo">
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
              <h3 className="font-heading font-extrabold text-lg mt-4">{user.name}</h3>
              <p className="text-white/60 text-xs mt-1">{user.email}</p>
            </div>

            {/* Sidebar Navigation Options */}
            <nav className="p-4 space-y-1">
              {[
                { id: 'profile', label: 'My Profile', icon: User },
                { id: 'orders', label: 'Orders History', icon: ShoppingBag, count: orders.length },
                { id: 'coupons', label: 'My Coupons', icon: Tag, count: couponsList.length },
                { id: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlistItems.length },
                { id: 'help', label: 'Help Center', icon: HelpCircle }
              ].map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
                      active 
                        ? 'bg-blue-50 text-[#2874F0] shadow-sm' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-brand-navy'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${active ? 'text-[#2874F0]' : 'text-gray-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.count > 0 && (
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                        active ? 'bg-[#2874F0] text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="pt-4 border-t border-gray-100 mt-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-300"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </div>

          {/* Right Column: Active Tab Content */}
          <div className="lg:col-span-9 bg-white rounded-3xl shadow-sm border border-gray-100 min-h-[600px] overflow-hidden p-6 md:p-8">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: PROFILE INFO */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8"
                >
                  {/* Profile Form Banner */}
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <div>
                      <h2 className="text-xl font-heading font-extrabold text-brand-navy">Personal Information</h2>
                      <p className="text-gray-400 text-xs mt-1">Manage your credentials and shipping contact preferences.</p>
                    </div>
                    {!isEditingProfile && (
                      <button 
                        onClick={() => setIsEditingProfile(true)}
                        className="flex items-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold px-4 py-2 rounded-xl text-xs transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-gray-400" /> Edit Profile
                      </button>
                    )}
                  </div>

                  {/* Profile Edit Panel */}
                  {isEditingProfile ? (
                    <form onSubmit={handleProfileSave} className="space-y-6 max-w-xl">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                          <input 
                            type="text" 
                            value={profileForm.name}
                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                            className="w-full border border-gray-200 px-4 py-3 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2874F0]"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                          <input 
                            type="email" 
                            value={profileForm.email}
                            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                            className="w-full border border-gray-200 px-4 py-3 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2874F0]"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 uppercase">Mobile Number</label>
                          <input 
                            type="tel" 
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                            className="w-full border border-gray-200 px-4 py-3 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2874F0]"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-500 uppercase">Gender</label>
                          <select 
                            value={profileForm.gender || 'Female'}
                            onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                            className="w-full border border-gray-200 px-4 py-3 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2874F0] bg-white"
                          >
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          type="submit"
                          className="bg-[#2874F0] hover:bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors"
                        >
                          Save Changes
                        </button>
                        <button 
                          type="button" 
                          onClick={() => {
                            setProfileForm(user);
                            setIsEditingProfile(false);
                          }}
                          className="border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold py-2.5 px-6 rounded-xl text-xs transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Full Name</span>
                        <p className="font-bold text-brand-navy mt-1 text-sm">{user.name}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Email Address</span>
                        <p className="font-bold text-brand-navy mt-1 text-sm">{user.email}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Mobile Number</span>
                        <p className="font-bold text-brand-navy mt-1 text-sm">+91 {user.phone}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Gender</span>
                        <p className="font-bold text-brand-navy mt-1 text-sm">{user.gender || 'Female'}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Account Status</span>
                        <p className="font-bold text-green-600 mt-1 text-sm flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Verified Customer</p>
                      </div>
                    </div>
                  )}

                  {/* ADDRESS BOOK */}
                  <div className="space-y-6 pt-4">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                      <div>
                        <h2 className="text-xl font-heading font-extrabold text-brand-navy">Manage Addresses</h2>
                        <p className="text-gray-400 text-xs mt-1">Configure default delivery options for seamless checkout.</p>
                      </div>
                      {!showAddressForm && (
                        <button 
                          onClick={() => {
                            setEditingAddressId(null);
                            setAddressForm({ name: '', phone: '', pincode: '', locality: '', address: '', city: '', state: '', type: 'Home' });
                            setShowAddressForm(true);
                          }}
                          className="bg-[#2874F0] hover:bg-blue-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          <Plus className="w-4 h-4" /> Add Address
                        </button>
                      )}
                    </div>

                    {/* Address Form panel */}
                    {showAddressForm && (
                      <motion.form 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        onSubmit={handleAddressSubmit}
                        className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-4"
                      >
                        <h3 className="font-bold text-sm text-brand-navy uppercase border-b border-gray-200 pb-2">
                          {editingAddressId ? 'Edit Address' : 'Add New Address'}
                        </h3>
                        {addressFormError && (
                          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-semibold flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" /> {addressFormError}
                          </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input 
                            type="text"
                            placeholder="Name"
                            value={addressForm.name}
                            onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                            className="border border-gray-200 px-4 py-2.5 text-sm rounded-xl bg-white"
                            required
                          />
                          <input 
                            type="text"
                            placeholder="10-digit mobile number"
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                            className="border border-gray-200 px-4 py-2.5 text-sm rounded-xl bg-white"
                            required
                          />
                          <input 
                            type="text"
                            placeholder="Pincode"
                            value={addressForm.pincode}
                            onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                            className="border border-gray-200 px-4 py-2.5 text-sm rounded-xl bg-white"
                            required
                          />
                          <input 
                            type="text"
                            placeholder="Locality"
                            value={addressForm.locality}
                            onChange={(e) => setAddressForm({ ...addressForm, locality: e.target.value })}
                            className="border border-gray-200 px-4 py-2.5 text-sm rounded-xl bg-white"
                            required
                          />
                        </div>
                        <textarea 
                          placeholder="Address (Area and Street)"
                          value={addressForm.address}
                          onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                          className="w-full border border-gray-200 px-4 py-2.5 text-sm rounded-xl bg-white h-20 resize-none"
                          required
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input 
                            type="text"
                            placeholder="City/District/Town"
                            value={addressForm.city}
                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                            className="border border-gray-200 px-4 py-2.5 text-sm rounded-xl bg-white"
                            required
                          />
                          <input 
                            type="text"
                            placeholder="State"
                            value={addressForm.state}
                            onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                            className="border border-gray-200 px-4 py-2.5 text-sm rounded-xl bg-white"
                            required
                          />
                        </div>
                        
                        <div className="flex gap-4 items-center">
                          <span className="text-xs font-bold text-gray-500 uppercase">Address Type:</span>
                          <div className="flex gap-3">
                            {['Home', 'Work'].map(type => (
                              <button
                                type="button"
                                key={type}
                                onClick={() => setAddressForm({ ...addressForm, type })}
                                className={`px-4 py-1.5 border text-xs font-bold rounded-xl transition-all ${
                                  addressForm.type === type 
                                    ? 'bg-brand-navy text-white border-brand-navy shadow-sm' 
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                {type}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button 
                            type="submit"
                            className="bg-[#2874F0] hover:bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors"
                          >
                            Save Address
                          </button>
                          <button 
                            type="button" 
                            onClick={() => {
                              setShowAddressForm(false);
                              setEditingAddressId(null);
                            }}
                            className="border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold py-2.5 px-6 rounded-xl text-xs transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.form>
                    )}

                    {/* Address Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((addr) => (
                        <div 
                          key={addr.id}
                          className={`p-5 border rounded-2xl transition-all relative flex flex-col justify-between ${
                            addr.isDefault 
                              ? 'border-[#2874F0] bg-blue-50/10 shadow-[0_0_15px_rgba(40,116,240,0.05)]' 
                              : 'border-gray-100 hover:shadow-sm bg-white'
                          }`}
                        >
                          <div className="text-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-extrabold text-brand-navy">{addr.name}</span>
                              <span className="px-2 py-0.5 bg-gray-100 text-[10px] uppercase font-bold text-gray-400 rounded-lg">
                                {addr.type}
                              </span>
                              {addr.isDefault && (
                                <span className="px-2 py-0.5 bg-green-50 border border-green-100 text-[10px] uppercase font-bold text-green-600 rounded-lg">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 mt-1.5 leading-relaxed">{addr.address}</p>
                            <p className="text-gray-600 font-medium">{addr.locality}, {addr.city}, {addr.state} - <span className="font-bold">{addr.pincode}</span></p>
                            <p className="mt-2 text-xs font-semibold text-gray-400">Phone: {addr.phone}</p>
                          </div>

                          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-50 text-xs">
                            <button 
                              onClick={() => handleEditAddress(addr)}
                              className="text-[#2874F0] hover:underline font-bold"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="text-red-500 hover:underline font-bold"
                            >
                              Delete
                            </button>
                            {!addr.isDefault && (
                              <button 
                                onClick={() => handleSetDefaultAddress(addr.id)}
                                className="text-gray-500 hover:text-brand-navy hover:underline font-bold ml-auto"
                              >
                                Set as Default
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: ORDERS HISTORY */}
              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="pb-4 border-b border-gray-100">
                    <h2 className="text-xl font-heading font-extrabold text-brand-navy">Order History</h2>
                    <p className="text-gray-400 text-xs mt-1">Track open shipments, cancel bookings, and review previous receipts.</p>
                  </div>

                  {orders.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                      <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4 stroke-[1.5]" />
                      <h3 className="font-bold text-brand-navy text-lg mb-1">No Orders Found</h3>
                      <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">You haven't placed any orders yet. Find some amazing products in store.</p>
                      <Link 
                        to="/"
                        className="bg-[#2874F0] text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-blue-600 transition-all inline-block shadow-sm"
                      >
                        Shop Now
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => {
                        const isExpanded = expandedOrderId === order.id;
                        const formattedDate = new Date(order.date).toLocaleDateString('en-US', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        });

                        return (
                          <div 
                            key={order.id}
                            className={`border rounded-2xl overflow-hidden transition-all bg-white ${
                              isExpanded 
                                ? 'border-[#2874F0] shadow-md shadow-blue-500/5' 
                                : 'border-gray-100 hover:border-gray-200 shadow-sm'
                            }`}
                          >
                            {/* Summary Card Header */}
                            <div 
                              onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                              className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                            >
                              <div className="space-y-1.5 text-left">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono text-xs font-bold text-gray-500 uppercase">Order ID: {order.id}</span>
                                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                                    order.status === 'Cancelled' 
                                      ? 'bg-red-50 text-red-600 border border-red-100' 
                                      : order.status === 'Delivered' 
                                        ? 'bg-green-50 text-green-600 border border-green-100'
                                        : 'bg-blue-50 text-[#2874F0] border border-blue-100'
                                  }`}>
                                    {order.status}
                                  </span>
                                </div>
                                <div className="flex gap-4 text-xs font-semibold text-gray-400">
                                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formattedDate}</span>
                                  <span className="flex items-center gap-1"><CreditCard className="w-3.5 h-3.5" /> Total: ₹{order.totalPayable.toLocaleString()}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                {/* Item Previews (Small images) */}
                                <div className="flex -space-x-2 overflow-hidden">
                                  {order.items.slice(0, 3).map((item, index) => (
                                    <img 
                                      key={index} 
                                      src={item.image} 
                                      alt="Product preview" 
                                      className="w-8 h-8 rounded-lg border border-gray-100 object-contain p-0.5 bg-white mix-blend-multiply flex-shrink-0"
                                    />
                                  ))}
                                  {order.items.length > 3 && (
                                    <div className="w-8 h-8 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-500 z-10">
                                      +{order.items.length - 3}
                                    </div>
                                  )}
                                </div>

                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180 text-brand-blue' : ''}`} />
                              </div>
                            </div>

                            {/* Details Accordion Panel */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0 }}
                                  animate={{ height: 'auto' }}
                                  exit={{ height: 0 }}
                                  className="border-t border-gray-100 overflow-hidden bg-gray-50/30"
                                >
                                  <div className="p-5 space-y-6">
                                    
                                    {/* Tracking Progress timeline (only for active orders) */}
                                    {order.status !== 'Cancelled' && (
                                      <div className="bg-white p-5 rounded-2xl border border-gray-100">
                                        <h4 className="font-bold text-xs uppercase text-gray-400 mb-4 tracking-wider">Tracking Status</h4>
                                        <div className="relative flex justify-between items-center max-w-lg mx-auto py-2">
                                          {/* Background line */}
                                          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-100 z-0" />
                                          <div 
                                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-green-500 z-0 transition-all duration-500" 
                                            style={{ width: order.status === 'Delivered' ? '100%' : '20%' }}
                                          />
                                          
                                          {/* Step nodes */}
                                          {[
                                            { label: 'Placed', active: true },
                                            { label: 'Shipped', active: order.status === 'Delivered' },
                                            { label: 'Delivered', active: order.status === 'Delivered' }
                                          ].map((step, i) => (
                                            <div key={i} className="flex flex-col items-center gap-1.5 relative z-10">
                                              <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center ${
                                                step.active 
                                                  ? 'bg-green-500 border-white text-white shadow-sm' 
                                                  : 'bg-white border-gray-200 text-gray-400'
                                              }`}>
                                                <Check className="w-3.5 h-3.5 stroke-[3px]" />
                                              </div>
                                              <span className="text-[10px] font-bold text-brand-navy font-heading">{step.label}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Items List */}
                                    <div className="space-y-3 bg-white p-4 rounded-2xl border border-gray-100">
                                      <h4 className="font-bold text-xs uppercase text-gray-400 tracking-wider">Items Details</h4>
                                      {order.items.map((item, index) => (
                                        <div key={index} className="flex gap-4 items-center py-2.5 border-b border-gray-50 last:border-0">
                                          <img 
                                            src={item.image} 
                                            alt={item.name} 
                                            className="w-12 h-12 object-contain mix-blend-multiply p-0.5 bg-gray-50 border border-gray-100 rounded-lg flex-shrink-0"
                                          />
                                          <div className="flex-1 min-w-0">
                                            <h5 className="font-bold text-sm text-brand-navy truncate hover:text-[#2874F0]">
                                              <Link to={`/product/${item.id}`}>{item.name}</Link>
                                            </h5>
                                            <p className="text-xs text-gray-400 mt-1">
                                              Qty: {item.quantity} {item.selectedColor ? `| Color: ${item.selectedColor.name}` : ''}
                                            </p>
                                          </div>
                                          <div className="text-right">
                                            <span className="font-mono text-sm font-bold text-brand-navy">₹{item.price.toLocaleString()}</span>
                                            {item.mrp && item.mrp > item.price && (
                                              <p className="font-mono text-xs text-gray-400 line-through mt-0.5">₹{item.mrp.toLocaleString()}</p>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Shipping details and payment info */}
                                    <div className="grid md:grid-cols-2 gap-5">
                                      <div className="bg-white p-4 rounded-2xl border border-gray-100 text-sm">
                                        <h4 className="font-bold text-xs uppercase text-gray-400 mb-2 tracking-wider">Shipping Address</h4>
                                        <p className="font-bold text-gray-800 text-xs">{order.address?.name}</p>
                                        <p className="text-gray-600 text-xs mt-1">{order.address?.address}</p>
                                        <p className="text-gray-600 text-xs font-semibold">{order.address?.locality}, {order.address?.city} - {order.address?.pincode}</p>
                                      </div>

                                      <div className="bg-white p-4 rounded-2xl border border-gray-100 text-sm flex flex-col justify-between">
                                        <div>
                                          <h4 className="font-bold text-xs uppercase text-gray-400 mb-2 tracking-wider">Payment Info</h4>
                                          <p className="text-xs text-gray-600 font-semibold capitalize">Method: <span className="font-bold text-brand-navy">{order.paymentMode}</span></p>
                                          <p className="text-xs text-gray-600 font-semibold mt-1">Status: <span className="font-bold text-green-600 uppercase">Paid</span></p>
                                        </div>
                                        <button 
                                          onClick={() => alert(`Downloading Invoice for order ${order.id}...`)}
                                          className="text-[#2874F0] hover:underline font-bold text-xs text-left mt-3 flex items-center gap-1"
                                        >
                                          Download Invoice (PDF)
                                        </button>
                                      </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex gap-3 justify-end">
                                      {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                                        <button 
                                          onClick={() => handleCancelOrder(order.id)}
                                          className="border border-red-200 text-red-500 hover:bg-red-50 font-bold py-2 px-5 rounded-xl text-xs transition-colors"
                                        >
                                          Cancel Order
                                        </button>
                                      )}
                                      <button 
                                        onClick={() => handleReorder(order)}
                                        className="bg-[#2874F0] hover:bg-blue-600 text-white font-bold py-2 px-5 rounded-xl text-xs transition-colors flex items-center gap-1.5"
                                      >
                                        Reorder Items
                                      </button>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 3: COUPONS */}
              {activeTab === 'coupons' && (
                <motion.div
                  key="coupons"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="pb-4 border-b border-gray-100">
                    <h2 className="text-xl font-heading font-extrabold text-brand-navy">My Coupons</h2>
                    <p className="text-gray-400 text-xs mt-1">Available discounts to apply at checkout. Click any card to copy code.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {couponsList.map((coupon) => {
                      const isCopied = copiedCouponCode === coupon.code;

                      return (
                        <div 
                          key={coupon.code}
                          onClick={() => copyToClipboard(coupon.code)}
                          className={`p-6 border rounded-2xl transition-all cursor-pointer relative overflow-hidden group flex flex-col justify-between min-h-[160px] ${
                            isCopied 
                              ? 'border-[#2874F0] bg-blue-50/10 shadow-sm' 
                              : 'border-gray-100 hover:border-gray-200 hover:shadow-sm bg-white'
                          }`}
                        >
                          {/* Radial Gradient overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-blue-50/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                          
                          {/* Left ticket notched circles */}
                          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-50 border-r border-gray-200" />
                          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-50 border-l border-gray-200" />

                          <div>
                            <div className="flex justify-between items-start">
                              <span className={`text-xl font-heading font-extrabold tracking-tight ${
                                coupon.type === 'shipping' ? 'text-[#FB641B]' : 'text-[#2874F0]'
                              }`}>
                                {coupon.discount}
                              </span>
                              <div className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-mono font-bold text-gray-500 uppercase flex items-center gap-1 border border-gray-150">
                                {coupon.code}
                                {isCopied ? (
                                  <Check className="w-3.5 h-3.5 text-green-500 stroke-[3px]" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                )}
                              </div>
                            </div>
                            <p className="text-gray-600 text-xs font-semibold mt-3 max-w-[85%]">{coupon.desc}</p>
                          </div>

                          <div className="flex justify-between items-center text-[10px] text-gray-400 border-t border-gray-50 pt-3 mt-4">
                            <span>Valid Till: {coupon.validUntil}</span>
                            {isCopied && <span className="text-green-600 font-bold uppercase tracking-wider animate-pulse">Copied!</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* TAB 4: WISHLIST */}
              {activeTab === 'wishlist' && (
                <motion.div
                  key="wishlist"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="pb-4 border-b border-gray-100">
                    <h2 className="text-xl font-heading font-extrabold text-brand-navy">My Wishlist</h2>
                    <p className="text-gray-400 text-xs mt-1">Review saved products, add them directly to cart, or delete them.</p>
                  </div>

                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                      <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4 stroke-[1.5]" />
                      <h3 className="font-bold text-brand-navy text-lg mb-1">Your Wishlist is Empty</h3>
                      <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">Save articles you love in your wishlist to keep track of prices and items.</p>
                      <Link 
                        to="/"
                        className="bg-[#2874F0] text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-blue-600 transition-all inline-block shadow-sm"
                      >
                        Find Products
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {wishlistItems.map((item) => (
                        <div 
                          key={item.id}
                          className="flex gap-4 p-4 border border-gray-100 rounded-2xl bg-white hover:shadow-sm transition-all"
                        >
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-20 h-20 object-contain mix-blend-multiply flex-shrink-0 p-1 bg-gray-50 rounded-xl"
                          />
                          <div className="flex-grow min-w-0 flex flex-col justify-between">
                            <div>
                              <h4 className="font-bold text-sm text-brand-navy truncate hover:text-[#2874F0]">
                                <Link to={`/product/${item.id}`}>{item.name}</Link>
                              </h4>
                              <p className="text-xs text-gray-400 mt-1">{item.brand} | {item.category}</p>
                              
                              <div className="flex items-center gap-2 mt-2">
                                <span className="font-mono text-sm font-bold text-brand-navy">₹{item.price.toLocaleString()}</span>
                                {item.mrp && item.mrp > item.price && (
                                  <span className="font-mono text-xs text-gray-400 line-through">₹{item.mrp.toLocaleString()}</span>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-3 mt-3">
                              <button 
                                onClick={() => {
                                  addToCart(item, 1);
                                  alert('Item added to cart!');
                                }}
                                className="bg-[#2874F0] hover:bg-blue-600 text-white font-bold py-1.5 px-4 rounded-lg text-xs transition-colors flex-1"
                              >
                                Add to Cart
                              </button>
                              <button 
                                onClick={() => removeFromWishlist(item.id)}
                                className="border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors flex-shrink-0"
                                title="Remove from Wishlist"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 5: HELP CENTER */}
              {activeTab === 'help' && (
                <motion.div
                  key="help"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8"
                >
                  <div className="pb-4 border-b border-gray-100">
                    <h2 className="text-xl font-heading font-extrabold text-brand-navy">Help Center</h2>
                    <p className="text-gray-400 text-xs mt-1">Get support via automated chat, raise service queries, or browse common solutions.</p>
                  </div>

                  {/* CHATBOT PANELS */}
                  <div className="bg-gray-50 border border-gray-100 rounded-3xl overflow-hidden shadow-inner">
                    
                    {/* Chat header */}
                    <div className="bg-brand-navy p-4 text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-yellow flex items-center justify-center font-bold text-sm text-brand-navy">E</div>
                      <div className="text-left">
                        <p className="text-sm font-bold">Elevate Support AI</p>
                        <p className="text-[10px] text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-ping" /> Online & Active</p>
                      </div>
                    </div>

                    {/* Messages Body */}
                    <div className="h-64 overflow-y-auto p-4 space-y-3 bg-white flex flex-col">
                      {chatMessages.map((msg, i) => (
                        <div 
                          key={i} 
                          className={`max-w-[75%] rounded-2xl p-3 text-xs leading-relaxed ${
                            msg.sender === 'user' 
                              ? 'bg-blue-50 text-gray-800 self-end rounded-tr-none' 
                              : 'bg-gray-100 text-gray-800 self-start rounded-tl-none whitespace-pre-line'
                          }`}
                        >
                          {msg.text}
                        </div>
                      ))}
                      {chatIsTyping && (
                        <div className="bg-gray-100 text-gray-400 self-start rounded-2xl rounded-tl-none p-3 text-xs flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                        </div>
                      )}
                      <div ref={chatBottomRef} />
                    </div>

                    {/* Chat Input form */}
                    <form onSubmit={handleSendMessage} className="p-3 bg-gray-50 border-t border-gray-100 flex gap-2">
                      <input 
                        type="text"
                        placeholder="Ask about returns, tracking, coupons..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#2874F0] bg-white"
                      />
                      <button 
                        type="submit"
                        className="bg-brand-navy hover:bg-[#2874F0] text-white p-2 rounded-xl transition-all"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>

                  {/* STRUCTURED FAQs */}
                  <div className="space-y-6">
                    <h3 className="font-heading font-extrabold text-brand-navy text-lg text-left">Frequently Asked Questions</h3>
                    <div className="space-y-4">
                      {faqCategories.map((category, catIdx) => (
                        <div key={catIdx} className="space-y-2">
                          <h4 className="text-xs uppercase font-extrabold text-gray-400 tracking-wider mb-2 text-left">{category.title}</h4>
                          <div className="space-y-2.5">
                            {category.questions.map((faq, faqIdx) => (
                              <details 
                                key={faqIdx} 
                                className="group border border-gray-100 rounded-2xl bg-white overflow-hidden [&_summary::-webkit-details-marker]:hidden"
                              >
                                <summary className="flex items-center justify-between p-4 cursor-pointer select-none">
                                  <span className="text-sm font-bold text-gray-800 text-left">{faq.q}</span>
                                  <ChevronDown className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180" />
                                </summary>
                                <div className="px-4 pb-4 text-xs text-gray-500 leading-relaxed border-t border-gray-50 pt-3 text-left whitespace-pre-line">
                                  {faq.a}
                                </div>
                              </details>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* DIRECT CONTACT SUPPORT */}
                  <div className="bg-brand-navy/5 border border-brand-navy/15 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
                    <div>
                      <h4 className="font-heading font-extrabold text-brand-navy text-base">Still need assistance?</h4>
                      <p className="text-gray-500 text-xs mt-1">Our support executives are available 9:00 AM - 9:00 PM every day.</p>
                    </div>
                    <div className="flex gap-4 flex-wrap text-sm">
                      <a href="tel:1800123456" className="flex items-center gap-2 text-[#2874F0] hover:underline font-bold">
                        <Phone className="w-4 h-4" /> 1800-123-456
                      </a>
                      <a href="mailto:support@elevate.com" className="flex items-center gap-2 text-[#2874F0] hover:underline font-bold">
                        <Mail className="w-4 h-4" /> support@elevate.com
                      </a>
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
