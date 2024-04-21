"use client"
import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { auth } from '@/firebase';

import { useLayoutEffect } from "react";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";
import { onAuthStateChanged, signOut } from 'firebase/auth';



const LoggedInCustomerOnlyLayout = ({children}) => {

  let sessionStatus;
    const abc = useSelector((state) => state.userReducer.user);
    if (abc) {
        // console.log(abc)
        sessionStatus = true;
    } else {
        sessionStatus = false;
    }
    useLayoutEffect(() => {
        const session = sessionStatus;
        // console.log(session)
        if (!session) {
        redirect("/logIn-email-pass")
        }
    }, [abc]);

    return (
        // <div className='text-5xl font-semibold mx-auto'>Login To Access This Page</div>
        <div className="h-full">{children}</div>
    )
}

export default LoggedInCustomerOnlyLayout