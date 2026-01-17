import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

interface ModalData {
  text1?: string;
  text2?: string;
  btn1Text?: string;
  btn2Text?: string;
  btn1Handler?: () => void;
  btn2Handler?: () => void;
}

interface ModalProps {
  modalData: ModalData;
}

export default function Modal({ modalData }: ModalProps) {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && modalData?.btn2Handler) {
      modalData.btn2Handler();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-black2 rounded-xl shadow-2xl border border-black5 max-w-md w-full animate-in fade-in zoom-in duration-200">
        {/* Modal Content */}
        <div className="p-6">
          {/* Icon and Title */}
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red2/20 flex items-center justify-center">
              <FaExclamationTriangle className="text-red2 text-xl" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">
                {modalData.text1 || "Confirm Action"}
              </h3>
              <p className="text-white4 text-sm leading-relaxed">
                {modalData.text2 || "Are you sure you want to proceed?"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={modalData?.btn2Handler}
              className="flex-1 px-4 py-2.5 bg-black3 hover:bg-black4 text-white rounded-lg transition-colors font-medium border border-black5"
            >
              {modalData.btn2Text || "Cancel"}
            </button>
            <button
              onClick={modalData?.btn1Handler}
              className="flex-1 px-4 py-2.5 bg-red2 hover:bg-red2/90 text-white rounded-lg transition-colors font-medium"
            >
              {modalData.btn1Text || "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

