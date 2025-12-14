import React, { useEffect, useState } from "react";
import { UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form";

interface UploadMediaProps {
  name: string;
  label: string;
  setValue: UseFormSetValue<any>;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  video?: boolean;
  image?: boolean;
  previewMedia?: string;
}

interface MediaState {
  file: File | string;
  preview: string;
}

export default function UploadMedia({
  name,
  label,
  setValue,
  register,
  errors,
  video,
  image,
  previewMedia,
}: UploadMediaProps) {
  const [media, setMedia] = useState<MediaState>({
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(uploadedFile);
      reader.onloadend = () => {
        setMedia({ file: uploadedFile, preview: reader.result as string });
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
