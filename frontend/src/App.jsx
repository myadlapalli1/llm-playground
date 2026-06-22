import { useState } from "react";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [model_id, setId] = useState("");
  const [temp, setTemp] = useState("");
  const [max_tokens, setTokens] = useState("");
  const [top_P, setP] = useState("");
  const [per_model_overrides, setOverrides] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  function updateResponse() {
    return (
      <div style={styles.response}>
        {response}
      </div>
    );
  }

  const sendPrompt = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          system_prompt: prompt,
          model_ids: [model_id],
          params: {
            temperature:  parseFloat(temp),
            max_tokens:  parseInt(max_tokens, 10),
            top_p: parseFloat(top_P)
          },
          per_model_overrides: {per_model_overrides}
        }),
      });

      const data = await res.json();

      setResponse( //Grab nested text values inside response output
        Object.values(Object.values(data.responses)[0])[1]
      );

      console.log(data);

    } catch (error) {
      setResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>AI Chat</h1>

      <textarea
        style={styles.textarea}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask something..."
      />

      <textarea
        style={styles.textarea}
        value={model_id}
        onChange={(e) => setId(e.target.value)}
        placeholder="Model ID"
      />

      <textarea
        style={styles.textarea}
        value={temp}
        onChange={(e) => setTemp(e.target.value)}
        placeholder="Temp"
      />

      <textarea
        style={styles.textarea}
        value={max_tokens}
        onChange={(e) => setTokens(e.target.value)}
        placeholder="Max Tokens"
      />

      <textarea
        style={styles.textarea}
        value={top_P}
        onChange={(e) => setP(e.target.value)}
        placeholder="Set Top P"
      />

        <textarea
        style={styles.textarea}
        value={per_model_overrides}
        onChange={(e) => setOverrides(e.target.value)}
        placeholder="Overrides"
      />

      <button
        style={styles.button}
        onClick={sendPrompt}
        disabled={loading}
      >
        {loading ? "Loading..." : "Send"}
      </button>

      {updateResponse()}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  textarea: {
    width: "100%",
    height: "150px",
    padding: "10px",
    fontSize: "16px",
  },
  button: {
    marginTop: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
  response: {
    marginTop: "20px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    minHeight: "100px",
    whiteSpace: "pre-wrap",
  },
};