import { useState } from "react";
import Dropdown from "./assets/Components/dropdown";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [model_id, setId] = useState("");
  const [temp, setTemp] = useState("");
  const [max_tokens, setTokens] = useState("");
  const [top_P, setP] = useState("");
  const [per_model_overrides, setOverrides] = useState("");
  const [responses, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  let isStopped = false;
  const [models, setModels] = useState([]);

  const addModel = (modelId) => {
    if (models.includes(modelId)) {
      console.log("Duplicate id");
      return;
    }
    else {
      console.log(modelId);
    }
    setModels([...models, modelId]);
  };

  const formatModels = (modelList) => {
    var modelText = "";
    if (modelList.length != 0) {
      for (var i = 0; i < modelList.length; i++) {
        modelText += `${modelList[i]}\n`;      
      }
    }
    return modelText;
  }

  const clearModels = (modelList) => {
    setModels([]);
  }

  const sendPrompt = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse([]);

      console.log(models);
      try {

        console.log(prompt);
        console.log(models);
        console.log(temp);
        console.log(max_tokens);
        console.log(top_P);
        const res = await fetch("http://localhost:8000/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: prompt,
            system_prompt: prompt,
            model_ids: models,
            params: {
              temperature:  parseFloat(temp),
              max_tokens:  parseInt(max_tokens),
              top_p: parseFloat(top_P)
            },
            per_model_overrides: null
          }),
        });
        
        if (isStopped == false) {
          const data = await res.json();
        setResponse([responses => [...responses, Object.values(Object.values(data.responses)[0])[1]]])
          console.log(data);
          setLoading(false);
        }
        else {
          return;
        }

        //console.log(data);


      } catch (error) {
        setResponse(`Error: ${error.message}`);
        setLoading(false);
      } 
        
      
    };
    

  const cancelRequest = async () => {
    isStopped = true;
    setLoading(false);
  }

  return (
    <div style={styles.container}>
      <h1>LLM Compare</h1>

      <textarea
        style={styles.promptArea}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Prompt"
      />

            <textarea
        style={styles.paramArea}
        value={temp}
        onChange={(e) => setTemp(e.target.value)}
        placeholder="Temp"
      />

      <textarea
        style={styles.paramArea}
        value={max_tokens}
        onChange={(e) => setTokens(e.target.value)}
        placeholder="Max Tokens"
      />

      <textarea
        style={styles.paramArea}
        value={top_P}
        onChange={(e) => setP(e.target.value)}
        placeholder="Set Top P"
      />

        <textarea
        style={styles.paramArea}
        value={per_model_overrides}
        onChange={(e) => setOverrides(e.target.value)}
        placeholder="Overrides *optional*"
      /> 

            <Dropdown
      setModel={setId}
      updateId={addModel}
      />


            <div style={styles.selectedModels}>
        {formatModels(models)}
      </div>

                  <button
        style={styles.clearButton}
        onClick={clearModels}
        disabled={loading}
      >      
      Clear models
      </button>

            <div style={styles.response}>
        {responses}
      </div>


      <button
        style={styles.button}
        onClick={sendPrompt}
        disabled={loading}
      >
        {loading ? "Loading..." : "Send"}        
      </button> 
      
      <button
        style={styles.button}
        onClick={cancelRequest}
        disabled={loading}
      >      
      Cancel
      </button> 
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
  promptArea: {
    width: "800px",
    height: "150px",
    padding: "10px",
    fontSize: "16px",
  },
  paramArea: {
    display: "block",
    margin: "20px",
    width: "40%",
    height: "30px",
    fontSize: "16px",
  },
  button: {
    margin: "20px",
    padding: "15px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
    clearButton: {
    margin: "150px 0 0px auto",
    padding: "15px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
    selectedModels: {
    padding: "10px",
    margin: "-250px 0 10px auto",
    border: "1px solid #ffffff",
    borderRadius: "8px",
    minHeight: "100px",
    maxWidth: "300px",
    whiteSpace: "pre-wrap",
  },
  response: {
    marginTop: "20px",
    padding: "15px",
    border: "1px solid #ffffff",
    borderRadius: "8px",
    minHeight: "100px",
    whiteSpace: "pre-wrap",
  },
};