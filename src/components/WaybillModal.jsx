import React from 'react';
import { X, Printer, ShieldCheck, QrCode } from 'lucide-react';

export default function WaybillModal({ ticket, onClose }) {
  if (!ticket) return null;

  const handlePrint = () => {
    window.print();
  };

  const {
    ticketId,
    timestamp,
    canonical,
    clusterKey,
    addressData,
    customerPhone,
    unitNote,
    rider,
    dispatchFee,
    sourceMode,
  } = ticket;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm print:p-0 print:bg-white">
      {/* Modal Card */}
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col border border-slate-200 print:border-none print:shadow-none print:w-full print:max-w-none">
        {/* Modal Controls (Hidden in print) */}
        <div className="bg-slate-100 px-4 py-2 flex items-center justify-between border-b border-slate-200 print:hidden">
          <span className="text-xs font-semibold text-slate-700">
            Thermal Waybill Slip Preview (80mm)
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Receipt */}
        <div className="p-6 font-mono text-xs space-y-4 print:p-8">
          {/* Header */}
          <div className="text-center border-b-2 border-dashed border-slate-400 pb-3">
            <h2 className="font-extrabold text-base tracking-tight text-slate-950 font-sans">
              NIGERIAN POSTAL SERVICE
            </h2>
            <p className="text-[10px] text-slate-600 font-sans">
              NIPOST DIGITAL ADDRESSING DISPATCH TICKET
            </p>
            <p className="text-[9px] text-slate-500 mt-0.5">
              Level 3 Verified Delivery Waybill
            </p>

            {/* Barcode Mock */}
            <div className="my-2.5 flex justify-center">
              <div className="flex items-center gap-[2px] h-9">
                {[4, 2, 5, 1, 3, 6, 2, 4, 1, 5, 2, 6, 3, 2, 5, 1, 4, 2, 6, 3, 1, 4].map(
                  (w, i) => (
                    <div
                      key={i}
                      className="bg-black h-full"
                      style={{ width: `${w}px` }}
                    />
                  )
                )}
              </div>
            </div>

            <div className="font-bold text-sm tracking-widest text-slate-900">
              {ticketId}
            </div>
            <div className="text-[9px] text-slate-500">
              Issued: {timestamp} • {sourceMode === 'live_api' ? 'LIVE-API' : 'SANDBOX-VERIFIED'}
            </div>
          </div>

          {/* Postcode & Cluster */}
          <div className="space-y-1 bg-slate-50 p-2.5 rounded border border-slate-200">
            <div className="flex justify-between font-bold text-slate-900">
              <span>NIPOST POSTCODE:</span>
              <span className="text-emerald-700">{canonical}</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-600">
              <span>CLUSTER ZONE:</span>
              <span>{clusterKey}</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-600">
              <span>PROPERTY USE:</span>
              <span className="uppercase">{addressData.building_use_status}</span>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">
              DELIVERY DESTINATION:
            </span>
            <p className="font-bold text-slate-950 text-xs leading-snug">
              {addressData.recent_house_address.recent}
            </p>
            <p className="text-[11px] text-slate-600">
              {addressData.administrative_address.locality_name},{' '}
              {addressData.administrative_address.lga_name} LGA,{' '}
              {addressData.administrative_address.state_name}
            </p>
            <div className="bg-amber-50 border border-amber-200 p-1.5 rounded text-[10px] text-amber-900 mt-1">
              <strong>Unit / Note:</strong> {unitNote}
            </div>
          </div>

          {/* Customer & Rider Info */}
          <div className="border-t border-b border-dashed border-slate-400 py-2.5 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-600">Customer Phone:</span>
              <span className="font-bold text-slate-900">{customerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Assigned Rider:</span>
              <span className="font-bold text-slate-900">{rider.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Motorcycle Plate:</span>
              <span className="font-bold text-slate-900">{rider.bike}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Rider Contact:</span>
              <span className="text-slate-900">{rider.phone}</span>
            </div>
          </div>

          {/* Delivery Fee */}
          <div className="flex justify-between items-center text-sm font-bold bg-slate-100 p-2 rounded">
            <span>DELIVERY FEE:</span>
            <span className="text-base text-emerald-800">
              NGN {dispatchFee.toLocaleString()}
            </span>
          </div>

          {/* Signatures */}
          <div className="pt-2 grid grid-cols-2 gap-4 text-[9px] text-slate-500">
            <div className="border-t border-slate-400 pt-1 text-center">
              <span>Merchant / Sender Sign</span>
            </div>
            <div className="border-t border-slate-400 pt-1 text-center">
              <span>Recipient Sign & Date</span>
            </div>
          </div>

          <div className="text-center text-[8px] text-slate-400 pt-1">
            * Generated via NIPOST WhatsApp Automated Dispatch Engine *
          </div>
        </div>
      </div>
    </div>
  );
}
