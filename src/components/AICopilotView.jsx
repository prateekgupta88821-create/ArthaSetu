import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { useUser } from '../context/UserContext';
import { Bot, Send, User, Sparkles, HelpCircle } from 'lucide-react';

export default function AICopilotView() {
  const { copilotInitialQuery, setCopilotInitialQuery } = useUser();
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! I'm your **GigWealth AI Copilot**. I have access to your exact income, expenses, and savings metrics. Ask me any question like *'Can I afford a new phone?'* or *'How much should I save this month?'*",
      source: 'GigWealth Financial Intelligence'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const presets = [
    "Can I afford this phone?",
    "How much should I save this month?",
    "Should I save first or invest?",
    "Which vehicle costs less for my usage?",
    "What is my average monthly income?",
    "What are my essential expenses?",
    "How much am I spending on fuel?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (copilotInitialQuery) {
      handleSend(copilotInitialQuery);
      setCopilotInitialQuery('');
    }
  }, [copilotInitialQuery]);

  const handleSend = async (queryText) => {
    const q = (queryText || input).trim();
    if (!q) return;

    const userMsg = { sender: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.askCopilot(q);
      const botMsg = {
        sender: 'bot',
        text: res.answer,
        source: res.source
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Copilot error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: "Sorry, I had trouble analyzing your metrics. Please try again.", source: "Error" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Bot className="w-5 h-5 text-emerald-400" />
            <span>AI Financial Copilot</span>
          </h2>
          <p className="text-xs text-gray-400">
            Answers natural-language financial questions grounded strictly in your pre-calculated database metrics.
          </p>
        </div>
      </div>

      {/* Preset Prompt Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {presets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(preset)}
            className="px-3 py-1.5 rounded-xl bg-gray-900 hover:bg-gray-800 border border-gray-800 text-[11px] text-emerald-300 font-medium whitespace-nowrap transition"
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="glass-panel p-4 rounded-2xl min-h-[420px] max-h-[500px] overflow-y-auto space-y-4 flex flex-col border border-gray-800">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'bot' && (
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-emerald-400" />
              </div>
            )}

            <div className={`max-w-xl rounded-2xl p-4 text-xs space-y-1.5 ${
              m.sender === 'user'
                ? 'bg-emerald-600 text-white rounded-br-none font-medium'
                : 'bg-gray-900 border border-gray-800 text-gray-200 rounded-bl-none leading-relaxed'
            }`}>
              <div className="whitespace-pre-line">{m.text}</div>
              {m.source && (
                <div className="text-[10px] text-gray-400 pt-1 border-t border-gray-800/80 flex items-center justify-between">
                  <span>Source: {m.source}</span>
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                </div>
              )}
            </div>

            {m.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-gray-800 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-gray-300" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-gray-400 p-2">
            <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
            <span>Analyzing your financial profile...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center space-x-2"
      >
        <input
          type="text"
          placeholder="Ask AI e.g. 'Can I afford an EV scooter right now?'..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-3 rounded-2xl bg-gray-900 border border-gray-800 text-xs text-white focus:outline-none focus:border-emerald-500 shadow-inner"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs transition flex items-center space-x-1.5 shadow-md shadow-emerald-600/20"
        >
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </form>

    </div>
  );
}
