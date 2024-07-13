import React from "react";
import RatingStars from "../../utils/RatingStars";

export default function ReviewCard({ data }) {
  console.log("rdata", data);
  return (
    <div className="bg-red-300 h-[300px] ">
      {/* <h1>Name : {data?.user}</h1> */}
      <div>
        <img
          src={data?.user?.profileImage}
          alt="profile Img"
          className="h-[100px] w-[100px] object-cover"
        />
      </div>

      <h2>Course : {data?.course?.courseName}</h2>
      <h2>
        Name: {data?.user?.firstName} {data?.user?.lastName}
      </h2>
      <div>
        <p>Rating : {data?.rating}</p>
        <p>Review : {data?.review}</p>
        <p>
          <RatingStars Review_Count={data?.rating}  Star_Size={30}/>
        </p>
      </div>
    </div>
  );
}
