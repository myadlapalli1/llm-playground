import { useState, useRef } from "react"
import Dropdown from "./assets/Components/dropdown"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { MainPrompt } from "./components/ui/mainPrompt"
import { SideMenu } from "@/components/ui/sidemenu"


export default function App() {

  // Define render backend url
  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
  
  const [prompt, setPrompt] = useState("");
  const [model_id, setId] = useState("");
  const [systemPrompt, setSysPrompt] = useState("");
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
  const [secondTxt, setSecondTxt] = useState("");
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
  const [runRandom, setRunRandom] = useState(false);
  const [viewPrevComparisons, setViewPrevComparisons] = useState(false);
  const [viewCustomEndpoint, SetViewCustomEndpoint] = useState(false);
  const [viewQuickCompare, SetViewQuickCompare] = useState(false);
  const [darkMode, setDarkMode] = useState(true)
  const [transitioningToResponse, setTransitioningToResponse] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [models, setModels] = useState([]);
  const [customModels, setCustomModels] = useState([])
  const [costs, setCosts] = useState([]);
  const [modelNames, setModelNames] = useState([]);
  const [requestIDs, setRequestIDs] = useState([]);
  const [prevComparisons, setPrevComparisons] = useState([]);
  const [customEndpointNum, setCustomNum] = useState(0);
  const [quickCompareMode, setQuickCompareMode] = useState("responded");
  const [quickCompareAnimating, setQuickCompareAnimating] = useState(false);
  const [randomNum, setRandomNum] = useState(0);
  const [activeResponseIndex, setActiveResponseIndex] = useState(0);
  const controllerRef = useRef(null);

let modelResponses = "";
let modelComparsion = "";

if (runRandom === false) {
  const newRandomNum = Math.floor(Math.random() * 5) + 1

  setRandomNum(newRandomNum)

  // Select random text to display on the home screen
  if (newRandomNum === 1) {
    setSecondTxt("Welcome back!")
  }
  else if (newRandomNum === 2) {
    setSecondTxt("Hello there.")
  }
  else if (newRandomNum === 3) {
    setSecondTxt("What will you compare today?")
  }
  else if (newRandomNum === 4) {
    setSecondTxt("Ready when you are.")
  }
  else {
    setSecondTxt("How's it going?")
  }

  setRunRandom(true)
}

  const panelBg = darkMode ? "#212121" : "#ffffff"
  const panelBorder = darkMode ? "1px solid #252525" : "1px solid #d7dce5"
  const panelText = darkMode ? "#f5f7fb" : "#202020"
  const mutedText = darkMode ? "#b1b1b1" : "#4b5563"
  const fieldBg = darkMode ? "#4d4d4d" : "#ffffff"
  const fieldBorder = darkMode ? "1px solid #404040" : "1px solid #d7dce5"
  const overlayBg = darkMode ? "rgba(2, 2, 2, 0.7)" : "rgba(255, 255, 255, 0.82)"

  const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "20px",
    boxSizing: "border-box",
    width: "100%",
    padding: "32px 20px",
    paddingLeft: sidebarOpen ? "260px" : "84px",
    maxWidth: "100vw",
    overflowX: "hidden",
    minHeight: "100vh",
    backgroundColor: darkMode ? "#16171d" : "#f4f4f5",
    color: darkMode ? "#ffffff" : "#18181b",
    transition: "padding-left 0.35s ease, background-color 0.3s ease, color 0.3s ease",
  },

  pageShell: {
    position: "relative",

    boxSizing: "border-box",
    width: "min(100%, 900px)",
    maxWidth: "100%",
    minWidth: 0,

    display: "flex",
    flexDirection: "column",
    alignItems: "center",

    gap: "18px",
    margin: "0 auto",

    paddingTop: "18px",
  },

  pageActions: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    width: "100%",
  },

  paramTxt: {
    fontSize: "30px",
    fontWeight: 500,
  },

  titleTxt: {
    fontFamily: '"Cormorant Garamond", serif',
    fontSize: "60px",
    opacity: 0,
    fontWeight: 1000,
    color: darkMode ? "#efeeee" : "#111827",
    animation: "fadeIn 0.6s ease-out forwards",
    marginTop: "30%"
  },

  pageTitle: {
    fontFamily: '"Cormorant Garamond", serif',
    fontSize: "48px",
    opacity: 0,
    fontWeight: 1000,
    color: darkMode ? "#efeeee" : "#111827",
    animation: "fadeIn 0.6s ease-out forwards",
    marginTop: "0%"
  },

  secondaryTxt: {
    fontFamily: '"Cormorant Garamond", serif',
    fontSize: "40px",
    opacity: 0,
    fontWeight: 700,
    color: darkMode ? "#efeeee" : "#111827",
    animation: "fadeIn 1s ease-out forwards",
    marginTop: "0%"
  },

  mainColumn: {
    boxSizing: "border-box",
    width: "min(100%, 800px)",
    maxWidth: "100%",
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: "15px",
    opacity: transitioningToResponse ? 0 : 1,
    transform: transitioningToResponse ? "translateY(-24px)" : "translateY(0)",
    transition: "opacity 0.35s ease, transform 0.35s ease",
    pointerEvents: transitioningToResponse ? "none" : "auto",
  },

  pageBackButton: {
    position: "fixed",

    top: "24px",
    left: sidebarOpen ? "280px" : "104px",
    maxWidth: "calc(100vw - 24px)",

    minWidth: "44px",
    width: "44px",
    height: "44px",
    padding: 0,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    borderRadius: "10px",

    fontFamily: '"Cormorant Garamond", serif',
    fontSize: "30px",
    fontWeight: 600,
    lineHeight: 1,

    textAlign: "center",

    transform: "translateY(-2px)",

    zIndex: 100,
    // Jump directly to the new position so the button does not slide across the page
    transition: "none",
  },

  paramColumn: {
    boxSizing: "border-box",
    width: "min(100%, 520px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
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
    boxSizing: "border-box",
    width: "100%",
    height: "40px",
    padding: "5px",
    fontSize: "16px",
    borderRadius: "5px",
    resize: "none",
    backgroundColor: fieldBg,
    border: fieldBorder,
    color: panelText,
    boxShadow: darkMode ? "inset 0 1px 0 rgba(255,255,255,0.04)" : "inset 0 1px 0 rgba(15,23,42,0.04)",
  },

  compareArea: {
    boxSizing: "border-box",
    width: "min(100%, 520px)",
    height: "40px",
    padding: "5px",
    fontSize: "16px",
    backgroundColor: fieldBg,
    border: fieldBorder,
    color: panelText,
    borderRadius: "5px",
    resize: "none",
  },

  compareNotes: {
    boxSizing: "border-box",
    width: "min(100%, 520px)",
    height: "140px",
    padding: "5px",
    marginTop: "5%",
    fontSize: "16px",
    backgroundColor: fieldBg,
    border: fieldBorder,
    color: panelText,
    borderRadius: "5px",
    resize: "none",
  },

  buttonRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "30px",
  },

  clearModels: {
    margin: "0px 50% 0px 25%",
    padding: "8px",
    fontSize: "14px",
    borderRadius: "4px",
    backgroundColor: fieldBg,
    border: fieldBorder,
    color: panelText,
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
    color: mutedText,
  },

  selectedModels: {
    boxSizing: "border-box",
    alignSelf: "center",
    border: panelBorder,
    borderRadius: "8px",
    minHeight: "100px",
    width: "100%",
    maxWidth: "640px",
    whiteSpace: "pre-wrap",
    padding: "12px",
    backgroundColor: darkMode ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.03)",
    color: panelText,
  },

  response: {
    boxSizing: "border-box",
    padding: "15px",
    width: "100%",
    maxWidth: "900px",
    minHeight: "180px",
    maxHeight: "480px",
    overflowY: "auto",
    margin: "0 auto",
    alignSelf: "center",
    border: panelBorder,
    borderRadius: "8px",
    whiteSpace: "pre-wrap",
    fontSize: "20px",
    fontWeight: 500,
    backgroundColor: darkMode ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.03)",
    color: panelText,
  },

  responseButton: {
    display: "block",
    padding: "10px 15px",
    fontSize: "16px",
    margin: "0 auto 5%",
    borderRadius: "5px",
    backgroundColor: fieldBg,
    border: fieldBorder,
    color: panelText,
    cursor: "pointer",
  },

  responseBg: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: "10px",
    gap: "10px",
    flexWrap: "wrap",
  },

  compareBg: {
    backgroundColor: darkMode ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.03)",
  },

  viewCompareBtn: {
    padding: "1%",
    fontSize: "16px",
    margin: "0 40%",
    marginTop: "10px",
    borderRadius: "5px",
    backgroundColor: fieldBg,
    border: fieldBorder,
    color: panelText,
    cursor: "pointer",
  },

  createCompareButton: {
    width: "80%", 
    height: "8%", 
    fontSize: "16px", 
    minHeight: "30px", 
    borderRadius: "5px", 
    marginTop: "3%",    
    backgroundColor: fieldBg,
    border: fieldBorder,
    color: panelText,
  },

  error: {
    marginTop: "5%",
    fontSize: "30px",
    fontFamily: '"Cormorant Garamond", serif',
    color: "#ff8e8e",
    opacity: 0,
    animation: "fadeIn 0.8s ease-out forwards",
  },

  cost: {
    color: darkMode ? "#c0f4c5" : "#166534",
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

  const toggleTheme = () => {
  setDarkMode((currentMode) => !currentMode)
}

  const addModelName = (modelName) => {
    if (modelNames.includes(modelName)) {
      return;
    }

    setModelNames([...modelNames, modelName]);
  };

  const clearModels = () => {
    setModels([]);
    setModelNames([]);
    setUserModelTxt("");
    clearCustomEndpoints();
  };

const removeModel = (index) => {
  const modelIdToRemove = models[index];

  // Remove the API model ID
  setModels((currentModels) =>
    currentModels.filter((_, currentIndex) => currentIndex !== index)
  );

  // Remove the matching display name
  setModelNames((currentModelNames) =>
    currentModelNames.filter((_, currentIndex) => currentIndex !== index)
  );

  // If it was a custom endpoint, remove it from custom model tracking
  if (customModels.includes(modelIdToRemove)) {
    const remainingCustomModels = customModels.filter(
      (customModel) => customModel !== modelIdToRemove
    );

    setCustomModels(remainingCustomModels);
    setCustomNum(remainingCustomModels.length);

    // Rebuild the custom endpoint text
    setUserModelTxt(remainingCustomModels.join("\n"));
  }
};


  const showResponse = (buttonIndex, responseList) => {
    const selectedItem = responseList[buttonIndex];
    if (!selectedItem) return;

    // 1. Prepare fresh tracking arrays based on current React state
    let currentCosts = [...costs];
    let currentUsedIndexes = [...usedIndexs];

    // 2. Only add cost on the first selection
    if (!currentUsedIndexes.includes(buttonIndex)) {
      console.log(selectedItem.tokens_out);
      currentCosts = [...currentCosts, selectedItem.cost_cents];
      currentUsedIndexes = [...currentUsedIndexes, buttonIndex];

      setCosts(currentCosts);
      setNewCosts(currentCosts);
      setUsedIndexs(currentUsedIndexes);
    }

    // 3. Update the UI text display
    setDisplayTxt(
      selectedItem.text +
        "\n\ncost: $" +
        String(selectedItem.cost_cents).slice(0, 8) +
        "\ntokens out: " +
        String(selectedItem.tokens_out).slice(0, 8) +
        "\nlatency ms: " +
        String(selectedItem.latency_ms).slice(0, 8)
    );

    // 4. Find valid models (tokens_out != 0) from used indexes
    const validSelections = currentUsedIndexes
      .map((idx) => responseList[idx])
      .filter((item) => item && item.tokens_out !== 0);

    if (validSelections.length > 0) {
      // Find the item object with the lowest cost
      const cheapestModel = validSelections.reduce((cheapest, current) =>
        current.cost_cents < cheapest.cost_cents ? current : cheapest
      );

      setCostTxt(
        "Of selected models, " +
          cheapestModel.model_id +
          " was the cheapest ($" +
          String(cheapestModel.cost_cents).slice(0, 8) +
          ") and used " +
          cheapestModel.tokens_out +
          " tokens."
      );
    } else {
      setCostTxt("");
    }
  };

  const listComparisons = async () => {
  window.open(
    `${API_URL}/api/prevcompare`,
    "_blank",
    "noopener,noreferrer"
  )
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
        const comp = await fetch(`${API_URL}/api/comparisons`, {
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
      setComparisonURL(isPublic ? compData.share_url : compData.share_url + "/key-here")
      setPrevComparisons([...prevComparisons, isPublic ? compData.share_url : compData.share_url + "/key-here"]);


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

    const temperatureValue = Number.parseFloat(temp);
    const maxTokensValue = Number.parseInt(max_tokens, 10);
    const topPValue = Number.parseFloat(top_P);

    if (prompt.trim() === "") {
      setLoading(false);
      setError("Prompt cannot be empty.");
      return;
    }
   if (models.length === 0) {
      setLoading(false);
      setError("Select at least one model.");
      return;
    }
  if (temperatureValue < 0 || temperatureValue > 1) {
      setLoading(false);
      setError("Temp must be between 0 and 1")
    return;
    }
  if (maxTokensValue <= 0) {
      setLoading(false);
      setError("Max tokens must be greater than 0")
    return;
    }
  if (topPValue < 0 || topPValue > 1) {
      setLoading(false);
      setError("Top P must be between 0 and 1")
    return;
    }
   if (per_model_overrides.trim() !== "") {
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
    let requestSucceeded = false;
    try {
      // Pass the milliseconds directly into AbortSignal.timeout()
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        signal: AbortSignal.timeout(60000), // 60-second timeout
        body: JSON.stringify({
          prompt,
          system_prompt: systemPrompt,
          model_ids: models,
          params: {
            temperature: Number.isNaN(temperatureValue)
              ? 0.5
              : temperatureValue,

            max_tokens: Number.isNaN(maxTokensValue)
              ? 1000
              : maxTokensValue,

            top_p: Number.isNaN(topPValue)
              ? 1
              : topPValue,
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
      setActiveResponseIndex(0);
      if (responses.length > 0) {
        showResponse(0, responses);
      } else {
        setDisplayTxt("No model responses were returned.");
      }
      requestSucceeded = true;
      setTransitioningToResponse(true);
      window.setTimeout(() => {
        setViewResponse(true);
        setTransitioningToResponse(false);
      }, 320);

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
      if (!requestSucceeded) {
        setViewResponse(true);
        setTransitioningToResponse(false);
      }
    }
  };

  const createCustomEndpoint = (customId) => {
    const cleanedId = customId.trim();

    // Do not allow an empty endpoint
    if (cleanedId === "") {
      setError("Enter a custom endpoint");
      return;
    }

    // Do not allow duplicate endpoints
    if (models.includes(cleanedId)) {
      setError("This endpoint has already been added");
      return;
    }

    // Maximum of five custom endpoints
    if (customEndpointNum >= 5) {
      setError("5 custom endpoints max");
      return;
    }

    // Add endpoint ID used by the API
    setModels((currentModels) => [
      ...currentModels,
      cleanedId,
    ]);

    // Remember which endpoints are custom
    setCustomModels((currentCustomModels) => [
      ...currentCustomModels,
      cleanedId,
    ]);

    // Add endpoint to the model display screen
    setModelNames((currentModelNames) => [
      ...currentModelNames,
      cleanedId,
    ]);

    // Update the custom endpoint modal display
    setUserModelTxt((currentText) =>
      currentText
        ? `${currentText}\n${cleanedId}`
        : cleanedId
    );

    setCustomNum((currentNumber) => currentNumber + 1);

    // Clear input and error after creation
    setCustomEndpoint("");
    setError("");
  };

  const clearCustomEndpoints = () => {
    // Remove custom endpoints from the API model IDs
    setModels((currentModels) =>
      currentModels.filter(
        (modelId) => !customModels.includes(modelId)
      )
    );

    // Remove custom endpoints from the displayed model names
    setModelNames((currentModelNames) =>
      currentModelNames.filter(
        (modelName) => !customModels.includes(modelName)
      )
    );

    setUserModelTxt("");
    setCustomModels([]);
    setCustomNum(0);
    setCustomEndpoint("");
    setError("");
  };

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

  const toggleQuickCompare = () => {
    SetViewQuickCompare((v) => !v);
  }

  const changeQuickCompareMode = (newMode) => {
    // Do nothing if the user clicks the mode that is already selected
    if (newMode === quickCompareMode || quickCompareAnimating) {
      return;
    }

    // Fade the current comparison out before changing the data
    setQuickCompareAnimating(true);

    window.setTimeout(() => {
      setQuickCompareMode(newMode);

      // Wait one frame so the new graph can render before fading in
      window.requestAnimationFrame(() => {
        setQuickCompareAnimating(false);
      });
    }, 180);
  };

  const setPageBool = (cmd) => {
    setViewModels(false)
    setViewCompare(false)
    setParam(false)
    setViewResponse(false)
    if (cmd == 0) {
      setViewModels(true)
    }
    else if (cmd == 1) {
      setViewCompare(true)
    }
    else if (cmd == 2) {
      setParam(true)
    }
    else if (cmd == 3) {
      setViewResponse(true)
    }
    else {
      //Remain false
    }
  }

  /* =====================
     UI
  ===================== */

return (
  <>
          <SideMenu
          onParameters={() => setPageBool(2)}
          onModels={() => setPageBool(0)}
          onComparison={() => setPageBool(1)}
          selectedModels={models.length}
          darkMode={darkMode}
          onThemeChange={toggleTheme}
          forceCollapsed={transitioningToResponse}
          isVisible={!transitioningToResponse}
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
        />
    <style>{`
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(6px);
        }

        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes loadingDotBounce {
        0%, 60%, 100% {
          transform: translateY(0);
          opacity: 0.45;
        }

        30% {
          transform: translateY(-5px);
          opacity: 1;
        }
      }

      @keyframes quickCompareEnter {
        from {
          opacity: 0;
          transform: translateY(8px);
        }

        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      html,
      body,
      #root {
        width: 100%;
        min-width: 0;
        min-height: 100%;
        margin: 0;
        overflow-x: hidden;
      }

      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      img,
      video,
      canvas,
      svg {
        max-width: 100%;
      }

      button,
      input,
      textarea,
      select {
        max-width: 100%;
      }

      .app-container,
      .page-shell,
      .main-column {
        min-width: 0;
        max-width: 100%;
      }

      @media (max-width: 900px) {
        .app-container {
          padding-top: 24px !important;
          padding-right: 16px !important;
          padding-bottom: 28px !important;
          padding-left: 76px !important;
        }

        .page-back-button {
          left: 76px !important;
          top: 16px !important;
        }
      }

      @media (max-width: 640px) {
        .app-container {
          gap: 12px !important;
          padding-top: 72px !important;
          padding-right: 12px !important;
          padding-bottom: 24px !important;
          padding-left: 12px !important;
        }

        .page-shell {
          width: 100% !important;
          padding-top: 0 !important;
        }

        .main-column {
          width: 100% !important;
          gap: 12px !important;
        }

        .page-back-button {
          top: 14px !important;
          left: 68px !important;
          width: 40px !important;
          height: 40px !important;
          min-width: 40px !important;
        }

        h1 {
          font-size: clamp(38px, 13vw, 52px) !important;
          line-height: 1.05 !important;
          overflow-wrap: anywhere;
        }

        h2 {
          font-size: clamp(28px, 9vw, 40px) !important;
          line-height: 1.1 !important;
          overflow-wrap: anywhere;
        }

        h3 {
          overflow-wrap: anywhere;
        }

        [role="dialog"] {
          width: calc(100vw - 20px) !important;
          max-width: calc(100vw - 20px) !important;
          max-height: calc(100dvh - 20px) !important;
          padding: 16px !important;
          border-radius: 14px !important;
        }

        [role="dialog"] > div:first-child {
          min-width: 0;
        }

        textarea,
        input,
        select {
          width: 100% !important;
          min-width: 0 !important;
          font-size: 16px !important;
        }

        svg {
          width: 100% !important;
          min-width: 0 !important;
          height: auto !important;
        }
      }

      @media (max-width: 380px) {
        .app-container {
          padding-right: 8px !important;
          padding-left: 8px !important;
        }

        [role="dialog"] {
          width: calc(100vw - 12px) !important;
          max-width: calc(100vw - 12px) !important;
          padding: 12px !important;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          scroll-behavior: auto !important;
          transition-duration: 0.01ms !important;
        }
      }
    `}</style>

    <div className="app-container" style={styles.container}>


  {viewParam && !viewModels && !viewCompare && !viewResponse && (
    <div className="page-shell" style={styles.pageShell}>
      <Button
        darkMode={darkMode}
        size="sqr"
        onClick={() => setPageBool(4)}
        className="page-back-button"
        style={styles.pageBackButton}
        aria-label="Go back"
      >
        <span style={styles.pageBackButtonText}>
          x
        </span>
      </Button>

      <div className="main-column" style={styles.mainColumn}>
        <div
          style={{
            width: "100%",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              ...styles.pageTitle,
              marginBottom: "1%",
            }}
          >
            Parameters
          </h2>
        </div>

        {/* Generation settings card */}
        <div
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "22px",

            backgroundColor: darkMode
              ? "rgba(255, 255, 255, 0.035)"
              : "rgba(255, 255, 255, 0.82)",

            border: darkMode
              ? "1px solid rgba(255, 255, 255, 0.09)"
              : "1px solid rgba(15, 23, 42, 0.1)",

            borderRadius: "16px",

            boxShadow: darkMode
              ? "0 14px 36px rgba(0, 0, 0, 0.22)"
              : "0 14px 36px rgba(15, 23, 42, 0.07)",
          }}
        >
          {/* Card heading */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "16px",
              marginBottom: "22px",
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0,
                  color: panelText,
                  fontSize: "20px",
                  fontWeight: 650,
                  fontFamily: "Arial",
                }}
              >
                Generation settings
              </h3>

              <p
                style={{
                  margin: "5px 0 0",
                  color: mutedText,
                  fontSize: "13px",
                  lineHeight: 1.5,
                }}
              >
                Leave a field empty to use its default value.
              </p>
            </div>
          </div>

          {/* System prompt */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginBottom: "20px",
            }}
          >
            <label
              htmlFor="system-prompt"
              style={{
                color: panelText,
                fontSize: "14px",
                fontWeight: 650,
              }}
            >
              System prompt
            </label>

            <Textarea
              id="system-prompt"
              darkMode={darkMode}
              value={systemPrompt}
              onChange={(e) => setSysPrompt(e.target.value)}
              placeholder="You are a helpful assistant. Answer clearly and concisely."
              style={{
                ...styles.paramArea,

                width: "100%",
                minHeight: "120px",
                height: "120px",
                boxSizing: "border-box",
                padding: "14px",

                borderRadius: "12px",
                resize: "vertical",

                fontSize: "14px",
                lineHeight: 1.55,
              }}
            />

            <span
              style={{
                color: mutedText,
                fontSize: "12px",
                lineHeight: 1.45,
              }}
            >
              Sets the instructions and behavior used by every selected model.
            </span>
          </div>

          {/* Numeric generation parameters */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(210px, 100%), 1fr))",
              gap: "16px",
            }}
          >
            {/* Temperature */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <label
                htmlFor="temperature"
                style={{
                  color: panelText,
                  fontSize: "14px",
                  fontWeight: 650,
                }}
              >
                Temperature
              </label>

              <input
                id="temperature"
                type="number"
                min="0"
                max="1"
                step="0.1"
                style={{
                  ...styles.paramArea,
                  height: "46px",
                  padding: "0 14px",
                  borderRadius: "10px",
                }}
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                placeholder="0.5"
              />

              <span
                style={{
                  color: mutedText,
                  fontSize: "12px",
                  lineHeight: 1.45,
                }}
              >
                Lower values are more predictable. Higher values are
                more creative.
              </span>
            </div>

            {/* Maximum tokens */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <label
                htmlFor="max-tokens"
                style={{
                  color: panelText,
                  fontSize: "14px",
                  fontWeight: 650,
                }}
              >
                Maximum tokens
              </label>

              <input
                id="max-tokens"
                type="number"
                min="1"
                step="1"
                style={{
                  ...styles.paramArea,
                  height: "46px",
                  padding: "0 14px",
                  borderRadius: "10px",
                }}
                value={max_tokens}
                onChange={(e) => setTokens(e.target.value)}
                placeholder="1000"
              />

              <span
                style={{
                  color: mutedText,
                  fontSize: "12px",
                  lineHeight: 1.45,
                }}
              >
                Controls the maximum possible length of each response.
              </span>
            </div>

            {/* Top P */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <label
                htmlFor="top-p"
                style={{
                  color: panelText,
                  fontSize: "14px",
                  fontWeight: 650,
                }}
              >
                Top P
              </label>

              <input
                id="top-p"
                type="number"
                min="0"
                max="1"
                step="0.1"
                style={{
                  ...styles.paramArea,
                  height: "46px",
                  padding: "0 14px",
                  borderRadius: "10px",
                }}
                value={top_P}
                onChange={(e) => setP(e.target.value)}
                placeholder="1"
              />

              <span
                style={{
                  color: mutedText,
                  fontSize: "12px",
                  lineHeight: 1.45,
                }}
              >
                Limits token selection to the most likely choices.
              </span>
            </div>
          </div>
        </div>

        {/* Per-model overrides card */}
        <div
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "22px",

            backgroundColor: darkMode
              ? "rgba(255, 255, 255, 0.035)"
              : "rgba(255, 255, 255, 0.82)",

            border: darkMode
              ? "1px solid rgba(255, 255, 255, 0.09)"
              : "1px solid rgba(15, 23, 42, 0.1)",

            borderRadius: "16px",

            boxShadow: darkMode
              ? "0 14px 36px rgba(0, 0, 0, 0.22)"
              : "0 14px 36px rgba(15, 23, 42, 0.07)",
          }}
        >
          <div
            style={{
              marginBottom: "14px",
            }}
          >
            <h3
              style={{
                margin: 0,
                color: panelText,
                fontSize: "20px",
                fontWeight: 650,
                fontFamily: "Arial",
              }}
            >
              Per-model overrides
            </h3>

            <p
              style={{
                margin: "5px 0 0",
                color: mutedText,
                fontSize: "13px",
                lineHeight: 1.5,
              }}
            >
              Apply different parameter values to individual models
              using JSON.
            </p>
          </div>

          <Textarea
            darkMode={darkMode}
            value={per_model_overrides}
            onChange={(e) => setOverrides(e.target.value)}
            placeholder={`{
    "meta/llama-3.3-70b-instruct": {
      "temperature": 0.9
    }
  }`}
            style={{
              ...styles.paramArea,

              width: "100%",
              minHeight: "120px",
              height: "120px",
              boxSizing: "border-box",
              padding: "14px",

              borderRadius: "12px",
              resize: "vertical",

              fontFamily:
                '"SFMono-Regular", Consolas, "Liberation Mono", monospace',

              fontSize: "13px",
              lineHeight: 1.6,
            }}
          />
        </div>

        {/* Parameter information */}
      </div>
    </div>
  )}

  {viewModels && !viewParam && !viewCompare && !viewResponse && (
    <div className="page-shell" style={styles.pageShell}>
      <Button
        darkMode={darkMode}
        size="sqr"
        onClick={() => setPageBool(4)}
        className="page-back-button"
        style={styles.pageBackButton}
        aria-label="Go back"
        disabled={viewCustomEndpoint}
      >
        <span style={styles.pageBackButtonText}>
          x
        </span>
      </Button>

      <div className="main-column" style={styles.mainColumn}>
        <h2 align="center" style={styles.pageTitle}>
          Models
        </h2>

        <div style={styles.pageActions}>

          <Button
            darkMode={darkMode}
            onClick={() =>
              window.open(
                `${API_URL}/api/models`,
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            All Models
          </Button>

          <Button
            darkMode={darkMode}
            onClick={toggleEndpoint}
          >
            Custom
          </Button>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              marginTop: "5%"
            }}
          >
            <Dropdown
              darkMode={darkMode}
              setModel={setId}
              updateId={addModel}
              updateNames={addModelName}
            />
          </div>
        </div>

        <div
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "20px",
            marginTop: "5%",

            backgroundColor: darkMode
              ? "rgba(255, 255, 255, 0.035)"
              : "rgba(255, 255, 255, 0.8)",

            border: darkMode
              ? "1px solid rgba(255, 255, 255, 0.09)"
              : "1px solid rgba(15, 23, 42, 0.1)",

            borderRadius: "16px",

            boxShadow: darkMode
              ? "0 14px 36px rgba(0, 0, 0, 0.22)"
              : "0 14px 36px rgba(15, 23, 42, 0.07)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              marginBottom: "15px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  color: panelText,
                  fontSize: "24px",
                  fontWeight: 650,
                  fontFamily: "Arial"
                }}
              >
                Selected model IDs
              </h2>

              <p
                style={{
                  margin: "5px 0 0",
                  color: mutedText,
                  fontSize: "13px",
                  lineHeight: 1.5,
                }}
              >
                These models will receive your prompt.
              </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
            }}
          >
            <Button
            darkMode={darkMode}
            onClick={() => clearModels()}
            disabled={models.length === 0}
          >
            Clear
          </Button>
            <span
              style={{
                width: "9px",
                height: "9px",
                flexShrink: 0,

                backgroundColor:
                  modelNames.length > 0 ? "#22c55e" : "#71717a",

                borderRadius: "50%",

                boxShadow:
                  modelNames.length > 0
                    ? "0 0 0 4px rgba(34, 197, 94, 0.13)"
                    : "0 0 0 4px rgba(113, 113, 122, 0.13)",
              }}
            />
            
          </div>

          </div>

          <div
            style={{
              width: "100%",
              minHeight: "160px",
              maxHeight: "340px",
              boxSizing: "border-box",
              padding: "12px",

              overflowY: "auto",
              overflowX: "hidden",

              backgroundColor: darkMode
                ? "rgba(0, 0, 0, 0.2)"
                : "#f8fafc",

              border: darkMode
                ? "1px solid rgba(255, 255, 255, 0.07)"
                : "1px solid #e2e8f0",

              borderRadius: "12px",
            }}
          >
            {modelNames.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "9px",
                  width: "100%",
                }}
              >
              {modelNames.map((modelName, index) => (
                <div
                  key={`${models[index]}-${index}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",

                    width: "100%",
                    boxSizing: "border-box",
                    padding: "11px 13px",

                    color: panelText,

                    backgroundColor: darkMode
                      ? "rgba(255, 255, 255, 0.045)"
                      : "#ffffff",

                    border: darkMode
                      ? "1px solid rgba(255, 255, 255, 0.08)"
                      : "1px solid #e2e8f0",

                    borderRadius: "10px",

                    boxShadow: darkMode
                      ? "none"
                      : "0 2px 6px rgba(15, 23, 42, 0.04)",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",

                      width: "27px",
                      height: "27px",
                      flexShrink: 0,

                      color: darkMode ? "#d4d4d8" : "#52525b",

                      backgroundColor: darkMode
                        ? "rgba(255, 255, 255, 0.08)"
                        : "#f1f5f9",

                      borderRadius: "8px",

                      fontFamily:
                        '"SFMono-Regular", Consolas, "Liberation Mono", monospace',

                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}
                  </span>

                  <span
                    style={{
                      minWidth: 0,
                      flex: 1,

                      color: panelText,

                      overflowWrap: "anywhere",
                      wordBreak: "break-word",

                      fontFamily:
                        '"SFMono-Regular", Consolas, "Liberation Mono", monospace',

                      fontSize: "13px",
                      lineHeight: 1.5,
                      textAlign: "left",
                    }}
                  >
                    {modelName}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeModel(index)}
                    aria-label={`Remove ${modelName}`}
                    title={`Remove ${modelName}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      width: "30px",
                      height: "30px",
                      minWidth: "30px",
                      flexShrink: 0,
                      padding: 0,

                      color: darkMode ? "#d4d4d8" : "#64748b",

                      backgroundColor: darkMode
                        ? "rgba(255, 255, 255, 0.06)"
                        : "#f1f5f9",

                      border: darkMode
                        ? "1px solid rgba(255, 255, 255, 0.08)"
                        : "1px solid #e2e8f0",

                      borderRadius: "8px",

                      fontFamily: "Arial, sans-serif",
                      fontSize: "18px",
                      fontWeight: 400,
                      lineHeight: 1,

                      cursor: "pointer",
                    }}
                    onMouseEnter={(event) => {
                      event.currentTarget.style.color = "#ef4444";
                      event.currentTarget.style.backgroundColor = darkMode
                        ? "rgba(239, 68, 68, 0.12)"
                        : "#fee2e2";
                      event.currentTarget.style.borderColor = darkMode
                        ? "rgba(239, 68, 68, 0.3)"
                        : "#fecaca";
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.color = darkMode
                        ? "#d4d4d8"
                        : "#64748b";

                      event.currentTarget.style.backgroundColor = darkMode
                        ? "rgba(255, 255, 255, 0.06)"
                        : "#f1f5f9";

                      event.currentTarget.style.borderColor = darkMode
                        ? "rgba(255, 255, 255, 0.08)"
                        : "#e2e8f0";
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  minHeight: "134px",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",

                  padding: "12px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    width: "42px",
                    height: "42px",
                    marginBottom: "12px",

                    color: mutedText,
                    backgroundColor: darkMode
                      ? "rgba(255, 255, 255, 0.07)"
                      : "#e2e8f0",

                    borderRadius: "12px",
                    fontSize: "25px",
                    fontWeight: 300,
                  }}
                >
                  +
                </div>

                <p
                  style={{
                    margin: 0,
                    color: panelText,
                    fontSize: "14px",
                    fontWeight: 650,
                  }}
                >
                  No models selected
                </p>

                <p
                  style={{
                    maxWidth: "290px",
                    margin: "6px 0 0",
                    color: mutedText,
                    fontSize: "12px",
                    lineHeight: 1.5,
                  }}
                >
                  Choose a model from the dropdown or add a custom endpoint.
                </p>
              </div>
            )}
          </div>
        </div>

        {viewCustomEndpoint && (
          <>
            <div
              onClick={toggleEndpoint}
              style={{
                position: "fixed",
                inset: 0,
                background: overlayBg,
                backdropFilter: "blur(4px)",
                opacity: "0.5",
                                zIndex: 1000,
              }}
            />

            <div
              role="dialog"
              aria-modal="true"
              aria-label="Custom endpoint"
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",

                width: "min(520px, calc(100vw - 32px))",
                maxHeight: "calc(100vh - 40px)",

                boxSizing: "border-box",
                padding: "clamp(16px, 4vw, 24px)",

                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                gap: "18px",

                overflowY: "auto",

                background: panelBg,
                border: panelBorder,
                borderRadius: "18px",

                color: panelText,
                boxShadow: "0 24px 70px rgba(0, 0, 0, 0.35)",

                zIndex: 1001,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontFamily: '"Cormorant Garamond", serif',
                      fontSize: "32px",
                      fontWeight: 700,
                    }}
                  >
                    Custom Endpoint
                  </h2>

                  <p
                    style={{
                      margin: "4px 0 0",
                      color: mutedText,
                      fontSize: "15px",
                    }}
                  >
                    Add a custom model endpoint to be used. View list of all models to see supported endpoints
                  </p>
                </div>

                <Button
                  darkMode={darkMode}
                  size="sqr"
                  onClick={toggleEndpoint}
                  aria-label="Close custom endpoint"
                  style={{
                    minWidth: "36px",
                    width: "40px",
                    height: "40px",
                    padding: 0,
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      lineHeight: 1,
                      transform: "translateY(-2px)",
                    }}
                  >
                    ×
                  </span>
                </Button>
              </div>

              <input
                style={{
                  ...styles.paramArea,
                  width: "100%",
                  height: "46px",
                  padding: "0 14px",
                  borderRadius: "10px",
                }}
                placeholder="Enter endpoint"
                value={customEndpoint}
                onChange={(e) => setCustomEndpoint(e.target.value)}
              />

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "12px",
                }}
              >
                <Button
                  darkMode={darkMode}
                  onClick={() => createCustomEndpoint(customEndpoint)}
                >
                  Create
                </Button>

              </div>

              {userModelTxt && (
                <div
                  style={{
                    minHeight: "70px",
                    padding: "14px",

                    color: panelText,

                    backgroundColor: darkMode
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(15,23,42,0.03)",

                    border: panelBorder,
                    borderRadius: "10px",

                    whiteSpace: "pre-wrap",
                    overflowWrap: "anywhere",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      marginBottom: "8px",
                      color: mutedText,
                      fontSize: "13px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Added endpoints
                  </div>

                  {userModelTxt}
                </div>
              )}

              {errorTxt && (
                <div
                  style={{
                    color: "#ff8e8e",
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: "20px",
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  {errorTxt}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )}

  {viewCompare && !viewModels && !viewParam && !viewResponse && (
    <div className="page-shell" style={styles.pageShell}>
      {/* Back button */}
      <Button
        darkMode={darkMode}
        size="sqr"
        onClick={() => setPageBool(4)}
        className="page-back-button"
        style={styles.pageBackButton}
        aria-label="Go back"
      >
        <span style={styles.pageBackButtonText}>
          x
        </span>
      </Button>

      <div className="main-column" style={styles.mainColumn}>
        {/* Page heading */}
        <div
          style={{
            width: "100%",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              ...styles.pageTitle,
              marginBottom: "1%",
            }}
          >
            Comparison
          </h2>
        </div>

        {/* Main comparison card */}
        <div
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "22px",

            backgroundColor: darkMode
              ? "rgba(255, 255, 255, 0.035)"
              : "rgba(255, 255, 255, 0.82)",

            border: darkMode
              ? "1px solid rgba(255, 255, 255, 0.09)"
              : "1px solid rgba(15, 23, 42, 0.1)",

            borderRadius: "16px",

            boxShadow: darkMode
              ? "0 14px 36px rgba(0, 0, 0, 0.22)"
              : "0 14px 36px rgba(15, 23, 42, 0.07)",
          }}
        >
          {/* Card header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
              marginBottom: "22px",
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0,
                  color: panelText,
                  fontSize: "20px",
                  fontWeight: 650,
                  fontFamily: "Arial",
                }}
              >
                Saved comparisons
              </h3>

              <p
                style={{
                  margin: "5px 0 0",
                  color: mutedText,
                  fontSize: "13px",
                  lineHeight: 1.5,
                }}
              >
                Create a shareable comparison from one of your previous chats.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >

              <Button
                darkMode={darkMode}
                onClick={() => {
                  listComparisons();
                  setComparisonURL(false);
                }}
              >
                {"Previous"}
              </Button>
            </div>
          </div>

          {/* Generated comparison URL */}
          {comparsionURL && (
            <div
              style={{
                width: "100%",
                boxSizing: "border-box",
                marginBottom: "18px",
                padding: "15px",

                backgroundColor: darkMode
                  ? "rgba(34, 197, 94, 0.08)"
                  : "rgba(34, 197, 94, 0.07)",

                border: darkMode
                  ? "1px solid rgba(34, 197, 94, 0.2)"
                  : "1px solid rgba(22, 163, 74, 0.2)",

                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  marginBottom: "7px",
                  color: darkMode ? "#86efac" : "#166534",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                Comparison created
              </div>

              <div
                style={{
                  color: panelText,
                  fontSize: "13px",
                  lineHeight: 1.5,
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                {comparsionURL}
              </div>
            </div>
          )}

          {/* Select a previous chat */}
            <div
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "18px",

                backgroundColor: darkMode
                  ? "rgba(0, 0, 0, 0.18)"
                  : "#f8fafc",

                border: darkMode
                  ? "1px solid rgba(255, 255, 255, 0.07)"
                  : "1px solid #e2e8f0",

                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  marginBottom: "14px",
                }}
              >
                <h4
                  style={{
                    margin: 0,
                    color: panelText,
                    fontSize: "15px",
                    fontWeight: 700,
                  }}
                >
                  Select a chat
                </h4>

                <p
                  style={{
                    margin: "5px 0 0",
                    color: mutedText,
                    fontSize: "12px",
                    lineHeight: 1.5,
                  }}
                >
                  Choose the chat you want to save as a comparison.
                </p>
              </div>

              {requestIDs.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "9px",
                    width: "100%",
                    maxHeight: "320px",
                    overflowY: "auto",
                  }}
                >
                  {requestIDs.map((id, index) => (
                    <button
                      type="button"
                      key={id || index}
                      onClick={() => {
                        setRequestId(id);
                        setCompError("");
                        toggleURL();
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",

                        width: "100%",
                        boxSizing: "border-box",
                        padding: "12px 14px",

                        color: panelText,

                        backgroundColor: darkMode
                          ? "rgba(255, 255, 255, 0.045)"
                          : "#ffffff",

                        border: darkMode
                          ? "1px solid rgba(255, 255, 255, 0.08)"
                          : "1px solid #e2e8f0",

                        borderRadius: "10px",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",

                          width: "28px",
                          height: "28px",
                          flexShrink: 0,

                          color: darkMode ? "#d4d4d8" : "#52525b",

                          backgroundColor: darkMode
                            ? "rgba(255, 255, 255, 0.08)"
                            : "#f1f5f9",

                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: 700,
                        }}
                      >
                        {index + 1}
                      </span>

                      <span
                        style={{
                          minWidth: 0,
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontSize: "13px",
                          fontWeight: 600,
                        }}
                      >
                        {prompts[index]
                          ? prompts[index].length > 70
                            ? prompts[index].slice(0, 70) + "..."
                            : prompts[index]
                          : `Chat ${index + 1}`}
                      </span>

                      <span
                        style={{
                          color: mutedText,
                          fontSize: "18px",
                        }}
                      >
                        →
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    minHeight: "130px",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      width: "42px",
                      height: "42px",
                      marginBottom: "12px",

                      color: mutedText,

                      backgroundColor: darkMode
                        ? "rgba(255, 255, 255, 0.07)"
                        : "#e2e8f0",

                      borderRadius: "12px",
                      fontSize: "22px",
                    }}
                  >
                    —
                  </div>

                  <p
                    style={{
                      margin: 0,
                      color: panelText,
                      fontSize: "14px",
                      fontWeight: 650,
                    }}
                  >
                    No previous chats
                  </p>

                  <p
                    style={{
                      margin: "6px 0 0",
                      color: mutedText,
                      fontSize: "12px",
                      lineHeight: 1.5,
                    }}
                  >
                    Send a prompt first, then return here to create a
                    comparison.
                  </p>
                </div>
              )}
            </div>
          

          {/* Previous comparisons */}
          {viewPrevComparisons && !isSaving && (
            <div
              style={{
                width: "100%",
                boxSizing: "border-box",
                marginTop: isSaving ? "16px" : 0,
                padding: "18px",

                backgroundColor: darkMode
                  ? "rgba(0, 0, 0, 0.18)"
                  : "#f8fafc",

                border: darkMode
                  ? "1px solid rgba(255, 255, 255, 0.07)"
                  : "1px solid #e2e8f0",

                borderRadius: "12px",
              }}
            >
              <h4
                style={{
                  margin: "0 0 12px",
                  color: panelText,
                  fontSize: "15px",
                  fontWeight: 700,
                }}
              >
                Previous comparisons
              </h4>

              <div
                style={{
                  minHeight: "80px",
                  color: allComparisons ? panelText : mutedText,
                  fontSize: "13px",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere",
                }}
              >
                {allComparisons
                  ? typeof allComparisons === "string"
                    ? allComparisons
                    : JSON.stringify(allComparisons, null, 2)
                  : "No saved comparisons were returned."}
              </div>
            </div>
          )}
        </div>

        {/* Create comparison modal */}
        {generateURL && (
          <>
            {/* Modal background */}
            <div
              onClick={toggleURL}
              style={{
                position: "fixed",
                inset: 0,

                background: overlayBg,
                backdropFilter: "blur(4px)",

                zIndex: 1000,
              }}
            />

            {/* Modal */}
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Create comparison"
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",

                width: "min(540px, calc(100vw - 32px))",
                maxHeight: "calc(100vh - 40px)",
                boxSizing: "border-box",
                padding: "clamp(16px, 4vw, 24px)",

                overflowY: "auto",

                background: panelBg,
                border: panelBorder,
                borderRadius: "18px",

                color: panelText,

                boxShadow: "0 24px 70px rgba(0, 0, 0, 0.35)",

                zIndex: 1001,
              }}
            >
              {/* Modal header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "16px",
                  marginBottom: "22px",
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontFamily: '"Cormorant Garamond", serif',
                      fontSize: "32px",
                      fontWeight: 700,
                    }}
                  >
                    Create
                  </h2>

                  <p
                    style={{
                      margin: "5px 0 0",
                      color: mutedText,
                      fontSize: "13px",
                      lineHeight: 1.5,
                    }}
                  >
                    Add a title, optional notes, and sharing settings.
                  </p>
                </div>

                <Button
                  darkMode={darkMode}
                  size="sqr"
                  onClick={() => {
                    toggleURL();
                    setCompError("");
                  }}
                  aria-label="Close comparison window"
                  style={{
                    minWidth: "38px",
                    width: "38px",
                    height: "38px",
                    padding: 0,
                    flexShrink: 0,
                  }}
                >
                  x
                </Button>
              </div>

              {/* Selected chat */}
              <div
                style={{
                  marginBottom: "18px",
                  padding: "12px 14px",

                  backgroundColor: darkMode
                    ? "rgba(255, 255, 255, 0.04)"
                    : "#f8fafc",

                  border: darkMode
                    ? "1px solid rgba(255, 255, 255, 0.08)"
                    : "1px solid #e2e8f0",

                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    marginBottom: "4px",
                    color: mutedText,
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}
                >
                  Selected chat
                </div>

                <div
                  style={{
                    color: panelText,
                    fontSize: "13px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {requestID
                    ? prompts[requestIDs.indexOf(requestID)] ||
                      requestID
                    : "No chat selected"}
                </div>
              </div>

              {/* Title */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  marginBottom: "0px",
                }}
              >
                <label
                  htmlFor="comparison-title"
                  style={{
                    color: panelText,
                    fontSize: "14px",
                    fontWeight: 650,
                  }}
                >
                  Title
                </label>

                <input
                  id="comparison-title"
                  value={compTitle}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a comparison title"
                  style={{
                    ...styles.paramArea,
                    width: "100%",
                    height: "46px",
                    padding: "0 14px",
                    borderRadius: "10px",
                  }}
                />
              </div>

              {/* Notes */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  marginBottom: "16px",
                }}
              >
                <label
                  htmlFor="comparison-notes"
                  style={{
                    color: panelText,
                    fontSize: "14px",
                    fontWeight: 650,
                  }}
                >
                  Notes
                </label>

                <Textarea
                  id="comparison-notes"
                  darkMode={darkMode}
                  value={compNotes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add optional notes about this comparison"
                  style={{
                    ...styles.paramArea,
                    width: "100%",
                    minHeight: "130px",
                    height: "130px",
                    boxSizing: "border-box",
                    padding: "14px",
                    borderRadius: "12px",
                    resize: "vertical",
                    fontSize: "14px",
                    lineHeight: 1.55,
                  }}
                />
              </div>

              {/* Public setting */}
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",

                  width: "100%",
                  boxSizing: "border-box",
                  marginBottom: "16px",
                  padding: "13px 14px",

                  backgroundColor: darkMode
                    ? "rgba(255, 255, 255, 0.04)"
                    : "#f8fafc",

                  border: darkMode
                    ? "1px solid rgba(255, 255, 255, 0.08)"
                    : "1px solid #e2e8f0",

                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                <div>
                  <div
                    style={{
                      color: panelText,
                      fontSize: "14px",
                      fontWeight: 650,
                    }}
                  >
                    Public comparison
                  </div>

                  <div
                    style={{
                      marginTop: "3px",
                      color: mutedText,
                      fontSize: "12px",
                      lineHeight: 1.4,
                    }}
                  >
                    Anyone with the URL can view it.
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => {
                    setIsPublic(e.target.checked);

                    if (e.target.checked) {
                      setKey("");
                    }
                  }}
                  style={{
                    width: "18px",
                    height: "18px",
                    flexShrink: 0,
                    cursor: "pointer",
                  }}
                />
              </label>

              {/* Private key */}
              {!isPublic && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginBottom: "16px",
                  }}
                >
                  <label
                    htmlFor="comparison-key"
                    style={{
                      color: panelText,
                      fontSize: "14px",
                      fontWeight: 650,
                    }}
                  >
                    Private key
                  </label>

                  <input
                    id="comparison-key"
                    type="password"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="Enter at least 5 characters"
                    style={{
                      ...styles.paramArea,
                      width: "100%",
                      height: "46px",
                      padding: "0 14px",
                      borderRadius: "10px",
                    }}
                  />

                  <span
                    style={{
                      color: mutedText,
                      fontSize: "12px",
                      lineHeight: 1.45,
                    }}
                  >
                    A key is required at the end of the URL when the comparison is private.
                  </span>
                </div>
              )}

              {/* Error */}
              {compErrorTxt && (
                <div
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    marginBottom: "16px",
                    padding: "11px 13px",

                    color: "#ff8e8e",

                    backgroundColor: darkMode
                      ? "rgba(239, 68, 68, 0.08)"
                      : "#fef2f2",

                    border: darkMode
                      ? "1px solid rgba(239, 68, 68, 0.2)"
                      : "1px solid #fecaca",

                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  {compErrorTxt}
                </div>
              )}

              {/* Modal buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <Button
                  darkMode={darkMode}
                  onClick={() => {
                    toggleURL();
                    setCompError("");
                  }}
                >
                  Cancel
                </Button>

                <Button
                  darkMode={darkMode}
                  onClick={saveComparison}
                >
                  Create
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )}
          

      {viewResponse && !viewParam && !viewModels && !viewCompare && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "18px",
            boxSizing: "border-box",
            width: "100%",
            maxWidth: "920px",
            margin: "0 auto",
            padding: "20px 0",
          }}
        >

        <Button
          darkMode={darkMode}
          size="sqr"
          onClick={() => setPageBool(4)}
          className="page-back-button"
        style={styles.pageBackButton}
          aria-label="Go back"
        >
          <span style={styles.pageBackButtonText}>
            x
          </span>
        </Button>

          <h2 align="center" style={styles.pageTitle}>Response</h2>
          <h4
            align="center"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: "28px",
              opacity: 0,
              fontWeight: 700,
              color: darkMode ? "#efeeee" : "#111827",
              animation: "fadeIn 1s ease-out forwards",
              marginTop: "0%"
            }}
          >
            Tap a response button below to view the model output.
          </h4>

          {(() => {
            // Keep each response's original index so showResponse still opens the correct item
            const responseItems = responses.map((model, index) => ({
              model,
              index,
              responded:
                Number(model?.tokens_out ?? model?.token_output ?? 0) > 0,
            }));

            const respondedItems = responseItems.filter(
              (item) => item.responded
            );

            const noResponseItems = responseItems.filter(
              (item) => !item.responded
            );

            const renderResponseButton = (item, didRespond) => {
              const selected = item.index === activeResponseIndex;

              return (
                <Button
                  darkMode={darkMode}
                  selected={selected}
                  key={`${item.model.model_id}-${item.index}`}
                  onClick={() => {
                    setActiveResponseIndex(item.index);
                    showResponse(item.index, responses);
                  }}
                  style={{
                    minWidth: "170px",
                    maxWidth: "100%",
                    padding: "10px 20px",
                    borderRadius: "10px",
                    fontWeight: 600,
                    cursor: "pointer",
                    zIndex: selected ? 2 : 1,
                    opacity: didRespond ? 1 : 0.76,
                    border: selected
                      ? `2px solid ${darkMode ? "#ffffff" : "#18181b"}`
                      : didRespond
                        ? darkMode
                          ? "1px solid rgba(34, 197, 94, 0.3)"
                          : "1px solid rgba(22, 163, 74, 0.24)"
                        : darkMode
                          ? "1px solid rgba(113, 113, 122, 0.32)"
                          : "1px solid rgba(100, 116, 139, 0.25)",
                    boxShadow: selected
                      ? darkMode
                        ? "0 0 0 3px rgba(255,255,255,0.16), 0 8px 20px rgba(0,0,0,0.4)"
                        : "0 0 0 3px rgba(24,24,27,0.12), 0 8px 20px rgba(24,24,27,0.2)"
                      : "none",
                    transition:
                      "opacity 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      width: "100%",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: "8px",
                        height: "8px",
                        flexShrink: 0,
                        borderRadius: "50%",
                        backgroundColor: didRespond ? "#22c55e" : "#71717a",
                        boxShadow: didRespond
                          ? "0 0 0 3px rgba(34, 197, 94, 0.12)"
                          : "0 0 0 3px rgba(113, 113, 122, 0.12)",
                      }}
                    />

                    <span
                      style={{
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.model.model_id}
                    </span>
                  </span>
                </Button>
              );
            };

            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  width: "100%",
                  padding: "0 10px",
                  boxSizing: "border-box",
                }}
              >
                {/* Models that returned output */}
                <section
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "16px",
                    backgroundColor: darkMode
                      ? "rgba(34, 197, 94, 0.045)"
                      : "rgba(34, 197, 94, 0.045)",
                    border: darkMode
                      ? "1px solid rgba(34, 197, 94, 0.14)"
                      : "1px solid rgba(22, 163, 74, 0.14)",
                    borderRadius: "14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      marginBottom: respondedItems.length > 0 ? "13px" : 0,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "9px",
                      }}
                    >
                      <span
                        style={{
                          width: "9px",
                          height: "9px",
                          flexShrink: 0,
                          borderRadius: "50%",
                          backgroundColor: "#22c55e",
                          boxShadow: "0 0 0 4px rgba(34, 197, 94, 0.12)",
                        }}
                      />

                      <div>
                        <div
                          style={{
                            color: panelText,
                            fontSize: "14px",
                            fontWeight: 700,
                          }}
                        >
                          Responded
                        </div>

                        <div
                          style={{
                            marginTop: "2px",
                            color: mutedText,
                            fontSize: "11px",
                          }}
                        >
                          Models that returned output tokens
                        </div>
                      </div>
                    </div>

                    <span
                      style={{
                        minWidth: "28px",
                        padding: "4px 8px",
                        color: darkMode ? "#86efac" : "#166534",
                        backgroundColor: darkMode
                          ? "rgba(34, 197, 94, 0.1)"
                          : "rgba(34, 197, 94, 0.09)",
                        borderRadius: "999px",
                        fontSize: "11px",
                        fontWeight: 700,
                        textAlign: "center",
                      }}
                    >
                      {respondedItems.length}
                    </span>
                  </div>

                  {respondedItems.length > 0 ? (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: "10px",
                      }}
                    >
                      {respondedItems.map((item) =>
                        renderResponseButton(item, true)
                      )}
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: "12px 0 2px",
                        color: mutedText,
                        fontSize: "12px",
                        textAlign: "center",
                      }}
                    >
                      No models returned a response.
                    </div>
                  )}
                </section>

                {/* Models that did not return output */}
                {noResponseItems.length > 0 && (
                  <section
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      padding: "16px",
                      backgroundColor: darkMode
                        ? "rgba(113, 113, 122, 0.055)"
                        : "rgba(100, 116, 139, 0.05)",
                      border: darkMode
                        ? "1px solid rgba(113, 113, 122, 0.18)"
                        : "1px solid rgba(100, 116, 139, 0.16)",
                      borderRadius: "14px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                        marginBottom: "13px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "9px",
                        }}
                      >
                        <span
                          style={{
                            width: "9px",
                            height: "9px",
                            flexShrink: 0,
                            borderRadius: "50%",
                            backgroundColor: "#71717a",
                            boxShadow: "0 0 0 4px rgba(113, 113, 122, 0.12)",
                          }}
                        />

                        <div>
                          <div
                            style={{
                              color: panelText,
                              fontSize: "14px",
                              fontWeight: 700,
                            }}
                          >
                            No response
                          </div>

                          <div
                            style={{
                              marginTop: "2px",
                              color: mutedText,
                              fontSize: "11px",
                            }}
                          >
                            Models that returned zero output tokens
                          </div>
                        </div>
                      </div>

                      <span
                        style={{
                          minWidth: "28px",
                          padding: "4px 8px",
                          color: mutedText,
                          backgroundColor: darkMode
                            ? "rgba(113, 113, 122, 0.12)"
                            : "rgba(100, 116, 139, 0.1)",
                          borderRadius: "999px",
                          fontSize: "11px",
                          fontWeight: 700,
                          textAlign: "center",
                        }}
                      >
                        {noResponseItems.length}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: "10px",
                      }}
                    >
                      {noResponseItems.map((item) =>
                        renderResponseButton(item, false)
                      )}
                    </div>
                  </section>
                )}
              </div>
            );
          })()}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              padding: "0 10px",
            }}
          >
            <Button
              darkMode={darkMode}
              onClick={() => toggleQuickCompare()}
              style={{
                ...styles.responseButton,
                minWidth: "180px",
                maxWidth: "260px",
              }}
            >
               + Quick Compare
            </Button>
          </div>

 {viewQuickCompare && (
  (() => {
    /*
      Create one graph item for every selected model.

      If a model did not return a response, its:
      - cost
      - latency
      - tokens

      will all display as 0.
    */
    const allSelectedModels = models.map((modelId) => {
      const matchingResponse = responses.find(
        (response) => response.model_id === modelId
      );

      const tokenUsage = Number(
        matchingResponse?.tokens_out ??
        matchingResponse?.token_output ??
        0
      );

      return {
        model_id: modelId,

        cost_cents: Number(
          matchingResponse?.cost_cents ?? 0
        ),

        latency_ms: Number(
          matchingResponse?.latency_ms ?? 0
        ),

        tokens_out: tokenUsage,

        responded: Boolean(
          matchingResponse && tokenUsage > 0
        ),
      };
    });

    // Models that actually produced output
    const respondedModels = allSelectedModels.filter(
      (model) => model.responded
    );

    /*
      Responded mode:
      Only show models with tokens_out greater than 0.

      All models mode:
      Show every selected model, including failed responses.
    */
    const graphModels =
      quickCompareMode === "responded"
        ? respondedModels.slice(0, 15)
        : allSelectedModels.slice(0, 15);

    const graphWidth = 760;
    const graphHeight = 320;

    const paddingLeft = 60;
    const paddingRight = 70;
    const paddingTop = 35;
    const paddingBottom = 75;

    const usableWidth =
      graphWidth - paddingLeft - paddingRight;

    const usableHeight =
      graphHeight - paddingTop - paddingBottom;

    const costs = graphModels.map((model) =>
      Number(model.cost_cents)
    );

    const latencies = graphModels.map((model) =>
      Number(model.latency_ms)
    );

    const tokens = graphModels.map((model) =>
      Number(model.tokens_out)
    );

    const maximumCost =
      costs.length > 0 ? Math.max(...costs) : 1;

    const maximumLatency =
      latencies.length > 0 ? Math.max(...latencies) : 1;

    const maximumTokens =
      tokens.length > 0 ? Math.max(...tokens) : 1;

    // Prevent division by zero
    const safeMaximumCost =
      maximumCost === 0 ? 1 : maximumCost;

    const safeMaximumLatency =
      maximumLatency === 0 ? 1 : maximumLatency;

    const safeMaximumTokens =
      maximumTokens === 0 ? 1 : maximumTokens;

    const getX = (index) => {
      if (graphModels.length <= 1) {
        return paddingLeft + usableWidth / 2;
      }

      return (
        paddingLeft +
        (index / (graphModels.length - 1)) *
          usableWidth
      );
    };

    const getCostY = (cost) =>
      paddingTop +
      usableHeight -
      (cost / safeMaximumCost) * usableHeight;

    const getLatencyY = (latency) =>
      paddingTop +
      usableHeight -
      (latency / safeMaximumLatency) *
        usableHeight;

    const getTokenY = (tokenCount) =>
      paddingTop +
      usableHeight -
      (tokenCount / safeMaximumTokens) *
        usableHeight;

    const costPoints = graphModels
      .map(
        (model, index) =>
          `${getX(index)},${getCostY(
            Number(model.cost_cents)
          )}`
      )
      .join(" ");

    const latencyPoints = graphModels
      .map(
        (model, index) =>
          `${getX(index)},${getLatencyY(
            Number(model.latency_ms)
          )}`
      )
      .join(" ");

    const tokenPoints = graphModels
      .map(
        (model, index) =>
          `${getX(index)},${getTokenY(
            Number(model.tokens_out)
          )}`
      )
      .join(" ");

    /*
      Only use models that responded for the summary cards.

      Otherwise, a failed model with zero cost and latency
      would incorrectly appear as the cheapest and fastest.
    */
    const summaryModels = respondedModels.slice(0, 15);

    const cheapestModel =
      summaryModels.length > 0
        ? summaryModels.reduce((cheapest, current) =>
            Number(current.cost_cents) <
            Number(cheapest.cost_cents)
              ? current
              : cheapest
          )
        : null;

    const fastestModel =
      summaryModels.length > 0
        ? summaryModels.reduce((fastest, current) =>
            Number(current.latency_ms) <
            Number(fastest.latency_ms)
              ? current
              : fastest
          )
        : null;

    const lowestTokenModel =
      summaryModels.length > 0
        ? summaryModels.reduce((lowest, current) =>
            Number(current.tokens_out) <
            Number(lowest.tokens_out)
              ? current
              : lowest
          )
        : null;

    return (
      <>
        {/* Background behind modal */}
        <div
          onClick={toggleQuickCompare}
          style={{
            position: "fixed",
            inset: 0,
            background: overlayBg,
            backdropFilter: "blur(4px)",
            zIndex: 1000,
          }}
        />

        {/* Quick Compare modal */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Quick model comparison"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",

            width: "min(940px, calc(100vw - 32px))",
            maxHeight: "calc(100vh - 40px)",
            boxSizing: "border-box",
            padding: "clamp(16px, 4vw, 24px)",

            overflowY: "auto",

            background: panelBg,
            border: panelBorder,
            borderRadius: "18px",

            color: panelText,

            boxShadow:
              "0 24px 70px rgba(0, 0, 0, 0.35)",

            zIndex: 1001,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "16px",
              marginBottom: "18px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontFamily:
                    '"Cormorant Garamond", serif',
                  fontSize: "32px",
                  fontWeight: 700,
                }}
              >
                Quick Compare
              </h2>
            </div>

            <Button
              darkMode={darkMode}
              size="sqr"
              onClick={toggleQuickCompare}
              aria-label="Close quick compare"
              style={{
                minWidth: "38px",
                width: "38px",
                height: "38px",
                padding: 0,
                flexShrink: 0,
              }}
            >
              x
            </Button>
          </div>

          {/* Mode buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "10px",

              width: "100%",
              boxSizing: "border-box",
              marginBottom: "18px",
              padding: "6px",

              backgroundColor: darkMode
                ? "rgba(0, 0, 0, 0.18)"
                : "#f1f5f9",

              border: darkMode
                ? "1px solid rgba(255, 255, 255, 0.07)"
                : "1px solid #e2e8f0",

              borderRadius: "12px",
            }}
          >
            <button
              type="button"
              disabled={quickCompareAnimating}
              onClick={() =>
                changeQuickCompareMode("responded")
              }
              style={{
                flex: "1 1 220px",
                padding: "10px 16px",

                color:
                  quickCompareMode === "responded"
                    ? darkMode
                      ? "#ffffff"
                      : "#111827"
                    : mutedText,

                backgroundColor:
                  quickCompareMode === "responded"
                    ? darkMode
                      ? "rgba(255, 255, 255, 0.1)"
                      : "#ffffff"
                    : "transparent",

                border:
                  quickCompareMode === "responded"
                    ? darkMode
                      ? "1px solid rgba(255, 255, 255, 0.14)"
                      : "1px solid #d7dce5"
                    : "1px solid transparent",

                borderRadius: "9px",

                fontSize: "13px",
                fontWeight: 700,
                cursor: quickCompareAnimating
                  ? "default"
                  : "pointer",
                opacity: quickCompareAnimating ? 0.72 : 1,
                transition:
                  "background-color 0.22s ease, border-color 0.22s ease, color 0.22s ease, opacity 0.22s ease, transform 0.22s ease",
              }}
            >
              Models that responded ({respondedModels.length})
            </button>

            <button
              type="button"
              disabled={quickCompareAnimating}
              onClick={() =>
                changeQuickCompareMode("all")
              }
              style={{
                flex: "1 1 220px",
                padding: "10px 16px",

                color:
                  quickCompareMode === "all"
                    ? darkMode
                      ? "#ffffff"
                      : "#111827"
                    : mutedText,

                backgroundColor:
                  quickCompareMode === "all"
                    ? darkMode
                      ? "rgba(255, 255, 255, 0.1)"
                      : "#ffffff"
                    : "transparent",

                border:
                  quickCompareMode === "all"
                    ? darkMode
                      ? "1px solid rgba(255, 255, 255, 0.14)"
                      : "1px solid #d7dce5"
                    : "1px solid transparent",

                borderRadius: "9px",

                fontSize: "13px",
                fontWeight: 700,
                cursor: quickCompareAnimating
                  ? "default"
                  : "pointer",
                opacity: quickCompareAnimating ? 0.72 : 1,
                transition:
                  "background-color 0.22s ease, border-color 0.22s ease, color 0.22s ease, opacity 0.22s ease, transform 0.22s ease",
              }}
            >
              All selected models ({allSelectedModels.length})
            </button>
          </div>

          <div
            key={quickCompareMode}
            style={{
              opacity: quickCompareAnimating ? 0 : 1,
              transform: quickCompareAnimating
                ? "translateY(8px) scale(0.995)"
                : "translateY(0) scale(1)",
              transition:
                "opacity 0.18s ease, transform 0.18s ease",
              animation: quickCompareAnimating
                ? "none"
                : "quickCompareEnter 0.28s ease-out",
              pointerEvents: quickCompareAnimating
                ? "none"
                : "auto",
              willChange: "opacity, transform",
            }}
          >
          {graphModels.length > 0 ? (
            <>
              {/* Summary cards */}
              {summaryModels.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(min(210px, 100%), 1fr))",
                    gap: "12px",
                    marginBottom: "18px",
                  }}
                >
                  {/* Cheapest model */}
                  <div
                    style={{
                      boxSizing: "border-box",
                      padding: "15px",

                      backgroundColor: darkMode
                        ? "rgba(255, 255, 255, 0.04)"
                        : "#f8fafc",

                      border: darkMode
                        ? "1px solid rgba(255, 255, 255, 0.08)"
                        : "1px solid #e2e8f0",

                      borderRadius: "12px",
                    }}
                  >
                    <div
                      style={{
                        color: mutedText,
                        fontSize: "12px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Cheapest response
                    </div>

                    <div
                      style={{
                        marginTop: "7px",
                        color: panelText,
                        fontSize: "14px",
                        fontWeight: 700,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {cheapestModel.model_id}
                    </div>

                    <div
                      style={{
                        marginTop: "5px",
                        color: darkMode
                          ? "#86efac"
                          : "#166534",
                        fontSize: "13px",
                      }}
                    >
                      $
                      {Number(
                        cheapestModel.cost_cents
                      ).toFixed(6)}
                    </div>
                  </div>

                  {/* Fastest model */}
                  <div
                    style={{
                      boxSizing: "border-box",
                      padding: "15px",

                      backgroundColor: darkMode
                        ? "rgba(255, 255, 255, 0.04)"
                        : "#f8fafc",

                      border: darkMode
                        ? "1px solid rgba(255, 255, 255, 0.08)"
                        : "1px solid #e2e8f0",

                      borderRadius: "12px",
                    }}
                  >
                    <div
                      style={{
                        color: mutedText,
                        fontSize: "12px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Fastest response
                    </div>

                    <div
                      style={{
                        marginTop: "7px",
                        color: panelText,
                        fontSize: "14px",
                        fontWeight: 700,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {fastestModel.model_id}
                    </div>

                    <div
                      style={{
                        marginTop: "5px",
                        color: darkMode
                          ? "#93c5fd"
                          : "#1d4ed8",
                        fontSize: "13px",
                      }}
                    >
                      {Number(
                        fastestModel.latency_ms
                      ).toFixed(0)}{" "}
                      ms
                    </div>
                  </div>

                  {/* Lowest token usage */}
                  <div
                    style={{
                      boxSizing: "border-box",
                      padding: "15px",

                      backgroundColor: darkMode
                        ? "rgba(255, 255, 255, 0.04)"
                        : "#f8fafc",

                      border: darkMode
                        ? "1px solid rgba(255, 255, 255, 0.08)"
                        : "1px solid #e2e8f0",

                      borderRadius: "12px",
                    }}
                  >
                    <div
                      style={{
                        color: mutedText,
                        fontSize: "12px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Lowest token usage
                    </div>

                    <div
                      style={{
                        marginTop: "7px",
                        color: panelText,
                        fontSize: "14px",
                        fontWeight: 700,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {lowestTokenModel.model_id}
                    </div>

                    <div
                      style={{
                        marginTop: "5px",
                        color: darkMode
                          ? "#d8b4fe"
                          : "#7e22ce",
                        fontSize: "13px",
                      }}
                    >
                      {Number(
                        lowestTokenModel.tokens_out
                      ).toLocaleString()}{" "}
                      tokens
                    </div>
                  </div>
                </div>
              )}

              {/* Graph card */}
              <div
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "18px",

                  backgroundColor: darkMode
                    ? "rgba(0, 0, 0, 0.18)"
                    : "#f8fafc",

                  border: darkMode
                    ? "1px solid rgba(255, 255, 255, 0.07)"
                    : "1px solid #e2e8f0",

                  borderRadius: "14px",
                }}
              >
                {/* Legend */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: "20px",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      fontSize: "12px",
                      fontWeight: 650,
                    }}
                  >
                    <span
                      style={{
                        width: "22px",
                        height: "3px",
                        backgroundColor: "#22c55e",
                        borderRadius: "10px",
                      }}
                    />

                    Cost
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      fontSize: "12px",
                      fontWeight: 650,
                    }}
                  >
                    <span
                      style={{
                        width: "22px",
                        height: "3px",
                        backgroundColor: "#3b82f6",
                        borderRadius: "10px",
                      }}
                    />

                    Latency
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                      fontSize: "12px",
                      fontWeight: 650,
                    }}
                  >
                    <span
                      style={{
                        width: "22px",
                        height: "3px",
                        backgroundColor: "#a855f7",
                        borderRadius: "10px",
                      }}
                    />

                    Output tokens
                  </div>

                  {quickCompareMode === "all" && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "7px",
                        fontSize: "12px",
                        fontWeight: 650,
                      }}
                    >
                      <span
                        style={{
                          width: "9px",
                          height: "9px",
                          backgroundColor: "#71717a",
                          borderRadius: "50%",
                        }}
                      />

                      No response
                    </div>
                  )}
                </div>

                {/* Graph */}
                <div
                  style={{
                    width: "100%",
                    overflowX: "auto",
                  }}
                >
                  <svg
                    viewBox={`0 0 ${graphWidth} ${graphHeight}`}
                    style={{
                      display: "block",
                      width: "100%",
                      minWidth: 0,
                      height: "auto",
                    }}
                  >
                    {/* Horizontal grid lines */}
                    {[0, 1, 2, 3, 4].map(
                      (lineNumber) => {
                        const y =
                          paddingTop +
                          (lineNumber / 4) *
                            usableHeight;

                        return (
                          <line
                            key={lineNumber}
                            x1={paddingLeft}
                            x2={
                              graphWidth -
                              paddingRight
                            }
                            y1={y}
                            y2={y}
                            stroke={
                              darkMode
                                ? "rgba(255,255,255,0.09)"
                                : "rgba(15,23,42,0.1)"
                            }
                            strokeWidth="1"
                          />
                        );
                      }
                    )}

                    {/* Cost scale */}
                    <text
                      x="15"
                      y={graphHeight / 2}
                      fill={
                        darkMode
                          ? "#86efac"
                          : "#166534"
                      }
                      fontSize="11"
                      fontWeight="700"
                      textAnchor="middle"
                      transform={`rotate(-90 15 ${
                        graphHeight / 2
                      })`}
                    >
                      Cost
                    </text>

                    <text
                      x={paddingLeft - 8}
                      y={paddingTop + 4}
                      fill={mutedText}
                      fontSize="10"
                      textAnchor="end"
                    >
                      ${maximumCost.toFixed(5)}
                    </text>

                    <text
                      x={paddingLeft - 8}
                      y={
                        paddingTop +
                        usableHeight +
                        4
                      }
                      fill={mutedText}
                      fontSize="10"
                      textAnchor="end"
                    >
                      $0
                    </text>

                    {/* Right-side maximum values */}
                    <text
                      x={
                        graphWidth -
                        paddingRight +
                        8
                      }
                      y={paddingTop + 4}
                      fill={
                        darkMode
                          ? "#93c5fd"
                          : "#1d4ed8"
                      }
                      fontSize="10"
                    >
                      {maximumLatency.toFixed(0)} ms
                    </text>

                    <text
                      x={
                        graphWidth -
                        paddingRight +
                        8
                      }
                      y={paddingTop + 19}
                      fill={
                        darkMode
                          ? "#d8b4fe"
                          : "#7e22ce"
                      }
                      fontSize="10"
                    >
                      {maximumTokens.toLocaleString()} tokens
                    </text>

                    <text
                      x={
                        graphWidth -
                        paddingRight +
                        8
                      }
                      y={
                        paddingTop +
                        usableHeight +
                        4
                      }
                      fill={mutedText}
                      fontSize="10"
                    >
                      0
                    </text>

                    {/* Metric lines */}
                    <polyline
                      points={costPoints}
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    <polyline
                      points={latencyPoints}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    <polyline
                      points={tokenPoints}
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Model points */}
                    {graphModels.map((model, index) => {
                      const x = getX(index);

                      const costY = getCostY(
                        Number(model.cost_cents)
                      );

                      const latencyY = getLatencyY(
                        Number(model.latency_ms)
                      );

                      const tokenY = getTokenY(
                        Number(model.tokens_out)
                      );

                      const shortenedName =
                        model.model_id.length > 13
                          ? model.model_id.slice(0, 13) +
                            "..."
                          : model.model_id;

                      const hoverText = `${model.model_id}
Status: ${model.responded ? "Responded" : "No response"}
Cost: $${Number(model.cost_cents).toFixed(6)}
Latency: ${Number(model.latency_ms).toFixed(0)} ms
Output tokens: ${Number(model.tokens_out).toLocaleString()}`;

                      return (
                        <g key={`${model.model_id}-${index}`}>
                          {/* Cost point */}
                          <circle
                            cx={x}
                            cy={costY}
                            r="6"
                            fill={
                              model.responded
                                ? "#22c55e"
                                : "#71717a"
                            }
                            stroke={
                              darkMode
                                ? "#16171d"
                                : "#ffffff"
                            }
                            strokeWidth="2"
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            <title>{hoverText}</title>
                          </circle>

                          {/* Latency point */}
                          <circle
                            cx={x}
                            cy={latencyY}
                            r="6"
                            fill={
                              model.responded
                                ? "#3b82f6"
                                : "#71717a"
                            }
                            stroke={
                              darkMode
                                ? "#16171d"
                                : "#ffffff"
                            }
                            strokeWidth="2"
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            <title>{hoverText}</title>
                          </circle>

                          {/* Token point */}
                          <circle
                            cx={x}
                            cy={tokenY}
                            r="6"
                            fill={
                              model.responded
                                ? "#a855f7"
                                : "#71717a"
                            }
                            stroke={
                              darkMode
                                ? "#16171d"
                                : "#ffffff"
                            }
                            strokeWidth="2"
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            <title>{hoverText}</title>
                          </circle>

                          {/* Larger invisible hover target */}
                          <circle
                            cx={x}
                            cy={
                              model.responded
                                ? Math.min(
                                    costY,
                                    latencyY,
                                    tokenY
                                  )
                                : paddingTop +
                                  usableHeight
                            }
                            r="13"
                            fill="transparent"
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            <title>{hoverText}</title>
                          </circle>

                          {/* Model name */}
                          <text
                            x={x}
                            y={
                              paddingTop +
                              usableHeight +
                              20
                            }
                            fill={
                              model.responded
                                ? mutedText
                                : "#71717a"
                            }
                            fontSize="9"
                            fontWeight={
                              model.responded
                                ? "400"
                                : "700"
                            }
                            textAnchor="end"
                            transform={`rotate(-35 ${x} ${
                              paddingTop +
                              usableHeight +
                              20
                            })`}
                          >
                            {shortenedName}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Written comparison */}
              {costTxt && (
                <div
                  style={{
                    ...styles.cost,

                    width: "100%",
                    boxSizing: "border-box",
                    marginTop: "16px",
                    padding: "14px 18px",

                    backgroundColor: darkMode
                      ? "rgba(255, 255, 255, 0.04)"
                      : "#f8fafc",

                    border: darkMode
                      ? "1px solid rgba(255, 255, 255, 0.08)"
                      : "1px solid #e2e8f0",

                    borderRadius: "12px",

                    textAlign: "center",
                    fontSize: "15px",
                    fontWeight: 500,
                    lineHeight: 1.6,

                    whiteSpace: "pre-wrap",
                  }}
                >
                  {costTxt}
                </div>
              )}
            </>
          ) : (
            <div
              style={{
                minHeight: "180px",

                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",

                color: mutedText,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  marginBottom: "10px",
                  fontSize: "32px",
                }}
              >
                —
              </div>

              <div
                style={{
                  color: panelText,
                  fontSize: "15px",
                  fontWeight: 700,
                }}
              >
                {quickCompareMode === "responded"
                  ? "No models produced a response"
                  : "No models selected"}
              </div>

              <div
                style={{
                  marginTop: "5px",
                  fontSize: "12px",
                }}
              >
                {quickCompareMode === "responded"
                  ? "Switch to All selected models to view every attempted model."
                  : "Select models and send a prompt before using Quick Compare."}
              </div>
            </div>
          )}
          </div>
        </div>
      </>
    );
  })()
)}

          <div
          
            style={{
              ...styles.response,
              opacity: responses.length === 0 ? 0 : 1,
              width: "100%",
              maxWidth: "900px",
            }}
            
          >
            {displayTxt || "Choose a model response to preview details here."}
          </div>

        </div>
      )}


      {!viewParam &&
       !viewModels &&
       !viewCompare &&
       !viewResponse && (

      <>

        <div className="main-column" style={styles.mainColumn}>
          <h1 align="center" style={styles.titleTxt}>SwiftEval</h1>
          <h2 align="center" style={styles.secondaryTxt}>{secondTxt}</h2>


          <MainPrompt
            value={prompt}
            darkMode={darkMode}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask me anything..."
          >
            <Button
              darkMode={darkMode}
              size="sqr"
              onClick={sendPrompt}
              disabled={loading}
            >
              {loading ? (
                <span
                  aria-label="Loading"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "3px",
                    height: "18px",
                  }}
                >
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      style={{
                        display: "block",
                        width: "5px",
                        height: "5px",
                        backgroundColor: "currentColor",
                        borderRadius: "50%",
                        animation:
                          "loadingDotBounce 1s ease-in-out infinite",
                        animationDelay: `${dot * 0.14}s`,
                      }}
                    />
                  ))}
                </span>
              ) : (
                "→"
              )}
            </Button>
          </MainPrompt>





          <h4
            style={styles.error}
            align="center"
          >
            {errorTxt}
          </h4>

        </div>
      </>
      )}

      </div>
    </>
  );
};
