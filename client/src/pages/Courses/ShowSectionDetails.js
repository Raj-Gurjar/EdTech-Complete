import React, { useEffect, useState } from "react";
import { getSectionDetails } from "../../services/operations/courseDetailsAPI";
import { Link, useParams } from "react-router-dom";

export default function ShowSectionDetails() {
  const [sectionData, setSectionData] = useState(null);
  const [loading, setLoading] = useState(false);

  const sectionId = useParams();
  const showSection = async () => {
    setLoading(true);
    const result = await getSectionDetails(sectionId);

    if (result) {
      setSectionData(result?.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (sectionId) {
      showSection();
    }
  }, []);

  console.log("sectionData :", sectionData);

  return (
    <div>
      <h1 className="text-2xl">Section Page</h1>

      <div className="bg-slate-300 my-5">
        <p>Section name: {sectionData?.sectionName}</p>
        <p>Short desc: {sectionData?.shortDescription}</p>
        <p>long desc: {sectionData?.longDescription}</p>
      </div>

      <div className="bg-pink-300">
        <h1>Section Content</h1>
        <p>Total Lessons: {sectionData?.subSections?.length}</p>

        {sectionData?.subSections?.map((subSection, index) => (
          <div key={index} className="bg-slate-300 m-5">
            <p>subSec title: {subSection?.title}</p>
            <p>Des: {subSection?.description}</p>
            <p>Lec video:</p>
          </div>
        ))}
      </div>
    </div>
  );
}
