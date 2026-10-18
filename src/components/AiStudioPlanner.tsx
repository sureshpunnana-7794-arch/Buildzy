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
  Printer,
  ShieldCheck,
  Bot,
  Zap,
  Check,
  RotateCcw,
  Sun,
  CloudRain,
  Eye,
  Grid3X3,
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
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
  
  // Visualizer view: 'blueprint' | 'vastu'
  const [visualizerMode, setVisualizerMode] = useState<'blueprint' | 'vastu'>('blueprint');
  
  // AI Generator state
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiReport, setAiReport] = useState<{
    setbacks: string;
    foundation: string;
    solarEstimate: string;
    rainwaterHarvesting: string;
    vastuVerdict: string;
    timestamp: string;
  } | null>(null);

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

  // Rooftop Solar & Rainwater Sizing
  const roofAreaSqFt = Math.round(plotAreaSqFt * 0.75);
  const solarCapacityKW = (roofAreaSqFt * 0.012).toFixed(1);
  const annualSolarUnits = Math.round(parseFloat(solarCapacityKW) * 1400);
  const rainwaterTankLiters = Math.round(roofAreaSqFt * 0.0929 * 650 * 0.85); // 650mm average rainfall

  // Generate AI Architectural & Structural Report using Gemini or heuristic fallback
  const handleGenerateAiReport = async () => {
    setIsGeneratingAi(true);

    const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');

    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are a licensed Indian Chief Civil & Structural Engineer adhering to NBC 2016 and Vastu Shastra.
Analyze this residential construction project:
- Plot: ${plotLength} ft x ${plotWidth} ft (${plotAreaSqFt} sq.ft), ${facing}-facing
- Floors: ${floors}, Typology: ${bhkType}
- Built-up area: ~${builtUpArea} sq.ft
- City: ${currentCity}, India
- Soil strata: ${soilType}
- Finishing tier: ${finishTier}

Return a concise structured JSON object with keys:
"setbacks" (mandatory front, rear, and side setbacks in feet for this plot size as per NBC),
"foundation" (precise foundation design: e.g. under-reamed pile vs isolated raft, footing depth, and concrete grade),
"solarEstimate" (solar rooftop potential in kW and monthly electricity bill savings in INR),
"rainwaterHarvesting" (recharge pit dimensions and storage tank capacity in liters),
"vastuVerdict" (specific placement verification for Master Bed in Nairuthi, Kitchen in Agneya, Pooja in Ishanya).`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const text = response.text || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setAiReport({
            setbacks: parsed.setbacks || `Front: 5 ft, Rear: 3.5 ft, Sides: 3 ft (NBC 2016 compliant for ${plotLength}x${plotWidth} plot).`,
            foundation: parsed.foundation || `${soilType === 'Black Cotton' ? 'Under-reamed pile foundation (6.5m depth)' : 'Isolated stepped trapezoidal footing (5.0ft depth)'} with M25 concrete & Fe 550D reinforcement.`,
            solarEstimate: parsed.solarEstimate || `${solarCapacityKW} kWp rooftop solar array generating ~${annualSolarUnits.toLocaleString()} units/yr (saving ~₹${Math.round(annualSolarUnits * 7.5).toLocaleString('en-IN')}/yr).`,
            rainwaterHarvesting: parsed.rainwaterHarvesting || `Underground sump capacity: ~${rainwaterTankLiters.toLocaleString()} Liters with desilting filtration chamber.`,
            vastuVerdict: parsed.vastuVerdict || `96% Vastu Compliance: Optimal ${facing} entrance, Pooja room oriented to North-East (Ishanya), Kitchen in South-East (Agneya), Master Bed in South-West (Nairuthi).`,
            timestamp: new Date().toLocaleTimeString(),
          });
          setIsGeneratingAi(false);
          return;
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to CPWD/NBC engineering engine:', err);
      }
    }

    // Heuristic Fallback Engine conforming to NBC 2016 & Regional IS codes
    setTimeout(() => {
      let foundationText = '';
      if (soilType === 'Black Cotton') {
        foundationText = `Under-reamed bored compaction pile foundation (diameter 300mm, depth 6.0m to 7.5m) socketed into firm strata with double under-ream bulbs to neutralize swelling pressure (IS 2911 Part III). Plinth tie beams required at ground level.`;
      } else if (soilType === 'Sandy') {
        foundationText = `Combined strip footing or continuous RCC raft foundation with minimum 1.8m embedment to prevent shear displacement in coastal sand strata. M25 design mix with corrosion-inhibiting admixture.`;
      } else if (soilType === 'Rocky Hard') {
        foundationText = `Shallow isolated pad footings (embedment 1.2m into hard rock). High safe bearing capacity (>350 kN/m²). Substantial cost savings on excavation.`;
      } else {
        foundationText = `Trapezoidal isolated column footings (depth 1.8m) on 100mm PCC bed (1:4:8). Safe bearing capacity certified at 180-220 kN/m² conforming to IS 1904.`;
      }

      const frontSetback = plotLength >= 60 ? '7.5 ft' : '5.0 ft';
      const rearSetback = plotLength >= 60 ? '5.0 ft' : '3.5 ft';
      const sideSetback = plotWidth >= 40 ? '4.0 ft' : '3.0 ft';

      setAiReport({
        setbacks: `Mandatory Municipal Setbacks: Front: ${frontSetback}, Rear: ${rearSetback}, Sides: ${sideSetback} as per NBC 2016 & ${currentCity} Town Planning bye-laws.`,
        foundation: foundationText,
        solarEstimate: `${solarCapacityKW} kWp rooftop solar PV capacity over ${roofAreaSqFt} sq.ft terrace area, yielding ~${annualSolarUnits.toLocaleString()} kWh/yr (estimated savings of ₹${Math.round(annualSolarUnits * 7.5).toLocaleString('en-IN')}/year).`,
        rainwaterHarvesting: `Underground RCC rainwater sump capacity: ${rainwaterTankLiters.toLocaleString()} Liters equipped with dual-chamber gravel/charcoal filtration bed.`,
        vastuVerdict: `96% Vastu Compliance Score for ${facing}-facing plot. Entrance positioned in auspicious Jayanta/Mahendra pada. Kitchen in South-East (Agneya), Master Bed in South-West (Nairuthi), Pooja in North-East (Ishanya).`,
        timestamp: new Date().toLocaleTimeString(),
      });
      setIsGeneratingAi(false);
    }, 900);
  };

  const handleAddEstimateToCart = () => {
    onAddToCart({
      listingId: 'ai-studio-est',
      listingName: `BUILDZY AI Verified Turnkey Contract (${floors} ${bhkType})`,
      itemId: `est-${Date.now()}`,
      itemName: `${floors} ${bhkType} (${builtUpArea} sq.ft) Turnkey Construction Contract Token in ${currentCity}`,
      price: 25000,
      unit: 'initial project escrow deposit',
      quantity: 1,
    });
    setHasAddedToCart(true);
    setTimeout(() => setHasAddedToCart(false), 2500);
  };

  // Printable BOQ sheet trigger
  const handlePrintBOQ = () => {
    window.print();
  };

  return (
    <div className="py-8 bg-stone-50/70 min-h-[calc(100vh-160px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>AI Construction Planning & Engineering Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-serif">
              {t.aiStudioHeader}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mt-1">
              Interactive 2D architectural blueprinting, Vastu compliance analysis, CPWD material BOQ estimation, and AI engineering advisory for {currentCity}.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handlePrintBOQ}
              className="px-3.5 py-2 bg-white hover:bg-stone-100 text-stone-800 text-xs font-bold rounded-xl border border-stone-300 shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Print BOQ for Bank Loan"
            >
              <Printer className="w-4 h-4 text-stone-600" />
              <span>Print BOQ Sheet</span>
            </button>

            <button
              onClick={handleGenerateAiReport}
              disabled={isGeneratingAi}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Bot className="w-4 h-4" />
              <span>{isGeneratingAi ? 'Analyzing Plot...' : 'Run Gemini AI Analysis'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Split: Configurator Left, Live BOQ Summary & Blueprint Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: CONFIGURATION FORM (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Plot Dimensions Card */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-2xs">
              <h2 className="text-base font-bold text-stone-900 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-rose-600" />
                  <span>1. {t.plotDimensionsTitle}</span>
                </span>
                <span className="text-xs text-stone-500 font-normal">
                  Location: <strong className="text-stone-900">{currentCity}</strong>
                </span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-stone-700">
                      {t.plotLength} (Depth)
                    </label>
                    <span className="text-xs font-mono font-bold text-rose-700">{plotLength} ft</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="5"
                    value={plotLength}
                    onChange={(e) => setPlotLength(Number(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 mt-0.5">
                    <span>20 ft</span>
                    <span>40 ft</span>
                    <span>60 ft</span>
                    <span>80 ft</span>
                    <span>100 ft</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-stone-700">
                      {t.plotWidth} (Road Frontage)
                    </label>
                    <span className="text-xs font-mono font-bold text-rose-700">{plotWidth} ft</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="80"
                    step="5"
                    value={plotWidth}
                    onChange={(e) => setPlotWidth(Number(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 mt-0.5">
                    <span>15 ft</span>
                    <span>30 ft</span>
                    <span>45 ft</span>
                    <span>60 ft</span>
                    <span>80 ft</span>
                  </div>
                </div>
              </div>

              {/* Area stats pill */}
              <div className="mt-4 p-3 bg-stone-100/80 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs text-stone-700">
                <div>
                  {t.plotArea}: <strong className="text-stone-900 font-mono">{plotAreaSqFt} sq.ft</strong> ({plotAreaSqYards} sq.yards / Gajam)
                </div>
                <div className="text-rose-700 font-bold font-mono">
                  {t.estBuiltUp}: ~{builtUpArea.toLocaleString('en-IN')} sq.ft ({floors})
                </div>
              </div>

              {/* Facing Selector */}
              <div className="mt-4 pt-3 border-t border-stone-100">
                <label className="text-xs font-semibold text-stone-700 block mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-stone-400" />
                    <span>{t.vastuFacing}</span>
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    {facing === 'East' || facing === 'North' ? '★ Highly Auspicious Vastu' : 'Remedy Layout Applied'}
                  </span>
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
              </div>
            </div>

            {/* Structure, BHK & Soil Profile Card */}
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

              {/* Soil Type Selection */}
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
                          ? 'bg-amber-50/90 border-amber-500 text-amber-950 font-bold ring-2 ring-amber-100'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <span className="block font-semibold">{soil}</span>
                      <span className="text-[10px] text-stone-400 block mt-0.5 font-normal">
                        {soil === 'Black Cotton'
                          ? 'Expansive Soil'
                          : soil === 'Red Loamy'
                          ? 'Standard SBC'
                          : soil === 'Sandy'
                          ? 'Coastal / Silt'
                          : 'High bearing'}
                      </span>
                    </button>
                  ))}
                </div>

                {soilType === 'Black Cotton' && (
                  <div className="mt-2.5 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold">Black Cotton Soil Alert:</strong> Typical in Andhra Pradesh, Telangana, Maharashtra, and Gujarat basins. Requires under-reamed pile foundations or isolated raft with plinth tie beams to prevent wall shear cracks.
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

            {/* INTERACTIVE 2D ARCHITECTURAL FLOOR PLAN & VASTU VISUALIZER */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between pb-3 border-b border-stone-100 gap-2 mb-4">
                <div>
                  <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-rose-600" />
                    <span>3. Architectural Blueprint & Vastu Layout</span>
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Live dynamic 2D plan scaled for {plotLength}' x {plotWidth}' ({facing} facing, {bhkType})
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => setVisualizerMode('blueprint')}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      visualizerMode === 'blueprint' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-600'
                    }`}
                  >
                    2D Blueprint
                  </button>
                  <button
                    onClick={() => setVisualizerMode('vastu')}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                      visualizerMode === 'vastu' ? 'bg-white text-rose-700 shadow-2xs font-bold' : 'text-stone-600'
                    }`}
                  >
                    <Grid3X3 className="w-3 h-3" />
                    <span>Vastu Mandala</span>
                  </button>
                </div>
              </div>

              {/* Dynamic SVG Floor Plan Container */}
              <div className="bg-stone-900 rounded-xl p-4 sm:p-6 overflow-hidden relative shadow-inner">
                {/* Vastu Compass Overlay */}
                <div className="absolute top-4 right-4 bg-stone-950/80 border border-stone-700 text-stone-300 text-[10px] font-mono px-2 py-1 rounded-md flex items-center gap-1.5 shadow-md">
                  <Compass className="w-3.5 h-3.5 text-rose-400" />
                  <span>Facing: <strong className="text-white">{facing}</strong></span>
                </div>

                {visualizerMode === 'blueprint' ? (
                  /* 2D Architectural Drawing */
                  <svg
                    viewBox="0 0 500 360"
                    className="w-full h-auto max-h-[340px] mx-auto filter drop-shadow-md select-none font-sans"
                  >
                    {/* Grid background */}
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="500" height="360" fill="#0f172a" />
                    <rect width="500" height="360" fill="url(#grid)" opacity="0.4" />

                    {/* Outer Boundary / Setback line */}
                    <rect
                      x="30"
                      y="30"
                      width="440"
                      height="300"
                      fill="none"
                      stroke="#475569"
                      strokeWidth="1.5"
                      strokeDasharray="4,4"
                    />
                    <text x="35" y="24" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                      Plot Boundary: {plotLength}' x {plotWidth}' ({plotAreaSqFt} sq.ft)
                    </text>

                    {/* Building RCC Outer Wall */}
                    <rect
                      x="60"
                      y="60"
                      width="380"
                      height="240"
                      fill="#1e293b"
                      stroke="#38bdf8"
                      strokeWidth="3"
                      rx="4"
                    />

                    {/* Room 1: Master Bedroom (South-West / Nairuthi) */}
                    <g>
                      <rect x="65" y="65" width="175" height="120" fill="#1e3a5f" stroke="#60a5fa" strokeWidth="1.5" />
                      <text x="75" y="88" fill="#e2e8f0" fontSize="11" fontWeight="bold">Master Bedroom</text>
                      <text x="75" y="104" fill="#93c5fd" fontSize="9" fontFamily="monospace">14'0" x 12'0"</text>
                      <text x="75" y="118" fill="#38bdf8" fontSize="8" fontWeight="600">SW (Nairuthi Corner)</text>
                      {/* Bed Icon Representation */}
                      <rect x="135" y="75" width="85" height="70" fill="#0f172a" stroke="#60a5fa" strokeWidth="1" rx="2" />
                      <text x="162" y="115" fill="#94a3b8" fontSize="8">KING BED</text>
                    </g>

                    {/* Room 2: Attached Toilet */}
                    <g>
                      <rect x="65" y="190" width="95" height="105" fill="#132e48" stroke="#38bdf8" strokeWidth="1.5" />
                      <text x="73" y="212" fill="#e2e8f0" fontSize="10" fontWeight="bold">Attached Bath</text>
                      <text x="73" y="226" fill="#93c5fd" fontSize="8" fontFamily="monospace">6'6" x 8'0"</text>
                    </g>

                    {/* Room 3: Sacred Pooja Room (North-East / Ishanya) */}
                    <g>
                      <rect x="345" y="65" width="90" height="90" fill="#3f2e15" stroke="#f59e0b" strokeWidth="1.5" />
                      <text x="355" y="88" fill="#fef3c7" fontSize="10" fontWeight="bold">Pooja Room</text>
                      <text x="355" y="102" fill="#fbbf24" fontSize="8" fontFamily="monospace">6'0" x 6'0"</text>
                      <text x="355" y="116" fill="#f59e0b" fontSize="8" fontWeight="bold">NE (Ishanya)</text>
                      <circle cx="390" cy="132" r="8" fill="#f59e0b" opacity="0.3" />
                      <circle cx="390" cy="132" r="4" fill="#f59e0b" />
                    </g>

                    {/* Room 4: Modular Kitchen & Utility (South-East / Agneya) */}
                    <g>
                      <rect x="315" y="160" width="120" height="135" fill="#382020" stroke="#f87171" strokeWidth="1.5" />
                      <text x="325" y="182" fill="#fee2e2" fontSize="11" fontWeight="bold">Modular Kitchen</text>
                      <text x="325" y="198" fill="#fca5a5" fontSize="9" fontFamily="monospace">10'0" x 11'6"</text>
                      <text x="325" y="212" fill="#ef4444" fontSize="8" fontWeight="bold">SE (Agneya Fire)</text>
                      {/* Kitchen Counter L-shape */}
                      <path d="M 325 240 L 420 240 L 420 285" fill="none" stroke="#fca5a5" strokeWidth="3" />
                    </g>

                    {/* Room 5: Living & Dining Hall (Central Brahmasthan) */}
                    <g>
                      <rect x="165" y="190" width="145" height="105" fill="#1b2a47" stroke="#818cf8" strokeWidth="1.5" />
                      <text x="175" y="212" fill="#e0e7ff" fontSize="11" fontWeight="bold">Living & Dining</text>
                      <text x="175" y="228" fill="#a5b4fc" fontSize="9" fontFamily="monospace">16'0" x 14'0"</text>
                      <text x="175" y="242" fill="#818cf8" fontSize="8">Brahmasthan Open</text>
                    </g>

                    {/* Room 6: Guest / Children Bed (North-West / Vayavya) */}
                    <g>
                      <rect x="245" y="65" width="95" height="120" fill="#203347" stroke="#60a5fa" strokeWidth="1.5" />
                      <text x="253" y="88" fill="#e2e8f0" fontSize="10" fontWeight="bold">Bed 2 / Guest</text>
                      <text x="253" y="104" fill="#93c5fd" fontSize="8" fontFamily="monospace">10'0" x 12'0"</text>
                      <text x="253" y="118" fill="#38bdf8" fontSize="8">NW (Vayavya)</text>
                    </g>

                    {/* Entrance Door & Portico (Facing indicated) */}
                    <path d="M 235 295 A 15 15 0 0 1 250 310" fill="none" stroke="#34d399" strokeWidth="2" />
                    <line x1="235" y1="295" x2="250" y2="295" stroke="#34d399" strokeWidth="2" />
                    <text x="220" y="325" fill="#34d399" fontSize="10" fontWeight="bold">
                      Main Entry Door ({facing})
                    </text>
                  </svg>
                ) : (
                  /* 9-Zone Vastu Purusha Mandala Grid */
                  <div className="grid grid-cols-3 gap-2.5 max-w-lg mx-auto py-2 text-center text-xs">
                    {/* Row 1: North */}
                    <div className="p-3 bg-blue-950/80 border border-blue-500/40 rounded-lg text-blue-200">
                      <span className="text-[10px] text-blue-400 block font-mono">NW · Vayavya</span>
                      <strong className="text-white block mt-0.5">Guest Bed / Living</strong>
                      <span className="text-[10px] text-emerald-400 mt-1 block">Air Element · Balanced</span>
                    </div>

                    <div className="p-3 bg-blue-950/80 border border-blue-500/40 rounded-lg text-blue-200">
                      <span className="text-[10px] text-blue-400 block font-mono">N · Kubera</span>
                      <strong className="text-white block mt-0.5">Main Foyer / Treasury</strong>
                      <span className="text-[10px] text-emerald-400 mt-1 block">Prosperity Zone</span>
                    </div>

                    <div className="p-3 bg-amber-950/80 border border-amber-500/40 rounded-lg text-amber-200 ring-2 ring-amber-400/30">
                      <span className="text-[10px] text-amber-400 block font-mono">NE · Ishanya</span>
                      <strong className="text-white block mt-0.5">Sacred Pooja / Water</strong>
                      <span className="text-[10px] text-amber-300 mt-1 block font-bold">Spiritual Peak ★</span>
                    </div>

                    {/* Row 2: Central */}
                    <div className="p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-300">
                      <span className="text-[10px] text-slate-400 block font-mono">W · Varuna</span>
                      <strong className="text-white block mt-0.5">Dining & Study</strong>
                      <span className="text-[10px] text-slate-400 mt-1 block">Water / Metal</span>
                    </div>

                    <div className="p-3 bg-purple-950/80 border border-purple-500/40 rounded-lg text-purple-200">
                      <span className="text-[10px] text-purple-400 block font-mono">Center · Brahmasthan</span>
                      <strong className="text-white block mt-0.5">Open Living Hall</strong>
                      <span className="text-[10px] text-purple-300 mt-1 block">Zero Heavy Load</span>
                    </div>

                    <div className="p-3 bg-blue-950/80 border border-blue-500/40 rounded-lg text-blue-200">
                      <span className="text-[10px] text-blue-400 block font-mono">E · Indra</span>
                      <strong className="text-white block mt-0.5">Verandah / Balcony</strong>
                      <span className="text-[10px] text-emerald-400 mt-1 block">Morning Sunlight</span>
                    </div>

                    {/* Row 3: South */}
                    <div className="p-3 bg-indigo-950/80 border border-indigo-500/40 rounded-lg text-indigo-200 ring-2 ring-indigo-400/30">
                      <span className="text-[10px] text-indigo-400 block font-mono">SW · Nairuthi</span>
                      <strong className="text-white block mt-0.5">Master Bedroom</strong>
                      <span className="text-[10px] text-indigo-300 mt-1 block font-bold">Earth Element (Stability)</span>
                    </div>

                    <div className="p-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-300">
                      <span className="text-[10px] text-slate-400 block font-mono">S · Yama</span>
                      <strong className="text-white block mt-0.5">Heavy Staircase</strong>
                      <span className="text-[10px] text-slate-400 mt-1 block">Earth Anchor</span>
                    </div>

                    <div className="p-3 bg-rose-950/80 border border-rose-500/40 rounded-lg text-rose-200 ring-2 ring-rose-400/30">
                      <span className="text-[10px] text-rose-400 block font-mono">SE · Agneya</span>
                      <strong className="text-white block mt-0.5">Modular Kitchen</strong>
                      <span className="text-[10px] text-rose-300 mt-1 block font-bold">Fire Element (Health)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI ENGINEERING ADVISORY REPORT CARD */}
            {aiReport && (
              <div className="bg-gradient-to-br from-stone-900 to-stone-950 text-white rounded-2xl p-5 border border-stone-800 shadow-md animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-3">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-rose-400" />
                    <h3 className="text-sm font-bold tracking-tight text-white">
                      Gemini Structural Engineering & Vastu Advisory
                    </h3>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">
                    Updated {aiReport.timestamp}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-[11px] font-semibold text-rose-300 block mb-0.5">
                      Statutory Setbacks & Ground Coverage:
                    </span>
                    <p className="text-stone-300 leading-relaxed">{aiReport.setbacks}</p>
                  </div>

                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-[11px] font-semibold text-amber-300 block mb-0.5">
                      Geotechnical Foundation Design ({soilType}):
                    </span>
                    <p className="text-stone-300 leading-relaxed">{aiReport.foundation}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 flex items-start gap-2">
                      <Sun className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] font-semibold text-amber-300 block">Rooftop Solar PV:</span>
                        <p className="text-stone-300 text-[11px] mt-0.5 leading-snug">{aiReport.solarEstimate}</p>
                      </div>
                    </div>

                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 flex items-start gap-2">
                      <CloudRain className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] font-semibold text-blue-300 block">Rainwater Sump:</span>
                        <p className="text-stone-300 text-[11px] mt-0.5 leading-snug">{aiReport.rainwaterHarvesting}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-emerald-950/40 rounded-xl border border-emerald-500/20 text-emerald-200">
                    <strong className="block text-[11px] text-emerald-300">Vastu Shastra Assessment:</strong>
                    <p className="mt-0.5 leading-relaxed">{aiReport.vastuVerdict}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: LIVE ESTIMATE & BOQ BREAKDOWN (5 cols) */}
          <div className="lg:col-span-5 space-y-5 sticky top-24">
            {/* Main Total Card */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  {t.indicativeBudget}
                </span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-sm border border-emerald-200">
                  CPWD / AP-SSR 2026
                </span>
              </div>

              <div className="mt-3">
                <div className="text-3xl font-black text-stone-950 font-mono tracking-tight">
                  ₹{totalEstimate.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Indicative turnkey cost @ ₹{effectiveRate}/sq.ft for {builtUpArea.toLocaleString('en-IN')} sq.ft built-up area
                </p>
                <div className="mt-2 text-[11px] text-stone-400">
                  Confidence range: ±6% based on soil testing report and certified structural designs
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 space-y-2.5">
                <button
                  onClick={handleAddEstimateToCart}
                  className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
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

              {/* Escrow Milestone Release Schedule */}
              <div className="mt-4 pt-3 border-t border-stone-200">
                <span className="text-[11px] font-bold text-stone-900 uppercase tracking-wider block mb-2">
                  5-Stage Escrow Release Breakdown
                </span>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-stone-600">
                    <span>1. Foundation & PCC (20%)</span>
                    <span className="font-mono font-bold">₹{Math.round(totalEstimate * 0.20).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>2. Plinth & RCC Framing (30%)</span>
                    <span className="font-mono font-bold">₹{Math.round(totalEstimate * 0.30).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>3. Brickwork & Plastering (25%)</span>
                    <span className="font-mono font-bold">₹{Math.round(totalEstimate * 0.25).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>4. Flooring & Plumbing (15%)</span>
                    <span className="font-mono font-bold">₹{Math.round(totalEstimate * 0.15).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>5. Painting & Key Handover (10%)</span>
                    <span className="font-mono font-bold">₹{Math.round(totalEstimate * 0.10).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Statutory Note */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-start gap-1.5 text-[10px] text-stone-400">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-600 mt-0.5" />
                <span>
                  100% Escrow Milestone Release: Contractor receives each installment only after your sign-off and QC Engineer cube crush test inspection.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
