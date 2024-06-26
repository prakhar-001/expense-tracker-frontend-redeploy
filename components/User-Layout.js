import React from 'react'
import Navbar from "./Navbar.js";


const CustomerLayout = ({children}) => {
  return (
    <>
    <div className='flex flex-col dark:bg-slate-700 h-max w-screen'> 
      <div className='fixed w-full '>
        <div className='mx-0'>
          <Navbar/>
        </div>
      </div>
      <div className='mt-20 sm:mt-18 h-full'>{children}</div>
    </div>
    </>
  )
}

export default CustomerLayout