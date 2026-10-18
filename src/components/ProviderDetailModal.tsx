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
  Calendar,
  Download,
  Building2,
  Award,
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
  
  // Custom Area Selector for turnkey builder / architectural packages
  const [selectedAreas, setSelectedAreas] = useState<Record<string, number>>({});
  
  // Booking consultation modal state
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [consultationDate, setConsultationDate] = useState('Tomorrow, 10:00 AM');
  const [consultationSuccess, setConsultationSuccess] = useState(false);

  const getItemQuantity = (item: CatalogItem) => {
    if (selectedAreas[item.id]) return selectedAreas[item.id];
    if (item.minQty && item.minQty >= 100) return item.minQty;
    return item.minQty || 1;
  };

  const handleAreaChange = (itemId: string, area: number) => {
    setSelectedAreas((prev) => ({ ...prev, [itemId]: Math.max(500, area) }));
  };

  const handleAdd = (item: CatalogItem) => {
    const qty = getItemQuantity(item);

    onAddToCart({
      listingId: listing.id,
      listingName: listing.name,
      itemId: item.id,
      itemName: item.name,
      price: item.price,
      unit: item.unit,
      quantity: qty,
    });

    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item.id]: false }));
    }, 1800);
  };

  const handleBookConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    setConsultationSuccess(true);
    setTimeout(() => {
      setConsultationSuccess(false);
      setIsConsultationModalOpen(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-stone-200">
        {/* Modal Header & Hero Image */}
        <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-stone-900 shrink-0">
          <img
            src={listing.image}
            alt={listing.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/50 to-black/30" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-900/80 hover:bg-stone-900 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20 shadow-md z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hero details overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {listing.badge && (
                <span className="px-2.5 py-0.5 bg-amber-400 text-stone-950 text-xs font-bold rounded-sm shadow-xs uppercase tracking-wider flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>{listing.badge}</span>
                </span>
              )}
              {listing.discountOffer && (
                <span className="px-2.5 py-0.5 bg-rose-600 text-white text-xs font-bold rounded-sm shadow-xs">
                  {listing.discountOffer}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif text-white">
                  {listing.name}
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 mt-1 font-medium max-w-xl">
                  {listing.cuisineTag}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-300 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    {listing.locality}, {listing.city} · {listing.distance}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-rose-400" />
                    {listing.deliveryTime}
                  </span>
                </div>
              </div>

              {/* Zomato Rating Pill with Reviews count */}
              <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 bg-stone-900/70 p-2 sm:p-2.5 rounded-xl border border-white/10 backdrop-blur-xs">
                <div className="flex items-center gap-1.5 bg-emerald-700 text-white px-2.5 py-1 rounded-md text-sm font-extrabold shadow-xs">
                  <span>{listing.rating.toFixed(1)}</span>
                  <Star className="w-3.5 h-3.5 fill-white" />
                </div>
                <span className="text-[11px] text-stone-300">
                  {listing.reviewsCount} verified reviews
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Zomato Restaurant tabs) */}
        <div className="border-b border-stone-200 bg-white px-4 sm:px-6 flex items-center justify-between text-sm font-semibold text-stone-600">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`py-3.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
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
                className={`py-3.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
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
              className={`py-3.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'border-rose-600 text-rose-600 font-bold'
                  : 'border-transparent hover:text-stone-900'
              }`}
            >
              Reviews ({listing.reviews.length})
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`py-3.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'about'
                  ? 'border-rose-600 text-rose-600 font-bold'
                  : 'border-transparent hover:text-stone-900'
              }`}
            >
              About & License
            </button>
          </div>

          <button
            onClick={() => setIsConsultationModalOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold rounded-lg cursor-pointer transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Site Visit</span>
          </button>
        </div>

        {/* Modal Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-50/50">
          {/* TAB 1: CATALOG / PACKAGES */}
          {activeTab === 'catalog' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <h3 className="text-base font-bold text-stone-900">
                  Select Deliverables & Materials
                </h3>
                <span className="text-xs text-stone-500">
                  Direct booking with escrow milestone guarantees
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listing.catalog.map((item) => {
                  const isAdded = !!addedItems[item.id];
                  const isAreaBased = item.unit.includes('sq.ft') || item.minQty && item.minQty >= 100;
                  const currentQty = getItemQuantity(item);

                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-stone-200 rounded-2xl p-4 flex flex-col justify-between hover:border-stone-300 shadow-2xs transition-all"
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

                        <h4 className="text-sm sm:text-base font-bold text-stone-900 leading-snug">
                          {item.name}
                        </h4>

                        <div className="mt-1 flex items-baseline gap-1 text-sm font-extrabold text-stone-950 font-mono">
                          <span>₹{item.price.toLocaleString('en-IN')}</span>
                          <span className="text-xs text-stone-500 font-sans font-normal">
                            {item.unit}
                          </span>
                        </div>

                        <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Interactive Area Selector for Turnkey / Architectural packages */}
                        {isAreaBased && (
                          <div className="mt-3 p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-semibold text-stone-700">Select Built-up Area:</span>
                              <span className="font-mono font-bold text-rose-700">{currentQty} sq.ft</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1.5">
                              {[1000, 1500, 2400].map((areaVal) => (
                                <button
                                  key={areaVal}
                                  type="button"
                                  onClick={() => handleAreaChange(item.id, areaVal)}
                                  className={`py-1 text-[11px] font-bold rounded-md border cursor-pointer ${
                                    currentQty === areaVal
                                      ? 'bg-stone-900 text-white border-stone-900'
                                      : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                                  }`}
                                >
                                  {areaVal} sq.ft
                                </button>
                              ))}
                            </div>
                            <div className="mt-2 flex justify-between text-[11px] font-bold text-stone-800 pt-1 border-t border-stone-200">
                              <span>Estimated Package Total:</span>
                              <span className="font-mono text-rose-700">
                                ₹{(item.price * currentQty).toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-[11px] text-stone-400">
                          {item.inStock ? 'Available for booking' : 'Call for lead time'}
                        </span>

                        <button
                          onClick={() => handleAdd(item)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                            isAdded
                              ? 'bg-emerald-600 text-white'
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
              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-2xs">
                <h3 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-rose-600" />
                  <span>NABL Accredited Soil Testing Parameters (IS:1892 & IS:2131)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                    <span className="text-stone-500 font-medium block">Standard Test Protocol</span>
                    <span className="font-bold text-stone-900 mt-0.5 block">
                      {listing.soilTestingSpecs.testMethod}
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                    <span className="text-stone-500 font-medium block">Investigation Depth</span>
                    <span className="font-bold text-stone-900 mt-0.5 block">
                      {listing.soilTestingSpecs.boreholeDepth}
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                    <span className="text-stone-500 font-medium block">Safe Bearing Capacity (SBC)</span>
                    <span className="font-bold text-stone-900 mt-0.5 block">
                      {listing.soilTestingSpecs.safeBearingCapacity}
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                    <span className="text-stone-500 font-medium block">Lab Turnaround Time</span>
                    <span className="font-bold text-stone-900 mt-0.5 block">
                      {listing.soilTestingSpecs.turnaroundTime}
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-amber-50/90 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <p>
                    <strong>Geotechnical Compliance:</strong> Field soil sampling and standard penetration tests comply strictly with BIS specifications. Stamped laboratory core reports accepted by all municipal corporations across India.
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
                      <div className="w-8 h-8 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center">
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
            <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4 shadow-2xs text-xs">
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
                  <span className="text-stone-400 block">Physical Head Office / Depot Yard</span>
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
          <div className="text-xs text-stone-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-stone-900">BUILDZY Protection:</span>
            <span className="text-stone-500 hidden sm:inline">
              100% Escrow Milestone Release guarantees on all bookings
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${listing.phone}`}
              className="px-3.5 py-2 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-rose-600" />
              <span>Call Provider</span>
            </a>
            <button
              onClick={() => setIsConsultationModalOpen(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Book Site Consultation
            </button>
          </div>
        </div>
      </div>

      {/* SCHEDULE CONSULTATION MODAL */}
      {isConsultationModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-md w-full rounded-2xl p-5 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-rose-600" />
                <h3 className="text-sm font-bold text-stone-900">Schedule Site Consultation</h3>
              </div>
              <button
                onClick={() => setIsConsultationModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {consultationSuccess ? (
              <div className="text-center py-6 space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-stone-900">Site Visit Confirmed!</h4>
                <p className="text-xs text-stone-500">
                  {listing.name}'s Senior Civil Engineer has reserved your slot for {consultationDate}. Confirmation sent via SMS.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookConsultation} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Preferred Slot</label>
                  <select
                    value={consultationDate}
                    onChange={(e) => setConsultationDate(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    <option value="Tomorrow, 10:00 AM">Tomorrow, 10:00 AM</option>
                    <option value="Tomorrow, 2:30 PM">Tomorrow, 2:30 PM</option>
                    <option value="This Saturday, 11:00 AM">This Saturday, 11:00 AM</option>
                    <option value="This Sunday, 10:00 AM">This Sunday, 10:00 AM</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Plot Location / Address</label>
                  <input
                    type="text"
                    defaultValue={`${listing.locality}, ${listing.city}`}
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    defaultValue="+91 98480 12345"
                    className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium"
                    required
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsConsultationModalOpen(false)}
                    className="px-3 py-2 text-stone-600 font-bold hover:bg-stone-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg cursor-pointer shadow-xs"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
