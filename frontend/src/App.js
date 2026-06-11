import { useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;

    // Add user message
    setChat((prev) => [
      ...prev,
      {
        sender: "user",
        text: userMessage,
      },
    ]);

    setMessage("");

    try {
      const res = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userMessage,
        }),
      });

      const data = await res.json();

      console.log("API Response:", data);

      // Add AI response
      setChat((prev) => [
        ...prev,
        {
          sender: "ai",
          text: data.response,
        },
      ]);
    } catch (error) {
      console.error(error);

      setChat((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Error connecting to AI backend",
        },
      ]);
    }
  };

  return (
    <div className="app">
      <h1>Sharanya AI Coding Mentor</h1>

      <div className="chat-box">
        {chat.map((msg, index) => (
          <div key={index} className={msg.sender}>
            {msg.sender === "ai" ? (
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            ) : (
              msg.text
            )}
          </div>
        ))}
      </div>

      <div className="input-box">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask coding question..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;