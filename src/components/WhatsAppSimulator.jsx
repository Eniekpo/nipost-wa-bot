import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  Phone, 
  Video, 
  CheckCheck, 
  RotateCcw,
  Sparkles,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  ArrowRight,
  User,
  Bike
} from 'lucide-react';
import { SAMPLE_CHAT_PRESETS, parseWhatsAppMessage } from '../services/whatsappBotService';

export default function WhatsAppSimulator({
  messages,
  isTyping,
  onSendMessage,
  onResetChat,
  onSelectTicket,
  onCopyRiderNote,
  copiedTicketId,
}) {
  const [inputText, setInputText] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const liveParsed = parseWhatsAppMessage(inputText);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isTyping) return;
    const textToSend = inputText;
    setInputText('');
    onSendMessage(textToSend);
  };

  const handlePresetClick = (presetText) => {
    setInputText(presetText);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Smartphone Chassis */}
      <div className="w-full bg-slate-900 border-4 border-slate-700/80 rounded-[42px] shadow-2xl overflow-hidden flex flex-col h-[720px] relative">
        {/* Dynamic Island / Speaker Notch */}
        <div className="h-7 bg-slate-950 flex items-center justify-between px-6 select-none shrink-0 border-b border-slate-800/40">
          <span className="text-[11px] font-semibold text-slate-300 font-mono">
            {currentTime || '10:45'}
          </span>
          <div className="w-20 h-4 bg-black rounded-full flex items-center justify-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80"></div>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-300 text-[10px]">
            <span>5G</span>
            <div className="w-3.5 h-2 border border-slate-400 rounded-sm p-0.5 flex items-center">
              <div className="w-full h-full bg-emerald-400 rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* WhatsApp Header */}
        <div className="bg-[#075E54] text-white px-3 py-2.5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center space-x-2.5">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                <span className="font-bold text-white text-sm tracking-wider">
                  NIPOST
                </span>
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#075E54] rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <h3 className="font-semibold text-sm leading-tight">
                  NIPOST Dispatch Bot
                </h3>
                <span className="bg-emerald-400/20 text-emerald-300 p-0.5 rounded-full" title="Verified Automated Service">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                </span>
              </div>
              <p className="text-[11px] text-emerald-100/80">
                {isTyping ? 'typing...' : 'automated dispatch ticket generator'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-emerald-100">
            <button
              onClick={() => alert('WhatsApp audio hotline is active for dispatch escalation.')}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
              title="Voice Call"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={onResetChat}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-emerald-200"
              title="Restart Demonstration Chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 wa-chat-bg">
          {/* Encryption Notice */}
          <div className="flex justify-center my-1">
            <span className="bg-slate-900/90 text-amber-300/80 text-[10px] px-3 py-1 rounded-lg border border-amber-500/20 text-center max-w-[280px] shadow-sm">
              🔒 Messages are processed in real-time by NIPOST Level 3 Verification Engine.
            </span>
          </div>

          {/* Messages */}
          {messages.map((msg) => {
            const isCustomer = msg.sender === 'customer';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-md relative ${
                    isCustomer
                      ? 'bg-[#005c4b] text-white rounded-tr-none'
                      : 'bg-slate-800/95 text-slate-100 border border-slate-700/60 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed font-sans">
                    {msg.text}
                  </p>

                  {/* Embedded Dispatch Ticket (If Generated) */}
                  {msg.ticket && (
                    <div className="mt-3 pt-2.5 border-t border-slate-700/60 space-y-2">
                      <div className="bg-slate-900/90 p-2.5 rounded-xl border border-emerald-500/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                            {msg.ticket.ticketId}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {msg.ticket.timestamp}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-300 space-y-1">
                          <p className="font-semibold text-white flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                            {msg.ticket.addressData.recent_house_address.recent}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Postcode: <span className="font-mono text-emerald-300">{msg.ticket.canonical}</span> ({msg.ticket.addressData.building_use_status})
                          </p>
                        </div>

                        {/* Rider Snapshot */}
                        <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800 flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Bike className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{msg.ticket.rider.name}</span>
                            <span className="text-slate-500">({msg.ticket.rider.bike})</span>
                          </div>
                          <span className="font-bold text-emerald-400">
                            ₦{msg.ticket.dispatchFee.toLocaleString()}
                          </span>
                        </div>

                        {/* Card Action Buttons */}
                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            onClick={() => onSelectTicket(msg.ticket)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-1 px-2 rounded-lg text-[10px] flex items-center justify-center gap-1 transition-colors"
                          >
                            <span>Inspect Dispatch</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => onCopyRiderNote(msg.ticket)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 py-1 px-2 rounded-lg text-[10px] flex items-center gap-1 border border-slate-700 transition-colors"
                            title="Copy rider dispatch note"
                          >
                            {copiedTicketId === msg.ticket.ticketId ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timestamp & Read Receipts */}
                  <div className="flex items-center justify-end space-x-1 mt-1 text-[9px] text-slate-300/70">
                    <span>{msg.time}</span>
                    {isCustomer && (
                      <CheckCheck className="w-3 h-3 text-cyan-400 inline" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start">
              <div className="bg-slate-800/90 text-slate-300 rounded-2xl rounded-tl-none px-4 py-2 text-xs flex items-center space-x-1 border border-slate-700/50">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
                <span className="text-[10px] text-slate-400 ml-1.5">Checking NIPOST registry...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Live Parsing HUD (Shows what bot senses while user is typing) */}
        {inputText.trim().length > 0 && (
          <div className="bg-slate-950/95 border-t border-slate-800 px-3 py-1.5 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-300">
            <span className="text-slate-500 font-medium">Extracting:</span>
            {liveParsed.rawPostcode ? (
              <span className="bg-emerald-950 border border-emerald-500/50 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                Code: {liveParsed.rawPostcode}
              </span>
            ) : (
              <span className="text-amber-400/80 bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-800/40">
                No 11-char code yet
              </span>
            )}
            {liveParsed.extractedPhone !== 'Not provided in chat' && (
              <span className="bg-blue-950 border border-blue-500/40 text-blue-300 px-1.5 py-0.5 rounded">
                Phone: {liveParsed.extractedPhone}
              </span>
            )}
            {liveParsed.extractedUnitNote !== 'Standard Main Entrance Drop-off' && (
              <span className="bg-purple-950 border border-purple-500/40 text-purple-300 px-1.5 py-0.5 rounded truncate max-w-[140px]">
                Unit: {liveParsed.extractedUnitNote}
              </span>
            )}
          </div>
        )}

        {/* Quick Demo Preset Chips */}
        <div className="bg-slate-900 border-t border-slate-800 px-2 py-1.5 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {SAMPLE_CHAT_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetClick(preset.text)}
              className="text-[10px] whitespace-nowrap bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2 py-1 rounded-md border border-slate-700 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="bg-slate-900 px-2.5 py-2 flex items-center space-x-2 shrink-0 border-t border-slate-800"
        >
          <div className="flex-1 bg-slate-950 border border-slate-700 rounded-full px-3.5 py-1.5 flex items-center space-x-2 focus-within:border-emerald-500 transition-colors">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste message or enter postcode..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              inputText.trim() && !isTyping
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>

      <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        <span>Try preset messages or type custom WhatsApp text with any NIPOST code.</span>
      </div>
    </div>
  );
}
