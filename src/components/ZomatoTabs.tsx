import React from 'react';
import { Truck, Landmark, Sparkles, Navigation, Activity } from 'lucide-react';
import { MainTab } from '../types';
import { TranslationStrings } from '../i18n/translations';

interface ZomatoTabsProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  activeProjectProgress?: number;
  t: TranslationStrings;
}

export const ZomatoTabs: React.FC<ZomatoTabsProps> = ({
  activeTab,
  onTabChange,
  activeProjectProgress = 42,
  t,
}) => {
  const tabs = [
    {
      id: 'delivery' as MainTab,
      label: t.orderMaterials,
      subtitle: t.orderMaterialsSub,
      icon: Truck,
      color: 'bg-rose-50 text-rose-600 border-rose-200',
      activeColor: 'bg-rose-600 text-white',
    },
    {
      id: 'dining' as MainTab,
      label: t.buildersArchitects,
      subtitle: t.buildersArchitectsSub,
      icon: Landmark,
      color: 'bg-stone-50 text-stone-700 border-stone-200',
      activeColor: 'bg-rose-600 text-white',
    },
    {
      id: 'ai-studio' as MainTab,
      label: t.aiBudgetStudio,
      subtitle: t.aiBudgetStudioSub,
      icon: Sparkles,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      activeColor: 'bg-stone-900 text-white',
    },
    {
      id: 'tracking' as MainTab,
      label: t.liveSiteTracker,
      subtitle: `${t.liveSiteTrackerSub} (${activeProjectProgress}%)`,
      icon: Navigation,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      activeColor: 'bg-emerald-700 text-white',
      badge: 'LIVE',
    },
  ];

  return (
    <div className="bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center gap-4 sm:gap-8 overflow-x-auto no-scrollbar py-3" aria-label="Main service tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-3.5 pb-2 transition-all relative shrink-0 cursor-pointer group text-left ${
                  isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                }`}
              >
                {/* Iconic Zomato circular category icon */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-xs ${
                    isActive
                      ? tab.activeColor
                      : 'bg-stone-100 text-stone-600 group-hover:bg-stone-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-sm sm:text-base font-bold tracking-tight whitespace-nowrap ${
                        isActive ? 'text-stone-950 font-extrabold' : 'text-stone-700'
                      }`}
                    >
                      {tab.label}
                    </span>
                    {tab.badge && (
                      <span className="flex items-center gap-1 px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-sm tracking-wide">
                        <Activity className="w-2.5 h-2.5 animate-pulse" />
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 whitespace-nowrap hidden sm:block">
                    {tab.subtitle}
                  </p>
                </div>

                {/* Bottom active indicator underline (Zomato style) */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.75 bg-rose-600 rounded-t-full transition-all" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
