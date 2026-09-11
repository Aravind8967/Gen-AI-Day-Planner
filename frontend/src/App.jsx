import { useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";

const API_URL = "http://localhost:8000";

function App() {
  const [status, setStatus] = useState("");
  const [history, setHistory] = useState([]);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // this function is to check the backend service health check
  const checkBackend = async () => {
    try {
      const response = await fetch(`${API_URL}/check`);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      setStatus(data.status);

      console.log("Backend response:", data);
    } catch (error) {
      console.error("Backend connection failed:", error);

      setStatus("Backend connection failed");
    }
  };

  // Get the history from the application
  const getHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/history`);
      
      if (!response.ok) {
        throw new error (`HTTP error : ${response.status}`);
      }

      const data = await response.json();
      console.log("History response: ", data);
      setHistory(data.history);
    } catch (error) {
      console.error("Failed to get history : ", error);
    }
  };

  const sendMessage = async () => {
    if (!question.trim() || loading) {
      return
    }

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();
      console.log('ans : ', data);
      setAnswer(data.answer);
    } catch (error) {
      console.error("Chat request failed : ", error);

      setAnswer("Sorry, somthing went wrong while connecting to the backend")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Day Planner</h1>

      {/* To check the backend health */}
      <button onClick={checkBackend}>
        Check Backend
      </button>

      {status && (
        <p>
          Backend status: {status}
        </p>
      )}

      {/* To check the history */}
      <button onClick={getHistory}>
        history
      </button>

      <div>
        {history.map((message, index) => (
          <div key={index}>
            <p>
              <strong>{message.role}:</strong>
            </p>
            <p>{message.content}</p>
          </div>
        ))}
      </div>

      {/* Chat */}
      <h2>Chat with Day Planner</h2>

      <textarea
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        placeholder="Ask something..."
        rows="4"
      />

      <br />

      <button
        onClick={sendMessage}
        disabled={loading || !question.trim()}
      >
        {loading ? "Thinking..." : "Send"}
      </button>

      {/* LLM Answer */}
      {answer && (
        <div>
          <h3>Day Planner</h3>

          <ReactMarkdown>
            {answer}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default App;