import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, ShoppingBag, Shield, Gift, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email address is required';
    } else if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    // Simulate network delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
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
              Reset Password
            </h2>
            <p className="text-white/80 text-sm mb-12 font-medium">
              Enter your email to receive a password reset link
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
            <h2 className="text-2xl font-heading font-extrabold text-brand-navy">Forgot Password?</h2>
            <p className="text-gray-400 text-xs mt-1">Get a recovery link sent to your inbox</p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 bg-gray-50/50 border ${
                      error ? 'border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-brand-orange focus:ring-brand-orange/15'
                    } rounded-xl text-sm font-medium focus:outline-none focus:ring-4 transition-all`}
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-xs font-semibold flex items-center gap-1 mt-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                    {error}
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
                    Send Reset Link
                    <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
              </motion.button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 space-y-6"
            >
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-100 shadow-sm text-green-500">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-2 max-w-sm mx-auto">
                <h3 className="text-lg font-heading font-extrabold text-brand-navy">Check Your Inbox</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  We've sent a password recovery link to <strong className="text-brand-navy font-semibold">{email}</strong>. Please check your spam folder if it doesn't show up.
                </p>
              </div>

              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full bg-brand-orange hover:bg-[#e05310] text-white py-3 rounded-xl font-bold text-sm transition-colors mt-4 shadow-md shadow-brand-orange/10 max-w-xs"
              >
                Back to Login
              </Link>
            </motion.div>
          )}

          {/* Redirection to Login */}
          {!isSubmitted && (
            <p className="text-center text-sm font-medium text-gray-500 mt-8">
              Remember your password?{' '}
              <Link to="/login" className="text-brand-orange font-bold hover:underline">
                Back to Login
              </Link>
            </p>
          )}

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
