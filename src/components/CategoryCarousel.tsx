import React from 'react';
import {
  Layers,
  Maximize2,
  Microscope,
  Home,
  Compass,
  Box,
  Droplets,
  Sparkles,
} from 'lucide-react';
import { QUICK_CATEGORIES } from '../data/mockData';
import { TranslationStrings } from '../i18n/translations';

interface CategoryCarouselProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  t: TranslationStrings;
}

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  selectedCategory,
  onSelectCategory,
  t,
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Sparkles':
        return <Sparkles className="w-6 h-6" />;
      case 'Layers':
        return <Layers className="w-6 h-6" />;
      case 'Maximize2':
        return <Maximize2 className="w-6 h-6" />;
      case 'Microscope':
        return <Microscope className="w-6 h-6" />;
      case 'Home':
        return <Home className="w-6 h-6" />;
      case 'Compass':
        return <Compass className="w-6 h-6" />;
      case 'Box':
        return <Box className="w-6 h-6" />;
      case 'Droplets':
        return <Droplets className="w-6 h-6" />;
      default:
        return <Home className="w-6 h-6" />;
    }
  };

  return (
    <section className="bg-stone-50/70 border-b border-stone-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 font-serif">
            {t.inspirationTitle}
          </h2>
          <span className="text-xs text-stone-500 font-medium">
            {t.tapToFilter}
          </span>
        </div>

        <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar py-2">
          {QUICK_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="flex flex-col items-center gap-2 group shrink-0 cursor-pointer text-center"
              >
                {/* Zomato-Style Circular Dish Icon Wrapper */}
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center p-3 transition-all duration-200 shadow-2xs group-hover:scale-105 ${
                    isSelected
                      ? 'bg-rose-600 text-white shadow-md ring-4 ring-rose-200'
                      : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-300 group-hover:shadow-sm'
                  }`}
                >
                  <div className="mb-1">{getIcon(cat.icon)}</div>
                  <span
                    className={`text-[10px] font-medium tracking-tight ${
                      isSelected ? 'text-rose-100' : 'text-stone-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </div>

                <span
                  className={`text-xs sm:text-sm font-semibold tracking-tight transition-colors ${
                    isSelected
                      ? 'text-rose-600 font-bold'
                      : 'text-stone-800 group-hover:text-rose-600'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
