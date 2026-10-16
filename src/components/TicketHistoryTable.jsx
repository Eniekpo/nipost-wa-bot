import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Printer, 
  Copy, 
  Check, 
  FileText, 
  Bike, 
  MapPin, 
  Calendar, 
  ArrowUpDown,
  Trash2
} from 'lucide-react';

export default function TicketHistoryTable({
  tickets,
  onSelectTicket,
  onOpenWaybillForTicket,
  onCopyRiderNote,
  copiedTicketId,
  onClearHistory,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchSearch =
        ticket.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.canonical.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.addressData.recent_house_address.recent
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        ticket.rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.customerPhone.includes(searchTerm);

      const matchState =
        stateFilter === 'ALL' ||
        ticket.addressData.administrative_address.state_name === stateFilter;

      return matchSearch && matchState;
    });
  }, [tickets, searchTerm, stateFilter]);

  const totalRevenue = useMemo(() => {
    return tickets.reduce((acc, curr) => acc + (curr.dispatchFee || 0), 0);
  }, [tickets]);

  const exportCsv = () => {
    if (tickets.length === 0) return;
    const headers = [
      'Ticket ID',
      'Timestamp',
      'Postcode',
      'Cluster Key',
      'Street Address',
      'LGA',
      'State',
      'Building Use',
      'Customer Phone',
      'Unit Note',
      'Assigned Rider',
      'Rider Bike',
      'Delivery Fee (NGN)',
    ];

    const rows = tickets.map((t) => [
      t.ticketId,
      t.timestamp,
      t.canonical,
      t.clusterKey,
      `"${t.addressData.recent_house_address.recent.replace(/"/g, '""')}"`,
      t.addressData.administrative_address.lga_name,
      t.addressData.administrative_address.state_name,
      t.addressData.building_use_status,
      t.customerPhone,
      `"${t.unitNote.replace(/"/g, '""')}"`,
      t.rider.name,
      t.rider.bike,
      t.dispatchFee,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nipost_dispatch_manifest_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col h-[720px]">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 shrink-0">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            Generated Dispatch Tickets
          </h2>
          <p className="text-xs text-slate-400">
            Real-time audit log of all automated WhatsApp dispatch tickets generated in this session.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            disabled={tickets.length === 0}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Export CSV Manifest
          </button>

          {tickets.length > 0 && (
            <button
              onClick={onClearHistory}
              className="p-1.5 bg-slate-800 hover:bg-rose-950/80 hover:text-rose-400 text-slate-400 rounded-xl border border-slate-700 transition-colors"
              title="Clear Ticket History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Ticket ID, postcode, street, rider, phone..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All States</option>
            <option value="LAGOS">Lagos</option>
            <option value="FCT">FCT Abuja</option>
            <option value="OGUN">Ogun</option>
            <option value="EKITI">Ekiti</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="flex-1 overflow-y-auto border border-slate-800 rounded-2xl bg-slate-950/60">
        {filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-500">
            <FileText className="w-10 h-10 mb-2 opacity-40 text-slate-400" />
            <p className="text-sm font-semibold text-slate-300">No tickets found</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              {tickets.length === 0
                ? 'Send orders in the WhatsApp phone simulator to generate automated tickets.'
                : 'Try adjusting your search query or state filters.'}
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 text-[10px] uppercase tracking-wider font-semibold sticky top-0 border-b border-slate-800">
              <tr>
                <th className="px-3.5 py-2.5">Ticket ID</th>
                <th className="px-3 py-2.5">Postcode</th>
                <th className="px-3 py-2.5">Verified Address</th>
                <th className="px-3 py-2.5">Rider & Bike</th>
                <th className="px-3 py-2.5 text-right">Fee</th>
                <th className="px-3 py-2.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTickets.map((t) => (
                <tr
                  key={t.ticketId}
                  className="hover:bg-slate-900/60 transition-colors group"
                >
                  <td className="px-3.5 py-3 font-mono font-bold text-emerald-400">
                    <div>{t.ticketId}</div>
                    <span className="text-[10px] text-slate-500 font-sans font-normal">
                      {t.timestamp}
                    </span>
                  </td>

                  <td className="px-3 py-3 font-mono">
                    <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-200">
                      {t.canonical}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Cluster: {t.clusterKey}
                    </div>
                  </td>

                  <td className="px-3 py-3 max-w-xs">
                    <p className="font-semibold text-white truncate">
                      {t.addressData.recent_house_address.recent}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {t.addressData.administrative_address.lga_name}, {t.addressData.administrative_address.state_name} • {t.unitNote}
                    </p>
                  </td>

                  <td className="px-3 py-3">
                    <div className="font-medium text-slate-200">
                      {t.rider.name}
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400">
                      {t.rider.bike}
                    </span>
                  </td>

                  <td className="px-3 py-3 text-right font-bold text-white">
                    ₦{t.dispatchFee.toLocaleString()}
                  </td>

                  <td className="px-3 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onSelectTicket(t)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 transition-colors"
                        title="View Full Ops Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onOpenWaybillForTicket(t)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Print Waybill POS Slip"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onCopyRiderNote(t)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Copy Rider Forward Text"
                      >
                        {copiedTicketId === t.ticketId ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary Footer */}
      <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 shrink-0">
        <div className="flex items-center gap-4">
          <span>
            Total Tickets: <strong className="text-white">{tickets.length}</strong>
          </span>
          <span>
            Filtered: <strong className="text-white">{filteredTickets.length}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span>Total Fleet Dispatch Value:</span>
          <span className="font-extrabold text-emerald-400 text-sm">
            ₦{totalRevenue.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
