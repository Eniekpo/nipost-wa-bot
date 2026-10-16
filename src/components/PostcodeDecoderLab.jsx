import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Send, 
  Info, 
  MapPin, 
  Building, 
  Compass,
  Bike
} from 'lucide-react';
import { 
  normalizePostcode, 
  disassemblePostcode, 
  NIPOST_SANDBOX_DB, 
  ZONE_RIDERS 
} from '../services/whatsappBotService';

export default function PostcodeDecoderLab({ onInjectToChat }) {
  const [testInput, setTestInput] = useState('la 11 w06 tc 10');

  const normalized = normalizePostcode(testInput);
  const disassembled = disassemblePostcode(testInput);
  const sandboxRecord = NIPOST_SANDBOX_DB[normalized];
  const assignedRider = disassembled ? ZONE_RIDERS[disassembled.clusterKey] : null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col h-[720px] overflow-y-auto">
      {/* Title */}
      <div className="pb-4 border-b border-slate-800 shrink-0">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-amber-400" />
          NIPOST Postcode Architecture & Decoder Lab
        </h2>
        <p className="text-xs text-slate-400">
          Inspect NIPOST 11-character addressing hierarchy, regular expression validation rules, and sandbox database coverage.
        </p>
      </div>

      <div className="py-4 space-y-4 flex-1">
        {/* Interactive Input Bar */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <label className="text-xs font-semibold text-slate-300 block">
            Test Any Postcode Input (Raw, Spaced, Compact, or Canonical):
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="e.g. la 11 w06 tc 10, FC01A01KP27, or LA-00-W06-TC-10"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            {sandboxRecord && (
              <button
                onClick={() => onInjectToChat(`Deliver package to ${normalized}`)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send to Bot</span>
              </button>
            )}
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-400">
            <span className="font-medium mr-1 text-slate-500">Quick tests:</span>
            <button
              onClick={() => setTestInput('LA-11-W06-TC-10')}
              className="font-mono bg-slate-900 hover:bg-slate-800 text-emerald-400 px-2 py-0.5 rounded border border-slate-800"
            >
              LA-11-W06-TC-10
            </button>
            <button
              onClick={() => setTestInput('FC01A01KP27')}
              className="font-mono bg-slate-900 hover:bg-slate-800 text-blue-400 px-2 py-0.5 rounded border border-slate-800"
            >
              FC01A01KP27 (Compact)
            </button>
            <button
              onClick={() => setTestInput('og 14 t18 bn 16')}
              className="font-mono bg-slate-900 hover:bg-slate-800 text-amber-400 px-2 py-0.5 rounded border border-slate-800"
            >
              og 14 t18 bn 16 (Spaced)
            </button>
            <button
              onClick={() => setTestInput('LA-00-W06-TC-10')}
              className="font-mono bg-slate-900 hover:bg-rose-950 text-rose-400 px-2 py-0.5 rounded border border-slate-800"
            >
              LA-00-W06-TC-10 (Invalid 00)
            </button>
          </div>
        </div>

        {/* Decoder Visualizer Result */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              Disassembly & Validation Analysis:
            </span>
            {disassembled ? (
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Valid 5-Segment Syntax
              </span>
            ) : (
              <span className="text-xs font-semibold text-rose-400 bg-rose-950/80 px-2.5 py-1 rounded-full border border-rose-800 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Invalid Postcode Format
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                Normalized Canonical Form:
              </span>
              <span className="font-mono font-bold text-white text-sm">
                {normalized || '—'}
              </span>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                Cluster Routing Key:
              </span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {disassembled ? disassembled.clusterKey : 'N/A'}
              </span>
            </div>
          </div>

          {/* Segment breakdown */}
          {disassembled ? (
            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                5-Segment Dissection:
              </span>
              <div className="grid grid-cols-5 gap-2 text-center font-mono">
                <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl">
                  <span className="text-base font-bold text-emerald-400 block">{disassembled.segments.state}</span>
                  <span className="text-[9px] text-slate-400">State</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl">
                  <span className="text-base font-bold text-emerald-400 block">{disassembled.segments.lga}</span>
                  <span className="text-[9px] text-slate-400">LGA</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl">
                  <span className="text-base font-bold text-emerald-400 block">{disassembled.segments.district}</span>
                  <span className="text-[9px] text-slate-400">District</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl">
                  <span className="text-base font-bold text-emerald-400 block">{disassembled.segments.area}</span>
                  <span className="text-[9px] text-slate-400">Area</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl">
                  <span className="text-base font-bold text-emerald-400 block">{disassembled.segments.unit}</span>
                  <span className="text-[9px] text-slate-400">Unit</span>
                </div>
              </div>

              {assignedRider && (
                <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl flex items-center justify-between text-xs mt-2">
                  <div className="flex items-center gap-2">
                    <Bike className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-300">Default Fleet Rider for this Cluster:</span>
                    <strong className="text-white">{assignedRider.name}</strong>
                    <span className="text-slate-500 font-mono">({assignedRider.bike})</span>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold">Base: ₦{assignedRider.baseFee}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-rose-950/40 border border-rose-900/50 p-3 rounded-xl text-xs text-rose-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">NIPOST Addressing Constraint Failure</p>
                <p className="text-[11px] text-rose-300/80 mt-0.5">
                  The regex requires: <code className="font-mono">([A-Z]&#123;2&#125;)-(0[1-9]|[1-9][0-9])-([A-Z0-9]&#123;3&#125;)-([A-Z]&#123;2&#125;)-(0[1-9]|[1-9][0-9])</code>.
                  Segments 2 & 5 cannot be <code className="font-mono text-rose-200">00</code>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Pre-Loaded Sandbox Database Table */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-300 block">
            Pre-Loaded NIPOST Sandbox Directory (Offline Ready):
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {Object.entries(NIPOST_SANDBOX_DB).map(([code, rec]) => (
              <div
                key={code}
                onClick={() => setTestInput(code)}
                className="bg-slate-950 border border-slate-800 hover:border-emerald-500/50 p-3 rounded-xl cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    {code}
                  </span>
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    {rec.building_use_status}
                  </span>
                </div>
                <p className="text-xs font-semibold text-white mt-1 group-hover:text-emerald-300 transition-colors">
                  {rec.recent_house_address.recent}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {rec.administrative_address.lga_name}, {rec.administrative_address.state_name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
