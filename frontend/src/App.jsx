import { useState, useRef } from "react";
import Dropdown from "./assets/Components/dropdown";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [model_id, setId] = useState("");
  const [temp, setTemp] = useState("");
  const [max_tokens, setTokens] = useState("");
  const [top_P, setP] = useState("");
  const [per_model_overrides, setOverrides] = useState("");
  const [compTitle, setTitle] = useState("");
  const [compNotes, setNotes] = useState("");
  const [comparsionTxt, setComparisonTxt] = useState("");
  const [comparsionURL, setComparisonURL] = useState("");
  const [errorTxt, setError] = useState("");
  const [compErrorTxt, setCompError] = useState("");
  const [costTxt, setCostTxt] = useState("");
  const [requestID, setRequestId] = useState("");
  const [key, setKey] = useState("");
  const [allComparisons, setAllComparisons] = useState("");
  const [customEndpoint, setCustomEndpoint] = useState("");
  const [userModelTxt, setUserModelTxt] = useState("");
  const [prompts, setPrompts] = useState([]);
  const [responses, setResponse] = useState([]);
  const [allResponses, setAllResponses] = useState([]);
  const [usedIndexs, setUsedIndexs] = useState([]);
  const [newCosts, setNewCosts] = useState([]);
  const [displayTxt, setDisplayTxt] = useState("");
  const [isPublic, setIsPublic] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [viewParam, setParam] = useState(false);
  const [viewModels, setViewModels] = useState(false);
  const [viewCompare, setViewCompare] = useState(false);
  const [viewResponse, setViewResponse] = useState(false);
  const [viewAllComparison, setViewAllComparison] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generateURL, setGenerateURL] = useState(false);
  const [showInfo, editInfo] = useState(false);
  const [viewPrevComparisons, setViewPrevComparisons] = useState(false);
  const [viewCustomEndpoint, SetViewCustomEndpoint] = useState(false);
  const [models, setModels] = useState([]);
  const [customModels, setCustomModels] = useState([])
  const [costs, setCosts] = useState([]);
  const [modelNames, setModelNames] = useState([]);
  const [requestIDs, setRequestIDs] = useState([]);
  const [prevComparisons, setPrevComparisons] = useState([]);
  const [customEndpointNum, setCustomNum] = useState(0);
  const controllerRef = useRef(null);

  let modelResponses = "";
  let modelComparsion = "";

  const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "20px",
    padding: "20px",
    backgroundColor: "#16171d",
    minHeight: "100vh",
    color: "white",
  },

  mainColumn: {
    width: "800px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  paramColumn: {
    width: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  promptArea: {
    width: "100%",
    height: "150px",
    padding: "10px",
    fontSize: "16px",
    resize: "none",
    borderRadius: "15px",
  },

  paramArea: {
    width: "100%",
    height: "40px",
    padding: "5px",
    fontSize: "16px",
    borderRadius: "5px",
    resize: "none",
  },

  compareArea: {
    width: "80%",
    height: "8%",
    padding: "5px",
    fontSize: "16px",
    backgroundColor: "#ffffffdd",
    border: "2px solid #d2d2d2dd",
    borderRadius: "5px",
    resize: "none",
  },

  compareNotes: {
    width: "80%",
    height: "30%",
    padding: "5px",
    marginTop: "5%",
    fontSize: "16px",
backgroundColor: "#ffffffdd",
    border: "2px solid #d2d2d2dd",
    borderRadius: "5px",
    resize: "none",
  },

  buttonRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },

  button: {
    padding: "10px 15px",
    fontSize: "16px",
    borderRadius: "5px",
    backgroundColor: "#ffffffdd",
    border: "2px solid #d2d2d2dd",
    cursor: "pointer",
  },

  clearModels: {
    margin: "0px 50% 0px 25%",
    padding: "8px",
    fontSize: "14px",
    borderRadius: "4px",
    backgroundColor: "#ffffffdd",
    border: "2px solid #d2d2d2dd",
    cursor: "pointer",
  },

  backButton: {
    margin: "30px",
    padding: "10px 15px",
    fontSize: "16px",
    cursor: "pointer",
  },

  infoButton: {
    padding: "5px 10px",
    margin: "10px 360px -70px 0px",
    fontSize: "14px",
  },

  infoLabel: {
    marginTop: "70px",
    fontSize: "14px",
    borderRadius: "4px",
  },

  modelBackButton: {
    margin: "0px 50% 0px 25%",
    padding: "8px",
    fontSize: "14px",
    borderRadius: "5px",
    backgroundColor: "#ffffffdd",
    border: "2px solid #d2d2d2dd",
    cursor: "pointer",
  },

  compareBackButton: {
    display: "block",
    padding: "1% 8%",
    fontSize: "16px",
    borderRadius: "5px",
    margin: "0 auto",
    marginTop: "1%",
    backgroundColor: "#ffffffdd",
    border: "2px solid #d2d2d2dd",
    cursor: "pointer",
  },

  responseBackButton: {
    display: "block",
    padding: "1% 15%",
    fontSize: "16px",
    borderRadius: "5px",
    margin: "0 auto",
    marginTop: "10%",
    backgroundColor: "#ffffffdd",
    border: "2px solid #d2d2d2dd",
    cursor: "pointer",
  },

  selectedModels: {
    alignSelf: "center",
    border: "1px solid white",
    borderRadius: "8px",
    minHeight: "100px",
    width: "400px",
    whiteSpace: "pre-wrap",
  },

  response: {
    padding: "15px",
    width: "800px",
    height: "30%",
    minHeight: "100px",
    margin: "0 auto",
    alignSelf: "center",
    border: "1px solid white",
    borderRadius: "8px",
    whiteSpace: "pre-wrap",
  },

  responseButton: {
    display: "block",
    padding: "10px 15px",
    fontSize: "16px",
    margin: "0 auto 5%",
    borderRadius: "5px",
    backgroundColor: "#ffffffdd",
    border: "2px solid #d2d2d2dd",
    cursor: "pointer",
  },

  responseBg: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10%",
    gap: "10px",
    flexWrap: "wrap",
  },

  compareBg: {
    backgroundColor: "#ffffffdd",
  },

  viewCompareBtn: {
    padding: "1%",
    fontSize: "16px",
    margin: "0 40%",
    marginTop: "10px",
    borderRadius: "5px",
    backgroundColor: "#ffffffdd",
    border: "2px solid #d2d2d2dd",
    cursor: "pointer",
  },

  createCompareButton: {
    width: "80%", 
    height: "8%", 
    fontSize: "16px", 
    minHeight: "30px", 
    borderRadius: "5px", 
    marginTop: "3%",    
    backgroundColor: "#ffffffdd", 
    border: "2px solid #d2d2d2dd"
  },

  error: {
    color: "#ff8e8e",
  },

  cost: {
    color: "#c0f4c5",
  }
};
  /* =====================
     MODEL LOGIC
  ===================== */

  const addModel = (modelId) => {
    if (models.includes(modelId)) {
      return;
    }
    setModels([...models, modelId]);
  };

  const addModelName = (modelName) => {
    if (modelNames.includes(modelName)) {
      return;
    }

    setModelNames([...modelNames, modelName]);
  };

  const clearModels = () => {
    setModels([]);
    setModelNames([]);
  };


  const showResponse = (buttonIndex, responseList) => {
    let updatedCosts = costs;
    let updatedUsedIndexes = usedIndexs;

    // Only add the cost the first time this model is selected
    if (!usedIndexs.includes(buttonIndex)) {
      updatedCosts = [...costs, responseList[buttonIndex].cost_cents];
      updatedUsedIndexes = [...usedIndexs, buttonIndex];

      setCosts(updatedCosts);
      setNewCosts(updatedCosts);
      setUsedIndexs(updatedUsedIndexes);
    }

    // Display the selected model's response
    setDisplayTxt(
      responseList[buttonIndex].text +
        "\n\ncost: $" +
        String(responseList[buttonIndex].cost_cents).slice(0, 8) +
        "\ntokens out: " +
        String(responseList[buttonIndex].tokens_out).slice(0, 8) +
        "\nlatency ms: " +
        String(responseList[buttonIndex].latency_ms).slice(0, 8)
    );

    // Find the cheapest model selected so far
    if (updatedCosts.length > 0) {
      const minCost = Math.min(...updatedCosts);
      const cheapestIndex = updatedCosts.indexOf(minCost);

      setCostTxt(
        "Of selected models, " +
          responseList[cheapestIndex].model_id +
          " is the cheapest ($" +
          String(minCost).slice(0, 8) +
          ")"
      );
    } else {
      setCostTxt("");
    }
  };

  const listComparisons = async () => {
      const listComp = await fetch("http://localhost:8000/api/prevcompare", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
      });
      const prevCompData = await listComp.json();
      setAllComparisons(prevCompData);
  }

  const saveComparison = async () => {
        if (Boolean(isPublic) == false) {
          if ((key.trim()).length == 0) {
              setCompError("Enter a valid key");
              return
          }
          else if (key.trim().length < 5) {
            setCompError("Enter a key with 5 or more characters")
            return
          }
        }
        setCompError("");
        toggleURL();
        setComparisonURL("");
        const comp = await fetch("http://localhost:8000/api/comparisons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          request_id : String(requestID),
          title : String(compTitle),
          notes : String(compNotes),
          is_public : Boolean(isPublic),
          key: key
        }),
      });
      
      setKey("");
      const compData = await comp.json();
      setComparisonURL(compData.share_url + "/key-here")
      setPrevComparisons([...prevComparisons, compData.share_url + "/key-here"]);
      //setAllComparisons(prevComparisons);
  

    modelComparsion = {
      "comparison_id": "21a4e57a-a7bb-4e95-b3ac-44b6f78c62c4",
      "title": "Quantum Computing Comparison",
      "notes": "Comparing responses from two NVIDIA models.",
      "is_public": false,
      "request": {
        "prompt": "Explain quantum computing in simple terms.",
        "system_prompt": "You are a helpful assistant.",
        "model_ids": [
          "meta/llama-3.3-70b-instruct",
          "meta/llama-3.2-1b-instruct"
        ],
        "params": {
          "temperature": 0.7,
          "max_tokens": 200,
          "top_p": 0.9
        },
        "per_model_overrides": {}
      },
      "created_at": "2026-07-08T15:30:00Z",
      "share_url": "http://localhost:8000/api/comparisons/21a4e57a-a7bb-4e95-b3ac-44b6f78c62c4"
    };

    setComparisonTxt(
      "Title: " + modelComparsion.title +
      "\n\nnotes: " + modelComparsion.notes +
      "\nrrequest: " + modelComparsion.request +
      "\nmodels: " + modelComparsion.model_ids +
      "\nparameters: " + modelComparsion.params +
      "\nresponses: " + modelComparsion.responses
    );
  };
  

  const formatModels = (modelList) =>
    modelList.map((m) => `• ${m}`).join("\n");


  /* =====================
     API CALL
  ===================== */

  const sendPrompt = async () => {

    setLoading(true);
    setResponse([]);
    const controller = new AbortController();
    controllerRef.current = controller;

    if (prompt.trim() === "") {
      setLoading(false);
      setError("Prompt cannot be empty.");
      return;
    }
    else if (models.length === 0) {
      setLoading(false);
      setError("Select at least one model.");
      return;
    }
    else if (temp.trim() === "" || isNaN(temp) || temp < 0 || temp > 1) {
      setLoading(false);
      setError("Invalid temperature value, must be a number between 0 and 1 inclusive.");
      return;
    }
    else if (max_tokens.trim() === "" || isNaN(max_tokens) || max_tokens <= 0) {
      setLoading(false);
      setError("Invalid max tokens value, must be a positive number.");
      return;
    }
    else if (top_P.trim() === "" || isNaN(top_P) || top_P < 0 || top_P > 1) {
      setLoading(false);
      setError("Invalid top P value, must be a number between 0 and 1 inclusive.");
      return;
    }
    else if (per_model_overrides.trim() !== "") {
      try {
        JSON.parse(per_model_overrides);
      }
      catch (e) {
        setLoading(false);
        setError("Invalid JSON format in per model overrides.");
        return;
      }
    }

    setError("");
    setDisplayTxt("");
    setCostTxt("");
    try {
      // Pass the milliseconds directly into AbortSignal.timeout()
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        signal: AbortSignal.timeout(60000), // 60-second timeout
        body: JSON.stringify({
          prompt,
          system_prompt: prompt,
          model_ids: models,
          params: {
            temperature: parseFloat(temp),
            max_tokens: parseInt(max_tokens),
            top_p: parseFloat(top_P),
          },
          per_model_overrides: per_model_overrides
            ? JSON.parse(per_model_overrides)
            : {},
          }),
        });
      const data = await res.json();

      setRequestIDs([...requestIDs, data.request_id]);

      const responses = data.responses ?? [];
      setCosts([]);
      setNewCosts([]);
      setUsedIndexs([]);
      setAllResponses([...allResponses, data]);
      setPrompts([...prompts, prompt]);
      setResponse(responses);
      showResponse(0, responses);

    } catch (error) {
      if (error.name === 'AbortError') 
        {
        console.error("The requested timed out.");
        setResponse((prev) => [
          ...prev,
          `Error: ${"The request timed out."}`
        ]);
      }
      else if (error.name !== "AbortError") {
        setResponse((prev) => [
          ...prev,
          `Error: ${error.message}`
        ]);
      }
    } finally {
      setLoading(false);
      setViewResponse(true);
    }
  };

  const createCustomEndpoint = (customId) => {
    if (customEndpointNum < 5) {
    setModels([...models, customId])
    setCustomModels([...customModels, customId])
    setUserModelTxt([...userModelTxt, "\n" + customId + "\n"])
    setCustomNum(customEndpointNum + 1)

    }
    else {
      setError("5 custom endpoints max")
    }
  };

  const clearCustomEndpoints = () => {
    setModels(models.filter((modelId) => !customModels.includes(modelId)));
    setUserModelTxt("")
    setCustomModels([]);
    setCustomNum(0);

  }
  const cancelRequest = () => {
    controllerRef.current?.abort();
  };

  const toggleParams = () => {
    setParam((v) => !v);
  };

  const toggleModels = () => {
    setViewModels((v) => !v);
  };

  const toggleCompare = () => {
    setViewCompare((v) => !v);
  };

  const toggleInfo = () => {
    editInfo((v) => !v);
  };

  const toggleResponse = () => {
    setViewResponse((v) => !v);
  };

  const toggleSaving = () => {
    setIsSaving((v) => !v);
  };

  const toggleURL = () => {
    setGenerateURL((v) => !v);
  }

  const toggleEndpoint = () => {
    SetViewCustomEndpoint ((v) => !v);
  }

  const toggleViewComparisons = () => {
    prevComparisons.length > 0 ?? setViewPrevComparisons((v) => !v);
  }

  /* =====================
     UI
  ===================== */

  return (
    <div style={styles.container}>

      {viewParam && (
        <div style={styles.paramColumn}>
          <h2 align="center">Parameters</h2>

          <input
            style={styles.paramArea}
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
            placeholder="Temp"
          />

          <input
            style={styles.paramArea}
            value={max_tokens}
            onChange={(e) => setTokens(e.target.value)}
            placeholder="Max Tokens"
          />

          <input
            style={styles.paramArea}
            value={top_P}
            onChange={(e) => setP(e.target.value)}
            placeholder="Top P"
          />

          <textarea
            style={styles.paramArea}
            value={per_model_overrides}
            onChange={(e) => setOverrides(e.target.value)}
            placeholder={"Overrides *optional* (JSON format)"}
          />

          <button
            style={styles.infoButton}
            onClick={toggleInfo}
          >
            ⓘ
          </button>

          <label
            style={{
              ...styles.infoLabel,
              opacity: showInfo ? 1 : 0,
            }}
          >
            Input per model overrides in JSON format. For example: {"{\"meta/llama-3.3-70b-instruct\":{\"temperature\":0.9}}"}
          </label>

          <button
            style={styles.backButton}
            onClick={toggleParams}
          >
            Back
          </button>
        </div>
      )}


      {viewModels && (
        <div style={styles.mainColumn}>
          <h2 align="center">Models</h2>

          <div style={styles.selectedModels} align="center">
            {formatModels(modelNames)}
          </div>

          <button
            style={styles.clearModels}
            onClick={clearModels}
            disabled={models.length === 0}
          >
            Clear
          </button>

          <button
            style={styles.modelBackButton}
            onClick={toggleModels}
          >
            Back
          </button>

          <Dropdown
            setModel={setId}
            updateId={addModel}
            updateNames={addModelName}
          />

          <button style={styles.button} onClick={() => toggleEndpoint()}>
            Specify endpoint
          </button>
          
          {viewCustomEndpoint && (
          <>
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "#0d0d0d",
                opacity: 0.5,
                zIndex: 1000,
              }}
            />

            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "40%",
                height: "60%",
                background: "#2e2e2e",
                borderRadius: "8px",
                textAlign: "center",
                zIndex: 1001,   // higher than overlay
              }}
            >
              <input
                style={styles.paramArea}
                placeholder="Endpoint"
                value={customEndpoint}
                onChange={(e) => setCustomEndpoint(e.target.value)}
              />

              <button
                style={styles.button}
                onClick={() => createCustomEndpoint(customEndpoint)}
              >
                Create
              </button>

              <button
                style={styles.button}
                onClick={() => clearCustomEndpoints()}
              >
                Clear
              </button>

              <button
                style={styles.button}
                onClick={() => toggleEndpoint()}
              >
                Close
              </button>

              <label>
                {userModelTxt}
              </label>

              <label style={styles.error}>
                {errorTxt}
              </label>

            </div>
          </>
          )}

        </div>
      )}

      {viewCompare && (
        <div style={styles.mainColumn}>
          <h2 align="center">Comparison</h2>

          <button onClick={toggleSaving} style={styles.viewCompareBtn}>
            Create New
          </button>
          <button
            style={styles.compareBackButton}
            onClick={toggleCompare}
          >
            Back
          </button>
          <h3 align="center">{comparsionURL}</h3>
           <div style={styles.responseBg}>
        {generateURL && (
            <>
          <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            minHeight: "150px",
            height: "100%",
            opacity: "50%",
            background: "#0d0d0d",
            borderRadius: "8px",
            zIndex: 1000,
          }}
          />
          <div
            style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "40%",
            minHeight: "150px",
            height: "60%",
            background: "#2e2e2e",
            borderRadius: "8px",
            textAlign:"center",
            zIndex: 1000,
            }}
            >
          <h3 style={{margin: "10%"}}>Comparison Create
          </h3>

          <input
            style={styles.compareArea}
            value={compTitle}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />

          <input
            style={styles.compareArea}
            value={compTitle}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />

          <textarea
            style={styles.compareNotes}
            value={compNotes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes"
          />

            <textarea
            style={styles.compareArea}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Key"
          />

          <label
            style={{
              display: "block",
              marginTop: "5%",
            }}
          >
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            {" "}Public
          </label>
        <h3 style={styles.error}>
          {compErrorTxt}
        </h3>
        <button onClick={() => saveComparison()} style={styles.createCompareButton}> Create 
        </button>         
        <button  onClick={() => toggleURL()} style={styles.createCompareButton}> Close 
        </button>         
          </div>
        </>
        )}
            <button
              style={styles.button}
              onClick={() => {
                listComparisons();
              }}
            >
              Prev compare
            </button>

          {viewPrevComparisons && (
            <h3>
              {allComparisons}
            </h3>
          )}
          {isSaving && (
            <div>
              {requestIDs.length != 0 && (
              <h3 align="center" style={null}>
                Select a chat to create a comparison.
              </h3>
              )}
              {requestIDs.length == 0 && (
              <h3 align="center" style={styles.error}>
                No previous chats
              </h3>
              )}
              {requestIDs.map((id, index) => (
                <button align="center"
                  style={styles.responseButton}
                  key={id}
                  onClick={() => {toggleURL(); setRequestId(id)}
                  }
                >
                  {prompts[index].length > 30 ? prompts[index].slice(0, 30) + "..." : prompts[index]}
                </button>
              ))}
            </div>
          )}
            </div>
        </div>

      )}
        

      {viewResponse && (
        <div>

          <h2 align="center">Response</h2>
          <h4 align="center">Select a model ID to view its response</h4>
          <div>

            <div style={styles.responseBg}>
              {responses.map((model, index) => (
                <button
                  style={styles.responseButton}
                  key={model.model_id}
                  onClick={() => showResponse(index, responses)}
                >
                  {model.model_id}
                </button>
                
              ))}
            </div>
            
            <div
              style={styles.cost}
              align="center"
            >
              {costTxt}
            </div>


            <div
              style={{
                ...styles.response,
                opacity: responses.length === 0 ? 0 : 1
              }}
              align="center"
            >
              {displayTxt}
            </div>

          </div>


          <button
            style={styles.responseBackButton}
            onClick={toggleResponse}
            align="center"
          >
            Back
          </button>

        </div>
      )}


      {!viewParam &&
       !viewModels &&
       !viewCompare &&
       !viewResponse && (

        <div style={styles.mainColumn}>

          <h1 align="center">LLM Compare</h1>


          <textarea
            style={styles.promptArea}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Prompt"
          />


          <div style={styles.buttonRow}>

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
              disabled={!loading}
            >
              Cancel
            </button>


            <button
              style={styles.button}
              onClick={toggleParams}
            >
              Parameters
            </button>


            <button
              style={styles.button}
              onClick={toggleModels}
            >
              Models
            </button>


            <button
              style={styles.button}
              onClick={() => {
                toggleCompare();
              }}
            >
              Comparison
            </button>

          </div>


          <h4
            style={styles.error}
            align="center"
          >
            {errorTxt}
          </h4>

        </div>

      )}

    </div>
  );
};