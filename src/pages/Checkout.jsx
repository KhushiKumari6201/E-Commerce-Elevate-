import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, MapPin, CreditCard, Lock, Smartphone, User, Plus, 
  Trash2, PlusCircle, MinusCircle, AlertCircle, ShoppingBag, 
  RefreshCw, ShieldCheck, HelpCircle, Truck, Package, Clock, 
  Home, CheckCircle2, ArrowLeft, Phone, Mail
} from 'lucide-react';
import { useCart } from '../context/CartContext';

// Helper to generate a random 4-digit captcha
const generateCaptcha = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Helper to generate a random Order ID
const generateOrderId = () => {
  return 'OD' + Math.floor(1000000000000000 + Math.random() * 9000000000000000);
};

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

  // Load items from navigation state or fallback to cart items
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [isDirectBuy, setIsDirectBuy] = useState(false);

  useEffect(() => {
    if (location.state?.checkoutItems && location.state.checkoutItems.length > 0) {
      setCheckoutItems(location.state.checkoutItems);
      setIsDirectBuy(true); // Direct buy bypasses the cart clearing
    } else {
      setCheckoutItems(cartItems);
      setIsDirectBuy(false);
    }
  }, [location.state, cartItems]);

  // Steps active state: 1 (Login), 2 (Address), 3 (Order Summary), 4 (Payment)
  const [activeStep, setActiveStep] = useState(2);
  const [completedSteps, setCompletedSteps] = useState({
    1: true,
    2: false,
    3: false,
    4: false
  });

  // Step 1: Login State - User is automatically logged in (no login form)
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('khushi@elevate.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [loginError, setLoginError] = useState('');

  // Step 2: Address State
  const [addresses, setAddresses] = useState([
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
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState('addr-1');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    pincode: '',
    locality: '',
    address: '',
    city: '',
    state: '',
    type: 'Home'
  });
  const [addressFormError, setAddressFormError] = useState('');

  // Step 4: Payment State
  const [paymentMode, setPaymentMode] = useState('cod');
  const [upiId, setUpiId] = useState('');
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '' });
  const [netBank, setNetBank] = useState('SBI');
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState(false);

  // Success Screen States
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState('');
  const [confettiElements, setConfettiElements] = useState([]);
  const [showTracking, setShowTracking] = useState(false);

  // Auto-login user if they click continue
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmailOrPhone) {
      setLoginError('Please enter Email or Mobile Number');
      return;
    }
    setIsLoggedIn(true);
    setCompletedSteps(prev => ({ ...prev, 1: true }));
    setActiveStep(2);
  };

  const handleDeliverHere = () => {
    setCompletedSteps(prev => ({ ...prev, 2: true }));
    setActiveStep(3);
  };

  const handleAddressFormChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const { name, phone, pincode, locality, address, city, state } = addressForm;
    if (!name || !phone || !pincode || !locality || !address || !city || !state) {
      setAddressFormError('All fields are required');
      return;
    }
    if (phone.length !== 10 || isNaN(phone)) {
      setAddressFormError('Please enter a valid 10-digit phone number');
      return;
    }
    const newAddr = {
      id: `addr-${Date.now()}`,
      ...addressForm,
      isDefault: false
    };
    setAddresses([...addresses, newAddr]);
    setSelectedAddressId(newAddr.id);
    setShowAddressForm(false);
    setAddressForm({
      name: '',
      phone: '',
      pincode: '',
      locality: '',
      address: '',
      city: '',
      state: '',
      type: 'Home'
    });
    setAddressFormError('');
  };

  const handleSummaryContinue = () => {
    setCompletedSteps(prev => ({ ...prev, 3: true }));
    setActiveStep(4);
  };

  // Captcha refresh
  const handleRefreshCaptcha = () => {
    setCaptchaCode(generateCaptcha());
    setCaptchaInput('');
    setCaptchaError(false);
  };

  // Payment Confirmation
  const handlePlaceOrder = () => {
    if (paymentMode === 'cod') {
      if (captchaInput !== captchaCode) {
        setCaptchaError(true);
        return;
      }
    } else if (paymentMode === 'upi') {
      if (!upiId.includes('@')) {
        alert('Please enter a valid UPI ID (e.g. name@bank)');
        return;
      }
    } else if (paymentMode === 'card') {
      if (cardForm.number.replace(/\s/g, '').length < 16 || !cardForm.expiry || cardForm.cvv.length < 3) {
        alert('Please fill all card details correctly');
        return;
      }
    }

    // Start payment loader
    setIsProcessing(true);
    setProcessingMessage('Securing connection with bank...');
    
    setTimeout(() => {
      setProcessingMessage('Verifying payment details with payment gateway...');
    }, 1000);

    setTimeout(() => {
      setProcessingMessage('Order registered! Setting up delivery details...');
    }, 2000);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setSuccessOrderId(generateOrderId());
      
      // Clear cart globally if order was from cart items
      if (!isDirectBuy) {
        clearCart();
      }

      // Generate confetti
      const confettis = Array.from({ length: 100 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        color: ['#FFC200', '#2874F0', '#FB641B', '#4CAF50', '#E91E63'][Math.floor(Math.random() * 5)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360
      }));
      setConfettiElements(confettis);
    }, 3200);
  };

  // Calculate pricing summary
  const totalItemsCount = checkoutItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalMrp = checkoutItems.reduce((acc, item) => acc + ((item.mrp || item.price) * item.quantity), 0);
  const totalDiscount = checkoutItems.reduce((acc, item) => acc + (((item.mrp || item.price) - item.price) * item.quantity), 0);
  const totalProductPrice = totalMrp - totalDiscount;
  
  const deliveryCharge = totalProductPrice > 500 ? 0 : 40;
  const packagingFee = totalItemsCount > 0 ? 29 : 0;
  const totalPayable = totalProductPrice + deliveryCharge + packagingFee;

  const selectedAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

  const handleStepClick = (step) => {
    // Only allow clicking to step if previous steps are completed
    if (step === 1) {
      setActiveStep(1);
    } else if (step === 2 && isLoggedIn) {
      setActiveStep(2);
    } else if (step === 3 && isLoggedIn && completedSteps[2]) {
      setActiveStep(3);
    } else if (step === 4 && isLoggedIn && completedSteps[2] && completedSteps[3]) {
      setActiveStep(4);
    }
  };

  // Confetti CSS animation helper
  const confettiStyle = `
    @keyframes fall {
      0% {
        transform: translateY(-20px) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
      }
    }
    .animate-fall {
      animation: fall 4s linear infinite;
    }
  `;

  // Render Order Success Screen
  if (isSuccess) {
    // Tracking Status Component
    const TrackingView = () => {
      const trackingSteps = [
        { 
          id: 1, 
          status: 'Order Confirmed', 
          description: 'Your order has been confirmed.',
          time: 'Just now',
          completed: true,
          icon: CheckCircle2
        },
        { 
          id: 2, 
          status: 'Processing', 
          description: 'Your order is being prepared for shipment.',
          time: 'Expected in 1 hour',
          completed: false,
          icon: Package
        },
        { 
          id: 3, 
          status: 'Shipped', 
          description: 'Your order has been picked up by the courier.',
          time: 'Expected tomorrow',
          completed: false,
          icon: Truck
        },
        { 
          id: 4, 
          status: 'Out for Delivery', 
          description: 'Your order is on the way.',
          time: 'Expected May 28th',
          completed: false,
          icon: Home
        },
        { 
          id: 5, 
          status: 'Delivered', 
          description: 'Your order has been delivered.',
          time: 'Expected by 9 PM',
          completed: false,
          icon: CheckCircle2
        }
      ];

      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
          <style dangerouslySetInnerHTML={{ __html: confettiStyle }} />
          
          {/* Confetti Elements */}
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            {confettiElements.map(c => (
              <div
                key={c.id}
                className="absolute animate-fall"
                style={{
                  left: `${c.left}%`,
                  top: `-20px`,
                  animationDelay: `${c.delay}s`,
                  backgroundColor: c.color,
                  width: `${c.size}px`,
                  height: `${c.size * 2}px`,
                  borderRadius: '2px',
                  transform: `rotate(${c.rotation}deg)`,
                  opacity: 0.8
                }}
              />
            ))}
          </div>

          {/* Tracking Card */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="bg-white w-full max-w-3xl rounded-3xl shadow-3d overflow-hidden border border-gray-100 z-20"
          >
            {/* Header with Back Button */}
            <div className="bg-[#2874F0] p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowTracking(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-2xl font-heading font-extrabold">Track Your Order</h2>
                  <p className="text-white/80 text-sm mt-1">Order ID: {successOrderId}</p>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="p-8">
              {/* Order Summary */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Estimated Delivery</p>
                  <p className="text-xl font-bold text-brand-navy">Thursday, May 28th by 9 PM</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-700">Delivery Address</p>
                  <p className="text-sm font-bold text-brand-navy">{selectedAddress.locality}, {selectedAddress.city}</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-0">
                {trackingSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isLast = index === trackingSteps.length - 1;
                  
                  return (
                    <div key={step.id} className="flex gap-4 pb-8 relative">
                      {/* Vertical Line */}
                      {!isLast && (
                        <div 
                          className={`absolute left-8 top-16 bottom-0 w-0.5 ${
                            step.completed ? 'bg-green-500' : 'bg-gray-200'
                          }`}
                        />
                      )}
                      
                      {/* Icon Circle */}
                      <div className="flex-shrink-0 relative z-10">
                        <div 
                          className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg shadow-md border-4 ${
                            step.completed 
                              ? 'bg-green-500 text-white border-white' 
                              : 'bg-white text-gray-400 border-gray-300'
                          }`}
                        >
                          <StepIcon className="w-8 h-8" />
                        </div>
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 pt-1">
                        <h3 className={`text-lg font-bold mb-1 ${
                          step.completed ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {step.status}
                        </h3>
                        <p className={`text-sm mb-2 ${
                          step.completed ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {step.description}
                        </p>
                        <p className={`text-xs font-semibold ${
                          step.completed ? 'text-green-600' : 'text-brand-blue'
                        }`}>
                          {step.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Contact Support */}
              <div className="bg-gray-50 rounded-xl p-4 mt-8 border border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-3">Need Help?</p>
                <div className="space-y-2 text-sm">
                  <a href="tel:1800123456" className="flex items-center gap-2 text-[#2874F0] hover:underline font-medium">
                    <Phone className="w-4 h-4" /> Call Customer Support: 1800-123-456
                  </a>
                  <a href="mailto:support@elevate.com" className="flex items-center gap-2 text-[#2874F0] hover:underline font-medium">
                    <Mail className="w-4 h-4" /> Email: support@elevate.com
                  </a>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button 
                  onClick={() => setShowTracking(false)}
                  className="flex-1 border-2 border-[#2874F0] text-[#2874F0] font-bold py-3 px-6 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  Back to Order
                </button>
                <Link 
                  to="/" 
                  className="flex-1 bg-[#FB641B] hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-colors text-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      );
    };

    // If tracking view is active, show tracking
    if (showTracking) {
      return <TrackingView />;
    }

    // Otherwise show order summary
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <style dangerouslySetInnerHTML={{ __html: confettiStyle }} />
        
        {/* Confetti Elements */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {confettiElements.map(c => (
            <div
              key={c.id}
              className="absolute animate-fall"
              style={{
                left: `${c.left}%`,
                top: `-20px`,
                animationDelay: `${c.delay}s`,
                backgroundColor: c.color,
                width: `${c.size}px`,
                height: `${c.size * 2}px`,
                borderRadius: '2px',
                transform: `rotate(${c.rotation}deg)`,
                opacity: 0.8
              }}
            />
          ))}
        </div>

        {/* Success Card */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="bg-white max-w-2xl w-full rounded-3xl shadow-3d overflow-hidden border border-gray-100 z-20"
        >
          {/* Top Banner */}
          <div className="bg-[#2874F0] p-8 text-center text-white flex flex-col items-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-md border-4 border-white/20"
            >
              <Check className="w-10 h-10 text-white stroke-[3px]" />
            </motion.div>
            <h1 className="text-3xl font-heading font-extrabold mb-1">Order Placed Successfully!</h1>
            <p className="text-white/80 font-medium">Thank you for your purchase. Your order details are below.</p>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Info Summary */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">Order ID</span>
                <p className="font-mono font-bold text-brand-navy text-lg">{successOrderId}</p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">Estimated Delivery</span>
                <p className="text-green-600 font-bold text-lg flex items-center gap-1.5">
                  <Truck className="w-5 h-5" /> Thursday, May 28th
                </p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">Total Payable</span>
                <p className="font-mono font-bold text-brand-navy text-lg">₹{totalPayable.toLocaleString()}</p>
              </div>
            </div>

            {/* Address & Payment Method */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-brand-navy mb-2 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-[#2874F0]" /> Delivery Address
                </h3>
                <div className="text-sm text-gray-600 leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <p className="font-bold text-gray-800">{selectedAddress.name}</p>
                  <p>{selectedAddress.address}</p>
                  <p>{selectedAddress.locality}, {selectedAddress.city}</p>
                  <p>{selectedAddress.state} - {selectedAddress.pincode}</p>
                  <p className="mt-2 text-xs font-semibold text-gray-500">Phone: {selectedAddress.phone}</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-brand-navy mb-2 flex items-center gap-1">
                  <CreditCard className="w-4 h-4 text-[#2874F0]" /> Payment Summary
                </h3>
                <div className="text-sm text-gray-600 bg-gray-50/50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between h-[120px]">
                  <div>
                    <span className="font-semibold text-gray-700">Payment Mode:</span>
                    <span className="ml-2 font-bold text-brand-navy uppercase">
                      {paymentMode === 'cod' ? 'Cash on Delivery (COD)' : 
                       paymentMode === 'upi' ? `UPI (${upiId})` : 
                       paymentMode === 'card' ? `Card (ending in ${cardForm.number.slice(-4)})` : 
                       `Net Banking (${netBank})`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-50 p-2 rounded-lg border border-green-100">
                    <ShieldCheck className="w-4 h-4" /> 100% Safe & Secure Transaction
                  </div>
                </div>
              </div>
            </div>

            {/* Items Summary list */}
            <div>
              <h3 className="font-bold text-brand-navy mb-3 flex items-center gap-1">
                <ShoppingBag className="w-4 h-4 text-[#2874F0]" /> Items Ordered ({totalItemsCount})
              </h3>
              <div className="max-h-[220px] overflow-y-auto border border-gray-100 rounded-xl divide-y divide-gray-100">
                {checkoutItems.map((item, index) => (
                  <div key={index} className="p-4 flex gap-4 items-center bg-white">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-contain mix-blend-multiply flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-brand-navy truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} {item.selectedColor ? `| Color: ${item.selectedColor.name}` : ''}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-brand-navy flex-shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA - Updated with Track Order button */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={() => setShowTracking(true)}
                className="bg-[#2874F0] hover:bg-blue-700 text-white font-bold text-base px-10 py-4 rounded-xl shadow-md transition-colors flex-1 sm:flex-none"
              >
                Track Order
              </button>
              <Link 
                to="/" 
                className="bg-[#FB641B] hover:bg-orange-600 text-white font-bold text-base px-12 py-4 rounded-xl shadow-md transition-colors text-center flex-1 sm:flex-none"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Render Loader during payment processing
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-12 rounded-3xl shadow-3d border border-gray-100 text-center max-w-md w-full flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-[#2874F0] border-gray-200 rounded-full animate-spin mb-6"></div>
          <h2 className="text-xl font-bold text-brand-navy mb-2">Processing Payment...</h2>
          <p className="text-gray-500 text-sm animate-pulse">{processingMessage}</p>
          <div className="mt-8 flex items-center gap-1.5 text-xs text-gray-400">
            <Lock className="w-4 h-4 text-green-500" /> Secure 256-bit SSL encrypted connection
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Empty Checkout Check */}
        {checkoutItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 shadow-3d text-center border border-gray-100 max-w-xl mx-auto mt-12">
            <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png" alt="Empty" className="w-40 mx-auto mb-6" />
            <h2 className="text-2xl font-extrabold text-brand-navy mb-2">Nothing to Checkout!</h2>
            <p className="text-gray-500 mb-8">Add items to your cart or choose 'Buy Now' on a product to proceed.</p>
            <Link to="/" className="bg-[#2874F0] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors inline-block shadow-md">
              Go Shop Now
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* Left Column: Accordion Checkout Flow */}
            <div className="w-full lg:w-8/12 space-y-4">
              
              {/* STEP 1: LOGIN - HIDDEN (Auto-logged in) */}
              <div className="bg-white shadow-sm border border-gray-200 rounded overflow-hidden">
                {/* Step Header - Showing completed status */}
                <div 
                  className={`px-6 py-4 flex items-center justify-between cursor-default bg-gray-50 text-gray-500`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs bg-green-100 text-green-600`}>
                      <Check className="w-4 h-4 stroke-[3px]" />
                    </span>
                    <div className="text-left">
                      <span className={`font-bold text-sm uppercase text-gray-700`}>
                        Login
                      </span>
                      <p className="text-xs text-gray-700 mt-0.5 font-semibold">
                        Khushi Kumari <span className="text-gray-400 font-normal">|</span> khushi@elevate.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 2: DELIVERY ADDRESS */}
              <div className="bg-white shadow-sm border border-gray-200 rounded overflow-hidden">
                {/* Step Header */}
                <div 
                  onClick={() => handleStepClick(2)}
                  className={`px-6 py-4 flex items-center justify-between cursor-pointer ${
                    activeStep === 2 ? 'bg-[#2874F0] text-white' : 'bg-white text-gray-500'
                  } ${!isLoggedIn && 'opacity-60 cursor-not-allowed'}`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
                      activeStep === 2 ? 'bg-white text-[#2874F0]' : 'bg-gray-100 text-gray-400'
                    }`}>
                      2
                    </span>
                    <div className="text-left">
                      <span className={`font-bold text-sm uppercase ${activeStep === 2 ? 'text-white' : 'text-gray-900'}`}>
                        Delivery Address {completedSteps[2] && <Check className="inline-block w-4 h-4 ml-1 text-green-600 stroke-[3px]" />}
                      </span>
                      {completedSteps[2] && (
                        <p className="text-xs text-gray-700 mt-0.5 font-semibold truncate max-w-md">
                          {selectedAddress.name} <span className="font-normal text-gray-400">|</span> {selectedAddress.address}, {selectedAddress.locality}, {selectedAddress.city} - {selectedAddress.pincode}
                        </p>
                      )}
                    </div>
                  </div>
                  {completedSteps[2] && activeStep !== 2 && (
                    <button className="border border-gray-200 text-[#2874F0] font-bold text-xs px-6 py-2 rounded bg-white hover:bg-gray-50 transition-colors">
                      CHANGE
                    </button>
                  )}
                </div>

                {/* Step Body */}
                {activeStep === 2 && isLoggedIn && (
                  <div className="p-6 border-t border-gray-100 bg-white">
                    <div className="space-y-4">
                      {addresses.map((addr) => (
                        <div 
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`p-5 border rounded cursor-pointer transition-all flex items-start gap-4 ${
                            selectedAddressId === addr.id ? 'border-[#2874F0] bg-blue-50/20' : 'border-gray-200 hover:bg-gray-50/50'
                          }`}
                        >
                          <input 
                            type="radio" 
                            checked={selectedAddressId === addr.id}
                            onChange={() => setSelectedAddressId(addr.id)}
                            className="mt-1 accent-[#2874F0] w-4 h-4 cursor-pointer"
                          />
                          <div className="flex-1 text-left text-sm">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-bold text-brand-navy">{addr.name}</span>
                              <span className="px-2 py-0.5 bg-gray-100 text-[10px] uppercase font-bold text-gray-500 rounded">
                                {addr.type}
                              </span>
                              {addr.phone && (
                                <span className="text-gray-500 font-bold ml-auto">{addr.phone}</span>
                              )}
                            </div>
                            <p className="text-gray-600 mt-1">{addr.address}</p>
                            <p className="text-gray-600 font-medium">{addr.locality}, {addr.city}, {addr.state} - <span className="font-bold">{addr.pincode}</span></p>
                            
                            {selectedAddressId === addr.id && (
                              <motion.button 
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeliverHere();
                                }}
                                className="mt-4 bg-[#FB641B] hover:bg-orange-600 text-white font-bold py-2.5 px-8 rounded text-xs transition-colors shadow-sm uppercase"
                              >
                                Deliver Here
                              </motion.button>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Add New Address Form Section */}
                      {!showAddressForm ? (
                        <button 
                          onClick={() => setShowAddressForm(true)}
                          className="w-full p-4 border border-dashed border-gray-300 rounded flex items-center justify-center gap-2 text-[#2874F0] hover:bg-blue-50/10 font-bold text-sm transition-colors mt-4"
                        >
                          <Plus className="w-4 h-4" /> Add a new address
                        </button>
                      ) : (
                        <motion.form 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          onSubmit={handleAddressSubmit}
                          className="border border-gray-200 rounded p-6 bg-gray-50/50 space-y-4 mt-4 text-left"
                        >
                          <h4 className="font-bold text-sm text-brand-navy uppercase mb-2">ADD ADDRESS</h4>
                          {addressFormError && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-semibold flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" /> {addressFormError}
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <input 
                                type="text"
                                name="name"
                                value={addressForm.name}
                                onChange={handleAddressFormChange}
                                placeholder="Name"
                                className="w-full border border-gray-200 px-4 py-2.5 text-sm rounded bg-white"
                                required
                              />
                            </div>
                            <div>
                              <input 
                                type="text"
                                name="phone"
                                value={addressForm.phone}
                                onChange={handleAddressFormChange}
                                placeholder="10-digit mobile number"
                                className="w-full border border-gray-200 px-4 py-2.5 text-sm rounded bg-white"
                                required
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <input 
                                type="text"
                                name="pincode"
                                value={addressForm.pincode}
                                onChange={handleAddressFormChange}
                                placeholder="Pincode"
                                className="w-full border border-gray-200 px-4 py-2.5 text-sm rounded bg-white"
                                required
                              />
                            </div>
                            <div>
                              <input 
                                type="text"
                                name="locality"
                                value={addressForm.locality}
                                onChange={handleAddressFormChange}
                                placeholder="Locality"
                                className="w-full border border-gray-200 px-4 py-2.5 text-sm rounded bg-white"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <textarea 
                              name="address"
                              value={addressForm.address}
                              onChange={handleAddressFormChange}
                              placeholder="Address (Area and Street)"
                              className="w-full border border-gray-200 px-4 py-2.5 text-sm rounded bg-white h-20"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <input 
                                type="text"
                                name="city"
                                value={addressForm.city}
                                onChange={handleAddressFormChange}
                                placeholder="City/District/Town"
                                className="w-full border border-gray-200 px-4 py-2.5 text-sm rounded bg-white"
                                required
                              />
                            </div>
                            <div>
                              <input 
                                type="text"
                                name="state"
                                value={addressForm.state}
                                onChange={handleAddressFormChange}
                                placeholder="State"
                                className="w-full border border-gray-200 px-4 py-2.5 text-sm rounded bg-white"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Address Type</label>
                            <div className="flex gap-4">
                              <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                                <input 
                                  type="radio" 
                                  name="type" 
                                  value="Home" 
                                  checked={addressForm.type === 'Home'}
                                  onChange={handleAddressFormChange}
                                  className="accent-[#2874F0] w-4 h-4"
                                /> Home (All day delivery)
                              </label>
                              <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                                <input 
                                  type="radio" 
                                  name="type" 
                                  value="Work" 
                                  checked={addressForm.type === 'Work'}
                                  onChange={handleAddressFormChange}
                                  className="accent-[#2874F0] w-4 h-4"
                                /> Work (Delivery between 10 AM - 5 PM)
                              </label>
                            </div>
                          </div>
                          <div className="flex gap-4 pt-4">
                            <button 
                              type="submit"
                              className="bg-[#2874F0] text-white font-bold py-2.5 px-8 rounded text-sm hover:bg-blue-700 transition-colors uppercase shadow-sm"
                            >
                              Save Address
                            </button>
                            <button 
                              type="button" 
                              onClick={() => setShowAddressForm(false)}
                              className="border border-gray-300 text-gray-600 font-bold py-2.5 px-8 rounded text-sm hover:bg-gray-100 transition-colors uppercase"
                            >
                              Cancel
                            </button>
                          </div>
                        </motion.form>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 3: ORDER SUMMARY */}
              <div className="bg-white shadow-sm border border-gray-200 rounded overflow-hidden">
                {/* Step Header */}
                <div 
                  onClick={() => handleStepClick(3)}
                  className={`px-6 py-4 flex items-center justify-between cursor-pointer ${
                    activeStep === 3 ? 'bg-[#2874F0] text-white' : 'bg-white text-gray-500'
                  } ${(!isLoggedIn || !completedSteps[2]) && 'opacity-60 cursor-not-allowed'}`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
                      activeStep === 3 ? 'bg-white text-[#2874F0]' : 'bg-gray-100 text-gray-400'
                    }`}>
                      3
                    </span>
                    <div className="text-left">
                      <span className={`font-bold text-sm uppercase ${activeStep === 3 ? 'text-white' : 'text-gray-900'}`}>
                        Order Summary {completedSteps[3] && <Check className="inline-block w-4 h-4 ml-1 text-green-600 stroke-[3px]" />}
                      </span>
                      {completedSteps[3] && (
                        <p className="text-xs text-gray-700 mt-0.5 font-semibold">
                          {totalItemsCount} item(s) selected for delivery
                        </p>
                      )}
                    </div>
                  </div>
                  {completedSteps[3] && activeStep !== 3 && (
                    <button className="border border-gray-200 text-[#2874F0] font-bold text-xs px-6 py-2 rounded bg-white hover:bg-gray-50 transition-colors">
                      CHANGE
                    </button>
                  )}
                </div>

                {/* Step Body */}
                {activeStep === 3 && isLoggedIn && completedSteps[2] && (
                  <div className="p-6 border-t border-gray-100 bg-white">
                    <div className="divide-y divide-gray-100">
                      {checkoutItems.map((item, idx) => (
                        <div key={idx} className="py-5 flex flex-col sm:flex-row gap-6 text-left items-start first:pt-0">
                          {/* Image */}
                          <div className="w-20 h-20 bg-gray-50 p-2 rounded border border-gray-100 flex-shrink-0 flex items-center justify-center">
                            <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-brand-navy leading-tight hover:text-[#2874F0] transition-colors">{item.name}</h4>
                            <p className="text-xs text-gray-400 mt-1 font-semibold">Seller: {item.brand}</p>
                            
                            <div className="flex items-center gap-3 mt-3">
                              <span className="text-lg font-mono font-bold text-brand-navy">₹{item.price.toLocaleString()}</span>
                              {item.mrp > item.price && (
                                <>
                                  <span className="text-xs text-gray-400 line-through font-mono">₹{item.mrp.toLocaleString()}</span>
                                  <span className="text-xs text-green-600 font-bold">{item.discount}% Off</span>
                                </>
                              )}
                            </div>

                            {item.selectedColor && (
                              <p className="text-xs text-gray-600 mt-2 font-medium">
                                Color: <span className="font-bold">{item.selectedColor.name}</span>
                              </p>
                            )}
                          </div>

                          {/* Qty & Deliver estimate */}
                          <div className="text-right sm:max-w-xs w-full flex sm:flex-col justify-between items-center sm:items-end gap-2">
                            <div className="text-xs text-gray-500 font-medium">
                              Delivery by Wed, May 27 | <span className="text-green-600 font-bold">Free</span>
                            </div>
                            <div className="flex items-center gap-3 border border-gray-200 rounded px-1 py-0.5 bg-gray-50">
                              <button 
                                onClick={() => {
                                  const newQty = Math.max(1, item.quantity - 1);
                                  if (isDirectBuy) {
                                    setCheckoutItems([{ ...item, quantity: newQty }]);
                                  } else {
                                    updateQuantity(item.cartItemId, newQty);
                                  }
                                }}
                                className="text-gray-400 hover:text-[#2874F0] p-1"
                              >
                                <MinusCircle className="w-5 h-5" />
                              </button>
                              <span className="font-bold text-sm w-6 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => {
                                  const newQty = item.quantity + 1;
                                  if (isDirectBuy) {
                                    setCheckoutItems([{ ...item, quantity: newQty }]);
                                  } else {
                                    updateQuantity(item.cartItemId, newQty);
                                  }
                                }}
                                className="text-gray-400 hover:text-[#2874F0] p-1"
                              >
                                <PlusCircle className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer text & button */}
                    <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <p className="text-xs text-gray-500 font-medium">
                        Order confirmation email will be sent to <span className="font-bold text-gray-700">{loginEmailOrPhone}</span>
                      </p>
                      <button 
                        onClick={handleSummaryContinue}
                        className="bg-[#FB641B] hover:bg-orange-600 text-white font-bold py-3 px-10 rounded text-sm transition-colors shadow-sm uppercase tracking-wide"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 4: PAYMENT OPTIONS */}
              <div className="bg-white shadow-sm border border-gray-200 rounded overflow-hidden">
                {/* Step Header */}
                <div 
                  className={`px-6 py-4 flex items-center gap-4 ${
                    activeStep === 4 ? 'bg-[#2874F0] text-white' : 'bg-white text-gray-500'
                  } ${(!isLoggedIn || !completedSteps[2] || !completedSteps[3]) && 'opacity-60 cursor-not-allowed'}`}
                >
                  <span className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
                    activeStep === 4 ? 'bg-white text-[#2874F0]' : 'bg-gray-100 text-gray-400'
                  }`}>
                    4
                  </span>
                  <span className={`font-bold text-sm uppercase ${activeStep === 4 ? 'text-white' : 'text-gray-900'}`}>
                    Payment Options
                  </span>
                </div>

                {/* Step Body */}
                {activeStep === 4 && isLoggedIn && completedSteps[2] && completedSteps[3] && (
                  <div className="p-6 border-t border-gray-100 bg-white">
                    <div className="space-y-4">
                      
                      {/* UPI */}
                      <div className={`border rounded p-4 text-left ${paymentMode === 'upi' ? 'border-[#2874F0] bg-blue-50/10' : 'border-gray-200'}`}>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input 
                            type="radio" 
                            name="payment" 
                            value="upi" 
                            checked={paymentMode === 'upi'}
                            onChange={() => setPaymentMode('upi')}
                            className="mt-1 accent-[#2874F0]"
                          />
                          <div className="flex-1 text-sm font-semibold text-brand-navy">
                            UPI (Pay via Google Pay, PhonePe, BHIM)
                            {paymentMode === 'upi' && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-4 space-y-3 max-w-md"
                              >
                                <input 
                                  type="text" 
                                  value={upiId}
                                  onChange={(e) => setUpiId(e.target.value)}
                                  placeholder="Enter UPI ID (e.g. username@okhdfcbank)"
                                  className="w-full border border-gray-200 px-4 py-2 text-xs font-normal focus:outline-none focus:border-[#2874F0] rounded bg-white"
                                />
                                <button 
                                  onClick={handlePlaceOrder}
                                  className="w-full bg-[#FB641B] hover:bg-orange-600 text-white font-bold py-2.5 rounded text-xs transition-colors shadow-sm"
                                >
                                  PAY ₹{totalPayable.toLocaleString()}
                                </button>
                              </motion.div>
                            )}
                          </div>
                        </label>
                      </div>

                      {/* CARD */}
                      <div className={`border rounded p-4 text-left ${paymentMode === 'card' ? 'border-[#2874F0] bg-blue-50/10' : 'border-gray-200'}`}>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input 
                            type="radio" 
                            name="payment" 
                            value="card" 
                            checked={paymentMode === 'card'}
                            onChange={() => setPaymentMode('card')}
                            className="mt-1 accent-[#2874F0]"
                          />
                          <div className="flex-1 text-sm font-semibold text-brand-navy">
                            Credit / Debit / ATM Card
                            {paymentMode === 'card' && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-4 space-y-3 max-w-md text-xs font-normal"
                              >
                                <input 
                                  type="text" 
                                  value={cardForm.number}
                                  onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                                  placeholder="Card Number"
                                  className="w-full border border-gray-200 px-4 py-2 focus:outline-none focus:border-[#2874F0] rounded bg-white"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                  <input 
                                    type="text" 
                                    value={cardForm.expiry}
                                    onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                                    placeholder="Expiry (MM/YY)"
                                    className="border border-gray-200 px-4 py-2 focus:outline-none focus:border-[#2874F0] rounded bg-white"
                                  />
                                  <input 
                                    type="password" 
                                    maxLength="3"
                                    value={cardForm.cvv}
                                    onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                                    placeholder="CVV"
                                    className="border border-gray-200 px-4 py-2 focus:outline-none focus:border-[#2874F0] rounded bg-white"
                                  />
                                </div>
                                <button 
                                  onClick={handlePlaceOrder}
                                  className="w-full bg-[#FB641B] hover:bg-orange-600 text-white font-bold py-2.5 rounded text-xs transition-colors shadow-sm"
                                >
                                  PAY ₹{totalPayable.toLocaleString()}
                                </button>
                              </motion.div>
                            )}
                          </div>
                        </label>
                      </div>

                      {/* NET BANKING */}
                      <div className={`border rounded p-4 text-left ${paymentMode === 'netbanking' ? 'border-[#2874F0] bg-blue-50/10' : 'border-gray-200'}`}>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input 
                            type="radio" 
                            name="payment" 
                            value="netbanking" 
                            checked={paymentMode === 'netbanking'}
                            onChange={() => setPaymentMode('netbanking')}
                            className="mt-1 accent-[#2874F0]"
                          />
                          <div className="flex-1 text-sm font-semibold text-brand-navy">
                            Net Banking
                            {paymentMode === 'netbanking' && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-4 space-y-3"
                              >
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
                                  {['SBI', 'HDFC', 'ICICI', 'AXIS'].map(bank => (
                                    <button 
                                      key={bank}
                                      onClick={() => setNetBank(bank)}
                                      className={`p-2.5 border rounded text-center transition-all ${
                                        netBank === bank ? 'border-[#2874F0] bg-blue-50 text-[#2874F0]' : 'border-gray-200 hover:bg-gray-50'
                                      }`}
                                    >
                                      {bank}
                                    </button>
                                  ))}
                                </div>
                                <button 
                                  onClick={handlePlaceOrder}
                                  className="max-w-md w-full bg-[#FB641B] hover:bg-orange-600 text-white font-bold py-2.5 rounded text-xs transition-colors shadow-sm"
                                >
                                  PAY ₹{totalPayable.toLocaleString()}
                                </button>
                              </motion.div>
                            )}
                          </div>
                        </label>
                      </div>

                      {/* COD */}
                      <div className={`border rounded p-4 text-left ${paymentMode === 'cod' ? 'border-[#2874F0] bg-blue-50/10' : 'border-gray-200'}`}>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input 
                            type="radio" 
                            name="payment" 
                            value="cod" 
                            checked={paymentMode === 'cod'}
                            onChange={() => setPaymentMode('cod')}
                            className="mt-1 accent-[#2874F0]"
                          />
                          <div className="flex-1 text-sm font-semibold text-brand-navy">
                            Cash on Delivery (COD)
                            {paymentMode === 'cod' && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-4 space-y-4 max-w-md"
                              >
                                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded border border-gray-200">
                                  {/* Confusing/stylized captcha box */}
                                  <div className="relative select-none pointer-events-none py-1.5 px-6 font-mono font-extrabold text-2xl tracking-widest text-gray-700 rounded border-2 border-dashed border-gray-400 bg-white shadow-inner flex items-center justify-center">
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-200/20 via-blue-200/20 to-green-200/20 mix-blend-color" />
                                    <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%)', backgroundSize: '10px 10px', opacity: 0.1 }} />
                                    {captchaCode}
                                  </div>
                                  
                                  <button 
                                    type="button" 
                                    onClick={handleRefreshCaptcha} 
                                    className="p-2 border rounded hover:bg-gray-100 text-gray-500 hover:text-brand-navy transition-all"
                                    title="Refresh Captcha"
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                  </button>
                                  
                                  <div className="flex-1">
                                    <input 
                                      type="text" 
                                      value={captchaInput}
                                      onChange={(e) => {
                                        setCaptchaInput(e.target.value.trim());
                                        setCaptchaError(false);
                                      }}
                                      maxLength="4"
                                      placeholder="Enter code"
                                      className={`w-full border px-3 py-2 text-sm text-center font-bold focus:outline-none rounded bg-white ${
                                        captchaError ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-[#2874F0]'
                                      }`}
                                    />
                                  </div>
                                </div>
                                {captchaError && (
                                  <p className="text-xs text-red-500 font-bold">Incorrect characters entered. Please try again.</p>
                                )}
                                <button 
                                  onClick={handlePlaceOrder}
                                  className="w-full bg-[#FB641B] hover:bg-orange-600 text-white font-bold py-3 rounded text-sm transition-colors shadow-sm uppercase tracking-wide"
                                >
                                  Confirm Order
                                </button>
                              </motion.div>
                            )}
                          </div>
                        </label>
                      </div>

                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Pricing Sidebar */}
            <div className="w-full lg:w-4/12 lg:sticky lg:top-28">
              <div className="bg-white rounded border border-gray-200 text-left">
                <h3 className="text-xs uppercase font-extrabold tracking-wider text-gray-400 px-6 py-4 border-b border-gray-100">
                  Price Details
                </h3>

                <div className="p-6 space-y-4 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Price ({totalItemsCount} item{totalItemsCount > 1 ? 's' : ''})</span>
                    <span className="font-mono">₹{totalMrp.toLocaleString()}</span>
                  </div>
                  
                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>Discount</span>
                      <span className="font-mono">- ₹{totalDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span className="font-mono">
                      {deliveryCharge === 0 ? (
                        <span className="text-green-600 font-semibold">FREE</span>
                      ) : (
                        `₹${deliveryCharge}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Secured Packaging Fee</span>
                    <span className="font-mono">₹{packagingFee}</span>
                  </div>

                  <div className="pt-4 border-t border-dashed border-gray-200">
                    <div className="flex justify-between font-extrabold text-lg text-brand-navy">
                      <span>Total Amount</span>
                      <span className="font-mono">₹{totalPayable.toLocaleString()}</span>
                    </div>
                  </div>

                  {totalDiscount > 0 && (
                    <div className="bg-green-50 text-green-600 p-3.5 rounded text-xs font-bold border border-green-100">
                      You will save ₹{totalDiscount.toLocaleString()} on this order
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400 font-bold justify-center">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <span>Safe and Secure Payments. Easy returns.</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
