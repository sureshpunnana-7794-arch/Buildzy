import React from 'react';
import { ChevronRight, ShieldCheck, Award, MapPin } from 'lucide-react';
import { CURATED_COLLECTIONS, BUILDER_IMAGE, MATERIALS_IMAGE, SOIL_IMAGE, HERO_IMAGE } from '../data/mockData';
import { TranslationStrings } from '../i18n/translations';

interface CuratedCollectionsProps {
  onSelectCollection: (filterTag: string) => void;
  selectedCity: string;
  t: TranslationStrings;
  onExploreAll?: () => void;
}

export const CuratedCollections: React.FC<CuratedCollectionsProps> = ({
  onSelectCollection,
  selectedCity,
  t,
  onExploreAll,
}) => {
  const collectionImages = [BUILDER_IMAGE, SOIL_IMAGE, MATERIALS_IMAGE, HERO_IMAGE];

  return (
    <section className="bg-white py-8 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-2">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-stone-900 font-serif">
              {t.curatedTitle} {selectedCity}
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              {t.curatedSub}
            </p>
          </div>
          <button
            onClick={() => {
              if (onExploreAll) {
                onExploreAll();
              } else {
                onSelectCollection('all');
              }
            }}
            className="flex items-center gap-1 text-sm font-semibold text-rose-600 hover:text-rose-700 cursor-pointer self-start sm:self-auto"
          >
            <span>{t.exploreOptions} ({selectedCity})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CURATED_COLLECTIONS.map((col, idx) => {
            const img = collectionImages[idx % collectionImages.length];

            return (
              <div
                key={col.id}
                onClick={() => onSelectCollection(col.filterTag)}
                className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300 border border-stone-200"
              >
                {/* Background image preview */}
                <img
                  src={img}
                  alt={col.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/50 to-black/30 group-hover:via-stone-950/40 transition-colors" />

                {/* Top Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-stone-900/80 backdrop-blur-md rounded-lg text-white text-[11px] font-semibold border border-white/20">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                  <span>{col.placesCount}</span>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-base font-bold tracking-tight text-white group-hover:text-rose-300 transition-colors leading-snug">
                    {col.title}
                  </h3>
                  <p className="text-xs text-stone-300 mt-1 line-clamp-2 leading-relaxed">
                    {col.subtitle}
                  </p>
                  <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-rose-300 group-hover:translate-x-1 transition-transform">
                    <span>Explore collection</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
