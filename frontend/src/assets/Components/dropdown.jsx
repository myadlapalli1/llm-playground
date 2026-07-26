import "./dropdown.css"
import data from "../../../../backend/data/models.json"
import { useEffect, useRef, useState } from "react"

const Dropdown = ({
  setModel,
  updateId,
  updateNames,
  darkMode = true,
}) => {
  const [dropdownToggled, setDropdownToggled] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)

  const dropdownRef = useRef(null)
  
  // Close the dropdown when the user clicks outside it
  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownToggled(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [])

  // Create options from the first 10 models
  const modelOptions = data.models.slice(0, 10).map((model, index) => ({
    id: model.model_id || index,
    label: model.display_name,
    value: model.model_id,
  }))

  function selectModel(option) {
    setSelectedOption(option)
    setModel(option.value)
    updateId(option.value)
    updateNames(option.label)
    setDropdownToggled(false)
  }

  return (
    <div
      ref={dropdownRef}
      className={`dropdown ${
        darkMode ? "dropdown-dark" : "dropdown-light"
      }`}
    >
      <button
        type="button"
        className={`dropdown-toggle ${
          dropdownToggled ? "dropdown-toggle-open" : ""
        }`}
        onClick={() => {
          setDropdownToggled((currentValue) => !currentValue)
        }}
        aria-expanded={dropdownToggled}
        aria-haspopup="listbox"
      >
        <span className="dropdown-toggle-content">
          <span className="dropdown-label">
            {selectedOption
              ? selectedOption.label
              : "Select a model"}
          </span>

          {selectedOption && (
            <span className="dropdown-model-id">
              {selectedOption.value}
            </span>
          )}
        </span>

        <span
          aria-hidden="true"
          className={`dropdown-chevron ${
            dropdownToggled ? "dropdown-chevron-open" : ""
          }`}
        >
          ▾
        </span>
      </button>

      <div
        className={`dropdown-options ${
          dropdownToggled ? "dropdown-options-visible" : ""
        }`}
        role="listbox"
      >
        <div className="dropdown-options-header">
          Available models
        </div>

        <div className="dropdown-options-scroll">
          {modelOptions.map((option, index) => {
            const selected =
              selectedOption?.value === option.value

            return (
              <button
                type="button"
                role="option"
                aria-selected={selected}
                key={`${option.id}-${index}`}
                className={`dropdown-option ${
                  selected ? "dropdown-option-selected" : ""
                }`}
                onClick={() => {
                  selectModel(option)
                }}
              >
                <span className="dropdown-option-text">
                  <span className="dropdown-option-label">
                    {option.label}
                  </span>

                  <span className="dropdown-option-id">
                    {option.value}
                  </span>
                </span>


              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Dropdown