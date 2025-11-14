import React, { useEffect, useState } from "react";
import { getSectionDetails } from "../../services/operations/courseDetailsAPI";
import { Link, useParams } from "react-router-dom";
import { FaBook, FaClock, FaPlayCircle, FaCheckCircle } from "react-icons/fa";
import { formateDate } from "../../utils/formatDate";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-black3 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow8 mx-auto mb-4"></div>
          <p className="text-black7">Loading section details...</p>
        </div>
      </div>
    );
  }

  if (!sectionData) {
    return (
      <div className="min-h-screen bg-black3 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Section not found</h2>
          <Link
            to="/allCourses"
            className="text-yellow8 hover:text-yellow9 transition-colors"
          >
            Browse all courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black3">
      {/* Breadcrumb */}
      <div className="bg-black2 border-b border-black5 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-maxContent mx-auto">
          <nav className="flex items-center space-x-2 text-sm text-black7">
            <Link to="/" className="hover:text-yellow8 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/allCourses" className="hover:text-yellow8 transition-colors">Courses</Link>
            <span>/</span>
            <span className="text-white">Section</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black2 to-black4 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-maxContent mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              {sectionData?.sectionName || "Section Details"}
            </h1>
            {sectionData?.shortDescription && (
              <p className="text-lg sm:text-xl text-black8 leading-relaxed max-w-3xl">
                {sectionData.shortDescription}
              </p>
            )}
          </div>

          {/* Section Meta Info */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm sm:text-base">
            <div className="flex items-center gap-2 text-black7">
              <FaBook className="text-yellow8" />
              <span>
                {sectionData?.subSections?.length || 0}{" "}
                {sectionData?.subSections?.length === 1 ? "lesson" : "lessons"}
              </span>
            </div>
            {sectionData?.createdAt && (
              <div className="flex items-center gap-2 text-black7">
                <span>Created: {formateDate(sectionData.createdAt)}</span>
              </div>
            )}
            {sectionData?.updatedAt && (
              <div className="flex items-center gap-2 text-black7">
                <span>Updated: {formateDate(sectionData.updatedAt)}</span>
              </div>
            )}
          </div>

          {/* Long Description */}
          {sectionData?.longDescription && (
            <div className="mt-6 p-6 bg-black1/50 rounded-lg border border-black5">
              <p className="text-black8 leading-relaxed">{sectionData.longDescription}</p>
            </div>
          )}
        </div>
      </section>

      {/* Section Content */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-maxContent mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Section Content
            </h2>
            <p className="text-black7">
              {sectionData?.subSections?.length || 0} lessons in this section
            </p>
          </div>

          {/* Lessons List */}
          <div className="space-y-6">
            {sectionData?.subSections?.length === 0 ? (
              <div className="bg-black2 border border-black5 rounded-xl p-12 text-center">
                <FaBook className="text-5xl text-black5 mx-auto mb-4" />
                <p className="text-black7">No lessons available in this section</p>
              </div>
            ) : (
              sectionData?.subSections?.map((subSection, index) => (
                <div
                  key={subSection?._id || index}
                  className="bg-black2 border border-black5 rounded-xl overflow-hidden hover:border-yellow8/30 transition-all duration-300"
                >
                  {/* Lesson Header */}
                  <div className="p-4 sm:p-6 border-b border-black5">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-yellow8/20 rounded-full flex items-center justify-center">
                        <span className="text-yellow8 font-bold text-sm sm:text-base">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                          {subSection?.title || `Lesson ${index + 1}`}
                        </h3>
                        {subSection?.description && (
                          <p className="text-black8 leading-relaxed mb-3">
                            {subSection.description}
                          </p>
                        )}
                        {subSection?.timeDuration && (
                          <div className="flex items-center gap-2 text-sm text-black7">
                            <FaClock className="text-yellow8" />
                            <span>{subSection.timeDuration}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Video Player */}
                  {subSection?.videoUrl && (
                    <div className="p-4 sm:p-6 bg-black1">
                      <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-2xl">
                        <div className="aspect-video">
              <video
                            src={subSection.videoUrl}
                controls
                            controlsList="nodownload"
                            className="w-full h-full object-contain"
                            preload="metadata"
                          >
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Lesson Completion Indicator */}
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 flex items-center gap-2 text-sm text-black7">
                    <FaPlayCircle className="text-yellow8" />
                    <span>Video lesson</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Navigation Help */}
          <div className="mt-8 p-4 sm:p-6 bg-black2 border border-black5 rounded-xl">
            <div className="flex items-start gap-3">
              <FaCheckCircle className="text-yellow8 text-xl flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-white mb-2">Learning Tips</h3>
                <p className="text-sm text-black8 leading-relaxed">
                  Watch each lesson in order and take notes. Complete all lessons in this section to progress to the next section.
                </p>
              </div>
            </div>
          </div>
      </div>
      </section>
    </div>
  );
}
