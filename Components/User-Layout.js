import React from 'react'
import Navbar from "./Navbar.js";


const CustomerLayout = ({children}) => {
  return (
    <>
    <div className='flex flex-col bg-medium h-max w-screen'> 
      <div className='fixed w-full h-full '>
        <div className='mx-0 h-full'>
          <Navbar/>
        </div>
      </div>
      <div className='mt-20 sm:mt-18 h-full '>{children}</div>
    </div>
    </>
  )
}

export default CustomerLayout