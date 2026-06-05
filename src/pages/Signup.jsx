import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, ShoppingBag, Shield, Gift } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate network delay
    setTimeout(() => {
      // Mock registration logic
      const loggedInUser = {
        name: form.name.trim(),
        email: form.email,
        phone: '9876543210',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120'
      };

      localStorage.setItem('elevate_user', JSON.stringify(loggedInUser));
      localStorage.setItem('elevate_is_logged_in', 'true');

      // Dispatch custom event to notify Header
      window.dispatchEvent(new Event('authChange'));

      setIsSubmitting(false);
      navigate('/account');
    }, 1000);
  };

  const benefits = [
    { icon: ShoppingBag, title: 'Manage Orders', desc: 'Easily track shipments and cancel items' },
    { icon: Gift, title: 'Wishlist & Rewards', desc: 'Save favorites and redeem cashback coins' },
    { icon: Shield, title: 'Secure Transactions', desc: 'End-to-end encryption for safe shopping' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12 select-none animate-fade-in">
      <div className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.06)] border border-gray-100 grid md:grid-cols-5 min-h-[550px]">
        
        {/* Left Sidebar (Flipkart Theme) */}
        <div className="md:col-span-2 bg-gradient-to-b from-brand-orange to-[#ff7e40] p-10 flex flex-col justify-between text-left text-white relative overflow-hidden hidden md:flex">
          {/* Subtle background blur circles */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/15 rounded-full blur-2xl pointer-events-none" />

          <div>
            <Link to="/" className="flex items-center gap-2 mb-10 w-fit">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center font-heading font-black text-lg text-brand-orange shadow-md">
                E
              </div>
              <span className="font-heading font-extrabold text-xl tracking-wide text-white">Elevate</span>
            </Link>

            <h2 className="text-3xl font-heading font-extrabold mb-3 leading-tight">
              Sign Up
            </h2>
            <p className="text-white/80 text-sm mb-12 font-medium">
              Looks like you're new here! Sign up to get started
            </p>

            <div className="space-y-6 relative z-10">
              {benefits.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4 items-start">
                  <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4.5 h-4.5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">{title}</h4>
                    <p className="text-white/70 text-xs mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-white/50 text-[11px] font-medium tracking-wide flex items-center gap-1.5 mt-8">
            <Shield className="w-3.5 h-3.5" />
            100% SAFE & SECURE TRANSACTIONS
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center text-left relative bg-white">
          <div className="mb-8 md:hidden">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center font-heading font-black text-base text-white">
                E
              </div>
              <span className="font-heading font-extrabold text-lg tracking-wide text-brand-navy">Elevate</span>
            </Link>
            <h2 className="text-2xl font-heading font-extrabold text-brand-navy">Sign Up</h2>
            <p className="text-gray-400 text-xs mt-1">Create an account to start shopping</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  name="name"
                  type="text"
                  placeholder="Enter full name"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 bg-gray-50/50 border ${
                    errors.name ? 'border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-brand-orange focus:ring-brand-orange/15'
                  } rounded-xl text-sm font-medium focus:outline-none focus:ring-4 transition-all`}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs font-semibold flex items-center gap-1 mt-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 bg-gray-50/50 border ${
                    errors.email ? 'border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-brand-orange focus:ring-brand-orange/15'
                  } rounded-xl text-sm font-medium focus:outline-none focus:ring-4 transition-all`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs font-semibold flex items-center gap-1 mt-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create password (min 6 characters)"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-11 py-3 bg-gray-50/50 border ${
                    errors.password ? 'border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-brand-orange focus:ring-brand-orange/15'
                  } rounded-xl text-sm font-medium focus:outline-none focus:ring-4 transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs font-semibold flex items-center gap-1 mt-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-orange hover:bg-[#e05310] text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors mt-6 shadow-md shadow-brand-orange/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign Up
                  <ArrowRight className="w-4.5 h-4.5" />
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <span className="relative bg-white px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                or continue with
              </span>
            </div>

            {/* Google Login (UI Only) */}
            <button
              type="button"
              onClick={() => alert("Google Sign-In is under review (UI only).")}
              className="w-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-99"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign up with Google
            </button>
          </form>

          {/* Redirection to Login */}
          <p className="text-center text-sm font-medium text-gray-500 mt-8">
            Existing User?{' '}
            <Link to="/login" className="text-brand-orange font-bold hover:underline">
              Log in
            </Link>
          </p>

          {/* Privacy Disclaimer */}
          <p className="text-center text-[10px] font-bold text-gray-400/80 mt-10 uppercase tracking-wide">
            By continuing, you agree to Elevate's{' '}
            <a href="#" className="hover:underline text-gray-500">Terms of Use</a> &{' '}
            <a href="#" className="hover:underline text-gray-500">Privacy Policy</a>
          </p>
        </div>

      </div>
    </div>
  );
}
