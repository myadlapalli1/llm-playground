import "./dropdown.css";
import data from "../../../../backend/data/models.json";
import { useState, useEffect, useRef} from "react";


const Dropdown = ({setModel, updateId, updateNames}) => {
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

   const modelOptions = [];

if (data.models[0]) {
    modelOptions.push({
        id: 1,
        label: data.models[0].display_name,
        value: data.models[0].model_id,
    });
}
if (data.models[1]) {
    modelOptions.push({
        id: 2,
        label: data.models[1].display_name,
        value: data.models[1].model_id,
    });
}
if (data.models[2]) {
    modelOptions.push({
        id: 3,
        label: data.models[2].display_name,
        value: data.models[2].model_id,
    });
}
if (data.models[3]) {
    modelOptions.push({
        id: 4,
        label: data.models[3].display_name,
        value: data.models[3].model_id,
    });
}
if (data.models[4]) {
    modelOptions.push({
        id: 5,
        label: data.models[4].display_name,
        value: data.models[4].model_id,
    });
}
if (data.models[5]) {
    modelOptions.push({
        id: 6,
        label: data.models[5].display_name,
        value: data.models[5].model_id,
    });
}
if (data.models[6]) {
    modelOptions.push({
        id: 7,
        label: data.models[6].display_name,
        value: data.models[6].model_id,
    });
}
if (data.models[7]) {
    modelOptions.push({
        id: 8,
        label: data.models[7].display_name,
        value: data.models[7].model_id,
    });
}
if (data.models[8]) {
    modelOptions.push({
        id: 9,
        label: data.models[8].display_name,
        value: data.models[8].model_id,
    });
}
if (data.models[9]) {
    modelOptions.push({
        id: 10,
        label: data.models[9].display_name,
        value: data.models[9].model_id,
    });
}

    return (
        <div className="dropdown" ref={dropdownRef}>
            <button 
            className="toggle" 
            onClick={() => {
                setDropdownToggled(!dropdownToggled);
            }}
            >
                <span>{selectedOption ? selectedOption.label : "Select models"}</span>
                <span>{dropdownToggled ? " -": " +"}</span>
            </button>
            <div className={`options ${dropdownToggled ? "visible" : ""}`}>
                {modelOptions.map((option, index) => {
                    return <button key={index} onClick={() => {
                        setSelectedOption(option);
                        setModel(option.value);
                        setDropdownToggled(false);
                        updateId(option.value);
                        updateNames(option.label)
                    }}>{option.label}</button>;
                })}
            </div>
        </div>
    );
};
export default Dropdown