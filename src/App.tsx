/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  Building2,
  X,
  PhoneCall,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { City, LocationOption, MainTab, ListingItem, CartItem, LanguageCode } from './types';
import {
  AVAILABLE_LOCATIONS,
  LISTINGS,
  HERO_IMAGE,
} from './data/mockData';
import { TRANSLATIONS } from './i18n/translations';
import { Navbar } from './components/Navbar';
import { ZomatoTabs } from './components/ZomatoTabs';
import { CategoryCarousel } from './components/CategoryCarousel';
import { CuratedCollections } from './components/CuratedCollections';
import { FilterBar } from './components/FilterBar';
import { ListingCard } from './components/ListingCard';
import { ProviderDetailModal } from './components/ProviderDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { AiStudioPlanner } from './components/AiStudioPlanner';
import { LiveProjectTracker } from './components/LiveProjectTracker';

export default function App() {
  // Language & Translation state
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  // Navigation & Location state (Default Bengaluru, South India)
  const [selectedLocation, setSelectedLocation] = useState<LocationOption>(AVAILABLE_LOCATIONS[0]);
  const [activeTab, setActiveTab] = useState<MainTab>('delivery');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filters
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [reraOnly, setReraOnly] = useState(false);
  const [fastDispatchOnly, setFastDispatchOnly] = useState(false);
  const [budgetFriendlyOnly, setBudgetFriendlyOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'price_low' | 'speed'>('relevance');

  // Modal & Drawer states
  const [selectedListing, setSelectedListing] = useState<ListingItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastPlacedOrderId, setLastPlacedOrderId] = useState<string | null>(null);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([
    {
      listingId: 'mat-allindia-1',
      listingName: 'National Direct Wholesale Building Materials Hub',
      itemId: 'cem-ultra-53',
      itemName: 'UltraTech Super Cement (53-Grade OPC)',
      price: 385,
      unit: '50kg bag',
      quantity: 50,
    },
    {
      listingId: 'soil-india-1',
      listingName: 'Bharat Geotech & Soil Investigation Labs',
      itemId: 'soil-std-pkg',
      itemName: 'Standard Residential Soil Test (2 Boreholes, 6m depth)',
      price: 14500,
      unit: 'per site test package',
      quantity: 1,
    },
  ]);

  const handleAddToCart = (newItem: CartItem) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((i) => i.itemId === newItem.itemId);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, newItem];
    });
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.itemId === itemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.itemId !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const hasActiveFilters = Boolean(
    ratingFilter !== null || reraOnly || fastDispatchOnly || budgetFriendlyOnly || selectedCategory !== 'all' || searchQuery
  );

  const handleResetFilters = () => {
    setRatingFilter(null);
    setReraOnly(false);
    setFastDispatchOnly(false);
    setBudgetFriendlyOnly(false);
    setSelectedCategory('all');
    setSearchQuery('');
  };

  // Filter listings based on current state & tab
  const filteredListings = useMemo(() => {
    return LISTINGS.filter((item) => {
      // Tab matching
      if (activeTab === 'delivery') {
        if (item.type !== 'materials' && item.type !== 'soil_lab' && selectedCategory === 'all' && !searchQuery) {
          return false;
        }
      } else if (activeTab === 'dining') {
        if (item.type !== 'builder' && item.type !== 'architect' && selectedCategory === 'all' && !searchQuery) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'cement') {
          const isCement = item.cuisineTag.toLowerCase().includes('cement') || item.catalog.some(c => c.category.toLowerCase().includes('cement') || c.name.toLowerCase().includes('cement'));
          if (!isCement) return false;
        } else if (selectedCategory === 'steel') {
          const isSteel = item.cuisineTag.toLowerCase().includes('steel') || item.catalog.some(c => c.category.toLowerCase().includes('steel') || c.name.toLowerCase().includes('steel') || c.name.toLowerCase().includes('rebar'));
          if (!isSteel) return false;
        } else if (selectedCategory === 'soil_lab') {
          if (item.type !== 'soil_lab') return false;
        } else if (selectedCategory === 'builder') {
          if (item.type !== 'builder') return false;
        } else if (selectedCategory === 'architect') {
          if (item.type !== 'architect') return false;
        } else if (selectedCategory === 'bricks') {
          const isBricks = item.cuisineTag.toLowerCase().includes('brick') || item.cuisineTag.toLowerCase().includes('aac') || item.catalog.some(c => c.name.toLowerCase().includes('brick') || c.name.toLowerCase().includes('aac') || c.category.toLowerCase().includes('brick'));
          if (!isBricks) return false;
        } else if (selectedCategory === 'sanitary') {
          const isSanitary = item.cuisineTag.toLowerCase().includes('sanitary') || item.cuisineTag.toLowerCase().includes('rmc') || item.cuisineTag.toLowerCase().includes('plumbing') || item.catalog.some(c => c.category.toLowerCase().includes('plumbing') || c.category.toLowerCase().includes('sanitary') || c.category.toLowerCase().includes('concrete'));
          if (!isSanitary) return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesTag = item.cuisineTag.toLowerCase().includes(q);
        const matchesLoc = item.locality.toLowerCase().includes(q) || item.city.toLowerCase().includes(q);
        const matchesCatalog = item.catalog.some((c) => c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q));
        if (!matchesName && !matchesTag && !matchesLoc && !matchesCatalog) {
          return false;
        }
      }

      // Filter: Rating
      if (ratingFilter && item.rating < ratingFilter) return false;

      // Filter: RERA
      if (reraOnly && !item.isReraVerified) return false;

      // Filter: Fast Dispatch
      if (fastDispatchOnly && !item.deliveryTime.toLowerCase().includes('same-day') && !item.deliveryTime.toLowerCase().includes('hrs')) return false;

      // Filter: Budget Friendly
      if (budgetFriendlyOnly && item.priceNumeric > 2000 && item.type === 'builder') return false;

      return true;
    }).sort((a, b) => {
      // Prioritize selected city
      const aInCity = a.city === selectedLocation.city ? 1 : 0;
      const bInCity = b.city === selectedLocation.city ? 1 : 0;
      if (aInCity !== bInCity) {
        return bInCity - aInCity;
      }

      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price_low') return a.priceNumeric - b.priceNumeric;
      if (sortBy === 'speed') return a.deliveryTime.localeCompare(b.deliveryTime);
      return b.rating - a.rating; // relevance
    });
  }, [activeTab, selectedCategory, searchQuery, ratingFilter, reraOnly, fastDispatchOnly, budgetFriendlyOnly, sortBy, selectedLocation.city]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-stone-900 flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900">
      {/* 1. TOP NAVBAR (Location Selector + Search Bar + Language + Cart) */}
      <Navbar
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cart.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAiStudio={() => setActiveTab('ai-studio')}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        t={t}
        onSelectListingFromSearch={(listingId) => {
          const item = LISTINGS.find((l) => l.id === listingId);
          if (item) setSelectedListing(item);
        }}
      />

      {/* 2. ZOMATO 4 MAIN SERVICE TABS */}
      <ZomatoTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeProjectProgress={42}
        t={t}
      />

      {/* Order Success Toast / Notification */}
      {lastPlacedOrderId && (
        <div className="bg-emerald-700 text-white px-4 py-3 shadow-md flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-200" />
              <span>
                Site Inspection & Procurement Request Registered! Reference ID: <strong>{lastPlacedOrderId}</strong>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setActiveTab('tracking');
                  setLastPlacedOrderId(null);
                }}
                className="text-xs bg-white text-emerald-900 px-3 py-1 rounded-md font-bold hover:bg-emerald-50 cursor-pointer"
              >
                Track Live Progress →
              </button>
              <button
                onClick={() => setLastPlacedOrderId(null)}
                className="text-emerald-200 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW SWITCHER BASED ON TAB */}

      {/* VIEW A: AI HOUSE & BUDGET STUDIO */}
      {activeTab === 'ai-studio' && (
        <main className="flex-1">
          <AiStudioPlanner
            currentCity={selectedLocation.city}
            onAddToCart={handleAddToCart}
            onSwitchToTracking={() => setActiveTab('tracking')}
            t={t}
          />
        </main>
      )}

      {/* VIEW B: LIVE CONSTRUCTION TRACKER */}
      {activeTab === 'tracking' && (
        <main className="flex-1">
          <LiveProjectTracker t={t} customOrderId={lastPlacedOrderId} />
        </main>
      )}

      {/* VIEW C: MARKETPLACE & SERVICES (DELIVERY OR DINING OUT TABS) */}
      {(activeTab === 'delivery' || activeTab === 'dining') && (
        <main className="flex-1">
          {/* Hero Highlight Banner */}
          <section className="bg-stone-900 text-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-3">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/10 text-rose-300 rounded-full text-xs font-semibold backdrop-blur-xs border border-white/10">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  <span>BUILDZY All-India Ecosystem · Verified in 28 States & UTs</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight font-serif">
                  {activeTab === 'delivery' ? t.heroDeliveryTitle : t.heroDiningTitle}
                </h1>

                <p className="text-xs sm:text-sm text-stone-300 max-w-xl leading-relaxed">
                  {t.heroSub}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setActiveTab('ai-studio')}
                    className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{t.calculatePlotBudget}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab(activeTab === 'delivery' ? 'dining' : 'delivery')}
                    className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs sm:text-sm font-semibold rounded-xl border border-stone-700 transition-colors cursor-pointer"
                  >
                    {activeTab === 'delivery' ? t.exploreToggleBuilders : t.exploreToggleMaterials}
                  </button>
                </div>
              </div>

              {/* Hero Image Card */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden aspect-16/10 shadow-2xl border border-white/10">
                  <img
                    src={HERO_IMAGE}
                    alt="Buildzy residential construction"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-rose-400 font-semibold block">
                        Verified Pan-India Jobsite
                      </span>
                      <span className="text-xs font-bold">RERA Registered Residential Villa</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded">
                      Milestone Phase 3
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Categories Carousel (Zomato-style circles) */}
          <CategoryCarousel
            selectedCategory={selectedCategory}
            onSelectCategory={(catId) => {
              setSelectedCategory(catId);
              if (catId === 'builder' || catId === 'architect') {
                setActiveTab('dining');
              } else if (catId === 'cement' || catId === 'steel' || catId === 'soil_lab' || catId === 'bricks' || catId === 'sanitary') {
                setActiveTab('delivery');
              }
              const sec = document.getElementById('listings-section');
              if (sec) sec.scrollIntoView({ behavior: 'smooth' });
            }}
            t={t}
          />

          {/* Curated Collections in Selected City */}
          <CuratedCollections
            onSelectCollection={(tag) => {
              if (tag === 'builder' || tag === 'architect') {
                setActiveTab('dining');
                setSelectedCategory(tag);
              } else {
                setActiveTab('delivery');
                setSelectedCategory(tag === 'materials' ? 'all' : tag);
              }
              const sec = document.getElementById('listings-section');
              if (sec) sec.scrollIntoView({ behavior: 'smooth' });
            }}
            onExploreAll={() => {
              setSelectedCategory('all');
              const sec = document.getElementById('listings-section');
              if (sec) sec.scrollIntoView({ behavior: 'smooth' });
            }}
            selectedCity={selectedLocation.city}
            t={t}
          />

          {/* Sticky Filter & Sort Bar */}
          <FilterBar
            ratingFilter={ratingFilter}
            onRatingFilterToggle={setRatingFilter}
            reraOnly={reraOnly}
            onReraToggle={() => setReraOnly(!reraOnly)}
            fastDispatchOnly={fastDispatchOnly}
            onFastDispatchToggle={() => setFastDispatchOnly(!fastDispatchOnly)}
            budgetFriendlyOnly={budgetFriendlyOnly}
            onBudgetFriendlyToggle={() => setBudgetFriendlyOnly(!budgetFriendlyOnly)}
            sortBy={sortBy}
            onSortChange={setSortBy}
            totalCount={filteredListings.length}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
            t={t}
          />

          {/* Main Listings Grid (Zomato Restaurant Card layout) */}
          <section id="listings-section" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 scroll-mt-24">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 font-serif">
                  {activeTab === 'delivery'
                    ? `Building Materials & Soil Testing Hubs near ${selectedLocation.locality}`
                    : `Verified Turnkey Builders & Architects in ${selectedLocation.city}`}
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Showing verified providers with transparent rates & direct booking
                </p>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-rose-600 font-semibold hover:underline cursor-pointer"
                >
                  {t.clearAll}
                </button>
              )}
            </div>

            {filteredListings.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center my-6">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3 text-stone-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-stone-900">No matching providers found</h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-4">
                  We couldn't find any suppliers or builders matching "{searchQuery}" with current filters. Try expanding your search or clearing filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-stone-800 cursor-pointer"
                >
                  {t.clearAll}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onSelect={(item) => setSelectedListing(item)}
                    t={t}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      )}

      {/* MODAL 1: PROVIDER DETAIL VIEW (Zomato Restaurant Page) */}
      <ProviderDetailModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        onAddToCart={(item) => {
          handleAddToCart(item);
          setIsCartOpen(true);
        }}
      />

      {/* DRAWER 2: PROJECT CART & BOQ ESTIMATOR */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        selectedLocation={selectedLocation}
        onOrderSuccess={(orderId) => setLastPlacedOrderId(orderId)}
        t={t}
      />

      {/* FOOTER (ZOMATO STYLE BRAND FOOTER) */}
      <footer className="bg-stone-950 text-stone-400 text-xs border-t border-stone-800 mt-12 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-stone-800">
            {/* Brand column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white font-black text-sm">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-xl font-black tracking-tight text-white font-serif">
                  BUILD<span className="text-rose-600">ZY</span>
                </span>
              </div>
              <p className="text-stone-400 text-xs leading-relaxed">
                All-India AI-Powered Home Construction Planning & Management Platform.
                Building trust, transparency, and certified quality for homeowners across 28 States and Union Territories.
              </p>
              <div className="text-[11px] text-stone-500">
                National Network: Bengaluru · Mumbai · Delhi NCR · Hyderabad · Pune · Chennai · Kolkata · Ahmedabad · Kochi
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                For Homeowners
              </h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setActiveTab('delivery')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Order Cement, Steel & River Sand
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('delivery')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Book NABL Geotechnical Soil Test
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('dining')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Verified RERA Turnkey Builders
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('ai-studio')} className="hover:text-white transition-colors cursor-pointer text-left">
                    AI Plot Budget Calculator (BOQ)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('tracking')} className="hover:text-white transition-colors cursor-pointer text-left">
                    Live Milestone Progress Tracker
                  </button>
                </li>
              </ul>
            </div>

            {/* For Partners */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                For Construction Pros
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pan-India Builder Partner Onboarding
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    NABL Soil Lab Accreditation Network
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Direct Mill Steel & Cement Stockist Portal
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    National RERA Compliance Guidelines
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal & Statutory Guardrails */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Responsible Engineering
              </h4>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                BUILDZY operates in strict compliance with BIS National Building Code (NBC 2016), IS 456, IS 1892,
                and state RERA regulatory authorities.
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-stone-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Escrow Milestone Release</span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
            <p>© 2026 BUILDZY Inc. All India Construction Platform. Available in 9 Indian languages.</p>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Pan-India RERA Compliance</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
