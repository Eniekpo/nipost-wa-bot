import React from 'react';
import { 
  Send, 
  MessageSquare, 
  ShieldCheck, 
  Radio, 
  Settings, 
  History, 
  Layers, 
  Database,
  Truck,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react';

export default function Navbar({
  apiKey,
  ticketsCount,
  activeTab,
  setActiveTab,
  onOpenSettings,
  soundEnabled,
  onToggleSound,
}) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-900/30 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 text-lg">
                    NP
                  </span>
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                  NIPOST <span className="text-emerald-400 font-semibold text-xs px-2 py-0.5 bg-emerald-950/80 border border-emerald-800/60 rounded-full">PROTOTYPE 4</span>
                </span>
                <span className="hidden sm:inline-block text-xs text-slate-400">|</span>
                <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-300 font-medium">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  WhatsApp Dispatch Ticket Generator
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Autonomous 5-Segment Postcode Parsing, Level 3 Verification & Fleet Rider Routing
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('live')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'live'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-emerald-300" />
              Live Bot & Ops
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'history'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <History className="w-3.5 h-3.5 text-blue-300" />
              Tickets ({ticketsCount})
            </button>
            <button
              onClick={() => setActiveTab('decoder')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'decoder'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-amber-300" />
              Postcode Lab
            </button>
            <button
              onClick={() => setActiveTab('batch')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'batch'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-purple-300" />
              Bulk Manifest
            </button>
          </nav>

          {/* Right utility icons & API badge */}
          <div className="flex items-center space-x-2.5">
            {/* Mode Indicator Badge */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium border ${
                apiKey
                  ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  apiKey ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="hidden sm:inline">
                {apiKey ? 'API: LIVE (postcode.gov.ng)' : 'MODE: SANDBOX FALLBACK'}
              </span>
              <span className="sm:hidden">{apiKey ? 'LIVE' : 'MOCK'}</span>
            </div>

            {/* Sound Mute/Unmute */}
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Mute audio' : 'Unmute audio'}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Settings Trigger */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
              title="Settings & NIPOST API Key"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
