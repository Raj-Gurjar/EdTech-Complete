import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../services/operations/courseDetailsAPI";
import { Table, Thead, Tr, Th, Tbody, Td } from "react-super-responsive-table";
import { COURSE_STATUS } from "../../../../utils/constants";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Modal from "../../../Modals-Popups/Modal";

export default function CoursesTable({ instCourses, setInstCourses }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);

  // console.log("instCO table :", instCourses);

  const handleDeleteCourse = async (courseId) => {
    setLoading(true);

    await deleteCourse({ courseId: courseId }, token);
    const result = await fetchInstructorCourses(token);

    if (result) {
      setInstCourses(result);
    }

    setModal(null);
    setLoading(false);
  };

  return (
    <div>
      <Table className="my-5">
        <Thead>
          <Tr className="bg-amber-200 flex gap-x-10 border-black-800 p-5">
            <Th>Courses</Th>
            <Th>Duration</Th>
            <Th>Price</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>

        <Tbody className="bg-slate-300">
          {instCourses.length === 0 ? (
            <Tr>
              <Td>No Courses Found</Td>
            </Tr>
          ) : (
            <div className="bg-green-300">
              {instCourses.map((course) => (
                <Tr
                  key={course._id}
                  className="flex gap-x-10 border-black-800 border-2 p-4"
                >
                  <Td className="flex gap-x-4 bg-red-200">
                    <img
                      src={course?.thumbnail}
                      className="bg-blue-300 h-[150px] w-[220px] rounded-lg object-cover"
                      alt="course-thumbnail"
                    />
                    <div className="flex flex-col">
                      <p>Course Name: {course.courseName}</p>
                      <p>Desc :{course.courseDescription}</p>
                      <p>Created at :</p>
                      <p>
                        {course.status === COURSE_STATUS.DRAFT ? (
                          <p className="text-red-500">DRAFTED</p>
                        ) : (
                          <p className="text-yellow-500">PUBLISHED</p>
                        )}
                      </p>
                    </div>
                  </Td>

                  <Td>2hr 30min</Td>
                  <Td>Price : Rs.{course?.price}</Td>
                  <Td>Category: {course?.category?.name}</Td>
                  <Td className="">
                    <button
                      className="mr-5"
                      disabled={loading}
                      onClick={() => {
                        navigate(`/dashboard/edit-course/${course._id}`);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      disabled={loading}
                      onClick={() => {
                        setModal({
                          text1: "Are You Sure?",
                          text2: "This course will be deleted permanently",
                          btn1Text: "Delete Course",
                          btn2Text: "Cancel",
                          btn1Handler: () => handleDeleteCourse(course._id),
                          btn2Handler: () => setModal(null),
                        });
                      }}
                    >
                      Delete
                    </button>
                  </Td>
                </Tr>
              ))}
            </div>
          )}
        </Tbody>
      </Table>

      {modal && <Modal modalData={modal} />}
    </div>
  );
}
