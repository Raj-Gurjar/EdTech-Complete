import React, { useEffect, useState } from "react";

export default function UploadMedia({
  name,
  label,
  setValue,
  register,
  errors,
  video,
  image,
}) {
  const [file, setFile] = useState("");
  const [previewFile, setPreviewFile] = useState("");

  useEffect(() => {
    register(name);
  }, []);

  useEffect(() => {
    setValue(name, file);
  }, [name, file, setValue]);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    TransformFile(uploadedFile);
  };

  const TransformFile = (file) => {
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPreviewFile(reader.result);
      };
    } else {
      setPreviewFile("");
    }
  };

  return (
    <div>
      <h1>{label}</h1>
      <div className="bg-slate-500 my-5 p-5">
        {file && (video || image) ? (
          video ? (
            <video
              src={previewFile}
              alt={label}
              controls
              className="h-[300px] w-[500px] m-5"
            />
          ) : (
            <img
              src={previewFile}
              alt={label}
              className="h-[300px] w-[500px] m-5"
            />
          )
        ) : (
          <h1>Add {label}</h1>
        )}
        <div className="flex gap-x-4">
          <input
            type="file"
            onChange={handleFileChange}
            accept={image ? "image/*" : video ? "video/*" : ""}
          />
          {file && (
            <button
              type="reset"
              className="bg-yellow-400"
              onClick={() => setFile("")}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      {errors[name] && <span>{label} is required</span>}
    </div>
  );
}
