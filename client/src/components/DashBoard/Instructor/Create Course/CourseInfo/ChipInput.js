import React, { useEffect, useState } from "react";

export default function ChipInput({
  name,
  label,
  register,
  errors,
  setValue,
  getValues,
  chipValues,
}) {
  console.log("chip val", chipValues);
  const [chipInput, setChipInput] = useState("");
  const [chipInputList, setChipInputList] = useState(chipValues || []);

  useEffect(() => {
    register(name, {
      required: true,
      validate: (value) => value.length > 0,
    });
  }, []);

  useEffect(() => {
    setValue(name, chipInputList);
  }, [name, chipInputList, setValue]);

  const addReqHandler = () => {
    if (chipInput) {
      setChipInputList([...chipInputList, chipInput]);
      setChipInput("");
    }
  };
  const removeReqHandler = (index) => {
    const updateReqList = [...chipInputList];
    updateReqList.splice(index, 1);
    setChipInputList(updateReqList);
  };

  // console.log("chipInputList", chipInputList);
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <div>
        <input
          type="text"
          id={name}
          value={chipInput}
          onChange={(e) => setChipInput(e.target.value)}
          className="w-full"
        />
      </div>

      <button
        type="button"
        onClick={addReqHandler}
        className="bg-yellow-200 font-semibold"
      >
        Add
      </button>
      <div className="bg-blue-200">
        {chipInputList.length === 0 && <span>Add {label}</span>}
        {chipInputList.length > 0 && (
          <ul>
            {chipInputList.map((chipInput, index) => (
              <li key={index} className="flex items-center bg-cyan-300">
                <span className="bg-red-400">{chipInput}</span>
                <button
                  type="button"
                  onClick={() => removeReqHandler(index)}
                  className="text-xl text-yellow-400"
                >
                  clear
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* {errors[name] && <span>{label} is required</span>} */}
    </div>
  );
}
