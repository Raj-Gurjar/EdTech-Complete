import React, { useEffect } from "react";
import { setLoading } from "../../../../toolkit/slice/authSlice";

export default function DashBoard() {
  useEffect(() => {
    const getCourseDataWithStats = async () => {

        setLoading(true);
        const instructorApiData = await get
    };
  }, []);
  return <div></div>;
}
