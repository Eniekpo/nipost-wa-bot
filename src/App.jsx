import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import WhatsAppSimulator from './components/WhatsAppSimulator';
import TicketInspectionPanel from './components/TicketInspectionPanel';
import TicketHistoryTable from './components/TicketHistoryTable';
import PostcodeDecoderLab from './components/PostcodeDecoderLab';
import BulkManifestGenerator from './components/BulkManifestGenerator';
import WaybillModal from './components/WaybillModal';
import SettingsModal from './components/SettingsModal';
import { processCustomerWhatsAppOrder } from './services/whatsappBotService';
import { sound } from './utils/soundEffects';

const INITIAL_MESSAGES = [
  {
    id: 'msg-init-1',
    sender: 'bot',
    text: "👋 Welcome to NIPOST WhatsApp Automated Dispatch!\n\nSend your order details including your 11-character NIPOST building postcode (e.g. LA-11-W06-TC-10). Our system will automatically verify your address, calculate delivery fees, and assign a cluster zone rider.",
    time: '10:00 AM',
    ticket: null,
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('live');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [waybillTicket, setWaybillTicket] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('nipost_api_key') || '';
  });
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('nipost_sound_enabled');
    return saved !== null ? saved === 'true' : true;
  });
  const [copiedTicketId, setCopiedTicketId] = useState(null);

  useEffect(() => {
    sound.enabled = soundEnabled;
    localStorage.setItem('nipost_sound_enabled', String(soundEnabled));
  }, [soundEnabled]);

  const handleSaveApiKey = (newKey) => {
    setApiKey(newKey);
    localStorage.setItem('nipost_api_key', newKey);
  };

  const handleToggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const handleSendMessage = async (text) => {
    const timeNow = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMsgId = `msg-cust-${Date.now()}`;
    const newCustMsg = {
      id: userMsgId,
      sender: 'customer',
      text,
      time: timeNow,
      ticket: null,
    };

    setMessages((prev) => [...prev, newCustMsg]);
    sound.playSend();
    setIsTyping(true);

    try {
      const result = await processCustomerWhatsAppOrder(text, apiKey);

      setIsTyping(false);
      sound.playReceive();

      const botMsgId = `msg-bot-${Date.now()}`;
      const newBotMsg = {
        id: botMsgId,
        sender: 'bot',
        text: result.botReply,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        ticket: result.ticket,
      };

      setMessages((prev) => [...prev, newBotMsg]);

      if (result.ok && result.ticket) {
        sound.playSuccess();
        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#008751', '#10b981', '#34d399', '#f59e0b'],
          });
        } catch {
          // Silent catch
        }
        setActiveTicket(result.ticket);
        setTickets((prev) => [result.ticket, ...prev]);
      }
    } catch (err) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'bot',
          text: `⚠️ Error processing order: ${err.message}`,
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          ticket: null,
        },
      ]);
    }
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
  };

  const handleCopyRiderNote = (ticketToCopy) => {
    if (!ticketToCopy) return;
    navigator.clipboard.writeText(ticketToCopy.riderForwardText);
    setCopiedTicketId(ticketToCopy.ticketId);
    setTimeout(() => {
      setCopiedTicketId(null);
    }, 2000);
  };

  const handleQuickLoadDemo = (postcode) => {
    const demoPrompt = `Hello, please deliver goods to ${postcode}. Recipient phone: 08031234567, Flat 2B.`;
    handleSendMessage(demoPrompt);
  };

  const handleInjectToChat = (text) => {
    setActiveTab('live');
    handleSendMessage(text);
  };

  const handleAddTicketsToHistory = (newTickets) => {
    setTickets((prev) => [...newTickets, ...prev]);
    if (newTickets.length > 0) {
      setActiveTicket(newTickets[0]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        apiKey={apiKey}
        ticketsCount={tickets.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile Tab Selector (Visible on small screens) */}
        <div className="md:hidden flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-1 mb-5 text-xs">
          <button
            onClick={() => setActiveTab('live')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'live' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            Live Simulator
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'history' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            Tickets ({tickets.length})
          </button>
          <button
            onClick={() => setActiveTab('decoder')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'decoder' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            Decoder
          </button>
          <button
            onClick={() => setActiveTab('batch')}
            className={`flex-1 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'batch' ? 'bg-emerald-600 text-white' : 'text-slate-400'
            }`}
          >
            Bulk
          </button>
        </div>

        {/* Dual Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: WhatsApp Mobile Simulator */}
          <div
            className={`lg:col-span-5 ${
              activeTab !== 'live' ? 'hidden lg:block' : 'block'
            }`}
          >
            <WhatsAppSimulator
              messages={messages}
              isTyping={isTyping}
              onSendMessage={handleSendMessage}
              onResetChat={handleResetChat}
              onSelectTicket={(ticket) => {
                setActiveTicket(ticket);
                setActiveTab('live');
              }}
              onCopyRiderNote={handleCopyRiderNote}
              copiedTicketId={copiedTicketId}
            />
          </div>

          {/* Right Column: Operations / Inspector / Tabs */}
          <div
            className={`lg:col-span-7 ${
              activeTab === 'live' ? 'block' : 'col-span-12'
            }`}
          >
            {activeTab === 'live' && (
              <TicketInspectionPanel
                ticket={activeTicket}
                onOpenWaybill={() => setWaybillTicket(activeTicket)}
                onCopyRiderNote={handleCopyRiderNote}
                copiedTicketId={copiedTicketId}
                onQuickLoadDemo={handleQuickLoadDemo}
              />
            )}

            {activeTab === 'history' && (
              <TicketHistoryTable
                tickets={tickets}
                onSelectTicket={(ticket) => {
                  setActiveTicket(ticket);
                  setActiveTab('live');
                }}
                onOpenWaybillForTicket={(ticket) => setWaybillTicket(ticket)}
                onCopyRiderNote={handleCopyRiderNote}
                copiedTicketId={copiedTicketId}
                onClearHistory={() => setTickets([])}
              />
            )}

            {activeTab === 'decoder' && (
              <PostcodeDecoderLab onInjectToChat={handleInjectToChat} />
            )}

            {activeTab === 'batch' && (
              <BulkManifestGenerator
                apiKey={apiKey}
                onAddTicketsToHistory={handleAddTicketsToHistory}
              />
            )}
          </div>
        </div>
      </main>

      {/* Thermal Waybill Modal */}
      {waybillTicket && (
        <WaybillModal
          ticket={waybillTicket}
          onClose={() => setWaybillTicket(null)}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          apiKey={apiKey}
          onSaveApiKey={handleSaveApiKey}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}
