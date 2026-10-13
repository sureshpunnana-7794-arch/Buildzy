import React from 'react';
import { SlidersHorizontal, Star, ShieldCheck, Zap, ArrowUpDown, X } from 'lucide-react';
import { TranslationStrings } from '../i18n/translations';

interface FilterBarProps {
  ratingFilter: number | null;
  onRatingFilterToggle: (val: number | null) => void;
  reraOnly: boolean;
  onReraToggle: () => void;
  fastDispatchOnly: boolean;
  onFastDispatchToggle: () => void;
  budgetFriendlyOnly: boolean;
  onBudgetFriendlyToggle: () => void;
  sortBy: 'relevance' | 'rating' | 'price_low' | 'speed';
  onSortChange: (sort: 'relevance' | 'rating' | 'price_low' | 'speed') => void;
  totalCount: number;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  t: TranslationStrings;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  ratingFilter,
  onRatingFilterToggle,
  reraOnly,
  onReraToggle,
  fastDispatchOnly,
  onFastDispatchToggle,
  budgetFriendlyOnly,
  onBudgetFriendlyToggle,
  sortBy,
  onSortChange,
  totalCount,
  onResetFilters,
  hasActiveFilters,
  t,
}) => {
  return (
    <div className="sticky top-[105px] z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 py-3 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3">
        {/* Filter Pills Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {/* Main Filters Pill */}
          <button
            onClick={() => onResetFilters()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              hasActiveFilters
                ? 'bg-rose-50 border-rose-300 text-rose-700'
                : 'bg-white border-stone-300 text-stone-700 hover:border-stone-400'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
            <span>{t.filters}</span>
            {hasActiveFilters && (
              <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">
                !
              </span>
            )}
          </button>

          {/* Rating 4.5+ Pill */}
          <button
            onClick={() => onRatingFilterToggle(ratingFilter === 4.5 ? null : 4.5)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              ratingFilter === 4.5
                ? 'bg-emerald-50 border-emerald-400 text-emerald-800 ring-2 ring-emerald-100'
                : 'bg-white border-stone-300 text-stone-700 hover:border-stone-400'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${ratingFilter === 4.5 ? 'fill-emerald-600 text-emerald-600' : 'text-stone-400'}`} />
            <span>{t.rating45}</span>
          </button>

          {/* Verified RERA Pill */}
          <button
            onClick={onReraToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              reraOnly
                ? 'bg-rose-50 border-rose-400 text-rose-800 ring-2 ring-rose-100'
                : 'bg-white border-stone-300 text-stone-700 hover:border-stone-400'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
            <span>{t.reraCertified}</span>
          </button>

          {/* Fast Turnaround Pill */}
          <button
            onClick={onFastDispatchToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              fastDispatchOnly
                ? 'bg-amber-50 border-amber-400 text-amber-800 ring-2 ring-amber-100'
                : 'bg-white border-stone-300 text-stone-700 hover:border-stone-400'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.fastDispatch}</span>
          </button>

          {/* Budget Friendly Pill */}
          <button
            onClick={onBudgetFriendlyToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              budgetFriendlyOnly
                ? 'bg-stone-900 border-stone-900 text-white'
                : 'bg-white border-stone-300 text-stone-700 hover:border-stone-400'
            }`}
          >
            <span>{t.affordableTier}</span>
          </button>

          {/* Reset Filter Pill */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>{t.clearAll}</span>
            </button>
          )}
        </div>

        {/* Right Sort Controls */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-500 hidden md:inline">
            <span className="font-semibold text-stone-800">{totalCount}</span> {t.verifiedOptions}
          </span>

          <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-xs font-medium text-stone-700">
            <ArrowUpDown className="w-3 h-3 text-stone-400" />
            <span className="text-stone-400 text-[11px]">{t.sort}</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="bg-transparent text-xs font-semibold text-stone-800 focus:outline-hidden cursor-pointer"
            >
              <option value="relevance">Popularity</option>
              <option value="rating">Rating: High to Low</option>
              <option value="price_low">Price: Low to High</option>
              <option value="speed">Handover / Delivery Speed</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
