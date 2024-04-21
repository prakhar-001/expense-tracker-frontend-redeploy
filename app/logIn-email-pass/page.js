"use client"
import React, { useState } from 'react'
import {signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "@/firebase.js";
import toast from "react-hot-toast";
import Link from 'next/link';
// import { redirect } from 'next/navigation';
import NotLoggedInUserLayout from "@/components/Not-Logged-In-User-Only-Layout.js";
import UserLayout from "@/components/User-Layout.js"




const page = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    let enableButton = false;
    const [userValue, setUserValue] = useState(false)

    if(email && password) enableButton=true;


    const submitHandler = async (e) => {
        e.preventDefault();
            
        signInWithEmailAndPassword(auth, email, password).then((userExist) => {
            toast.success("User Logged In Successfully")
            setUserValue(true)
            // console.log(userExist)
            // redirect("/");
        }).catch((err) => {
            // console.log(err)
            toast.error(err.code)
        })
    }
  return (
    <>
    <UserLayout>
    <NotLoggedInUserLayout>
    <div className='flex items-center flex-col justify-center mt-20 sm:mt-24 mx-auto border-2 shadow-2xl mb-32 rounded-xl w-11/12 sm:w-2/5 p-6 pb-7 bg-gray-400'>
            <h1 className='text-xl font-semibold'>Login Now</h1>
            <form action="" onSubmit={submitHandler} className='w-5/6 sm:w-9/12 flex flex-col gap-5 items-center mb-8'>
                
                <div className='w-full'> 
                    <label htmlFor="gender" className='my-2'>Email</label>
                    <input 
                    type="email " 
                    placeholder='Email' 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className='p-2 border-2 rounded-xl w-full'
                    />
                </div>
                <div className='w-full'>
                    <div className='flex justify-between items-center'>
                        <label htmlFor="gender" className='my-2'>Password</label>
                        <Link href={"/resetPassword"}><p className='text-sm text-red-600'>Forget Password?</p></Link>
                    </div>
                    <input 
                    type="password" 
                    placeholder='Password' 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className='p-2 border-2 rounded-xl w-full'/>
                </div>
                
                {/* <button type='submit' className='p-2 rounded-xl w-32  hover:shadow-green-300 shadow-xl'>Log In</button> */}
                {
                    enableButton? 
                    <button type='submit' className='p-2 rounded-xl w-32  hover:shadow-green-300 shadow-xl'>Log In</button>
                    :
                    <div className='p-2 rounded-xl w-32 px-5 hover:shadow-red-300 shadow-xl flex justify-center'><p>Log In</p></div>
                }
            </form>
            <div className='flex gap-5'> 
                <Link href={"/signIn-email-pass"}>
                    <div>
                        <button className='p-2 w-32 mb-1 border-2 hover:shadow-slate-400 rounded-xl shadow-xl '>Sign Up</button>
                    </div>
                </Link>
                {/* {
                    userValue? */}
                    <Link href={"/"} className='flex items-center justify-center gap-2'>
                        <div className='p-2 px-5 w-32 border-2 hover:shadow-green-300 shadow-xl rounded-xl'>Track Now!</div>
                    </Link>
                    {/* :
                    <div><button className='p-2 w-32 border-2 hover:shadow-red-300 shadow-xl rounded-xl' ><Link href={"/"} className='flex items-center justify-center gap-2'><p>Track Now! </p></Link></button></div>
                } */}
            </div>
        </div>     
    </NotLoggedInUserLayout>
    </UserLayout>
    </>
  )
}

export default page