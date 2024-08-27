import React, { useEffect, useState } from "react";

export default function UploadMedia({
  name,
  label,
  setValue,
  register,
  errors,
  video,
  image,
  previewMedia,
}) {
  // console.log("set val", setValue);
  const [media, setMedia] = useState({
    file: "",
    preview: previewMedia || "",
  });

  useEffect(() => {
    register(name);
    setValue(name, media.file);
  }, [register, name, setValue, media.file]);

  useEffect(() => {
    if (previewMedia) {
      setMedia((prev) => ({ ...prev, preview: previewMedia }));
    }
  }, [previewMedia]);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(uploadedFile);
      reader.onloadend = () => {
        setMedia({ file: uploadedFile, preview: reader.result });
      };
    }
  };

  const handleReset = () => {
    setMedia({ file: "", preview: previewMedia || "" });
  };

  return (
    <div>
      <h1>{label}</h1>
      <div className="bg-slate-500 my-5 p-5">
        {media.preview && (video || image) ? (
          video ? (
            <video
              src={media.preview}
              alt={label}
              controls
              className="h-[300px] w-[500px] m-5"
            />
          ) : (
            <img
              src={media.preview}
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
          {media.file && (
            <button
              type="reset"
              className="bg-yellow-400"
              onClick={handleReset}
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
