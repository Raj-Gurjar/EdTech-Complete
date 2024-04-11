import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxDropdownMenu } from "react-icons/rx";
import { FaRegEdit } from "react-icons/fa";
import { AiTwotoneDelete } from "react-icons/ai";

export default function SectionDetails({ handleChangeEditSecName }) {
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [addSubSection, setAddSubSection] = useState(null);
  const [viewSubSection, setViewSubSection] = useState(null);
  const [editSubSection, setEditSubSection] = useState(null);
  console.log("inside section details");
  return (
    <div>
      <h1 className="text-2xl">Section Details</h1>

      <div>
        {course?.courseContent?.map((section) => (
          <details key={section._id} open>
            <summary className="flex bg-green-300 m-1 justify-between gap-x-3">
              <div className="flex bg-red-300 gap-4">
                <RxDropdownMenu />
                <p>{section.sectionName}</p>
                <div>
                  {/* <button
                    onClick={handleChangeEditSecName(
                      section._id,
                      section.sectionName
                    )}
                  >
                    <FaRegEdit />
                  </button> */}

                  <button
                  onClick={() =>
                  {
                    
                  }}>
                    <AiTwotoneDelete />
                  </button>
                </div>
              </div>
            </summary>
          </details>
        ))}
      </div>
    </div>
  );
}
