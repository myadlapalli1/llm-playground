import "./dropdown.css"
import { useState, useEffect, useRef} from "react"


const Dropdown = ({setModel, updateId}) => {
    const [dropdownToggled, setDropdownToggled] = useState(false)
    const [selectedOption, setSelectedOption] = useState(null)
    const dropdownRef = useRef(null);


    useEffect(() => {
        function handler(e) {
            if (dropdownRef.current) {
                if (!dropdownRef.current.contains(e.target)) {
                    setDropdownToggled(false)
                }
            }
        }

        document.addEventListener('click', handler)

        return () => {
            document.removeEventListener('click', handler)
        }
    });

    const modelOptions = [
        {
            id: 1,
            label: "Llama 3.3 70B Instruct",
            value: "meta/llama-3.3-70b-instruct",
        },
        {
            id: 2,
            label: "Llama 3.2 1B Instruct",
            value: "meta/llama-3.2-1b-instruct",
        },
        {
            id: 3,
            label: "GPT 120b",
            value: "openai/gpt-oss-120b",
        },
        {
            id: 4,
            label: "Mixtral 14B Instruct",
            value: "mistralai/ministral-14b-instruct-2512",
        },
        {
            id: 5,
            label: "Qwen 3.5 122B",
            value: "qwen/qwen3.5-122b-a10b",
        },
        {
            id: 6,
            label: "Gemma 2 2B Instruct",
            value: "google/gemma-3n-e2b-it",
        },
        {
            id: 7,
            label: "Deepseek v4 flash",
            value: "deepseek-ai/deepseek-v4-flash",
        },
    ];

    return (
        <div className="dropdown" ref={dropdownRef}>
            <button 
            className="toggle" 
            onClick={() => {
                setDropdownToggled(!dropdownToggled);
            }}
            >
                <span>{selectedOption ? selectedOption.label : "Select models"}</span>
                <span>{dropdownToggled ? "-": "+"}</span>
            </button>
            <div className={`options ${dropdownToggled ? "visible" : ""}`}>
                {modelOptions.map((option, index) => {
                    return <button key={index} onClick={() => {
                        setSelectedOption(option);
                        setModel(option.value);
                        setDropdownToggled(false);
                        updateId(option.value);
                    }}>{option.label}</button>;
                })}
            </div>
        </div>
    );
};
export default Dropdown