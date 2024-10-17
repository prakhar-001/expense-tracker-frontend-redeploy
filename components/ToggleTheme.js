"use client"
import { useEffect, useState } from "react";
import { FaMoon } from "react-icons/fa";
import { BsSunFill } from "react-icons/bs";

const ToggleTheme = () => {

    const [darkMode, setDarkMode] = useState()

    useEffect(() => {
        const theme = localStorage.getItem("theme")
        if(theme === "dark") setDarkMode(true)
    }, [])

    useEffect(() => {
        if(darkMode){
            document.documentElement.classList.add("dark")
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove("dark")
            localStorage.setItem('theme', 'light')
        }
    })

  return (
    <div className='relative w-14 h-6 flex items-center dark:bg-gray-900 border-2 border-green-400 dark:border-2 dark:border-white bg-slate-900 py-3 cursor-pointer rounded-full p-1' 
    onClick={() => setDarkMode(!darkMode)}>
        <FaMoon className='text-white' size={16} />
        <div className='absolute bg-white dark:bg-white w-5 h-5  rounded-full shadow-md transform transition-transform duration-300' style={darkMode ? {left: '4px'} : {right: '4px'}}>
        </div>
        <BsSunFill className='ml-auto text-yellow-500' size={18}/>
    </div>
  )
}

export default ToggleTheme