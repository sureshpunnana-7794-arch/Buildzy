import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Info,
  Phone,
  MessageSquare,
  ShieldCheck,
  Receipt,
  Camera,
  Activity,
  ArrowRight,
  Check,
  FileText,
  X,
  Award,
  HardHat,
  ChevronRight,
} from 'lucide-react';
import { SAMPLE_ACTIVE_PROJECT } from '../data/mockData';
import { TranslationStrings } from '../i18n/translations';

interface LiveProjectTrackerProps {
  t: TranslationStrings;
  customOrderId?: string | null;
}

export const LiveProjectTracker: React.FC<LiveProjectTrackerProps> = ({ t, customOrderId }) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'alerts' | 'expenses'>('timeline');
  const [siteNote, setSiteNote] = useState('');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Escrow Approval Modal State
  const [escrowModalMilestone, setEscrowModalMilestone] = useState<{
    id: string;
    title: string;
    amount: number;
    cubeStrength: string;
    slump: string;
  } | null>(null);

  // Dynamic milestone state to allow interactive escrow signoff
  const [milestones, setMilestones] = useState(SAMPLE_ACTIVE_PROJECT.milestones);
  const [overallProgress, setOverallProgress] = useState(SAMPLE_ACTIVE_PROJECT.overallProgress);
  const [currentStage, setCurrentStage] = useState(SAMPLE_ACTIVE_PROJECT.currentStage);

  // Alerts state to allow interactive resolution
  const [alerts, setAlerts] = useState(
    SAMPLE_ACTIVE_PROJECT.activeAlerts.map((a) => ({ ...a, resolved: false }))
  );

  // Expenses state
  const [expenses, setExpenses] = useState(SAMPLE_ACTIVE_PROJECT.recentExpenses);

  // Site notes list
  const [siteNotesList, setSiteNotesList] = useState([
    {
      time: 'Today, 10:30 AM',
      author: 'Er. Sandeep Reddy (Site Engg)',
      text: 'Plinth shuttering alignment checked with auto-level instrument. Concrete pour scheduled for tomorrow morning.',
    },
    {
      time: 'Yesterday, 4:15 PM',
      author: 'Quality Lab Inspector',
      text: 'Collected 6 concrete cube samples for 7-day and 28-day compressive strength testing. Slump tested at 120mm.',
    },
  ]);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteNote.trim()) return;
    const newNote = {
      time: 'Just now',
      author: 'Suresh Punnana (Owner)',
      text: siteNote,
    };
    setSiteNotesList([newNote, ...siteNotesList]);
    setSiteNote('');
    showToast('Note posted directly to Site Engineer dashboard.');

    // Simulated Engineer response after 2 seconds
    setTimeout(() => {
      setSiteNotesList((prev) => [
        {
          time: 'Just now',
          author: 'Er. Sandeep Reddy (Site Engg)',
          text: `Acknowledged: "${newNote.text.slice(0, 30)}...". I will verify this on site during the 2:00 PM inspection round.`,
        },
        ...prev,
      ]);
    }, 2200);
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, resolved: true } : a))
    );
    showToast('Risk mitigation action recorded & verified on site log.');
  };

  const handleApproveEscrowRelease = () => {
    if (!escrowModalMilestone) return;

    // Update milestone to completed
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === escrowModalMilestone.id ? { ...m, status: 'completed' } : m
      )
    );

    // Advance progress
    const newProgress = Math.min(100, overallProgress + 18);
    setOverallProgress(newProgress);
    setCurrentStage('Ground Floor RCC Columns & 1st Slab');

    // Add to verified expenses
    setExpenses([
      {
        date: 'Today',
        title: `${escrowModalMilestone.title} Escrow Milestone Release`,
        amount: escrowModalMilestone.amount,
        category: 'Milestone Escrow',
        receiptVerified: true,
      },
      ...expenses,
    ]);

    setEscrowModalMilestone(null);
    showToast(`✓ ₹${escrowModalMilestone.amount.toLocaleString('en-IN')} successfully released from Escrow to Contractor.`);
  };

  return (
    <div className="py-8 bg-stone-50/70 min-h-[calc(100vh-160px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Zomato-Style Live Tracking Banner */}
        <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-rose-600/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-full">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  <span>{t.liveBannerTitle}</span>
                </span>
                <span className="text-xs text-stone-400 font-mono">
                  Order ID: <strong className="text-white">{customOrderId || SAMPLE_ACTIVE_PROJECT.id}</strong>
                </span>
                <span className="px-2 py-0.5 bg-rose-600/30 text-rose-300 text-[10px] font-bold rounded-sm border border-rose-500/30">
                  100% Escrow Insured
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif">
                {SAMPLE_ACTIVE_PROJECT.projectName}
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 mt-1">
                {SAMPLE_ACTIVE_PROJECT.location} · Handover Target: <strong className="text-white">{SAMPLE_ACTIVE_PROJECT.targetHandover}</strong>
              </p>

              {/* Current Stage */}
              <div className="mt-4 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                <span className="text-sm font-bold text-rose-300">
                  {t.currentStage}: <span className="text-white">{currentStage}</span>
                </span>
              </div>
            </div>

            {/* Contractor Contact Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 shrink-0 max-w-sm w-full">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div>
                  <span className="text-[11px] text-stone-400 block font-medium">Turnkey Contractor</span>
                  <span className="text-sm font-bold text-white block">{SAMPLE_ACTIVE_PROJECT.builderName}</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-600/40 text-emerald-300 text-[10px] font-bold rounded">
                  RERA Verified
                </span>
              </div>

              <p className="text-xs text-stone-300 mb-3 flex items-center gap-1.5">
                <HardHat className="w-3.5 h-3.5 text-amber-400" />
                <span>Assigned Site Engineer: <strong>{SAMPLE_ACTIVE_PROJECT.siteEngineer}</strong></span>
              </p>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${SAMPLE_ACTIVE_PROJECT.builderPhone}`}
                  className="flex-1 py-2 px-3 bg-white hover:bg-stone-100 text-stone-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-rose-600" />
                  <span>{t.callEngineer}</span>
                </a>
                <button
                  onClick={() => showToast(`Opening priority direct chat with ${SAMPLE_ACTIVE_PROJECT.siteEngineer}...`)}
                  className="py-2 px-3 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-white/10"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{t.chatEngineer}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-stone-300 font-medium">
                Overall Milestone Progress: <strong className="text-emerald-400 font-mono text-sm">{overallProgress}% Completed</strong>
              </span>
              <span className="text-stone-400">Target Completion in 68 Days</span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3 Inner Tabs */}
        <div className="flex items-center gap-4 border-b border-stone-200 mb-6 bg-white px-4 rounded-xl py-2 shadow-2xs">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-2 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            {t.milestoneTimeline} ({milestones.length})
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`py-2 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'alerts'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>{t.delayRadar}</span>
            <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold text-white ${
              alerts.some((a) => !a.resolved) ? 'bg-amber-500' : 'bg-emerald-600'
            }`}>
              {alerts.filter((a) => !a.resolved).length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            className={`py-2 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'expenses'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            {t.itemizedExpenses} ({expenses.length})
          </button>
        </div>

        {/* TAB 1: MILESTONE TIMELINE & ESCROW ACTIONS */}
        {activeTab === 'timeline' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between pb-4 mb-6 border-b border-stone-100 gap-2">
                <div>
                  <h2 className="text-base font-bold text-stone-900">
                    Phase-Wise Construction Stepper
                  </h2>
                  <p className="text-xs text-stone-500">
                    Escrow releases require owner inspection approval and digital QC signoff
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Escrow Balance: ₹14,20,000 Safe</span>
                </div>
              </div>

              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                {milestones.map((m, idx) => {
                  const isDone = m.status === 'completed';
                  const isCurrent = m.status === 'in_progress';

                  return (
                    <div key={m.id} className="relative group">
                      {/* Step Dot */}
                      <div
                        className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-rose-600 text-white animate-pulse'
                            : 'bg-stone-200 text-stone-500'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <span className="text-[10px] font-bold">{idx + 1}</span>
                        )}
                      </div>

                      <div className="bg-stone-50/60 hover:bg-stone-50 p-4 rounded-xl border border-stone-200/80 transition-colors">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3
                            className={`text-sm sm:text-base font-bold leading-tight ${
                              isCurrent ? 'text-rose-600 font-extrabold' : 'text-stone-900'
                            }`}
                          >
                            {m.title}
                          </h3>
                          <span className="text-xs font-mono font-medium text-stone-600 bg-white border border-stone-200 px-2 py-0.5 rounded shadow-2xs">
                            {m.date}
                          </span>
                        </div>

                        <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                          {m.description}
                        </p>

                        {/* Interactive Status & Action Banner */}
                        <div className="mt-3 pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
                          {isDone ? (
                            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Milestone Inspected & Escrow Released</span>
                            </div>
                          ) : isCurrent ? (
                            <>
                              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-amber-50 text-amber-900 text-xs font-semibold rounded-md border border-amber-200">
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                <span>QC Inspection Complete (M20 Strength: 24.2 N/mm²)</span>
                              </div>

                              <button
                                onClick={() =>
                                  setEscrowModalMilestone({
                                    id: m.id,
                                    title: m.title,
                                    amount: 245000,
                                    cubeStrength: '24.2 N/mm² (Target 20 N/mm²)',
                                    slump: '115mm (IS 1199 Compliant)',
                                  })
                                }
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
                              >
                                <Award className="w-3.5 h-3.5" />
                                <span>Review & Release ₹2,45,000</span>
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-stone-400">
                              Upcoming milestone (Awaiting Stage 3 completion)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Daily Site Log & Photo Feed */}
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-2xs">
                <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center justify-between">
                  <span>Site Photo & Notes Log</span>
                  <Camera className="w-4 h-4 text-stone-400" />
                </h3>

                <form onSubmit={handleAddNote} className="mb-4">
                  <textarea
                    rows={2}
                    placeholder="Send an observation or query to the site engineer..."
                    value={siteNote}
                    onChange={(e) => setSiteNote(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-rose-500 resize-none"
                  />
                  <button
                    type="submit"
                    className="mt-1.5 w-full py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Post Note to Site Engineer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                <div className="space-y-3 max-h-80 overflow-y-auto divide-y divide-stone-100 text-xs">
                  {siteNotesList.map((log, i) => (
                    <div key={i} className="pt-2.5 first:pt-0">
                      <div className="flex items-center justify-between text-[11px] text-stone-400 mb-0.5">
                        <span className="font-semibold text-stone-800">{log.author}</span>
                        <span>{log.time}</span>
                      </div>
                      <p className="text-stone-600 leading-relaxed bg-stone-50/70 p-2 rounded-lg border border-stone-100">
                        {log.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statutory Quality Assurance Card */}
              <div className="bg-stone-900 text-white rounded-2xl p-5 shadow-md border border-stone-800 text-xs space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>BUILDZY Quality Guarantee</span>
                </div>
                <p className="text-stone-300 leading-relaxed text-[11px]">
                  All RCC columns and plinth casting follow strict IS 456 standards. Digital cube strength reports and slump test records are automatically audited by our independent civil QC engineering panel.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DELAY & RISK RADAR */}
        {activeTab === 'alerts' && (
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-stone-900 flex items-center justify-between">
              <span>Rule-Based Delay & Meteorological Radar</span>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                Active Continuous Monitoring
              </span>
            </h2>

            <div className="space-y-3">
              {alerts.map((alertItem) => (
                <div
                  key={alertItem.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                    alertItem.resolved
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                      : alertItem.severity === 'warning'
                      ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                      : 'bg-blue-50/80 border-blue-300 text-blue-950'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {alertItem.resolved ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle
                        className={`w-5 h-5 shrink-0 mt-0.5 ${
                          alertItem.severity === 'warning' ? 'text-amber-600' : 'text-blue-600'
                        }`}
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold">{alertItem.title}</h4>
                        {alertItem.resolved && (
                          <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded">
                            Action Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs mt-0.5 opacity-90 leading-relaxed">
                        {alertItem.description}
                      </p>
                      <div className="text-[11px] font-semibold mt-1">
                        Recommended Action: <span className="underline">{alertItem.actionRequired}</span>
                      </div>
                    </div>
                  </div>

                  {!alertItem.resolved ? (
                    <button
                      onClick={() => handleResolveAlert(alertItem.id)}
                      className="px-3.5 py-1.5 bg-white text-xs font-bold rounded-lg border border-stone-200 shadow-2xs hover:bg-stone-50 cursor-pointer whitespace-nowrap self-start sm:self-auto transition-colors"
                    >
                      Resolve Alert
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-700 font-bold whitespace-nowrap self-start sm:self-auto">
                      ✓ Resolved on site
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ITEMIZED EXPENSES */}
        {activeTab === 'expenses' && (
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs">
            <h2 className="text-base font-bold text-stone-900 mb-4 flex items-center justify-between">
              <span>Verified Milestone Disbursements & Invoices</span>
              <Receipt className="w-4 h-4 text-stone-400" />
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3 text-right">Receipt Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {expenses.map((exp, idx) => (
                    <tr key={idx} className="hover:bg-stone-50/50">
                      <td className="py-2.5 px-3 text-stone-500 font-mono">{exp.date}</td>
                      <td className="py-2.5 px-3 font-semibold text-stone-900">{exp.title}</td>
                      <td className="py-2.5 px-3 text-stone-600">{exp.category}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-stone-950">
                        ₹{exp.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verified QC</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ESCROW RELEASE MODAL */}
        {escrowModalMilestone && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
              <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold">Milestone Inspection & Escrow Release</h3>
                </div>
                <button
                  onClick={() => setEscrowModalMilestone(null)}
                  className="text-stone-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs">
                <div>
                  <span className="text-[11px] text-stone-400 uppercase font-semibold">Milestone Phase</span>
                  <h4 className="text-base font-bold text-stone-900 mt-0.5">
                    {escrowModalMilestone.title}
                  </h4>
                </div>

                <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                  <div className="flex justify-between">
                    <span className="text-stone-600">QC Cube Compressive Strength:</span>
                    <strong className="text-stone-900 font-mono">{escrowModalMilestone.cubeStrength}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Slump Test Result:</span>
                    <strong className="text-stone-900 font-mono">{escrowModalMilestone.slump}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Site Inspection Signoff:</span>
                    <span className="text-emerald-700 font-bold">Er. Sandeep Reddy (Civil Engg)</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] leading-relaxed">
                  <strong>Homeowner Authorization:</strong> Authorizing this release transfers ₹{escrowModalMilestone.amount.toLocaleString('en-IN')} from your escrow deposit to Sovereign Buildcon's verified account.
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase font-bold">Amount to Disburse</span>
                    <span className="text-lg font-black text-stone-900 font-mono">
                      ₹{escrowModalMilestone.amount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEscrowModalMilestone(null)}
                      className="px-3.5 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleApproveEscrowRelease}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>Confirm & Release</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Toast */}
        {feedbackToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 border border-stone-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{feedbackToast}</span>
          </div>
        )}
      </div>
    </div>
  );
};
