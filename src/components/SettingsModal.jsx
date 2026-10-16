import React, { useState } from 'react';
import { 
  X, 
  Key, 
  Volume2, 
  VolumeX, 
  Shield, 
  Check, 
  HelpCircle,
  ExternalLink,
  Bike,
  Sparkles
} from 'lucide-react';
import { ZONE_RIDERS } from '../services/whatsappBotService';

export default function SettingsModal({
  apiKey,
  onSaveApiKey,
  soundEnabled,
  onToggleSound,
  onClose,
}) {
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    onSaveApiKey(inputKey.trim());
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setInputKey('');
    onSaveApiKey('');
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                System Settings & NIPOST API
              </h3>
              <p className="text-[11px] text-slate-400">
                Configure Level 3 endpoint credentials and dispatch fleet rules
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5 text-xs text-slate-300">
          {/* API Key Section */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-200 flex items-center justify-between">
              <span>NIPOST Production API Key (X-API-Key):</span>
              <span className="text-[10px] text-slate-400 font-normal">
                Endpoint: api.postcode.gov.ng/v1
              </span>
            </label>

            <input
              type="text"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Paste X-API-Key or leave empty for offline sandbox"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 font-mono text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-1.5 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <Shield className="w-3.5 h-3.5" />
                <span>Sandbox Mode (Recommended for testing)</span>
              </div>
              <p>
                When left empty, the application runs on the built-in offline NIPOST sandbox database with instant Level 3 address resolution for Lagos, Abuja, Ogun, and Ekiti.
              </p>
            </div>
          </div>

          {/* Sound Effects Toggle */}
          <div className="flex items-center justify-between bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2.5">
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
              <div>
                <span className="font-semibold text-white block">
                  WhatsApp Sound Effects
                </span>
                <span className="text-[11px] text-slate-400">
                  Synthesized chimes when messages send, arrive, and tickets are created
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleSound}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                soundEnabled ? 'bg-emerald-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  soundEnabled ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Zone Fleet Directory */}
          <div className="space-y-2">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Bike className="w-3.5 h-3.5 text-emerald-400" />
              Configured Zone Fleet Riders:
            </span>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              {Object.entries(ZONE_RIDERS).map(([cluster, rider]) => (
                <div key={cluster} className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <div className="flex justify-between font-mono text-emerald-400 font-bold">
                    <span>{cluster}</span>
                    <span>₦{rider.baseFee}</span>
                  </div>
                  <div className="text-white font-medium mt-0.5">{rider.name}</div>
                  <div className="text-slate-500">{rider.bike} • {rider.phone}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-400 hover:text-slate-200 transition-colors text-xs"
            >
              Reset to Sandbox Mode
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-900/30"
              >
                {savedNotice ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{savedNotice ? 'Saved!' : 'Save Settings'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
