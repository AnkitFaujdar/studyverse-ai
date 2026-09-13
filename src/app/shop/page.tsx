'use client';

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Star, 
  Plus, 
  Minus, 
  Trash2, 
  X, 
  CheckCircle2, 
  Package, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useStudyVerse } from '@/lib/store/studyverse-context';
import { MOCK_PRODUCTS } from '@/lib/data/mock-db';
import { ProductItem } from '@/lib/types';

const CATEGORIES = [
  'All',
  'Books',
  'Pens',
  'Pencils',
  'Notebooks',
  'Geometry',
  'Highlighters',
  'Bags',
  'Calculators',
];

export default function StudyShopPage() {
  const { cart, addToCart, removeFromCart, updateCartQuantity, clearCart, orders, placeOrder } = useStudyVerse();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  // Checkout form
  const [shippingName, setShippingName] = useState('Ankit Sharma');
  const [street, setStreet] = useState('221B Baker St / Campus Hostel');
  const [city, setCity] = useState('New Delhi');
  const [zipCode, setZipCode] = useState('110001');
  const [phone, setPhone] = useState('+91 98765 43210');

  // Filter products
  const filteredProducts = MOCK_PRODUCTS.filter((p) => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    placeOrder({
      fullName: shippingName,
      street,
      city,
      zipCode,
      phone,
    });
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>EXAM ARSENAL LOGISTICS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Study Shop</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Physical study gear, textbooks, precision pens, notebooks, and exam-approved calculators.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOrdersOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition flex items-center gap-1.5"
          >
            <Package className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-xs font-bold text-white shadow-lg shadow-purple-900/40 transition flex items-center gap-2 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Cart ({totalItemsCount})</span>
          </button>
        </div>
      </div>

      {/* Search & Categories Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books, pens, calculators, notebooks..."
            className="w-full rounded-2xl bg-[#0d1029]/80 border border-indigo-900/40 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                  isSelected
                    ? 'bg-purple-600 border-purple-400 text-white shadow-md shadow-purple-900/30'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="rounded-3xl bg-[#0e1230]/90 border border-indigo-900/40 hover:border-purple-500/50 overflow-hidden flex flex-col justify-between shadow-xl transition group"
          >
            {/* Product Image */}
            <div
              className="relative h-44 w-full bg-slate-950 overflow-hidden cursor-pointer"
              onClick={() => setSelectedProduct(prod)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={prod.imageUrl}
                alt={prod.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              {prod.badge && (
                <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-purple-600 text-[10px] font-black uppercase tracking-wider text-white shadow">
                  {prod.badge}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span className="font-semibold text-purple-400">{prod.category}</span>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-3 h-3 fill-yellow-400" />
                    <span>{prod.rating} ({prod.reviewsCount})</span>
                  </div>
                </div>

                <h3
                  className="text-sm font-bold text-white line-clamp-2 cursor-pointer hover:text-cyan-300 transition"
                  onClick={() => setSelectedProduct(prod)}
                >
                  {prod.name}
                </h3>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-base font-black text-white">${prod.price.toFixed(2)}</span>
                  {prod.originalPrice && (
                    <span className="text-xs text-slate-500 line-through ml-1.5">
                      ${prod.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => addToCart(prod)}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-xs font-bold text-purple-200 transition active:scale-95"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 1. CART SLIDE-OVER DRAWER */}
      {/* ========================================================================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />

          <div className="relative ml-auto flex h-full w-full max-w-md flex-col bg-[#0b0e27] p-6 shadow-2xl border-l border-indigo-900/40 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-purple-400" />
                <h2 className="text-base font-bold text-white">Your Study Bag</h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-slate-500 space-y-2">
                  <ShoppingBag className="w-12 h-12 mx-auto text-slate-600" />
                  <p className="text-xs font-semibold">Your cart is currently empty.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-white truncate">{item.product.name}</h4>
                      <span className="text-xs font-mono text-cyan-400">${item.product.price.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-white w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-sm font-bold text-white">
                  <span>Estimated Total:</span>
                  <span className="text-lg font-mono text-cyan-400">${cartSubtotal.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-3.5 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 transition shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2"
                >
                  <span>Proceed to Test Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MOCK CHECKOUT MODAL */}
      {/* ========================================================================= */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-[#0b0e27] border border-indigo-700/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Test Mode Checkout</h3>
              <button onClick={() => setIsCheckoutOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-cyan-400" />
              <span>Simulated payment test mode. No real cards required or charged.</span>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={shippingName}
                  onChange={(e) => setShippingName(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs font-bold text-white">
                <span>Total Charge:</span>
                <span className="font-mono text-cyan-400 text-sm">${cartSubtotal.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-xs font-bold text-white shadow-lg shadow-emerald-900/30 transition"
              >
                Place Test Order
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ORDER HISTORY MODAL */}
      {/* ========================================================================= */}
      {isOrdersOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-[#0b0e27] border border-indigo-700/40 p-6 shadow-2xl space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Your Order History</h3>
              <button onClick={() => setIsOrdersOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {orders.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No orders placed yet. Add study supplies to your bag!
                </div>
              ) : (
                orders.map((ord) => (
                  <div key={ord.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white">Order #{ord.orderNumber}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                        {ord.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400">
                      {ord.items.map((i) => `${i.quantity}x ${i.product.name}`).join(', ')}
                    </div>

                    <div className="flex justify-between items-center pt-1 border-t border-slate-800 text-xs">
                      <span className="text-slate-500">{new Date(ord.createdAt).toLocaleDateString()}</span>
                      <span className="font-mono font-bold text-cyan-400">${ord.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PRODUCT DETAIL MODAL */}
      {/* ========================================================================= */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-[#0b0e27] border border-indigo-700/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-purple-400">{selectedProduct.category}</span>
              <button onClick={() => setSelectedProduct(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-48 w-full rounded-2xl overflow-hidden bg-slate-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full h-full object-cover" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{selectedProduct.name}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{selectedProduct.description}</p>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xl font-black text-white">${selectedProduct.price.toFixed(2)}</span>
              <button
                onClick={() => {
                  addToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-xs text-white transition shadow-md shadow-purple-900/40"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
