import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, TrendingUp, Users, Globe, ShieldCheck, Headphones, ArrowRight, CheckCircle, Package, BarChart3, Truck } from 'lucide-react';

const stats = [
  { value: '5Cr+', label: 'Active Buyers' },
  { value: '12L+', label: 'Sellers Trusted Us' },
  { value: '19K+', label: 'Cities Delivered' },
  { value: '₹0', label: 'Registration Fee' },
];

const steps = [
  { icon: Store, title: 'Create Your Store', desc: 'Register for free and set up your seller profile in minutes.' },
  { icon: Package, title: 'List Your Products', desc: 'Upload products with images, descriptions, and pricing.' },
  { icon: TrendingUp, title: 'Start Selling', desc: 'Go live instantly and reach crores of buyers across India.' },
  { icon: BarChart3, title: 'Grow & Scale', desc: 'Use our analytics tools to boost your sales & visibility.' },
];

const benefits = [
  { icon: Globe, title: 'Pan India Reach', desc: 'Sell to customers across 19,000+ pincodes.' },
  { icon: ShieldCheck, title: 'Seller Protection', desc: 'Covered by our fraud protection policies.' },
  { icon: Truck, title: 'Logistics Support', desc: 'We handle pickup, shipping & returns for you.' },
  { icon: Headphones, title: '24/7 Seller Support', desc: 'Dedicated team available round the clock.' },
  { icon: Users, title: 'Marketing Tools', desc: 'Run ads, promotions, and sponsored listings.' },
  { icon: TrendingUp, title: 'Performance Insights', desc: 'Deep analytics to help you grow faster.' },
];

export default function BecomeSeller() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ biz: '', gst: '', phone: '', email: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-navy to-[#1565c0] text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block bg-brand-yellow text-brand-navy text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wide">
              🚀 Start Selling Today — It's Free!
            </span>
            <h1 className="text-4xl md:text-6xl font-heading font-extrabold mb-5 leading-tight">
              Grow Your Business<br />with <span className="text-brand-yellow">Elevate</span>
            </h1>
            <p className="text-white/75 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Join 12 lakh+ sellers who trust Elevate to reach crores of buyers and scale their business across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#register-form">
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  className="bg-brand-yellow text-brand-navy px-8 py-4 rounded-xl font-bold text-base shadow-lg flex items-center gap-2"
                >
                  Start Selling for Free <ArrowRight className="w-5 h-5" />
                </motion.button>
              </a>
              <Link to="/">
                <button className="border border-white/30 text-white px-8 py-4 rounded-xl font-medium text-base hover:bg-white/10 transition-colors">
                  Back to Shopping
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-heading font-extrabold text-brand-navy">{value}</div>
              <div className="text-sm text-gray-500 mt-1">{label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-heading font-extrabold text-brand-navy text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-brand-navy/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-brand-navy" />
                </div>
                <div className="w-6 h-6 bg-brand-yellow rounded-full text-brand-navy font-bold text-xs flex items-center justify-center mx-auto mb-3">{i + 1}</div>
                <h3 className="font-bold text-brand-navy mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-heading font-extrabold text-brand-navy text-center mb-4">Why Sell on Elevate?</h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">Everything you need to run and grow your online business — all in one place.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-brand-blue/30 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-navy flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-brand-yellow" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-navy mb-1">{title}</h3>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div id="register-form" className="py-16 px-4 bg-gradient-to-br from-brand-navy to-[#1565c0]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-heading font-extrabold text-white mb-3">Register as a Seller</h2>
            <p className="text-white/60">It takes less than 5 minutes to get started</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-[0_40px_80px_rgba(0,0,0,0.3)]">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              {['Business Info', 'Verification', 'Complete'].map((s, i) => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    i < step ? 'bg-green-500 text-white' : i === step ? 'bg-brand-navy text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-brand-navy' : 'text-gray-400'}`}>{s}</span>
                  {i < 2 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-green-500' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); if (step < 2) setStep(step + 1); else navigate('/'); }}>
              {step === 0 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Name *</label>
                    <input name="biz" required onChange={handleChange} placeholder="e.g. Krishna Traders"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">GST Number *</label>
                    <input name="gst" required onChange={handleChange} placeholder="e.g. 22AAAAA0000A1Z5"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Category</label>
                    <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue bg-gray-50">
                      <option>Electronics</option>
                      <option>Fashion</option>
                      <option>Home & Furniture</option>
                      <option>Grocery</option>
                      <option>Beauty & Personal Care</option>
                      <option>Books</option>
                      <option>Toys & Games</option>
                      <option>Sports</option>
                      <option>Other</option>
                    </select>
                  </div>
                </motion.div>
              )}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number *</label>
                    <input name="phone" type="tel" required onChange={handleChange} placeholder="+91 98765 43210"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                    <input name="email" type="email" required onChange={handleChange} placeholder="you@example.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Bank Account Number *</label>
                    <input type="text" required placeholder="For payment settlements"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue bg-gray-50" />
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-heading font-extrabold text-brand-navy mb-3">You're All Set! 🎉</h3>
                  <p className="text-gray-500 mb-6">Your seller account has been created. Our team will verify your details within 24 hours.</p>
                  <ul className="text-left space-y-2 mb-6">
                    {['Access to Seller Dashboard', 'List up to 100 products for free', 'Priority support for 30 days'].map(item => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full mt-6 bg-brand-navy text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-brand-blue transition-colors shadow-md"
              >
                {step === 2 ? 'Go to Dashboard' : step === 1 ? 'Complete Registration' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
