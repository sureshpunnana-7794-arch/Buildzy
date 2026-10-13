import React from 'react';
import { Star, Clock, MapPin, ShieldCheck, Tag } from 'lucide-react';
import { ListingItem } from '../types';
import { TranslationStrings } from '../i18n/translations';

interface ListingCardProps {
  listing: ListingItem;
  onSelect: (listing: ListingItem) => void;
  onQuickAdd?: (listing: ListingItem) => void;
  t: TranslationStrings;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onSelect,
  onQuickAdd,
  t,
}) => {
  return (
    <article
      onClick={() => onSelect(listing)}
      className="group bg-white rounded-2xl border border-stone-200/90 hover:border-stone-300 shadow-2xs hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full"
    >
      {/* Image Container with Zomato overlays */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-stone-100">
        <img
          src={listing.image}
          alt={listing.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient Scrim for readable badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges (Discount offer & RERA) */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
          {listing.discountOffer ? (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-600/95 backdrop-blur-xs text-white text-[11px] font-bold rounded-lg shadow-xs uppercase tracking-tight">
              <Tag className="w-3 h-3" />
              <span className="truncate max-w-[190px]">{listing.discountOffer}</span>
            </span>
          ) : (
            <span />
          )}

          {listing.badge && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-stone-900/90 backdrop-blur-xs text-amber-300 text-[10px] font-semibold rounded-md shadow-xs shrink-0">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>{listing.badge}</span>
            </span>
          )}
        </div>

        {/* Bottom Right Delivery / Handover Time Badge (Zomato-style) */}
        <div className="absolute bottom-2.5 right-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-xs text-stone-900 text-xs font-semibold rounded-lg shadow-sm">
          <Clock className="w-3.5 h-3.5 text-rose-600" />
          <span>{listing.deliveryTime}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Row 1: Name + Star Rating Pill */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-base font-bold text-stone-900 group-hover:text-rose-600 transition-colors line-clamp-1 leading-snug">
              {listing.name}
            </h3>

            {/* Zomato Iconic Emerald Rating Pill */}
            <div className="flex items-center gap-1 bg-emerald-700 text-white px-2 py-0.5 rounded-md text-xs font-bold shrink-0 shadow-2xs">
              <span>{listing.rating.toFixed(1)}</span>
              <Star className="w-3 h-3 fill-white text-white" />
            </div>
          </div>

          {/* Row 2: Cuisine / Specialization tags */}
          <p className="text-xs text-stone-500 line-clamp-1 mb-2 font-medium">
            {listing.cuisineTag}
          </p>

          {/* Row 3: Location / Distance + Price */}
          <div className="flex items-center justify-between text-xs text-stone-600 mb-3 pt-1 border-t border-stone-100">
            <div className="flex items-center gap-1 text-stone-500">
              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span className="truncate max-w-[130px] sm:max-w-[160px]">
                {listing.locality}, {listing.city} · {listing.distance}
              </span>
            </div>

            <div className="font-bold text-stone-900 text-right whitespace-nowrap">
              {listing.priceDisplay}
            </div>
          </div>
        </div>

        {/* Zomato-Style Safety / Guarantee Footnote */}
        <div className="pt-2.5 border-t border-stone-100/90 flex items-center justify-between text-[11px] text-stone-500">
          <div className="flex items-center gap-1.5 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{t.escrowNote}</span>
          </div>

          <span className="text-rose-600 font-semibold group-hover:underline whitespace-nowrap ml-2">
            {t.viewCatalog}
          </span>
        </div>
      </div>
    </article>
  );
};
