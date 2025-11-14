import React from "react";

export default function Modal({ modalData }) {
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
