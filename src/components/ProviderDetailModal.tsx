import React, { useState } from 'react';
import {
  X,
  Star,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Plus,
  Check,
  Tag,
  Info,
  Layers,
  FileCheck2,
  ChevronRight,
} from 'lucide-react';
import { ListingItem, CatalogItem, CartItem } from '../types';

interface ProviderDetailModalProps {
  listing: ListingItem | null;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

export const ProviderDetailModal: React.FC<ProviderDetailModalProps> = ({
  listing,
  onClose,
  onAddToCart,
}) => {
  if (!listing) return null;

  const [activeTab, setActiveTab] = useState<'catalog' | 'soil' | 'reviews' | 'about'>('catalog');
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const handleAdd = (item: CatalogItem) => {
    onAddToCart({
      listingId: listing.id,
      listingName: listing.name,
      itemId: item.id,
      itemName: item.name,
      price: item.price,
      unit: item.unit,
      quantity: item.minQty ? (item.minQty > 10 ? 1 : item.minQty) : 1,
    });

    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item.id]: false }));
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-stone-200">
        {/* Modal Header & Hero Image */}
        <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-stone-900 shrink-0">
          <img
            src={listing.image}
            alt={listing.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-black/30" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-900/80 hover:bg-stone-900 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20 shadow-md"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hero details overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {listing.badge && (
                <span className="px-2.5 py-0.5 bg-amber-400 text-stone-950 text-xs font-bold rounded-sm shadow-xs uppercase tracking-wider">
                  {listing.badge}
                </span>
              )}
              {listing.discountOffer && (
                <span className="px-2.5 py-0.5 bg-rose-600 text-white text-xs font-bold rounded-sm shadow-xs">
                  {listing.discountOffer}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif">
                  {listing.name}
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 mt-1 font-medium">
                  {listing.cuisineTag}
                </p>
                <div className="flex items-center gap-3 text-xs text-stone-300 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    {listing.locality}, {listing.city}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-rose-400" />
                    {listing.deliveryTime}
                  </span>
                </div>
              </div>

              {/* Zomato Rating Pill with Reviews count */}
              <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 bg-stone-900/60 p-2 sm:p-2.5 rounded-xl border border-white/10">
                <div className="flex items-center gap-1.5 bg-emerald-700 text-white px-2.5 py-1 rounded-md text-sm font-extrabold shadow-xs">
                  <span>{listing.rating.toFixed(1)}</span>
                  <Star className="w-3.5 h-3.5 fill-white" />
                </div>
                <span className="text-[11px] text-stone-300">
                  {listing.reviewsCount} customer reviews
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Zomato Restaurant tabs) */}
        <div className="border-b border-stone-200 bg-white px-4 sm:px-6 flex items-center gap-6 text-sm font-semibold text-stone-600">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-3.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'catalog'
                ? 'border-rose-600 text-rose-600 font-bold'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            Packages & Catalog ({listing.catalog.length})
          </button>

          {listing.soilTestingSpecs && (
            <button
              onClick={() => setActiveTab('soil')}
              className={`py-3.5 border-b-2 transition-all cursor-pointer ${
                activeTab === 'soil'
                  ? 'border-rose-600 text-rose-600 font-bold'
                  : 'border-transparent hover:text-stone-900'
              }`}
            >
              Geotechnical Specs
            </button>
          )}

          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-rose-600 text-rose-600 font-bold'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            Reviews ({listing.reviews.length})
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`py-3.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'about'
                ? 'border-rose-600 text-rose-600 font-bold'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            About & License
          </button>
        </div>

        {/* Modal Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-50/50">
          {/* TAB 1: CATALOG / PACKAGES (ZOMATO FOOD MENU STYLE) */}
          {activeTab === 'catalog' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <h3 className="text-lg font-bold text-stone-900">
                  Select Deliverables & Materials
                </h3>
                <span className="text-xs text-stone-500">
                  Add to cart for itemized BOQ estimation
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listing.catalog.map((item) => {
                  const isAdded = !!addedItems[item.id];

                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col justify-between hover:border-stone-300 shadow-2xs transition-all"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="text-xs font-semibold text-rose-600 uppercase tracking-wide">
                            {item.category}
                          </span>
                          {item.popular && (
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold rounded-md">
                              Bestseller
                            </span>
                          )}
                        </div>

                        <h4 className="text-base font-bold text-stone-900 leading-snug">
                          {item.name}
                        </h4>

                        <div className="mt-1 flex items-baseline gap-1 text-sm font-extrabold text-stone-950 font-mono">
                          <span>₹{item.price.toLocaleString('en-IN')}</span>
                          <span className="text-xs text-stone-500 font-sans font-normal">
                            {item.unit}
                          </span>
                        </div>

                        <p className="text-xs text-stone-600 mt-2 line-clamp-3 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-[11px] text-stone-400">
                          {item.inStock ? 'Available for booking' : 'Call for lead time'}
                        </span>

                        <button
                          onClick={() => handleAdd(item)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isAdded
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add to Project</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: GEOTECHNICAL & SOIL SPECS */}
          {activeTab === 'soil' && listing.soilTestingSpecs && (
            <div className="space-y-4">
              <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-2xs">
                <h3 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-rose-600" />
                  <span>NABL Accredited Soil Testing Parameters (IS:1892 & IS:2131)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <span className="text-stone-500 font-medium block">Standard Test Protocol</span>
                    <span className="font-bold text-stone-900 mt-0.5 block">
                      {listing.soilTestingSpecs.testMethod}
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg">
                    <span className="text-stone-500 font-medium block">Investigation Depth</span>
                    <span className="font-bold text-stone-900 mt-0.5 block">
                      {listing.soilTestingSpecs.boreholeDepth}
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg">
                    <span className="text-stone-500 font-medium block">Safe Bearing Capacity (SBC)</span>
                    <span className="font-bold text-stone-900 mt-0.5 block">
                      {listing.soilTestingSpecs.safeBearingCapacity}
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-lg">
                    <span className="text-stone-500 font-medium block">Lab Turnaround Time</span>
                    <span className="font-bold text-stone-900 mt-0.5 block">
                      {listing.soilTestingSpecs.turnaroundTime}
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-amber-50/80 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <p>
                    <strong>Geotechnical Disclaimer:</strong> Preliminary app values are indicative.
                    Structural engineering decisions and foundation designs must be certified by a registered
                    structural engineer based on stamped laboratory core reports.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-stone-900 mb-2">
                Verified Client Testimonials
              </h3>
              {listing.reviews.map((rev) => (
                <div key={rev.id} className="bg-white border border-stone-200 rounded-xl p-4 shadow-2xs">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center">
                        {rev.author.charAt(0)}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-stone-900 block leading-tight">
                          {rev.author}
                        </span>
                        <span className="text-[11px] text-rose-600 font-medium">
                          {rev.verifiedProject}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-emerald-700 text-white px-2 py-0.5 rounded-md text-xs font-bold">
                      <span>{rev.rating}</span>
                      <Star className="w-3 h-3 fill-white" />
                    </div>
                  </div>

                  <p className="text-xs text-stone-700 mt-2 leading-relaxed">
                    "{rev.comment}"
                  </p>

                  <span className="text-[10px] text-stone-400 mt-2 block">
                    Posted {rev.date} · Verified BUILDZY Milestone Inspection
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: ABOUT & LICENSE */}
          {activeTab === 'about' && (
            <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-4 shadow-2xs text-xs">
              <div>
                <h4 className="font-bold text-stone-900 text-sm mb-1">Company Overview</h4>
                <p className="text-stone-600 leading-relaxed">{listing.about}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-stone-100">
                <div>
                  <span className="text-stone-400 block">Registration & License</span>
                  <span className="font-bold text-stone-800 font-mono text-xs">
                    {listing.licenseNumber}
                  </span>
                </div>

                <div>
                  <span className="text-stone-400 block">Contact Phone</span>
                  <span className="font-bold text-stone-800 text-xs flex items-center gap-1 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-stone-500" />
                    {listing.phone}
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-stone-400 block">Physical Head Office / Yard</span>
                  <span className="font-medium text-stone-800 text-xs mt-0.5 block">
                    {listing.address}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Sticky Bar */}
        <div className="p-4 bg-white border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-600">
            <span className="font-semibold text-stone-900">BUILDZY Protection:</span>
            <span className="ml-1 text-stone-500 hidden sm:inline">
              Payments disbursed only upon completed milestone inspection
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
