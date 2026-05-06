import { Link } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & About */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-brand-yellow text-brand-navy rounded-lg flex items-center justify-center font-bold text-xl">
                E
              </div>
              <span className="font-heading font-bold text-2xl tracking-tight">
                Elevate
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              India's premium e-commerce destination. Experience the best products with fast delivery and unmatched customer service.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-blue transition-colors font-bold">
                FB
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-blue transition-colors font-bold">
                TW
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-blue transition-colors font-bold">
                IG
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-blue transition-colors font-bold">
                YT
              </a>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6 text-white">Help & Info</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/cancellation" className="hover:text-white transition-colors">Cancellation Policy</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6 text-white">Top Categories</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><Link to="/category/electronics" className="hover:text-white transition-colors">Mobiles & Electronics</Link></li>
              <li><Link to="/category/fashion" className="hover:text-white transition-colors">Men's Fashion</Link></li>
              <li><Link to="/category/fashion" className="hover:text-white transition-colors">Women's Fashion</Link></li>
              <li><Link to="/category/home" className="hover:text-white transition-colors">Home & Furniture</Link></li>
              <li><Link to="/category/beauty" className="hover:text-white transition-colors">Beauty & Grooming</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6 text-white">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">Subscribe to our newsletter for exclusive offers and updates.</p>
            <form className="relative group">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue transition-colors"
              />
              <button 
                type="submit"
                className="absolute right-2 top-2 bottom-2 bg-brand-blue text-white w-10 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
            
            <div className="mt-8">
              <h5 className="text-sm font-bold text-white mb-3">Download App</h5>
              <div className="flex gap-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-8 cursor-pointer" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" className="h-8 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Elevate Commerce. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1 font-bold text-gray-400"><span className="text-blue-500 text-lg">V</span> Visa</span>
            <span className="flex items-center gap-1 font-bold text-gray-400"><span className="text-orange-500 text-lg">M</span> Mastercard</span>
            <span className="flex items-center gap-1 font-bold text-gray-400">UPI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
