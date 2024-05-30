"use client"
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios'; // Ensure axios is imported at the top
import UserLayout from "@/components/User-Layout.js"
import LoggedInUserComponent from "@/components/Logged-In-User-Only-Layout.js"
import { useSelector } from "react-redux";
import { SlRefresh } from "react-icons/sl";
import { MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { FcViewDetails } from "react-icons/fc";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const Page = () => {

  const {user, loading} = useSelector(state => state.userReducer)
  const userId = user?._id;
  // console.log(userId)
// console.log(user)

 const [expensesData, setExpensesData] = useState([]);
 const [totalExpense, setTotalExpense] = useState(0);
 const [refreshExpenses, setRefreshExpenses] = useState(true)
 const [selectedMode, setSelectedMode] = useState("all");
 const [selectedMonth, setSelectedMonth] = useState("all");
 const [selectedYear, setSelectedYear] = useState("2024");
 const [addOpen, setAddOpen] = useState(false)
 const [details, setDetails] = useState(false)
 const [categoriesData, setCategoriesData] = useState([])
//  console.log(addOpen)

 const [expenseData, setExpenseData] = useState({
  title: '',
  amount: '',
  mode: '',
  user: userId,
  description: '',
  date: '',
  category: ''
});
const type = "Expense"


// Inside a React component or a function
  // const generatePdf = async () => {
  //   const url = 'http://localhost:3000/api/pdf?url=https://example.com';
  //   const response = await fetch(url);
  //   const blob = await response.blob();
  //   const link = document.createElement('a');
  //   link.href = URL.createObjectURL(blob);
  //   link.download = 'download.pdf';
  //   link.click();
  //  };
  //  useEffect(()=> {
  //   generatePdf() 
  //  }, [])

  useEffect(() => {
    fetchExpenses(userId, selectedMonth, selectedYear, selectedMode);
  }, [refreshExpenses, selectedMonth, selectedYear, selectedMode]);
  
  useEffect(() => {
    fetchCategories(userId, type);
  }, [refreshExpenses]);

  const fetchExpenses = async (userId, month, year, mode) => {
    // console.log(userId + "  " + month + "  " + year)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_VITE_SERVER}/api/v1/transaction/get-expenses?id=${userId}&month=${month}&year=${year}&mode=${mode}`); // Assuming this is your API endpoint for fetching expenses
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }
      const data = await response.json();
      // console.log(data)
      // console.log(data.expenses)
      setExpensesData(data.expenses); // Assuming the response is in the format { success: true, expenses: [...] }

      const total = data.expenses.reduce((acc, income) => acc + +income.amount, 0);
      setTotalExpense(total);
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
  // console.log(categoriesData)

  const deleteHandler = async (itemId) => {
    // console.log(itemId);
    try {
      //  console.log("Trying to delete");
       const response = await axios.delete(`${process.env.NEXT_PUBLIC_VITE_SERVER}/api/v1/transaction/delete-expense/${itemId}`);
       setRefreshExpenses(!refreshExpenses)
      //  fetchExpenses(userId);
       // console.log(response);
       toast.success(response.data.message)
    } catch (error) {
       toast.error(error.response.data.message)
      //  console.log(error.response.data.message)
    }
   };

  const handleChangeExpense = (e) => {
    setExpenseData({
      ...expenseData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmitExpense = async (e) => {
    e.preventDefault();
    try {
      // console.log(expenseData)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_VITE_SERVER}/api/v1/transaction/add-expense`, expenseData);
      // console.log(response.data);
      toast.success(response.data.message)
      // fetchExpenses(userId);
      setAddOpen(!addOpen)
      setRefreshExpenses(!refreshExpenses)
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
    <div className="flex flex-col items-center justify-between px-2 sm:px-12 pb-5 w-full h-max">

      {/* HEADER */}
      <div className="flex justify-between flex-wrap w-full mb-5 text-base sm:text-2xl font-semibold">
        <div className="flex gap-2 sm:gap-5 items-center dark:text-white justify-between w-full sm:w-7/12">
          <div className='flex gap-2 items-center'>
            <h1>Expenses</h1>
            <button onClick={() => setRefreshExpenses(!refreshExpenses)}><SlRefresh className="sm:hover:text-3xl active:animate-spin"/></button>
          </div>
          <h1 className='dark:text-white'>Total Expense : {totalExpense}</h1>
          <button onClick={() => setAddOpen(!addOpen)} className="sm:hidden flex items-center gap-3 bg-green-400 dark:bg-white p-1 px-3 rounded-xl text-sm dark:text-black">Add <FaPlus /></button>
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
            
            <button onClick={() => setDetails(!details)} className="sm:hidden flex items-center gap-3 bg-green-400 dark:bg-white p-1 px-3 rounded-xl"><FcViewDetails className="text-xl "/></button>
        </div>
      </div>
                
      <div className="flex flex-col sm:flex-row justify-between w-full h-full"> 
        {/* EXPENSE Form Pc Users*/}
        <div className="sm:flex flex-col items-center justify-around border-2 w-full sm:w-1/3 bg-slate-200 dark:bg-gray-400 rounded-xl p-5 hidden h-[78.15vh]">
            <h1 className="font-semibold text-xl">Add Expense</h1>
            <form onSubmit={handleSubmitExpense} className="flex flex-col w-full px-5">
              <div className="my-1 flex w-full flex-col">
                <label htmlFor="title">Title</label>
                <input type="text" name="title" value={expenseData.title} onChange={handleChangeExpense} className="rounded-md p-1"/>
              </div>
              <div className="my-1 flex w-full flex-col">
                <label htmlFor="amount">Amount</label>
                <input type="number" name="amount" value={expenseData.amount} onChange={handleChangeExpense} className="rounded-md p-1"/>
              </div>
              <div className="my-1 flex w-full flex-col">
                <label htmlFor="description">Description</label>
                <textarea name="description" value={expenseData.description} onChange={handleChangeExpense} className="rounded-md p-1"
                style={{ resize: 'none', height: '70px', width:'auto' }}/>
              </div>
              <div className="my-1 flex w-full flex-col">
                <label htmlFor="date">Date</label>
                <input type="date" name="date" value={expenseData.date} onChange={handleChangeExpense} className="rounded-md p-1"/>
              </div>

              <div className="my-1 flex w-full flex-col">
              <label htmlFor="category">Category</label>
              <select name="category" value={expenseData.category} onChange={handleChangeExpense} className="rounded-md p-1">
                <option value="Other">Other</option>
                <option value="Shopping">Shopping</option>
                <option value="Gaming">Gaming</option>
                {/* <option value="">Expense 3 A</option> */}
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
                        type="radio"  name="mode"  value="Cash"  checked={expenseData.mode === "Cash"}  onChange={handleChangeExpense}  className="mr-2"
                      />
                      Cash
                    </label>
                    <label>
                      <input
                        type="radio"  name="mode"  value="Online"  checked={expenseData.mode === "Online"}  onChange={handleChangeExpense} className="mr-2"/>
                      Online
                    </label>
                  </div>
              </div>
              

              <button type="submit" className="p-2 w-40 mx-auto rounded-xl bg-green-300 dark:bg-slate-800 dark:text-white mt-3 font-semibold">Add Expense</button>
            </form>
        </div>

        {/* Form For Phone Websites */}
        {
          addOpen && (
            <div className="flex sm:hidden flex-col items-center border-2 w-full sm:w-1/3 h-max bg-gray-400 rounded-xl p-5">
            <h1 className="font-semibold">Add Expense</h1>
            <form onSubmit={handleSubmitExpense} className="flex flex-col w-full px-5">
              <div className="my-1 flex w-full flex-col">
                <label htmlFor="title">Title</label>
                <input type="text" name="title" value={expenseData.title} onChange={handleChangeExpense} className="rounded-md p-1"/>
              </div>
              <div className="my-1 flex w-full flex-col">
                <label htmlFor="amount">Amount</label>
                <input type="number" name="amount" value={expenseData.amount} onChange={handleChangeExpense} className="rounded-md p-1"/>
              </div>
              <div className="my-1 flex w-full flex-col">
                <label htmlFor="description">Description</label>
                <textarea name="description" value={expenseData.description} onChange={handleChangeExpense} className="rounded-md p-1"/>
              </div>
              <div className="my-1 flex w-full flex-col">
                <label htmlFor="date">Date</label>
                <input type="date" name="date" value={expenseData.date} onChange={handleChangeExpense} className="rounded-md p-1"/>
              </div>

              <div className="my-1 flex w-full flex-col">
                <label htmlFor="category">Category</label>
                <select name="category" value={expenseData.category} onChange={handleChangeExpense} className="rounded-md p-1">
                  <option value="Other">Other</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Gaming">Gaming</option>
                  {/* <option value="">Expense 3 A</option> */}
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
                        type="radio"  name="mode"  value="Cash"  checked={expenseData.mode === "Cash"}  onChange={handleChangeExpense}  className="mr-2"
                      />
                      Cash
                    </label>
                    <label>
                      <input
                        type="radio"  name="mode"  value="Online"  checked={expenseData.mode === "Online"}  onChange={handleChangeExpense} className="mr-2"/>
                      Online
                    </label>
                  </div>
              </div>

              <button type="submit" className="p-2 w-40 mx-auto rounded-xl bg-green-300 dark:bg-slate-800 dark:text-white mt-2">Add Expense</button>
            </form>
        </div>
          )
        }

        {/* EXPENSES TABLE  FOR PC*/}
        <div className="w-full sm:pl-5 h-full hidden sm:flex">
          <table className="table-auto w-full border-2 h-full bg-slate-200 dark:bg-gray-400 p-10 overflow-x-scroll ">
            {
              expensesData.length > 0 && (
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
                expensesData.length === 0 && (
                  <tr>
                    <td>
                      <div className='text-4xl font-semibold flex items-center justify-center my-24 gap-5'>
                        Track Your Expenses 
                        <p className='dark:text-white text-green-500'>Add Now!!!</p>
                      </div>
                    </td>
                  </tr>
                )
              }
              {expensesData.map((expense) => (
                <tr key={expense._id} className="h-[7vh]">
                  <td className="border px-4 py-2 w-2/12">{expense.title}</td>
                  <td className="border px-4 py-2 w-1/12 ">
                    <div className="flex justify-center">{expense.amount}</div>
                  </td>
                  <td className="border px-4 py-2 w-2/12">{expense.category}</td>
                  <td className="border px-4 py-2 w-1/12">{expense.mode}</td>
                  <td className="border px-4 py-2 w-1/12">
                    <div className="flex justify-center">{new Date(expense.date).toLocaleDateString()}</div>
                  </td>
                  <td className="border px-4 py-2 w-3/12">{expense.description}</td>
                  <td className="border px-4 py-2 w-1/12"><div className="flex justify-center">Edit</div></td>
                  <td className="border px-4 py-2 w-1/12"><button onClick={() => deleteHandler(expense._id)}><div className="ml-4 text-xl"><MdDelete className="hover:text-red-600 hover:text-2xl"/></div></button></td>
                  {/* Add more data cells as needed */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* EXPENSES TABLE  FOR PHONE*/}
        <div className="w-full sm:pl-5 h-full overflow-x-scroll flex sm:hidden">
          <table className="table-auto w-full border-2 h-full bg-gray-400 p-10 ">
            <thead className="w-full">
              <tr className="w-full">
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
                    <th className="px-6 py-2 w-10 text-xl"><MdDelete/></th>
                  )}
              </tr>
            </thead>
            <tbody>
              {expensesData.map((expense) => (
                <tr key={expense._id} className="h-[7vh]">
                  {details && (
                    <td className="border px-4 py-2 w-2/12">{expense.title}</td>
                  )}
                  <td className="border px-4 py-2 w-1/12 ">
                    <div className="flex justify-center">{expense.amount}</div>
                  </td>
                  <td className="border px-4 py-2 w-2/12">{expense.category}</td>
                  <td className="border px-4 py-2 w-1/12">{expense.mode}</td>
                  <td className="border px-2 py-2 w-1/12">
                    <div className="flex justify-center">{new Date(expense.date).toLocaleDateString()}</div>
                  </td>
                  {details && (
                    <td className="border px-2 py-2 w-3/12">{expense.description}</td>
                  )}
                  
                  {details && (
                    <td className="border px-4 py-2 w-1/12"><div className="flex justify-center">Edit</div></td>
                  )}
                  {details && (
                    <td className="border px-6 py-2 w-10"><button onClick={() => deleteHandler(expense._id)}><div className="text-xl"><MdDelete className="hover:text-red-600 hover:text-2xl"/></div></button></td>
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
