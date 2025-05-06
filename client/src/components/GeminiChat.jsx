import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaPaperPlane, FaRobot, FaTimes } from "react-icons/fa";

export default function GimniChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await axios.post("http://localhost:3000/api/ai", {
        message: input,
      });

      const botReply = { text: response.data.reply, sender: "bot" };
      setMessages((prev) => [...prev, botReply]);
      setError(null);
    } catch (err) {
      console.error("Error:", err);
      setError("⚠️ Failed to fetch response.");
    }

    inputRef.current?.focus();
  };

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end z-50">
      {/* Toggle Button */}
      <button
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaRobot />}
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div className="w-80 mt-2 bg-white rounded-lg shadow-lg flex flex-col max-h-[400px]">
          {/* Header */}
          <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center rounded-t-lg">
            <span className="font-semibold">BrickBot</span>
            <FaTimes
              className="cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-gray-100 p-3 space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 max-w-[75%] rounded-md ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white self-end ml-auto"
                    : "bg-gray-300 text-black self-start mr-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={chatRef}></div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-500 text-center text-sm mt-1">{error}</div>
          )}

          {/* Input */}
          <div className="flex p-2 border-t">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask me something..."
              className="flex-1 border rounded-md px-2 py-1 text-sm focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="bg-blue-600 text-white px-3 py-1 ml-2 rounded-md hover:bg-blue-700"
              onClick={sendMessage}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
