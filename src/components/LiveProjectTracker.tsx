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
} from 'lucide-react';
import { SAMPLE_ACTIVE_PROJECT } from '../data/mockData';
import { TranslationStrings } from '../i18n/translations';

interface LiveProjectTrackerProps {
  t: TranslationStrings;
}

export const LiveProjectTracker: React.FC<LiveProjectTrackerProps> = ({ t }) => {
  const project = SAMPLE_ACTIVE_PROJECT;
  const [activeTab, setActiveTab] = useState<'timeline' | 'alerts' | 'expenses'>('timeline');
  const [siteNote, setSiteNote] = useState('');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [siteNotesList, setSiteNotesList] = useState([
    {
      time: 'Today, 10:30 AM',
      author: 'Er. Sandeep Reddy (Site Engg)',
      text: 'Plinth shuttering alignment checked with auto-level instrument. Concrete pour scheduled for tomorrow morning.',
    },
    {
      time: 'Yesterday, 4:15 PM',
      author: 'Quality Lab Inspector',
      text: 'Collected 6 concrete cube samples for 7-day and 28-day compressive strength testing.',
    },
  ]);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteNote.trim()) return;
    setSiteNotesList([
      {
        time: 'Just now',
        author: 'Suresh Punnana (Owner)',
        text: siteNote,
      },
      ...siteNotesList,
    ]);
    setSiteNote('');
  };

  return (
    <div className="py-8 bg-stone-50/70 min-h-[calc(100vh-160px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Zomato-Style Live Tracking Banner */}
        <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
          {/* Subtle background mesh */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-rose-600/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-full">
                  <Activity className="w-3.5 h-3.5 animate-pulse" />
                  <span>{t.liveBannerTitle}</span>
                </span>
                <span className="text-xs text-stone-400 font-mono">
                  Order ID: {project.id}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif">
                {project.projectName}
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 mt-1">
                {project.location} · Handover Target: <strong className="text-white">{project.targetHandover}</strong>
              </p>

              {/* Current Stage */}
              <div className="mt-4 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                <span className="text-sm font-bold text-rose-300">
                  {t.currentStage}: {project.currentStage}
                </span>
              </div>
            </div>

            {/* Contractor Contact Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 shrink-0 max-w-sm w-full">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div>
                  <span className="text-[11px] text-stone-400 block font-medium">Turnkey Contractor</span>
                  <span className="text-sm font-bold text-white block">{project.builderName}</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-600/40 text-emerald-300 text-[10px] font-bold rounded">
                  RERA Verified
                </span>
              </div>

              <p className="text-xs text-stone-300 mb-3">
                Assigned Site Engineer: <strong>{project.siteEngineer}</strong>
              </p>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${project.builderPhone}`}
                  className="flex-1 py-2 px-3 bg-white hover:bg-stone-100 text-stone-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-rose-600" />
                  <span>{t.callEngineer}</span>
                </a>
                <button
                  onClick={() => showToast(`Opening live chat session with ${project.siteEngineer}...`)}
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
                Overall Milestone Progress: <strong className="text-white">{project.overallProgress}%</strong>
              </span>
              <span className="text-stone-400">Target Completion in 68 Days</span>
            </div>
            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${project.overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3 Inner Tabs */}
        <div className="flex items-center gap-4 border-b border-stone-200 mb-6 bg-white px-4 rounded-xl py-2">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-2 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            {t.milestoneTimeline} ({project.milestones.length})
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
            <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
              {project.activeAlerts.length}
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
            {t.itemizedExpenses}
          </button>
        </div>

        {/* Tab 1: Milestone Stepper (Zomato Order Stepper Style) */}
        {activeTab === 'timeline' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs">
              <h2 className="text-base font-bold text-stone-900 mb-6 flex items-center justify-between">
                <span>Phase-Wise Construction Stepper</span>
                <span className="text-xs text-stone-400 font-normal">Escrow-backed release</span>
              </h2>

              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
                {project.milestones.map((m, idx) => {
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
                            ? 'bg-rose-600 text-white animate-bounce'
                            : 'bg-stone-200 text-stone-500'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <span className="text-[10px] font-bold">{idx + 1}</span>
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3
                            className={`text-sm sm:text-base font-bold leading-tight ${
                              isCurrent ? 'text-rose-600 font-extrabold' : 'text-stone-900'
                            }`}
                          >
                            {m.title}
                          </h3>
                          <span className="text-xs font-mono font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                            {m.date}
                          </span>
                        </div>

                        <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                          {m.description}
                        </p>

                        {isCurrent && (
                          <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-800 text-xs font-semibold rounded-lg border border-rose-200">
                            <Clock className="w-3.5 h-3.5 text-rose-600" />
                            <span>Work actively underway on site today</span>
                          </div>
                        )}
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
                    placeholder="Add an owner inquiry or observation..."
                    value={siteNote}
                    onChange={(e) => setSiteNote(e.target.value)}
                    className="w-full text-xs p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-rose-500 resize-none"
                  />
                  <button
                    type="submit"
                    className="mt-1.5 w-full py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                  >
                    Post Note to Site Engineer
                  </button>
                </form>

                <div className="space-y-3 max-h-72 overflow-y-auto divide-y divide-stone-100 text-xs">
                  {siteNotesList.map((log, i) => (
                    <div key={i} className="pt-2.5 first:pt-0">
                      <div className="flex items-center justify-between text-[11px] text-stone-400 mb-0.5">
                        <span className="font-semibold text-stone-700">{log.author}</span>
                        <span>{log.time}</span>
                      </div>
                      <p className="text-stone-600 leading-relaxed">{log.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Delay & Risk Radar (PDF Section 14) */}
        {activeTab === 'alerts' && (
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-stone-900 flex items-center justify-between">
              <span>Rule-Based Risk & Delay Mitigation Engine</span>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Active Monitoring
              </span>
            </h2>

            <div className="space-y-3">
              {project.activeAlerts.map((alertItem) => (
                <div
                  key={alertItem.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    alertItem.severity === 'warning'
                      ? 'bg-amber-50/70 border-amber-300 text-amber-950'
                      : 'bg-blue-50/70 border-blue-300 text-blue-950'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
                      alertItem.severity === 'warning' ? 'text-amber-600' : 'text-blue-600'
                    }`} />
                    <div>
                      <h4 className="text-sm font-bold">{alertItem.title}</h4>
                      <p className="text-xs mt-0.5 opacity-90 leading-relaxed">
                        {alertItem.description}
                      </p>
                      <div className="text-[11px] font-semibold mt-1">
                        Recommended Action: <span className="underline">{alertItem.actionRequired}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => showToast(`Action initiated: ${alertItem.actionRequired}`)}
                    className="px-3.5 py-1.5 bg-white text-xs font-bold rounded-lg border border-stone-200 shadow-2xs hover:bg-stone-50 cursor-pointer whitespace-nowrap self-start sm:self-auto"
                  >
                    Resolve Alert
                  </button>
                </div>
              ))}
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

        {/* Tab 3: Itemized Expenses */}
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
                  {project.recentExpenses.map((exp, idx) => (
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
      </div>
    </div>
  );
};
