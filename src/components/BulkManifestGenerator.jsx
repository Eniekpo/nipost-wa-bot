import React, { useState } from 'react';
import { 
  Layers, 
  Play, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  RefreshCw, 
  FileSpreadsheet,
  Bike
} from 'lucide-react';
import { processCustomerWhatsAppOrder } from '../services/whatsappBotService';

const SAMPLE_BULK_INPUT = `Customer 1: Hi vendor, I paid for the heels. Postcode is LA-11-W06-TC-10, Flat 3B Second Floor. Call 08031234567.
Customer 2: Deliver laptop stand to FC01A01KP27, Suite 402 Left Wing. Phone: 08098765432
Customer 3: Send to OG-14-T18-BN-16, yellow gate duplex. 08165554433.
Customer 4: Here is my address: 28 Joel Ogunnaike Ikeja GRA, postcode is la 11 w06 tc 18, 08034445566
Customer 5: Deliver goods to EK-01-A03-FK-01, back of Fabian Hotel, Ado Ekiti. 08092223344
Customer 6: Send to LA-00-W06-TC-10, flat 2, 08022223333`;

export default function BulkManifestGenerator({ apiKey, onAddTicketsToHistory }) {
  const [inputText, setInputText] = useState(SAMPLE_BULK_INPUT);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleProcess = async () => {
    if (!inputText.trim() || isProcessing) return;
    setIsProcessing(true);

    const lines = inputText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const processed = [];
    const validTickets = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const res = await processCustomerWhatsAppOrder(line, apiKey);
      processed.push({
        rawLine: line,
        res,
      });
      if (res.ok && res.ticket) {
        validTickets.push(res.ticket);
      }
    }

    setResults(processed);
    setIsProcessing(false);

    if (validTickets.length > 0 && onAddTicketsToHistory) {
      onAddTicketsToHistory(validTickets);
    }
  };

  const copyAllRiderNotes = () => {
    if (!results) return;
    const notes = results
      .filter((r) => r.res.ok && r.res.ticket)
      .map((r) => r.res.ticket.riderForwardText)
      .join('\n\n========================================\n\n');

    navigator.clipboard.writeText(notes);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const exportBulkCsv = () => {
    if (!results) return;
    const validOnes = results.filter((r) => r.res.ok && r.res.ticket);
    if (validOnes.length === 0) return;

    const headers = [
      'Ticket ID',
      'Postcode',
      'Street Address',
      'LGA',
      'State',
      'Building Type',
      'Customer Phone',
      'Unit Note',
      'Assigned Rider',
      'Bike Plate',
      'Fee (NGN)',
    ];

    const rows = validOnes.map(({ res }) => {
      const t = res.ticket;
      return [
        t.ticketId,
        t.canonical,
        `"${t.addressData.recent_house_address.recent.replace(/"/g, '""')}"`,
        t.addressData.administrative_address.lga_name,
        t.addressData.administrative_address.state_name,
        t.addressData.building_use_status,
        t.customerPhone,
        `"${t.unitNote.replace(/"/g, '""')}"`,
        t.rider.name,
        t.rider.bike,
        t.dispatchFee,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bulk_dispatch_manifest_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const validCount = results ? results.filter((r) => r.res.ok).length : 0;
  const invalidCount = results ? results.filter((r) => !r.res.ok).length : 0;
  const totalFee = results
    ? results
        .filter((r) => r.res.ok && r.res.ticket)
        .reduce((sum, r) => sum + r.res.ticket.dispatchFee, 0)
    : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col h-[720px] overflow-y-auto">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 shrink-0">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            Bulk WhatsApp Order Manifest Generator
          </h2>
          <p className="text-xs text-slate-400">
            Paste multiple customer WhatsApp order messages to parse, verify addresses, and create a centralized dispatch manifest in one batch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setInputText(SAMPLE_BULK_INPUT)}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors"
          >
            Load 6 Sample Chats
          </button>
          <button
            onClick={handleProcess}
            disabled={isProcessing || !inputText.trim()}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold px-4 py-1.5 rounded-xl shadow-md transition-colors"
          >
            {isProcessing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{isProcessing ? 'Processing Orders...' : 'Process All Orders'}</span>
          </button>
        </div>
      </div>

      <div className="py-4 space-y-4 flex-1">
        {/* Input Textarea */}
        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
          <label className="text-xs font-semibold text-slate-400 block mb-1">
            Raw Customer WhatsApp Orders (One message per line):
          </label>
          <textarea
            rows={5}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste multiple WhatsApp customer messages here..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 resize-none"
          />
        </div>

        {/* Results summary stats */}
        {results && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Messages</span>
              <p className="text-lg font-bold text-white mt-0.5">{results.length}</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-emerald-900/60">
              <span className="text-[10px] text-emerald-400 uppercase font-semibold">Verified Tickets</span>
              <p className="text-lg font-bold text-emerald-400 mt-0.5">{validCount}</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-rose-900/60">
              <span className="text-[10px] text-rose-400 uppercase font-semibold">Errors / Invalid</span>
              <p className="text-lg font-bold text-rose-400 mt-0.5">{invalidCount}</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-purple-900/60">
              <span className="text-[10px] text-purple-300 uppercase font-semibold">Manifest Revenue</span>
              <p className="text-lg font-bold text-purple-400 mt-0.5">₦{totalFee.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Manifest actions bar */}
        {results && validCount > 0 && (
          <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-300 font-medium">
              Manifest Ready: {validCount} tickets dispatched
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={copyAllRiderNotes}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAll ? 'All Notes Copied!' : 'Copy All Rider Notes'}</span>
              </button>
              <button
                onClick={exportBulkCsv}
                className="text-xs bg-purple-600 hover:bg-purple-500 text-white font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Manifest CSV</span>
              </button>
            </div>
          </div>
        )}

        {/* Processed results list */}
        {results && (
          <div className="space-y-2">
            {results.map(({ rawLine, res }, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-xs transition-all ${
                  res.ok
                    ? 'bg-slate-950 border-emerald-900/60 hover:border-emerald-500/50'
                    : 'bg-rose-950/20 border-rose-900/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {res.ok ? (
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        {res.ticket.ticketId}
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> FAILED
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 font-mono">
                      Line #{idx + 1}
                    </span>
                  </div>

                  {res.ok && (
                    <span className="font-mono text-emerald-400 font-bold">
                      ₦{res.ticket.dispatchFee.toLocaleString()}
                    </span>
                  )}
                </div>

                <p className="text-slate-300 text-[11px] italic mb-1.5 line-clamp-1">
                  "{rawLine}"
                </p>

                {res.ok ? (
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="space-y-0.5">
                      <p className="text-white font-medium">
                        {res.ticket.addressData.recent_house_address.recent}
                      </p>
                      <p className="text-slate-400 text-[10px]">
                        Postcode: <span className="font-mono text-emerald-300">{res.ticket.canonical}</span> • Phone: {res.ticket.customerPhone}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Bike className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{res.ticket.rider.name}</span>
                      <span className="text-slate-500 font-mono">({res.ticket.rider.bike})</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-rose-300 bg-rose-950/50 p-2 rounded-lg border border-rose-900/60">
                    {res.botReply}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
