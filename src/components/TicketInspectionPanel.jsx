import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Navigation, 
  Phone, 
  User, 
  Bike, 
  Building2, 
  CheckCircle2, 
  Copy, 
  Check, 
  Printer, 
  ExternalLink, 
  FileText, 
  Compass, 
  Clock, 
  Share2, 
  Download,
  AlertCircle,
  HelpCircle,
  Hash,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function TicketInspectionPanel({
  ticket,
  onOpenWaybill,
  onCopyRiderNote,
  copiedTicketId,
  onQuickLoadDemo,
}) {
  const [deliveryStatus, setDeliveryStatus] = useState('Assigned');

  if (!ticket) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center h-[720px] shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          No Active Dispatch Ticket Selected
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
          Send a WhatsApp customer order in the phone simulator to extract the 11-character NIPOST code, verify Level 3 address records, and assign zone riders.
        </p>

        <div className="w-full max-w-md bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-left space-y-3">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
            ⚡ Quick-Launch Demo Scenarios:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => onQuickLoadDemo("LA-11-W06-TC-10")}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-emerald-300">LA-11-W06-TC-10</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Ikeja GRA, Lagos (Residential)</p>
            </button>

            <button
              onClick={() => onQuickLoadDemo("FC-01-A01-KP-27")}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-300">FC-01-A01-KP-27</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">NIPOST HQ, Abuja CBD (Commercial)</p>
            </button>

            <button
              onClick={() => onQuickLoadDemo("OG-14-T18-BN-16")}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-300">OG-14-T18-BN-16</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Akute, Ifo, Ogun State</p>
            </button>

            <button
              onClick={() => onQuickLoadDemo("EK-01-A03-FK-01")}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple-300">EK-01-A03-FK-01</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 transition-colors" />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Ado Ekiti, Ekiti State</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const {
    ticketId,
    timestamp,
    canonical,
    clusterKey,
    segments,
    sourceMode,
    addressData,
    customerPhone,
    unitNote,
    rider,
    dispatchFee,
    mapsUrl,
    riderForwardText,
  } = ticket;

  const isCommercial = addressData.building_use_status === 'commercial';

  const downloadJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(ticket, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${ticketId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col h-[720px] overflow-y-auto">
      {/* Top Banner: Verification Stamp & Ticket ID */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-900/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight font-mono">
                {ticketId}
              </h2>
              <span className="bg-emerald-950 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                NIPOST LEVEL 3 VERIFIED
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Generated: {timestamp}</span>
              <span>•</span>
              <span className="font-mono text-[11px] text-slate-300">
                Mode: {sourceMode === 'live_api' ? 'Live API (HTTP 200)' : 'Sandbox Database'}
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons: Print, Download, Status */}
        <div className="flex items-center gap-2">
          <select
            value={deliveryStatus}
            onChange={(e) => setDeliveryStatus(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 font-medium"
          >
            <option value="Assigned">Status: Rider Assigned</option>
            <option value="Dispatched">Status: Out for Delivery</option>
            <option value="Completed">Status: Delivered</option>
          </select>

          <button
            onClick={onOpenWaybill}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-md transition-colors"
            title="Print 80mm Waybill POS Slip"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print Slip</span>
          </button>

          <button
            onClick={downloadJson}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors"
            title="Export Ticket JSON"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="py-4 space-y-4 flex-1">
        {/* 5-Segment Postcode Architecture Disassembler */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-emerald-400" />
              NIPOST 5-Segment Postcode Breakdown:
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              Cluster Zone: {clusterKey}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 text-center font-mono">
            {/* Segment 1: State */}
            <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-2">
              <span className="text-sm sm:text-base font-extrabold text-emerald-400 block">
                {segments.state}
              </span>
              <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
                State
              </span>
              <span className="text-[8px] text-emerald-300/70 truncate block">
                {addressData.administrative_address.state_name}
              </span>
            </div>

            {/* Segment 2: LGA */}
            <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-2">
              <span className="text-sm sm:text-base font-extrabold text-emerald-400 block">
                {segments.lga}
              </span>
              <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
                LGA Code
              </span>
              <span className="text-[8px] text-slate-400 truncate block">
                (01-99)
              </span>
            </div>

            {/* Segment 3: District */}
            <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-2">
              <span className="text-sm sm:text-base font-extrabold text-emerald-400 block">
                {segments.district}
              </span>
              <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
                District
              </span>
              <span className="text-[8px] text-slate-400 truncate block">
                Alphanum
              </span>
            </div>

            {/* Segment 4: Area */}
            <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-2">
              <span className="text-sm sm:text-base font-extrabold text-emerald-400 block">
                {segments.area}
              </span>
              <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
                Street Area
              </span>
              <span className="text-[8px] text-slate-400 truncate block">
                Grid Sector
              </span>
            </div>

            {/* Segment 5: Unit */}
            <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-2">
              <span className="text-sm sm:text-base font-extrabold text-emerald-400 block">
                {segments.unit}
              </span>
              <span className="text-[9px] text-slate-400 uppercase tracking-wider block">
                Building Unit
              </span>
              <span className="text-[8px] text-slate-400 truncate block">
                (01-99)
              </span>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 leading-tight">
            * Segments 2 (LGA) & 5 (Building Unit) are strictly non-zero (01-99). Any code with '00' is automatically discarded by the bot filter.
          </p>
        </div>

        {/* Address & Geographic Hierarchy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Physical Address Details */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              Verified House & Locality:
            </span>

            <p className="font-bold text-sm text-white leading-snug">
              {addressData.recent_house_address.recent}
            </p>

            <div className="text-xs text-slate-300 space-y-1 pt-1 border-t border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">LGA / Locality:</span>
                <span className="font-medium text-slate-200">
                  {addressData.administrative_address.lga_name} / {addressData.administrative_address.locality_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Geo Zone:</span>
                <span className="font-medium text-slate-200">
                  {addressData.administrative_address.zone}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Building Classification:</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase ${
                    isCommercial
                      ? 'bg-purple-950 text-purple-300 border border-purple-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {addressData.building_use_status}
                  {isCommercial && ' (₦200 commercial discount applied)'}
                </span>
              </div>
            </div>
          </div>

          {/* Customer & Unit Landmark Notes */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-400" />
              Customer Drop-off Instructions:
            </span>

            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                Apartment / Landmark Note:
              </span>
              <p className="text-xs font-semibold text-emerald-300 mt-0.5">
                {unitNote}
              </p>
            </div>

            <div className="text-xs text-slate-300 space-y-1.5 pt-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Customer Phone:</span>
                <a
                  href={`tel:${customerPhone}`}
                  className="font-mono text-xs font-semibold text-white bg-slate-800 px-2 py-0.5 rounded hover:bg-slate-700 transition-colors"
                >
                  {customerPhone}
                </a>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">GPS Coordinates:</span>
                <span className="font-mono text-[11px] text-slate-300">
                  {addressData.coordinates.lat.toFixed(4)}°N, {addressData.coordinates.lng.toFixed(4)}°E
                </span>
              </div>
              <div className="pt-1">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs py-1.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Open Delivery Destination in Google Maps</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Fleet Rider Assignment & Fee Breakdown */}
        <div className="bg-gradient-to-r from-emerald-950/60 to-slate-950 border border-emerald-900/60 rounded-2xl p-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold block">
                ASSIGNED ZONE RIDER
              </span>
              <h4 className="text-sm font-bold text-white">
                {rider.name}
              </h4>
              <p className="text-xs text-slate-400">
                Bike Plate: <span className="font-mono text-slate-200 font-semibold">{rider.bike}</span> • Hotline: {rider.phone}
              </p>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6 w-full sm:w-auto flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-medium block">
                Calculated Delivery Fee
              </span>
              <span className="text-xl font-extrabold text-emerald-400">
                ₦{dispatchFee.toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              (Zone base ₦{rider.baseFee.toLocaleString()} {isCommercial ? '- ₦200 commercial discount' : ''})
            </span>
          </div>
        </div>

        {/* Copy-Ready WhatsApp Rider Dispatch Note */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              Automated Rider Dispatch Note (WhatsApp Ready):
            </span>
            <div className="flex items-center gap-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(riderForwardText)}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] bg-emerald-950 border border-emerald-700/60 hover:bg-emerald-900 text-emerald-300 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
              >
                <span>Send via WhatsApp</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={() => onCopyRiderNote(ticket)}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-white font-medium px-2.5 py-1 rounded-lg flex items-center gap-1 border border-slate-700 transition-colors"
              >
                {copiedTicketId === ticketId ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <pre className="bg-slate-900/90 text-emerald-200/90 p-3 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto border border-slate-800 whitespace-pre-wrap select-all">
            {riderForwardText}
          </pre>
        </div>
      </div>
    </div>
  );
}
