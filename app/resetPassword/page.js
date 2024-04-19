"use client"
import React, { useState } from 'react'
import {sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "@/firebase.js";
import toast from "react-hot-toast";
import Link from 'next/link';
// import NotLoggedInCustomerOnlyLayout from "@/components/Not-Logged-In-Customer-Only-Layout.js"
// import CustomerLayout from "@/components/Customer-Layout.js";
import { redirect } from 'next/navigation';
import { useRouter } from 'next/router';


const page = () => {
    const [email, setEmail] = useState("");

    const submitHandler = async (e) => {
        e.preventDefault();
        
        sendPasswordResetEmail(auth,email)
        .then((userExist)=> {
            toast.success("Link to Reset Password sent to your email")
        })
        .catch((err)=> toast.error(err.code))

        // redirect("/logIn-email-pass")

    }


  return (
    <>
    {/* <CustomerLayout> */}
    {/* <NotLoggedInCustomerOnlyLayout> */}
        <div className='flex items-center flex-col justify-between mt-20 sm:mt-36 mx-auto border-2 shadow-2xl h-auto mb-20 rounded-xl w-11/12 sm:w-2/5 p-10 sm:p-10 bg-gray-400'>
            <h1 className='text-xl font-semibold my-5'>Login Now</h1>
            <form action="" onSubmit={submitHandler} className='w-5/6 sm:w-9/12 flex flex-col gap-5 items-center mb-5'>
                
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
                
                <button type='submit' className='p-2 my-2 rounded-xl w-40 border-2 hover:shadow-green-300 shadow-xl'>Reset Password</button>
            </form>
            <Link href={"/logIn-email-pass"}><button className='p-2 rounded-xl w-40 border-2 hover:shadow-slate-400 shadow-xl'>Login Now</button></Link>
        </div>
    {/* </NotLoggedInCustomerOnlyLayout> */}
    {/* </CustomerLayout> */}
    </>
  )
}

export default page