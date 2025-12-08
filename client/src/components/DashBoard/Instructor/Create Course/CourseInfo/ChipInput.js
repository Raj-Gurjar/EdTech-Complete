import React, { useEffect, useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

export default function ChipInput({
  name,
  label,
  register,
  errors,
  setValue,
  getValues,
  chipValues,
}) {
  const [chipInput, setChipInput] = useState("");
  
  // Handle different input types: array, string, or empty
  const getInitialChips = () => {
    if (!chipValues) return [];
    if (Array.isArray(chipValues)) return chipValues;
    if (typeof chipValues === 'string') {
      // If it's a comma-separated string, split it
      if (chipValues.includes(',')) {
        return chipValues.split(',').map(item => item.trim()).filter(item => item);
      }
      return [chipValues];
    }
    return [];
  };

  const [chipInputList, setChipInputList] = useState(getInitialChips());

  useEffect(() => {
    register(name, {
      required: true,
      validate: (value) => value.length > 0,
    });
  }, [register, name]);

  // Update chips when chipValues prop changes (for edit mode)
  useEffect(() => {
    if (chipValues !== undefined) {
      const newChips = getInitialChips();
      setChipInputList(newChips);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chipValues]);

  useEffect(() => {
    setValue(name, chipInputList);
  }, [name, chipInputList, setValue]);

  const addReqHandler = (e) => {
    e.preventDefault();
    const trimmedInput = chipInput.trim();
    if (trimmedInput && !chipInputList.includes(trimmedInput)) {
      setChipInputList([...chipInputList, trimmedInput]);
      setChipInput("");
    }
  };

  const removeReqHandler = (index) => {
    const updateReqList = [...chipInputList];
    updateReqList.splice(index, 1);
    setChipInputList(updateReqList);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addReqHandler(e);
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-white">
        {label} <span className="text-red2">*</span>
      </label>
      
      {/* Input and Add Button */}
      <div className="flex gap-2">
        <input
          type="text"
          id={name}
          value={chipInput}
          onChange={(e) => setChipInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Add ${label.toLowerCase()}...`}
          className="flex-1 bg-black3 border border-black5 rounded-lg px-4 py-2.5 text-white placeholder:text-white4 focus:outline-none focus:border-yellow8 transition-colors"
        />
        <button
          type="button"
          onClick={addReqHandler}
          disabled={!chipInput.trim()}
          className="px-4 py-2.5 bg-yellow8 hover:bg-yellow9 text-black rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <FaPlus className="text-sm" />
          <span>Add</span>
        </button>
      </div>

      {/* Chips Display */}
      <div className="min-h-[60px] bg-black3 border border-black5 rounded-lg p-3">
        {chipInputList.length === 0 ? (
          <p className="text-white4 text-sm italic">No {label.toLowerCase()} added yet. Add your first one above.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {chipInputList.map((chip, index) => (
              <div
                key={index}
                className="group flex items-center gap-2 bg-black2 border border-black5 rounded-lg px-3 py-1.5 hover:border-yellow8 transition-colors"
              >
                <span className="text-white text-sm">{chip}</span>
                <button
                  type="button"
                  onClick={() => removeReqHandler(index)}
                  className="text-white4 hover:text-red2 transition-colors"
                  aria-label={`Remove ${chip}`}
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {errors[name] && (
        <p className="text-red2 text-sm mt-1">{label} is required. Please add at least one item.</p>
      )}
    </div>
  );
}
