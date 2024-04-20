"use client"
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios'; // Ensure axios is imported at the top
import UserLayout from "@/components/User-Layout.js"
import { useSelector } from "react-redux";
import LoggedInUserComponent from "@/components/Logged-In-User-Only-Layout.js"
import { SlRefresh } from "react-icons/sl";
import { MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { FcViewDetails } from "react-icons/fc";
import { Hanken_Grotesk } from 'next/font/google';

const Page = () => {
  const {user, loading} = useSelector(state => state.userReducer)
  const userId = user?._id;
  // console.log(userId)

 const [incomesData, setIncomesData] = useState([]);
 const [totalIncome, setTotalIncome] = useState(0);
 const [refreshIncomes, setRefreshIncomes] = useState(true)
 const [selectedMonth, setSelectedMonth] = useState("all");
 const [selectedMode, setSelectedMode] = useState("all");
 const [selectedYear, setSelectedYear] = useState("2024");
 const [addOpen, setAddOpen] = useState(false)
 const [details, setDetails] = useState(false)
 const [categoriesData, setCategoriesData] = useState([])


 const [incomeData, setIncomeData] = useState({
  title: '',
  amount: '',
  mode: '',
  user: userId,
  description: '',
  date: '',
  category: ''
});
const type = "Income"

 useEffect(() => {
    fetchIncomes(userId, selectedMonth, selectedYear, selectedMode);
 }, [refreshIncomes, selectedMonth, selectedYear, selectedMode]);
 useEffect(() => {
  fetchCategories(userId, type);
}, [refreshIncomes]);

 const fetchIncomes = async (userId, month, year, mode) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_VITE_SERVER}/api/v1/transaction/get-incomes?id=${userId}&month=${month}&year=${year}&mode=${mode}`); // Assuming this is your API endpoint for fetching expenses
    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
    }
    const data = await response.json();
    // console.log(data.incomes)
    setIncomesData(data.incomes); // Assuming the response is in the format { success: true, expenses: [...] }

    const total = data.incomes.reduce((acc, income) => acc + +income.amount, 0);
    setTotalIncome(total);
  } catch (error) {
    console.error('Error fetching expenses:', error);
  }
}
const fetchCategories = async (userId, type) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_VITE_SERVER}/api/v1/category/get?id=${userId}&type=${type}`); // Assuming this is your API endpoint for fetching expenses
    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
    }
    // console.log(response)
    const data = await response.json();
    // console.log(data)
    // console.log(data.expenses)
    setCategoriesData(data.categories);
  } catch (error) {
    console.error('Error fetching expenses:', error);
}
}



