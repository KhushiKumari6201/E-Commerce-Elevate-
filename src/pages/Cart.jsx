import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-[60vh]">
      <h1 className="text-3xl font-heading font-bold mb-8 text-brand-navy">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm text-center border border-gray-100">
          <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png" alt="Empty Cart" className="w-48 mx-auto mb-6 opacity-80" />
          <h2 className="text-xl font-bold text-brand-navy mb-2">Your cart is empty!</h2>
          <p className="text-gray-500 mb-6">Explore our wide selection and find something you like</p>
          <Link to="/" className="bg-brand-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors inline-block">
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3 flex flex-col gap-4">
            {cartItems.map((item) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={item.id} 
                className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6"
              >
                {/* Item Image */}
                <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-xl p-2 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                
                {/* Item Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-brand-navy text-lg leading-tight mb-1">{item.name}</h3>
                    <p className="text-gray-500 text-sm mb-3">Brand: {item.brand}</p>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="font-bold font-mono text-xl">₹{item.price.toLocaleString()}</span>
                      {item.mrp && item.mrp > item.price && (
                        <span className="text-sm text-gray-400 line-through font-mono">₹{item.mrp.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Quantity & Actions */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-brand-blue hover:bg-gray-100 rounded-l-lg transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-bold text-sm bg-white h-8 flex items-center justify-center border-x border-gray-200">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-brand-blue hover:bg-gray-100 rounded-r-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Price Details */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg font-bold text-brand-navy border-b border-gray-100 pb-4 mb-4">Price Details</h3>
              
              <div className="flex flex-col gap-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Price ({cartItems.length} items)</span>
                  <span className="font-mono">₹{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Discount</span>
                  <span className="font-mono text-green-500">- ₹0</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges</span>
                  <span className="font-mono text-green-500">Free</span>
                </div>
              </div>
              
              <div className="border-t border-dashed border-gray-200 pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg text-brand-navy">
                  <span>Total Amount</span>
                  <span className="font-mono">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
              
              <button className="w-full bg-brand-orange hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors shadow-sm text-lg">
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
