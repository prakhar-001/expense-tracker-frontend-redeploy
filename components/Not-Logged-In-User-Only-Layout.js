"use client"
import React from 'react'
import { useSelector } from "react-redux";
import { useLayoutEffect } from "react";
import { redirect } from "next/navigation";
import { useRouter } from 'next/navigation';

const LoggedInCustomerOnlyLayout = ({children}) => {
    const router = useRouter();
    let sessionStatus;
    const abc = useSelector((state) => state.userReducer.user);
    if (abc) {
        // console.log(abc.role)
        sessionStatus = true;
    } else {
        sessionStatus = false;
    }
    useLayoutEffect(() => {
        const session = sessionStatus;
        if (session) {
            // router.push("/")
        redirect("/")
        }
    }, [abc]);
    return (
        // <div className='text-5xl font-semibold mx-auto'>Login To Access This Page</div>
        <div>
        {
            sessionStatus?
            <div>Loading...</div>
            :
            <div>{children}</div>
        }
        </div>
    )
}

export default LoggedInCustomerOnlyLayout