const deleteHandler = async (itemId) => {
//  console.log(itemId);
 try {
    // console.log("Trying to delete");
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_VITE_SERVER}/api/v1/transaction/delete-income/${itemId}`);
    // fetchIncomes(userId);
    setRefreshIncomes(!refreshIncomes)
    // console.log(response);
    toast.success(response.data.message)
 } catch (error) {
    toast.error(error.response.data.message)
    // console.log(error.response.data.message)
 }
};

const handleChangeIncome = (e) => {
  setIncomeData({
    ...incomeData,
    [e.target.name]: e.target.value
  });
};
const handleSubmitIncome = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_VITE_SERVER}/api/v1/transaction/add-income`, incomeData);
    // console.log(response.data);
    toast.success(response.data.message)
    // fetchIncomes(userId);
    setAddOpen(!addOpen)
    setRefreshIncomes(!refreshIncomes)
    // Handle success, e.g., show a success message or reset the form
  } catch (error) {
    // console.error(error);
    toast.error(error.response.data.message)
    // Handle error, e.g., show an error message
  }
};

 return (
  <UserLayout>
  <LoggedInUserComponent>
    <div className="flex flex-col items-center justify-between px-2 sm:px-12 pb-5 w-full h-max ">
      <div  className="flex justify-between flex-wrap w-full mb-5 text-base sm:text-2xl font-semibold">
        <div className="flex gap-2 sm:gap-5 items-center justify-between dark:text-white w-full sm:w-7/12">
          <div className='flex gap-2 items-center'>
            <h1>Incomes</h1>
            <button onClick={() => setRefreshIncomes(!refreshIncomes)}><SlRefresh className="sm:hover:text-3xl active:animate-spin"/></button>
          </div>
          <h1 className='dark:text-white'>Total Income : {totalIncome}</h1>
          <button onClick={() => setAddOpen(!addOpen)} className="sm:hidden flex items-center gap-3 bg-green-400 dark:bg-white p-1 px-3 text-sm rounded-xl dark:text-black">Add <FaPlus /></button>
        </div>
        <div className="text-base flex justify-between gap-2 mx-0 w-full sm:w-max sm:mx-0 mt-2 sm:mt-0">
            <select value={selectedMode} onChange={(e) => setSelectedMode(e.target.value)} className='rounded-xl px-2 border-2 border-green-400 dark:border-slate-900'>
                <option value="all">All Mode</option>
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
            </select>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className='rounded-xl px-2 border-2 border-green-400 dark:border-slate-900'>
                <option value="all">All Months</option>
                <option value="01">Jan</option>
                <option value="02">Feb</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">Aug</option>
                <option value="09">Sep</option>
                <option value="10">Oct</option>
                <option value="11">Nov</option>
                <option value="12">Dec</option>
                {/* {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                 <option key={month} value={month}>{month}</option>
                ))} */}
            </select>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className='rounded-xl px-2 border-2 border-green-400 dark:border-slate-900'>
                {/* <option value="2024">2024</option> */}
                {Array.from({ length: 5 }, (_, i) => 2022 + i).map((year) => (
                 <option key={year} value={year}>{year}</option>
                ))}
            </select>
            <button onClick={() => setDetails(!details)} className="sm:hidden flex items-center gap-3 bg-green-400 dark:bg-white p-1 px-3 rounded-xl"><FcViewDetails className="text-xl dark:text-black"/></button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between w-full h-full">
        {/* INCOME Form for Pc Website*/}
        <div className="pc-form sm:flex flex-col items-center justify-around border-2 w-full sm:w-1/3 bg-slate-200 dark:bg-gray-400 rounded-xl p-5 hidden h-[78.15vh]">        
            <h1 className="font-semibold text-xl">Add Income</h1>
            <form onSubmit={handleSubmitIncome} className="flex flex-col w-full px-5">
              <div className="my-1 flex w-full flex-col">
              <label htmlFor="title">Title</label>
              <input type="text" name="title" value={incomeData.title} onChange={handleChangeIncome} className="rounded-md p-1"/>
              </div>
              <div className="my-1 flex w-full flex-col">
                <label htmlFor="amount">Amount</label>                
                <input type="number" name="amount" value={incomeData.amount} onChange={handleChangeIncome}  className="rounded-md p-1"/>
              </div>
              <div className="my-1 flex w-full flex-col">
                <label htmlFor="description">Description</label>
                <textarea name="description" value={incomeData.description} onChange={handleChangeIncome} className="rounded-md p-1"
                style={{ resize: 'none', height: '70px', width:'auto' }}/>
              </div>
              <div className="my-1 flex w-full flex-col">
                <label htmlFor="date">Date</label>
                <input type="date" name="date" value={incomeData.date} onChange={handleChangeIncome} className="rounded-md p-1"/>
              </div>

              <div className="my-1 flex w-full flex-col">
              <label htmlFor="category">Category</label>
              <select name="category" value={incomeData.category} onChange={handleChangeIncome} className="rounded-md p-1">
                <option value="Other">Other</option>
                <option value="Salary">Salary</option>
                <option value="Loan">Loan</option>
                {
                  categoriesData.map((i) => (
                    <option value={i.title} key={i._id}>{i.title}</option>
                  ))
                }
                </select>
              </div>
              <div className="my-1 flex w-full flex-col">
                  <label htmlFor="Mode">Mode of Payment</label>
                  <div className="flex gap-5">
                    <label>
                      <input
                        type="radio"  name="mode"  value="Cash"  checked={incomeData.mode === "Cash"}  onChange={handleChangeIncome}  className="mr-2"
                      />
                      Cash
                    </label>
                    <label>
                      <input
                        type="radio"  name="mode"  value="Online"  checked={incomeData.mode === "Online"}  onChange={handleChangeIncome} className="mr-2"/>
                      Online
                    </label>
                  </div>
              </div>

              <button type="submit" className="p-2 w-40 mx-auto rounded-xl bg-green-300 dark:bg-slate-800 dark:text-white mt-3 font-semibold">Add Income</button>            
          </form>
        </div>

        {/* Form For Phone Websites */}
        {
          addOpen && (
            <div className="flex sm:hidden flex-col items-center border-2 w-full sm:w-1/3 h-max bg-gray-400 rounded-xl p-5">        
            <h1 className="font-semibold">Add Income</h1>
            <form onSubmit={handleSubmitIncome} className="flex flex-col w-full px-5">
              <div className="my-1 flex w-full flex-col">
              <label htmlFor="title">Title</label>
              <input type="text" name="title" value={incomeData.title} onChange={handleChangeIncome} className="rounded-md p-1"/>
              </div>
              <div className="my-1 flex w-full flex-col">
                <label htmlFor="amount">Amount</label>                
                <input type="number" name="amount" value={incomeData.amount} onChange={handleChangeIncome}  className="rounded-md p-1"/>
              </div>
              <div className="my-1 flex w-full flex-col">
                <label htmlFor="description">Description</label>
                <textarea name="description" value={incomeData.description} onChange={handleChangeIncome}  className="rounded-md p-1"/>
              </div>
              <div className="my-1 flex w-full flex-col">
                <label htmlFor="date">Date</label>
                <input type="date" name="date" value={incomeData.date} onChange={handleChangeIncome} className="rounded-md p-1"/>
              </div>

              <div className="my-1 flex w-full flex-col">
              <label htmlFor="category">Category</label>
              <select name="category" value={incomeData.category} onChange={handleChangeIncome} className="rounded-md p-1">
                <option value="Other">Other</option>
                <option value="Salary">Salary</option>
                <option value="Loan">Loan</option>
                {
                  categoriesData.map((i) => (
                    <option value={i.title} key={i._id}>{i.title}</option>
                  ))
                }
                </select>
              </div>
              <div className="my-1 flex w-full flex-col">
                  <label htmlFor="Mode">Mode of Payment</label>
                  <div className="flex gap-5">
                    <label>
                      <input
                        type="radio"  name="mode"  value="Cash"  checked={incomeData.mode === "Cash"}  onChange={handleChangeIncome}  className="mr-2"
                      />
                      Cash
                    </label>
                    <label>
                      <input
                        type="radio"  name="mode"  value="Online"  checked={incomeData.mode === "Online"}  onChange={handleChangeIncome} className="mr-2"/>
                      Online
                    </label>
                  </div>
              </div>

              <button type="submit" className="p-2 w-40 mx-auto rounded-xl bg-green-300 mt-2">Add Income</button>            
          </form>
        </div>
          )
        }

        {/* INCOMES TABLE FOR PC*/}
        <div className="w-full sm:pl-5 h-max hidden sm:flex">
          <table className="table-auto w-full border-2 h-full bg-slate-200 dark:bg-gray-400 p-10 overflow-x-scroll ">
          {
              incomeData.length > 0 && (
              <thead className="w-full ">
                <tr className="">
                  <th className="px-4 py-2 w-2/12">Title</th>
                  <th className="px-4 py-2 w-1/12">Amount</th>
                  <th className="px-4 py-2 w-2/12">Category</th>
                  <th className="px-4 py-2 w-1/12">Mode</th>
                  <th className="px-4 py-2 w-1/12">Date</th>
                  <th className="px-4 py-2 w-3/12">Description</th>
                  <th className="px-4 py-2 w-1/12">Edit</th>
                  <th className="px-4 py-2 w-1/12">Delete</th>
                </tr>
              </thead>
              )
            }
            <tbody>
              {
                incomesData.length === 0 && (
                  <tr>
                    <td>
                      <div className='text-4xl font-semibold flex items-center justify-center my-24 gap-5'>
                        Track Your Income 
                        <p className='dark:text-white text-green-500'>Add Now!!!</p>
                      </div>
                    </td>
                  </tr>
                )
              }
              {incomesData.map((income) => (
                <tr key={income._id}>
                  {/* <td className="border px-4 py-2">{income._id}</td> */}
                  <td className="border px-4 py-2">{income.title}</td>
                  <td className="border px-4 py-2"><div className="flex justify-center">{income.amount}</div></td>
                  <td className="border px-4 py-2">{income.category}</td>
                  <td className="border px-4 py-2 w-1/12">{income.mode}</td>
                  <td className="border px-4 py-2"><div className="flex justify-center">{new Date(income.date).toLocaleDateString()}</div></td>
                  <td className="border px-4 py-2">{income.description}</td>
                  <td className="border px-4 py-2"><div className="flex justify-center">Edit</div></td>
                  <td className="border px-4 py-2"><button onClick={() => deleteHandler(income._id)}><div className="ml-4 text-xl"><MdDelete className="hover:text-red-500" /></div></button></td>
                  {/* Add more data cells as needed */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        {/* INCOMES TABLE FOR Phone*/}
        <div className="w-full sm:pl-5 overflow-x-scroll flex sm:hidden">
          <table className="table-auto w-full border h-full bg-gray-400 p-10">
            <thead className="w-full">
              <tr className="">
                {
                  details && (
                    <th className="px-4 py-2 w-2/12">Title</th>
                )}
                <th className="px-4 py-2 w-1/12">Amount</th>
                <th className="px-4 py-2 w-2/12">Category</th>
                <th className="px-4 py-2 w-1/12">Mode</th>
                <th className="px-4 py-2 w-1/12">Date</th>
                {
                  details && (
                    <th className="px-16 py-2 w-3/12">Description</th>
                )}
                {
                  details && (
                    <th className="px-4 py-2 w-1/12">Edit</th>
                )}
                {
                  details && (
                    <th className="px-6 py-2 w-10 text-xl "><MdDelete/></th>
                )}
              </tr>
            </thead>
            <tbody>
              {incomesData.map((income) => (
                <tr key={income._id} className="h-[7vh]">
                  {details && (
                    <td className="border px-4 py-2 w-2/12">{income.title}</td>
                  )}
                  <td className="border px-4 py-2 w-1/12 ">
                    <div className="flex justify-center">{income.amount}</div>
                  </td>
                  <td className="border px-4 py-2 w-2/12">{income.category}</td>
                  <td className="border px-4 py-2 w-1/12">{income.mode}</td>
                  <td className="border px-2 py-2 w-1/12">
                    <div className="flex justify-center">{new Date(income.date).toLocaleDateString()}</div>
                  </td>
                  {details && (
                    <td className="border px-2 py-2 w-3/12">{income.description}</td>
                  )}
                  
                  {details && (
                    <td className="border px-4 py-2 w-1/12"><div className="flex justify-center">Edit</div></td>
                  )}
                  {details && (
                    <td className="border px-6 py-2 w-10"><button onClick={() => deleteHandler(income._id)}><div className="text-xl"><MdDelete className="hover:text-red-600 hover:text-2xl"/></div></button></td>
                  )}
                  
                  {/* Add more data cells as needed */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
    </LoggedInUserComponent>
    </UserLayout>
 );
};

export default Page;