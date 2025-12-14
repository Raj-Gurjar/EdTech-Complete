import React from "react";

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
  console.log("modal called");
  return (
    <div>
      <div className="flex flex-col p-4 bg-red3 z-77 absolute m-auto top-[50%] left-[50%] translate-[50%] ">
        <p>{modalData.text1}</p>
        <p>{modalData.text2}</p>

        <div className="flex gap-10">
          <button onClick={modalData?.btn1Handler}>{modalData.btn1Text}</button>
          <button onClick={modalData?.btn2Handler}>{modalData.btn2Text}</button>
        </div>
      </div>
    </div>
  );
}

