import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Phone, ArrowRight, ShoppingBag, Shield, Gift } from 'lucide-react';

export default function Login() {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/');
  };

  const benefits = [
    { icon: ShoppingBag, title: 'Exclusive Deals', desc: 'Access member-only offers & early sales' },
    { icon: Shield, title: 'Safe & Secure', desc: 'Bank-grade security on all transactions' },
    { icon: Gift, title: 'Rewards Points', desc: 'Earn points on every purchase' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy via-[#1a237e] to-[#0d47a1] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.4)]">

        {/* Left Panel */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-brand-yellow/20 to-brand-blue/30 backdrop-blur-xl p-10 border-r border-white/10">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-12">
              <div className="w-10 h-10 rounded-xl bg-brand-yellow flex items-center justify-center font-bold text-xl text-brand-navy">E</div>
              <span className="font-heading font-bold text-2xl text-white">Elevate</span>
            </Link>
            <h2 className="text-4xl font-heading font-extrabold text-white mb-4 leading-tight">
              Shop Smarter,<br />Live Better.
            </h2>
            <p className="text-white/70 text-base mb-10">
              Join millions of happy shoppers and unlock a world of exclusive benefits.
            </p>
            <div className="space-y-6">
              {benefits.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-brand-yellow" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{title}</p>
                    <p className="text-sm text-white/60">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-white/40 text-sm">© 2025 Elevate. All rights reserved.</p>
        </div>

        {/* Right Panel - Form */}
        <div className="bg-white p-8 md:p-10 flex flex-col justify-center">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-8 md:hidden">
              <div className="w-8 h-8 rounded-lg bg-brand-navy flex items-center justify-center font-bold text-lg text-brand-yellow">E</div>
              <span className="font-heading font-bold text-xl text-brand-navy">Elevate</span>
            </Link>
            <h1 className="text-2xl font-heading font-extrabold text-brand-navy mb-1">
              {activeTab === 'login' ? 'Welcome back!' : 'Create your account'}
            </h1>
            <p className="text-gray-500 text-sm">
              {activeTab === 'login' ? 'Sign in to continue shopping' : 'Start your Elevate journey today'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
            {['login', 'register'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all duration-300 ${
                  activeTab === tab ? 'bg-white text-brand-navy shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {activeTab === 'register' && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    required
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue transition bg-gray-50"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  required
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue transition bg-gray-50"
                />
              </div>

              {activeTab === 'register' && (
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Phone number"
                    required
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue transition bg-gray-50"
                  />
                </div>
              )}

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  required
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue transition bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {activeTab === 'login' && (
                <div className="text-right">
                  <a href="#" className="text-sm text-brand-blue hover:underline">Forgot password?</a>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-brand-navy text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-brand-blue transition-colors mt-2 shadow-md"
              >
                {activeTab === 'login' ? 'Sign In' : 'Create Account'}
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                <div className="relative flex justify-center"><span className="bg-white px-4 text-xs text-gray-400">or continue with</span></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google
                </button>
                <button type="button" className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </button>
              </div>
            </motion.form>
          </AnimatePresence>

          <p className="text-center text-xs text-gray-400 mt-6">
            By continuing, you agree to Elevate's{' '}
            <a href="#" className="text-brand-blue hover:underline">Terms of Use</a> &{' '}
            <a href="#" className="text-brand-blue hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
