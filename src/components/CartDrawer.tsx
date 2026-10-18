import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShieldCheck,
  Tag,
  CheckCircle2,
  MapPin,
  ArrowRight,
  Sparkles,
  Receipt,
  Check,
} from 'lucide-react';
import { CartItem, LocationOption } from '../types';
import { TranslationStrings } from '../i18n/translations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  selectedLocation: LocationOption;
  onOrderSuccess: (orderId: string) => void;
  t: TranslationStrings;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  selectedLocation,
  onOrderSuccess,
  t,
}) => {
  const [couponCode, setCouponCode] = useState('BUILDZY1500');
  const [couponApplied, setCouponApplied] = useState(true);
  const [couponMsg, setCouponMsg] = useState('₹1,500 Pan-India Construction Subsidy Applied');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const itemTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const platformFee = Math.round(itemTotal * 0.03); // 3% escrow coordination fee
  const deliveryFee = itemTotal > 20000 || itemTotal === 0 ? 0 : 750;
  const couponDiscount = couponApplied && itemTotal > 0 ? (itemTotal > 1500 ? 1500 : Math.round(itemTotal * 0.1)) : 0;
  const taxableAmount = Math.max(0, itemTotal + platformFee - couponDiscount);
  const cgst = Math.round(taxableAmount * 0.09);
  const sgst = Math.round(taxableAmount * 0.09);
  const totalGst = cgst + sgst;
  const grandTotal = Math.max(0, taxableAmount + deliveryFee + totalGst);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'BUILDZY1500' || code === 'FIRSTBUILD' || code === 'DIRECTSTEEL') {
      setCouponApplied(true);
      setCouponMsg('Coupon applied successfully! ₹1,500 Escrow Discount.');
    } else {
      setCouponApplied(false);
      setCouponMsg('Invalid coupon code. Try BUILDZY1500 or FIRSTBUILD.');
    }
  };

  const handleCheckout = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const generatedId = `BLD-${Math.floor(100000 + Math.random() * 900000)}`;
      onOrderSuccess(generatedId);
      onClearCart();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-stone-950/65 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-rose-500" />
              <div>
                <h2 className="text-base font-bold tracking-tight">
                  {t.cartTitle}
                </h2>
                <p className="text-xs text-stone-400">
                  {items.length} {items.length === 1 ? 'item' : 'items'} · Escrow Backed
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Site Delivery Address Bar */}
          <div className="p-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-stone-700">
              <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
              <div>
                <span className="font-semibold block">{selectedLocation.locality}</span>
                <span className="text-[11px] text-stone-500">{selectedLocation.city}, {selectedLocation.state}</span>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-sm border border-emerald-200">
              Verified Logistics Hub
            </span>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3 text-stone-400">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-stone-800">{t.cartEmpty}</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                  {t.cartEmptySub}
                </p>
              </div>
            ) : (
              items.map((item) => {
                const isBulk = item.unit.includes('bag') || item.unit.includes('kg') || item.unit.includes('piece');
                const bulkStep = item.unit.includes('bag') ? 25 : item.unit.includes('kg') ? 100 : item.unit.includes('sq.ft') ? 250 : 1;

                return (
                  <div
                    key={item.itemId}
                    className="bg-white border border-stone-200 rounded-2xl p-4 shadow-2xs hover:border-stone-300 transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-semibold text-rose-600 block">
                          {item.listingName}
                        </span>
                        <h4 className="text-sm font-bold text-stone-900 leading-snug">
                          {item.itemName}
                        </h4>
                        <div className="text-xs font-mono font-bold text-stone-900 mt-0.5">
                          ₹{item.price.toLocaleString('en-IN')}{' '}
                          <span className="text-[11px] text-stone-500 font-sans font-normal">
                            {item.unit}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.itemId)}
                        className="text-stone-300 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quantity Stepper & Subtotal */}
                    <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 bg-stone-100 rounded-lg p-1">
                        <button
                          onClick={() => onUpdateQuantity(item.itemId, -bulkStep)}
                          className="w-6 h-6 rounded-md bg-white hover:bg-stone-200 flex items-center justify-center text-stone-700 cursor-pointer shadow-2xs text-xs font-bold"
                          title={`Decrease by ${bulkStep}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-stone-900 px-2 font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.itemId, bulkStep)}
                          className="w-6 h-6 rounded-md bg-white hover:bg-stone-200 flex items-center justify-center text-stone-700 cursor-pointer shadow-2xs text-xs font-bold"
                          title={`Increase by ${bulkStep}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-stone-900 font-mono">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bill Breakdown (Zomato-style bottom summary) */}
          {items.length > 0 && (
            <div className="p-4 bg-stone-50 border-t border-stone-200 space-y-3">
              {/* Promo Coupon banner */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter Coupon (e.g. BUILDZY1500)"
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono font-bold uppercase focus:outline-hidden focus:border-rose-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponMsg && (
                  <p className={`text-[10px] font-semibold ${couponApplied ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {couponMsg}
                  </p>
                )}
              </form>

              {/* Bill Details */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                <div className="flex justify-between">
                  <span>{t.itemSubtotal}</span>
                  <span className="font-mono font-medium text-stone-900">
                    ₹{itemTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Promotional Discount:</span>
                    <span className="font-mono">-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>{t.siteDelivery}</span>
                  <span className="font-mono text-emerald-700 font-medium">
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span title="BUILDZY 3% Platform Escrow & QC Coordination Fee">
                    {t.platformFee} (3% Escrow Protection)
                  </span>
                  <span className="font-mono font-medium text-stone-900">
                    ₹{platformFee.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>GST Statutory (CGST 9% + SGST 9%)</span>
                  <span className="font-mono font-medium text-stone-900">
                    ₹{totalGst.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="border-t border-stone-300 pt-2 flex justify-between text-sm font-extrabold text-stone-950">
                  <span>{t.toPayIndicative}</span>
                  <span className="font-mono text-rose-700 text-base">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Escrow Guarantee note */}
              <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Funds held in 100% Escrow and released solely after site QC inspection</span>
              </div>

              {/* Checkout Action */}
              <button
                disabled={isSubmitting}
                onClick={handleCheckout}
                className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 disabled:bg-stone-400 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {isSubmitting ? (
                  <span>{t.processing}</span>
                ) : (
                  <>
                    <span>Confirm Booking & Open Escrow</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
