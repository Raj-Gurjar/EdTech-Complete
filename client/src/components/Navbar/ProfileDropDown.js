import React from 'react'
import { RxAvatar } from "react-icons/rx";


export default function ProfileDropDown() {
  return (
    <div>
        <div className="profile-pic">
            <RxAvatar className="text-xl cursor-pointer hover:bg-green-200"/>
        </div>
        <div className="profile-dropDown">
            
        </div>
    </div>
  )
}
