import React, { useEffect, useState } from "react";

export default function RequirementField({
  name,
  label,
  register,
  errors,
  setValue,
  getValues,
}) {
  const [requirement, setRequirement] = useState("");
  const [requirementList, setRequirementList] = useState([]);

  useEffect(() => {
    register(name, {
      required: true,
      validate: (value) => value.length > 0,
    });
  }, []);

  useEffect(() => {
    setValue(name, requirementList);
  }, [name, requirementList, setValue]);

  const addReqHandler = () => {
    if (requirement) {
      setRequirementList([...requirementList, requirement ]);
      setRequirement("");
    }
  };
  const removeReqHandler = (index) => {
    const updateReqList = [...requirementList];
    updateReqList.splice(index, 1);
    setRequirementList(updateReqList);
  };

  console.log("requirementList", requirementList);
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <div>
        <input
          type="text"
          id={name}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
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
        {requirementList.length === 0 && <span>Add Requirements</span>}
        {requirementList.length > 0 && (
          <ul>
            {requirementList.map((requirement, index) => (
              <li key={index} className="flex items-center bg-cyan-300">
                <span className="bg-red-400">{requirement}</span>
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
      {errors[name] && <span>{label} is required</span>}
    </div>
  );
}
