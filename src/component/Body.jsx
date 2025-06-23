import React, { useEffect } from "react";

import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import NavBar from "./NavBar";

const Body = () => {
const dispatch=useDispatch()
 const user =useSelector((state)=>state.user)
 const navigate=useNavigate()
  const fetchProfile=async()=>{
     let BACKEND = import.meta.env.VITE_BACKEND_URL;
   try {
     const res=await fetch (`${BACKEND}/get-user`, {
     method: "GET",
     credentials: "include", 
   })
     const data=await res.json()
     console.log("data::",data)
     if(res.ok){
dispatch(addUser(data?.user))
     }
     else{
        navigate("/login"); 
     }
   } catch (error) {
    console.log("error",error)
   }
  }


  useEffect(()=>{
    if(!user){
    fetchProfile()
    }

  },[])
  return (
    <div>
      {" "}
      <NavBar />
      <Outlet />
    </div>
  );
};

export default Body;
