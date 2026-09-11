import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "/api";

function App() {
  const [status, setStatus] = useState("");
  const [history, setHistory] = useState([]);

  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // -----------------------------
  // Check Backend
  // -----------------------------
  const checkBackend = async () => {
    try {
      const response = await fetch(`${API_URL}/check`);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      console.log("Backend response:", data);

      setStatus(data.status);
    } catch (error) {
      console.error("Backend connection failed:", error);

      setStatus("Backend connection failed");
    }
  };

  // -----------------------------
  // Get History
  // -----------------------------
  const getHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/history`);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      console.log("History response:", data);

      setHistory(data.history);
    } catch (error) {
      console.error("Failed to get history:", error);
    }
  };

  // -----------------------------
  // Send Chat Message
  // -----------------------------
  const sendMessage = async () => {
    const userQuestion = question.trim();

    if (!userQuestion || loading) {
      return;
    }

    // Immediately add user's message to UI
    setMessages((previousMessages) => [
      ...previousMessages,
      {
        role: "user",
        content: userQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userQuestion,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      console.log("LLM response:", data);

      // Add assistant response to UI
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "assistant",
          content: data.answer,
        },
      ]);
    } catch (error) {
      console.error("Chat request failed:", error);

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't connect to the server. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Enter / Shift + Enter
  // -----------------------------
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  // -----------------------------
  // Auto Scroll
  // -----------------------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  return (
    <div className="app">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">✦</div>

          <div>
            <h1>Day Planner</h1>
            <span>AI Personal Assistant</span>
          </div>
        </div>

        <button
          className="new-chat-button"
          onClick={() => {
            setMessages([]);
            setQuestion("");
          }}
        >
          <span>＋</span>
          New Chat
        </button>

        <div className="sidebar-section">
          <div className="section-title">
            CONVERSATION
          </div>

          <div className="conversation-preview">
            <div className="conversation-icon">
              ✦
            </div>

            <div>
              <strong>Current Chat</strong>
              <span>
                {messages.length === 0
                  ? "Start a conversation"
                  : `${messages.length} messages`}
              </span>
            </div>
          </div>
        </div>

        <div className="sidebar-bottom">

          <div className="connection-status">
            <span
              className={
                status === "ok"
                  ? "status-dot online"
                  : "status-dot"
              }
            />

            <span>
              {status === "ok"
                ? "AI system online"
                : "AI system"}
            </span>
          </div>

          <button
            className="check-button"
            onClick={checkBackend}
          >
            Check connection
          </button>

        </div>
      </aside>


      {/* ================= MAIN CHAT ================= */}

      <main className="main">

        {/* Header */}

        <header className="chat-header">

          <div className="header-info">

            <div className="assistant-avatar">
              ✦
            </div>

            <div>
              <h2>Day Planner</h2>

              <div className="online-text">
                <span />
                Online · Gemma 3
              </div>
            </div>

          </div>

          <button
            className="history-button"
            onClick={getHistory}
          >
            History
          </button>

        </header>


        {/* ================= MESSAGES ================= */}

        <section className="chat-area">

          {messages.length === 0 ? (

            <div className="welcome-screen">

              <div className="welcome-icon">
                ✦
              </div>

              <h2>
                How can I help you today?
              </h2>

              <p>
                I can help you plan your day,
                organize tasks, and manage your
                schedule.
              </p>

              <div className="suggestions">

                <button
                  onClick={() =>
                    setQuestion("Help me plan my day")
                  }
                >
                  <span>📅</span>
                  <div>
                    <strong>Plan my day</strong>
                    <small>
                      Create a productive schedule
                    </small>
                  </div>
                </button>

                <button
                  onClick={() =>
                    setQuestion(
                      "Help me prioritize my tasks"
                    )
                  }
                >
                  <span>🎯</span>
                  <div>
                    <strong>Prioritize tasks</strong>
                    <small>
                      Decide what to do first
                    </small>
                  </div>
                </button>

                <button
                  onClick={() =>
                    setQuestion(
                      "Help me create a productive schedule"
                    )
                  }
                >
                  <span>⚡</span>
                  <div>
                    <strong>Create a schedule</strong>
                    <small>
                      Organize your available time
                    </small>
                  </div>
                </button>

              </div>

            </div>

          ) : (

            <div className="messages-container">

              {messages.map((message, index) => (

                <div
                  key={index}
                  className={`message-row ${message.role}`}
                >

                  {/* Avatar */}

                  <div
                    className={`message-avatar ${message.role}`}
                  >
                    {message.role === "user"
                      ? "You"
                      : "✦"}
                  </div>


                  {/* Message */}

                  <div className="message-wrapper">

                    <div className="message-header">

                      <span className="message-name">
                        {message.role === "user"
                          ? "You"
                          : "Day Planner"}
                      </span>

                    </div>

                    <div className="message-bubble">

                      {message.role === "assistant" ? (

                        <ReactMarkdown>
                          {message.content}
                        </ReactMarkdown>

                      ) : (

                        <p>
                          {message.content}
                        </p>

                      )}

                    </div>

                  </div>

                </div>

              ))}


              {/* Typing indicator */}

              {loading && (

                <div className="message-row assistant">

                  <div className="message-avatar assistant">
                    ✦
                  </div>

                  <div className="message-wrapper">

                    <div className="message-header">
                      <span className="message-name">
                        Day Planner
                      </span>
                    </div>

                    <div className="message-bubble typing-bubble">

                      <div className="typing">
                        <span />
                        <span />
                        <span />
                      </div>

                    </div>

                  </div>

                </div>

              )}

              <div ref={messagesEndRef} />

            </div>

          )}

        </section>


        {/* ================= INPUT ================= */}

        <div className="input-section">

          <div className="input-container">

            <textarea
              ref={textareaRef}
              value={question}
              onChange={(event) =>
                setQuestion(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Message Day Planner..."
              rows="1"
              disabled={loading}
            />

            <button
              className="send-button"
              onClick={sendMessage}
              disabled={
                !question.trim() || loading
              }
            >
              ↑
            </button>

          </div>

          <div className="input-footer">
            <span>
              Enter to send
            </span>

            <span>
              Shift + Enter for new line
            </span>
          </div>

        </div>

      </main>

    </div>
  );
}

export default App;