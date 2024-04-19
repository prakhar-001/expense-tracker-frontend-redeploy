"use client"
import React, { useState, useEffect } from 'react'
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged  } from 'firebase/auth';
import Link from 'next/link';
import { auth } from "@/firebase.js";
import toast from "react-hot-toast";
import axios from 'axios';


const page = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    let enableButton = false;
    const [userValue, setUserValue] = useState(false)

    if(name && email && password) enableButton=true;
    // console.log(enableButton)

    const createUserDB = async (userData) => {
        // e.preventDefault();
        // setAddExpenseOpen(false)
        console.log(userData)
        try {
          const response = await axios.post('${process.env.NEXT_PUBLIC_VITE_SERVER}/api/v1/user/new', userData);
          toast.success(response.data.message)
        } catch (error) {
          console.log(error)
        //   toast.error("Error aagya")
          toast.error(error.response.data.message)
        }
      };

    const submitHandler = async (e) => {
        let userDetail;
        e.preventDefault();
        try {
            const {newUser} = createUserWithEmailAndPassword(auth, email, password)
            .then((authUser) => {
                signInWithEmailAndPassword(auth, email, password).then(
                    userDetail = auth.currentUser,
                    // console.log(auth.currentUser),                    
                    toast.success("User Created in FireBase"),
                );
                createUserDB({
                    name:name,
                    email: userDetail.email,
                    password: password,
                    _id: userDetail.uid
                })
                setUserValue(true)
            })
            .catch((err) => {
                console.log(err)
                toast.error("User Not Created")
                toast.error(err.code)
            });
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <>
    <div className='flex items-center flex-col justify-center mt-5 sm:mt-28 mx-auto border-2 shadow-2xl mb-20 rounded-xl w-11/12 sm:w-2/5 p-5 bg-gray-400'>
            <h1 className='text-xl font-semibold'>Create Account</h1>
            <form action="" onSubmit={submitHandler} className='w-5/6 sm:w-9/12 flex flex-col gap-5 items-center mb-8'>
                
                
                <div className='w-full'> 
                    <label htmlFor="name" className='my-2'>Name</label>
                    <input 
                    type="name " 
                    placeholder='Name' 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className='p-2 border-2 rounded-xl w-full'
                    />
                </div>
                <div className='w-full'> 
                    <label htmlFor="email" className='my-2'>Email</label>
                    <input 
                    type="email " 
                    placeholder='Email' 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className='p-2 border-2 rounded-xl w-full'
                    />
                </div>
                <div className='w-full'>
                    <label htmlFor="gender" className='my-2'>Password</label>
                    <input 
                    type="password" 
                    placeholder='Password' 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    className='p-2 border-2 rounded-xl w-full'
                />
                </div>
                
                
                {
                    enableButton? 
                    <button type='submit' className='p-2 border-2 rounded-xl w-32 hover:shadow-green-300 shadow-xl'>Sign Up</button>
                    :
                    <div className='p-2 px-5 border-2 rounded-xl w-auto hover:shadow-red-300 shadow-xl'>Sign Up</div>
                }
            </form>
            <div className='flex gap-5'> 
                <div><button className='p-2 w-32 mb-1 border-2 hover:shadow-slate-400 rounded-xl shadow-xl '><Link href={"/logIn-email-pass"}>Log In</Link></button></div>
                {
                    userValue?
                    <div><button className='p-2 w-32 border-2 hover:shadow-green-300 rounded-xl shadow-xl'><Link href={"/"} className='flex items-center justify-center gap-2'><p>Track Now! </p></Link></button></div>
                    :
                    <div><button className='p-2 w-32 border-2 hover:shadow-red-300 shadow-xl rounded-xl' ><Link href={"/"} className='flex items-center justify-center gap-2'><p>Track Now! </p></Link></button></div>
                }
            </div>
        </div>
    </>
  )
}

export default page