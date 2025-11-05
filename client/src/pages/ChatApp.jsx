import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { Send, Paperclip, Smile, Users, LogOut } from "lucide-react";

const socket = io("http://localhost:5000", {
  auth: { token: localStorage.getItem("token") },
});

export default function ChatApp({ user, setUser }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("general");
  const [typing, setTyping] = useState("");
  const [online, setOnline] = useState([]);
  const fileInput = useRef();

  useEffect(() => {
    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("typing", ({ username, isTyping }) => {
      setTyping(isTyping ? `${username} is typing...` : "");
    });

    socket.on("user-online", (user) => {
      setOnline((prev) => [...prev.filter(u => u.userId !== user.userId), user]);
    });

    socket.on("notification", (msg) => {
      setMessages((prev) => [...prev, { message: msg, type: "notification" }]);
    });

    socket.emit("join-room", room);

    return () => socket.off();
  }, [room]);

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit("send-message", { room, message });
    setMessage("");
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", { room, isTyping: e.target.value.length > 0 });
  };

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: form,
    });
    const { file: url } = await res.json();
    socket.emit("send-message", { room, message: file.name, type: "file", file: url });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-800 text-white p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">ChatApp</h1>
          <button onClick={() => { localStorage.clear(); setUser(null); }} className="text-sm">
            <LogOut size={20} />
          </button>
        </div>
        <p className="mb-2">Welcome, <strong>{user.username}</strong></p>
        <div className="space-y-2">
          {["general", "random", "tech"].map(r => (
            <button
              key={r}
              onClick={() => setRoom(r)}
              className={`block w-full text-left p-2 rounded ${room === r ? "bg-indigo-600" : "hover:bg-indigo-700"}`}
            >
              # {r}
            </button>
          ))}
        </div>
        <div className="mt-6">
          <h3 className="flex items-center gap-2 text-sm"><Users size={16} /> Online</h3>
          <div className="text-xs space-y-1 mt-2">
            {online.map(u => <div key={u.userId} className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div> {u.username}
            </div>)}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-sm p-4 border-b">
          <h2 className="text-lg font-semibold"># {room}</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === user.username ? "justify-end" : "justify-start"}`}
            >
              {msg.type === "notification" ? (
                <p className="text-xs text-gray-500 italic">{msg.message}</p>
              ) : msg.type === "file" ? (
                <a href={msg.file} target="_blank" className="bg-blue-100 p-3 rounded-lg flex items-center gap-2">
                  <Paperclip size={16} /> {msg.message}
                </a>
              ) : (
                <div className={`max-w-xs p-3 rounded-lg ${msg.sender === user.username ? "bg-indigo-600 text-white" : "bg-gray-200"}`}>
                  <p className="text-xs font-medium opacity-75">{msg.sender}</p>
                  <p>{msg.message}</p>
                  <p className="text-xs opacity-75">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                </div>
              )}
            </div>
          ))}
          {typing && <p className="text-sm text-gray-500 italic">{typing}</p>}
        </div>

        <div className="p-4 bg-white border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={handleTyping}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input type="file" ref={fileInput} onChange={uploadFile} className="hidden" />
            <button onClick={() => fileInput.current.click()} className="p-3 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Paperclip />
            </button>
            <button onClick={sendMessage} className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}