import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../../utils/api";

export default function RecruiterChatbot({ onClose }) {
  const STORAGE_KEY = "chatbot_history_recruiter";
  const initialMessages = [
    { sender: "bot", text: "Hi! Need hiring or screening tips?" },
  ];
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialMessages;
    } catch {
      return initialMessages;
    }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const nextMessages = [...messages, { sender: "user", text: input }];
    setMessages(nextMessages);
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/chatbot/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, role: "recruiter", history: nextMessages }),
      });
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: data.reply || data.response || "Sorry, I didn't get that." },
      ]);
    } catch (err) {
      const msg =
        err?.message || "Sorry, the chatbot is unavailable right now.";
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: msg },
      ]);
      setError(msg);
    }
    setInput("");
    setLoading(false);
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const clearChat = () => {
    setMessages(initialMessages);
    setError("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 max-w-full">
      <div className="panel flex flex-col h-[26rem] overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-purple-50/60 via-transparent to-fuchsia-50/60" />
        <div className="px-4 py-3 border-b border-slate-200/70 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white font-semibold flex items-center justify-between relative">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
              AI
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">Recruiter Assistant</div>
              <div className="text-[11px] text-white/80">Online</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="text-xs text-white/80 hover:text-white"
              onClick={clearChat}
              type="button"
            >
              Clear
            </button>
            {onClose && (
              <button
                className="text-xs text-white/80 hover:text-white"
                onClick={onClose}
                type="button"
                aria-label="Close Chatbot"
              >
                Close
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-white/70 relative">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`text-sm px-3 py-2 rounded-2xl max-w-[85%] shadow-sm ${
                msg.sender === "bot"
                  ? "bg-purple-50 text-slate-800 self-start border border-purple-100"
                  : "bg-fuchsia-50 text-slate-800 self-end border border-fuchsia-100"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && (
            <div className="text-xs text-gray-500">Assistant is typing...</div>
          )}
          <div ref={chatEndRef} />
        </div>
        <form
          className="flex border-t border-slate-200/70 bg-white/80"
          onSubmit={(e) => {
            e.preventDefault();
            if (!loading) sendMessage();
          }}
        >
          <input
            className="flex-1 p-3 rounded-bl-xl outline-none bg-white/80 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about hiring, screening..."
            disabled={loading}
            autoFocus
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white rounded-br-xl disabled:bg-gray-300 text-sm font-semibold"
            disabled={loading || !input.trim()}
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
        {error && (
          <div className="text-[11px] text-red-500 px-3 pb-2">{error}</div>
        )}
      </div>
    </div>
  );
}
