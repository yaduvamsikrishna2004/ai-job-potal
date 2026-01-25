import { useState, useRef } from "react";
import { apiFetch } from "../../utils/api";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { sender: "user", text: input }]);
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/chatbot/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: data.reply || "Sorry, I didn't get that." },
      ]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: "Sorry, the chatbot is unavailable right now." },
      ]);
      setError("Chatbot unavailable");
    }
    setInput("");
    setLoading(false);
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 max-w-full">
      <div className="bg-white rounded-xl shadow-xl border flex flex-col h-96">
        <div className="p-3 border-b font-bold text-blue-700 flex items-center">
          <span className="mr-2">🤖</span> Candidate Chatbot
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`text-sm px-3 py-2 rounded-lg max-w-[80%] ${
                msg.sender === "bot"
                  ? "bg-blue-100 text-blue-900 self-start"
                  : "bg-green-100 text-green-900 self-end"
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form
          className="flex border-t"
          onSubmit={(e) => {
            e.preventDefault();
            if (!loading) sendMessage();
          }}
        >
          <input
            className="flex-1 p-2 rounded-bl-xl outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            disabled={loading}
            autoFocus
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-br-xl disabled:bg-gray-300"
            disabled={loading || !input.trim()}
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
        {error && (
          <div className="text-xs text-red-500 px-3 pb-2">{error}</div>
        )}
      </div>
    </div>
  );
}
