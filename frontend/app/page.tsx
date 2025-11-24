"use client"
import { useState, useRef, useEffect } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { FiSend, FiUpload, FiFileText, FiLoader } from "react-icons/fi";

export default function App() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi 👋 Upload a PDF to begin chatting!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // ===================== 📂 Upload PDF =====================
const handleFileUpload = async (file: File | null) => {
  if (!file) return;
  setUploading(true);
  setFileName(file.name);

  try {
    const formData = new FormData();
    formData.append("file", file); // ✅ must match upload.single("file")

    const res = await fetch(`${BACKEND_URL}/upload`, {
      method: "POST",
      body: formData, // ✅ no headers needed; browser sets boundary automatically
    });

    const data = await res.json();
    setMessages((prev) => [
      ...prev,
      {
        role: "bot",
        text: data.message || `✅ Uploaded "${file.name}" successfully!`,
      },
    ]);
  } catch (err) {
    console.error("Upload error:", err);
    setMessages((prev) => [
      ...prev,
      { role: "bot", text: "⚠️ Failed to upload file." },
    ]);
  } finally {
    setUploading(false);
  }
};


  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve: (value: string) => void, reject: (reason?: any) => void) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result.split(",")[1]);
        } else {
          reject(new Error('Failed to read file as data URL'));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  }

  // ===================== 💬 Chatbot Query =====================
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
 const res = await fetch(`${BACKEND_URL}/chat`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: userMsg.text }), // ✅ changed "question" → "message"
});

      const data = await res.json();
      console.log("Response data:", data);
      const botMsg = {
        role: "bot",
        text: data.reply || "Sorry, I couldn’t find that in the document.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Error connecting to server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Auto scroll to latest message
  useEffect(() => {
    virtuosoRef.current?.scrollToIndex({
      index: messages.length - 1,
      behavior: "smooth",
    });
  }, [messages.length]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Header */}
      <div className="p-4 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <FiFileText className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
               AI Chatbot
            </h1>
          </div>
          
          <label className="relative group">
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            />
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
              uploading 
                ? 'bg-purple-600/50' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'
            }`}>
              {uploading ? (
                <>
                  <FiLoader className="animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <FiUpload />
                  <span>{fileName || 'Upload PDF'}</span>
                </>
              )}
            </div>
            {fileName && !uploading && (
              <div className="absolute -bottom-8 right-0 bg-gray-800 text-xs text-gray-300 px-2 py-1 rounded whitespace-nowrap">
                {fileName}
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Message list (virtualized) */}
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYwMiIgZmlsbC1vcGFjaXR5PSIwLjA1Ij48cGF0aCBkPSJNMjggMjhINnYtNmgyMnY2ek02IDZoMjJ2Nkg2VjZ6bNiA4aDE2djZIMTJ2LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-5"></div>
        <Virtuoso
          ref={virtuosoRef}
          data={messages}
          itemContent={(index, message) => (
            <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} px-4 py-2`}>
              <div 
                className={`max-w-[80%] lg:max-w-[60%] rounded-2xl p-4 shadow-lg transition-all duration-300 transform hover:scale-[1.02] ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-none'
                    : 'bg-white/10 backdrop-blur-sm text-gray-100 rounded-bl-none'
                }`}
                style={{ 
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.6',
                  wordBreak: 'break-word',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              >
                <div className="flex items-center mb-1">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    message.role === 'user' ? 'bg-white/70' : 'bg-purple-400'
                  }`}></div>
                  <span className="text-xs font-medium opacity-70">
                    {message.role === 'user' ? 'You' : 'Assistant'}
                  </span>
                </div>
                <div className="text-sm">{message.text}</div>
              </div>
            </div>
          )}
          className="h-full px-2 py-4"
          followOutput
          initialTopMostItemIndex={messages.length - 1}
        />
      </div>

      {/* Input area */}
      <div className="p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-1 shadow-xl">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                placeholder={fileName ? "Ask about the document..." : "Upload a PDF to start chatting..."}
                disabled={loading || uploading}
                className="w-full bg-transparent border-0 focus:ring-0 text-white placeholder-gray-400 p-3 text-sm focus:outline-none"
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={loading || uploading || !input.trim()}
              className={`p-2 rounded-lg transition-all duration-200 ${
                loading || uploading || !input.trim()
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 transform hover:scale-105'
              }`}
              aria-label="Send message"
            >
              {loading ? (
                <FiLoader className="animate-spin w-5 h-5" />
              ) : (
                <FiSend className="w-5 h-5" />
              )}
            </button>
          </div>
          <div className="px-3 pb-1 text-xs text-gray-400 text-center">
            {fileName ? (
              <span className="inline-flex items-center">
                <FiFileText className="mr-1" /> {fileName}
              </span>
            ) : (
              'Upload a PDF to start chatting with your documents'
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
