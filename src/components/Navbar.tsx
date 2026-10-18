import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  Search,
  ChevronDown,
  ShoppingBag,
  Sparkles,
  Building2,
  X,
  Globe,
  Check,
  Star,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { City, LocationOption, LanguageCode } from '../types';
import { AVAILABLE_LOCATIONS, LISTINGS } from '../data/mockData';
import { SUPPORTED_LANGUAGES, TranslationStrings } from '../i18n/translations';

interface NavbarProps {
  selectedLocation: LocationOption;
  onSelectLocation: (loc: LocationOption) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAiStudio: () => void;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  t: TranslationStrings;
  onSelectListingFromSearch?: (listingId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedLocation,
  onSelectLocation,
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart,
  onOpenAiStudio,
  currentLanguage,
  onLanguageChange,
  t,
  onSelectListingFromSearch,
}) => {
  const [isLocDropdownOpen, setIsLocDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [locSearchFilter, setLocSearchFilter] = useState('');

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  // Filter locations in dropdown
  const filteredLocations = AVAILABLE_LOCATIONS.filter(
    (loc) =>
      loc.city.toLowerCase().includes(locSearchFilter.toLowerCase()) ||
      loc.locality.toLowerCase().includes(locSearchFilter.toLowerCase()) ||
      loc.state.toLowerCase().includes(locSearchFilter.toLowerCase())
  );

  // Instant search results
  const searchResults = searchQuery.trim().length >= 2
    ? LISTINGS.filter((item) => {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.cuisineTag.toLowerCase().includes(q) ||
          item.city.toLowerCase().includes(q) ||
          item.locality.toLowerCase().includes(q) ||
          item.catalog.some((c) => c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q))
        );
      }).slice(0, 5)
    : [];

  // Close search suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-xs">
      {/* Top Banner - Pan-India Notice */}
      <div className="bg-stone-900 text-stone-200 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <p className="flex items-center gap-2 truncate pr-4">
            <span className="font-semibold text-rose-400 shrink-0">BUILDZY INDIA:</span>
            <span className="truncate">{t.topNotice}</span>
          </p>
          <div className="hidden lg:flex items-center gap-4 text-stone-400 text-xs shrink-0">
            <span>{t.supportHours}</span>
          </div>
        </div>
      </div>

      {/* Main Zomato-Style Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3 md:gap-6">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-sm font-black tracking-wider text-xl">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-stone-950 font-serif">
                BUILD<span className="text-rose-600">ZY</span>
              </span>
              <p className="text-[10px] text-stone-500 font-medium tracking-tight -mt-1 hidden sm:block">
                All-India Construction Ecosystem
              </p>
            </div>
          </div>
        </div>

        {/* Central Search + Location Bar (Zomato iconic combo) */}
        <div ref={searchContainerRef} className="flex-1 max-w-2xl relative">
          <div className="flex items-center bg-white border border-stone-300 rounded-xl shadow-xs hover:shadow-sm transition-all focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-100 overflow-hidden">
            {/* Location Selector */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsLocDropdownOpen(!isLocDropdownOpen);
                  setIsLangDropdownOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2.5 text-xs sm:text-sm font-medium text-stone-800 hover:bg-stone-50 transition-colors border-r border-stone-200 cursor-pointer"
                title="Change City / Locality"
              >
                <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="max-w-[110px] sm:max-w-[160px] truncate text-left">
                  {selectedLocation.locality}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              </button>

              {/* Location Dropdown Modal */}
              {isLocDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-80 bg-white border border-stone-200 rounded-2xl shadow-2xl z-50 p-2 animate-in fade-in slide-in-from-top-1">
                  <div className="p-2 border-b border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                      Select City / Zone ({AVAILABLE_LOCATIONS.length} Hubs)
                    </span>
                    <button
                      onClick={() => setIsLocDropdownOpen(false)}
                      className="text-stone-400 hover:text-stone-700 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-1.5">
                    <input
                      type="text"
                      placeholder="Filter city or state..."
                      value={locSearchFilter}
                      onChange={(e) => setLocSearchFilter(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:outline-hidden focus:border-rose-500"
                    />
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-stone-50 py-1">
                    {filteredLocations.map((loc, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          onSelectLocation(loc);
                          setIsLocDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs sm:text-sm flex items-center justify-between hover:bg-rose-50 transition-colors cursor-pointer ${
                          selectedLocation.locality === loc.locality
                            ? 'text-rose-600 font-semibold bg-rose-50/50'
                            : 'text-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          <div>
                            <span className="font-semibold block">{loc.locality}</span>
                            <span className="text-[10px] text-stone-400 font-normal">{loc.city}</span>
                          </div>
                        </div>
                        <span className="text-[11px] text-stone-400 font-normal">
                          {loc.state}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Live Search Input */}
            <div className="flex-1 flex items-center px-3 py-2 gap-2">
              <Search className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setIsSearchFocused(true);
                }}
                className="w-full text-xs sm:text-sm text-stone-800 placeholder-stone-400 bg-transparent focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="text-stone-400 hover:text-stone-700 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Instant Search Suggestions Dropdown */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 p-2 animate-in fade-in slide-in-from-top-1 divide-y divide-stone-100">
              <div className="px-3 py-1.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                Matching Providers & Supplies
              </div>
              {searchResults.map((res) => (
                <button
                  key={res.id}
                  onClick={() => {
                    if (onSelectListingFromSearch) {
                      onSelectListingFromSearch(res.id);
                    }
                    setIsSearchFocused(false);
                  }}
                  className="w-full text-left p-2.5 hover:bg-stone-50 rounded-xl transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900">{res.name}</span>
                      <span className="px-1.5 py-0.2 bg-stone-100 text-stone-600 text-[10px] rounded uppercase font-semibold">
                        {res.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                      {res.locality}, {res.city} · {res.priceDisplay}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-0.5">
                      {res.rating.toFixed(1)} <Star className="w-3 h-3 fill-emerald-700" />
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Zone Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* LANGUAGE SELECTOR (9 Indian Languages) */}
          <div className="relative">
            <button
              onClick={() => {
                setIsLangDropdownOpen(!isLangDropdownOpen);
                setIsLocDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer border border-stone-200"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-rose-600" />
              <span>{currentLangObj.nativeName}</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 p-2 animate-in fade-in slide-in-from-top-1">
                <div className="p-2 border-b border-stone-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                    Select Language
                  </span>
                  <button
                    onClick={() => setIsLangDropdownOpen(false)}
                    className="text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-stone-50 py-1">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-rose-50 transition-colors cursor-pointer ${
                        currentLanguage === lang.code
                          ? 'text-rose-600 font-bold bg-rose-50/50'
                          : 'text-stone-700'
                      }`}
                    >
                      <div>
                        <span className="block font-semibold">{lang.nativeName}</span>
                        <span className="text-[10px] text-stone-400">{lang.name}</span>
                      </div>
                      {currentLanguage === lang.code && (
                        <Check className="w-3.5 h-3.5 text-rose-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Planner Shortcut */}
          <button
            onClick={onOpenAiStudio}
            className="hidden xl:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>{t.aiStudioBtn}</span>
          </button>

          {/* Cart / BOQ Estimator */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-stone-900 bg-white border border-stone-300 rounded-xl hover:border-stone-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
            aria-label="View Project Cart"
          >
            <ShoppingBag className="w-4 h-4 text-rose-600" />
            <span className="hidden sm:inline">{t.projectCart}</span>
            {cartCount > 0 && (
              <span className="bg-rose-600 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-1 border-l border-stone-200">
            <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold ring-2 ring-stone-100">
              IN
            </div>
            <div className="hidden 2xl:block text-left text-xs leading-tight">
              <p className="font-semibold text-stone-900">Suresh P.</p>
              <p className="text-stone-500 text-[10px]">Verified Homeowner</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
