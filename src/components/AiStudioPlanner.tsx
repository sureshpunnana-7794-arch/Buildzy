import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Calculator,
  Compass,
  Layers,
  CheckCircle,
  FileSpreadsheet,
  Plus,
  AlertTriangle,
  Info,
  Maximize2,
  Building,
} from 'lucide-react';
import { City, CartItem } from '../types';
import { TranslationStrings } from '../i18n/translations';

interface AiStudioPlannerProps {
  currentCity: City;
  onAddToCart: (item: CartItem) => void;
  onSwitchToTracking: () => void;
  t: TranslationStrings;
}

export const AiStudioPlanner: React.FC<AiStudioPlannerProps> = ({
  currentCity,
  onAddToCart,
  onSwitchToTracking,
  t,
}) => {
  // Inputs
  const [plotLength, setPlotLength] = useState<number>(40); // ft
  const [plotWidth, setPlotWidth] = useState<number>(30); // ft
  const [floors, setFloors] = useState<'G' | 'G+1' | 'G+2'>('G+1');
  const [facing, setFacing] = useState<'East' | 'North' | 'West' | 'South'>('East');
  const [soilType, setSoilType] = useState<'Red Loamy' | 'Black Cotton' | 'Sandy' | 'Rocky Hard'>('Black Cotton');
  const [finishTier, setFinishTier] = useState<'Economy' | 'Standard' | 'Premium'>('Standard');
  const [bhkType, setBhkType] = useState<'2BHK' | '3BHK' | '4BHK Duplex'>('3BHK');
  const [hasAddedToCart, setHasAddedToCart] = useState(false);

  // Computed areas
  const plotAreaSqFt = plotLength * plotWidth;
  const plotAreaSqYards = (plotAreaSqFt / 9).toFixed(1);

  const floorMultiplier = floors === 'G' ? 1 : floors === 'G+1' ? 1.85 : 2.7;
  const builtUpArea = Math.round(plotAreaSqFt * 0.75 * floorMultiplier); // 75% ground coverage rule

  // Material & Cost Calculations based on Pan-India CPWD benchmark rules
  const ratesPerSqFt = {
    Economy: 1650,
    Standard: 2050,
    Premium: 2750,
  };

  const baseRate = ratesPerSqFt[finishTier];

  // Soil adjustment factor
  const soilSurchargePerSqFt = soilType === 'Black Cotton' ? 120 : soilType === 'Sandy' ? 60 : 0;
  const effectiveRate = baseRate + soilSurchargePerSqFt;

  const totalEstimate = Math.round(builtUpArea * effectiveRate);

  // Material Breakdown
  const cementBags = Math.round(builtUpArea * 0.42);
  const cementCost = cementBags * 380;

  const steelTonnes = parseFloat(((builtUpArea * 3.8) / 1000).toFixed(2));
  const steelCost = Math.round(steelTonnes * 1000 * 66); // ₹66/kg

  const sandBrass = Math.round((builtUpArea * 1.8) / 100);
  const sandCost = sandBrass * 1900;

  const bricksCount = Math.round(builtUpArea * 7.5);
  const bricksCost = Math.round(bricksCount * 9.5);

  const laborCost = Math.round(builtUpArea * 520);
  const architecturalFee = Math.round(builtUpArea * 35);
  const soilInvestigationFee = 14500;

  const handleAddEstimateToCart = () => {
    onAddToCart({
      listingId: 'ai-studio-est',
      listingName: `BUILDZY AI Estimated Package (${floors} ${bhkType})`,
      itemId: `est-${Date.now()}`,
      itemName: `${floors} ${bhkType} (${builtUpArea} sq.ft) Turnkey Construction Contract Token`,
      price: 25000,
      unit: 'initial project deposit',
      quantity: 1,
    });
    setHasAddedToCart(true);
    setTimeout(() => setHasAddedToCart(false), 2500);
  };

  return (
    <div className="py-8 bg-stone-50/70 min-h-[calc(100vh-160px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Title Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Pan-India Construction Planning & Budgeting</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-serif">
            {t.aiStudioHeader}
          </h1>
          <p className="text-sm text-stone-600 max-w-2xl mt-1">
            {t.aiStudioSub}
          </p>
        </div>

        {/* 2-Column Split: Configurator Left, Live BOQ Summary Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: CONFIGURATION FORM (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Plot Dimensions Card */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-2xs">
              <h2 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-rose-600" />
                <span>{t.plotDimensionsTitle}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    {t.plotLength}
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="150"
                    value={plotLength}
                    onChange={(e) => setPlotLength(Math.max(15, Number(e.target.value)))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm font-bold text-stone-900 focus:bg-white focus:border-rose-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    {t.plotWidth}
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="150"
                    value={plotWidth}
                    onChange={(e) => setPlotWidth(Math.max(15, Number(e.target.value)))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm font-bold text-stone-900 focus:bg-white focus:border-rose-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Area stats pill */}
              <div className="mt-3 p-3 bg-stone-100/70 rounded-xl flex items-center justify-between text-xs text-stone-700">
                <div>
                  {t.plotArea}: <strong className="text-stone-900">{plotAreaSqFt} sq.ft</strong> ({plotAreaSqYards} sq.yards / Gajam)
                </div>
                <div className="text-rose-700 font-bold">
                  {t.estBuiltUp}: ~{builtUpArea.toLocaleString('en-IN')} sq.ft
                </div>
              </div>

              {/* Facing Selector */}
              <div className="mt-4">
                <label className="text-xs font-semibold text-stone-700 block mb-1.5 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-stone-400" />
                  <span>{t.vastuFacing}</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['East', 'North', 'West', 'South'] as const).map((dir) => (
                    <button
                      key={dir}
                      type="button"
                      onClick={() => setFacing(dir)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        facing === dir
                          ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {dir} {dir === 'East' || dir === 'North' ? '★' : ''}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-stone-400 mt-1.5">
                  *East and North facing orientations are ideal for traditional Indian Vastu layouts.
                </p>
              </div>
            </div>

            {/* Building Structure & Soil Analysis Card */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-2xs">
              <h2 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
                <Building className="w-4 h-4 text-rose-600" />
                <span>2. Structural Configuration & Soil Type</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Floors */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                    Structure Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['G', 'G+1', 'G+2'] as const).map((flr) => (
                      <button
                        key={flr}
                        type="button"
                        onClick={() => setFloors(flr)}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          floors === flr
                            ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        {flr} {flr === 'G' ? 'Ground' : flr === 'G+1' ? 'Duplex' : 'Triplex'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* BHK Config */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                    Typology
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['2BHK', '3BHK', '4BHK Duplex'] as const).map((typ) => (
                      <button
                        key={typ}
                        type="button"
                        onClick={() => setBhkType(typ)}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          bhkType === typ
                            ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        {typ}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Soil Type Selection (Case Study Section 11) */}
              <div className="mt-4 pt-4 border-t border-stone-100">
                <label className="text-xs font-semibold text-stone-700 block mb-1.5 flex items-center justify-between">
                  <span>Soil Investigation Profile (Site Strata)</span>
                  <span className="text-[11px] text-rose-600 font-normal">
                    Affects footing depth & steel reinforcement
                  </span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Red Loamy', 'Black Cotton', 'Sandy', 'Rocky Hard'] as const).map((soil) => (
                    <button
                      key={soil}
                      type="button"
                      onClick={() => setSoilType(soil)}
                      className={`p-2.5 text-xs text-left rounded-lg border transition-all cursor-pointer ${
                        soilType === soil
                          ? 'bg-amber-50/80 border-amber-500 text-amber-950 font-bold ring-2 ring-amber-100'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <span className="block font-semibold">{soil}</span>
                      <span className="text-[10px] text-stone-400 block mt-0.5 font-normal">
                        {soil === 'Black Cotton'
                          ? 'High Swell (AP/TS)'
                          : soil === 'Red Loamy'
                          ? 'Standard SBC'
                          : soil === 'Sandy'
                          ? 'Coastal / Vizag'
                          : 'High bearing'}
                      </span>
                    </button>
                  ))}
                </div>

                {soilType === 'Black Cotton' && (
                  <div className="mt-2.5 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold">Black Cotton Soil Alert:</strong> Typical in Guntur,
                      Vijayawada, and Nizamabad basins. Requires under-reamed pile foundations or isolated raft
                      with plinth tie beams to prevent wall shear cracks.
                    </div>
                  </div>
                )}
              </div>

              {/* Finish Quality Tier */}
              <div className="mt-4 pt-4 border-t border-stone-100">
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                  Specification & Finishing Tier
                </label>

                <div className="grid grid-cols-3 gap-3">
                  {(['Economy', 'Standard', 'Premium'] as const).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setFinishTier(tier)}
                      className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                        finishTier === tier
                          ? 'bg-rose-50 border-rose-500 text-rose-950 font-bold ring-2 ring-rose-100'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <span className="text-xs font-bold block">{tier}</span>
                      <span className="text-xs text-rose-700 font-mono font-extrabold block mt-0.5">
                        ₹{ratesPerSqFt[tier]}/sq.ft
                      </span>
                      <span className="text-[10px] text-stone-400 block mt-1 leading-tight font-normal">
                        {tier === 'Economy'
                          ? 'Vitrified ₹45, Anchor switches'
                          : tier === 'Standard'
                          ? 'Vitrified ₹70, Jaguar fittings'
                          : 'Italian Marble, Teakwood, Kohler'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: LIVE ESTIMATE & BOQ BREAKDOWN (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Main Total Card */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  {t.indicativeBudget}
                </span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-sm border border-emerald-200">
                  CPWD / Pan-India 2026
                </span>
              </div>

              <div className="mt-3">
                <div className="text-3xl font-black text-stone-950 font-mono tracking-tight">
                  ₹{totalEstimate.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Indicative construction cost @ ₹{effectiveRate}/sq.ft for {builtUpArea.toLocaleString('en-IN')} sq.ft built-up area
                </p>
                <div className="mt-2 text-[11px] text-stone-400">
                  Confidence range: ±8% based on soil test report and final material finishes
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 space-y-2.5">
                <button
                  onClick={handleAddEstimateToCart}
                  className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {hasAddedToCart ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>{t.addedTokenBtn}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>{t.bookTokenBtn}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onSwitchToTracking}
                  className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer text-center"
                >
                  {t.viewLiveTrackerBtn}
                </button>
              </div>
            </div>

            {/* Bill of Quantities (BOQ) Breakdown Card */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-2xs">
              <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center justify-between">
                <span>{t.boqSummary}</span>
                <FileSpreadsheet className="w-4 h-4 text-stone-400" />
              </h3>

              <div className="space-y-3 text-xs">
                {/* Cement */}
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div>
                    <span className="font-bold text-stone-900 block">53-Grade OPC / PPC Cement</span>
                    <span className="text-[11px] text-stone-400">{cementBags.toLocaleString()} Bags (50kg)</span>
                  </div>
                  <span className="font-mono font-bold text-stone-900">
                    ₹{cementCost.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Steel */}
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div>
                    <span className="font-bold text-stone-900 block">Fe 550D Ribbed TMT Steel</span>
                    <span className="text-[11px] text-stone-400">{steelTonnes} Metric Tonnes</span>
                  </div>
                  <span className="font-mono font-bold text-stone-900">
                    ₹{steelCost.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Sand */}
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div>
                    <span className="font-bold text-stone-900 block">Screened Coarse River Sand</span>
                    <span className="text-[11px] text-stone-400">{sandBrass} Brass (100 cft)</span>
                  </div>
                  <span className="font-mono font-bold text-stone-900">
                    ₹{sandCost.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Bricks */}
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div>
                    <span className="font-bold text-stone-900 block">Table-Moulded Red Bricks</span>
                    <span className="text-[11px] text-stone-400">{bricksCount.toLocaleString()} Units</span>
                  </div>
                  <span className="font-mono font-bold text-stone-900">
                    ₹{bricksCost.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Labor */}
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div>
                    <span className="font-bold text-stone-900 block">Civil & RCC Masonry Labor</span>
                    <span className="text-[11px] text-stone-400">Centering, Bar Bending & Curing</span>
                  </div>
                  <span className="font-mono font-bold text-stone-900">
                    ₹{laborCost.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Architecture & Geotech */}
                <div className="flex items-center justify-between pt-1 text-stone-500">
                  <span>CoA Architectural Sanction + Soil Test</span>
                  <span className="font-mono font-medium text-stone-800">
                    ₹{(architecturalFee + soilInvestigationFee).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Statutory Note */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-start gap-1.5 text-[10px] text-stone-400">
                <Info className="w-3.5 h-3.5 shrink-0 text-stone-400 mt-0.5" />
                <span>
                  All estimates are indicative planning calculations based on regional CPWD/AP-SSR schedule rates.
                  Actual contract rates require site-specific soil investigation, structural designs, and local municipal sanctions.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
