"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import UserLayout from "../Components/User-Layout.js";
import LoggedInUserComponent from "../Components/Logged-In-User-Only-Layout.js";
import { useSelector } from "react-redux";


export default function Home() {
  const {user, loading} = useSelector(state => state.userReducer)
  const userId = user?._id;

  const [addIncomeOpen, setAddIncomeOpen] = useState(false)
  const [addExpenseOpen, setAddExpenseOpen] = useState(false)
  const [categoriesDataIncome, setCategoriesDataIncome] = useState([])
  const [categoriesDataExpense, setCategoriesDataExpense] = useState([])

  // console.log(addIncomeOpen)
  
  const [incomeData, setIncomeData] = useState({
    title: '',
    amount: '',
    mode: '',
    user: userId,
    description: '',
    date: '',
    category: ''
  });
  const [expenseData, setExpenseData] = useState({
    title: '',
    amount: '',
    user: userId,
    description: '',
    date: '',
    category: ''
  });

 const handleChangeIncome = (e) => {
    setIncomeData({
      ...incomeData,
      [e.target.name]: e.target.value
    });
  };
 const handleChangeExpense = (e) => {
    setExpenseData({
      ...expenseData,
      [e.target.name]: e.target.value
    });
  };

  const typeIncome = "Income"
  const typeExpense = "Expense"
  useEffect(() => {
    fetchCategoriesIncome(userId, typeIncome);
    fetchCategoriesExpense(userId, typeExpense);
  }, []);

  const fetchCategoriesIncome = async (userId, type) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_VITE_SERVER}/api/v1/category/get?id=${userId}&type=${type}`); // Assuming this is your API endpoint for fetching expenses
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }
      // console.log(response)
      const data = await response.json();
      // console.log(data)
      // console.log(data.expenses)
      setCategoriesDataIncome(data.categories);
    } catch (error) {
      console.error('Error fetching expenses:', error);
  }
  }
  const fetchCategoriesExpense = async (userId, type) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_VITE_SERVER}/api/v1/category/get?id=${userId}&type=${type}`); // Assuming this is your API endpoint for fetching expenses
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }
      // console.log(response)
      const data = await response.json();
      // console.log(data)
      // console.log(data.expenses)
      setCategoriesDataExpense(data.categories);
    } catch (error) {
      console.error('Error fetching expenses:', error);
  }
  }

const handleSubmitIncome = async (e) => {
  e.preventDefault();
  setAddExpenseOpen(false)
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_VITE_SERVER}/api/v1/transaction/add-income`, incomeData);
    // console.log(response.data);
    toast.success(response.data.message)
    // Handle success, e.g., show a success message or reset the form
  } catch (error) {
    // console.error(error);
    toast.error(error.response.data.message)
    // Handle error, e.g., show an error message
  }
};
const handleSubmitExpense = async (e) => {
  e.preventDefault();
  try {
    console.log(expenseData)
    const response = await axios.post(`${process.env.NEXT_PUBLIC_VITE_SERVER}/api/v1/transaction/add-expense`, expenseData);
    // console.log(response.data);
    toast.success(response.data.message)
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
    <main className="flex flex-col sm:flex-row justify-between sm:pt-5 pb-24 gap-2 sm:gap-5 h-screen sm:h-[90vh] w-auto mx-2 sm:mx-20 sm:px-2 ">


    {/* ADD Container */}
    <div className="w-full h-full sm:w-1/3 flex flex-col gap-2">
      {/* Buttons */}
      <h1 className='text-2xl font-bold dark:text-white mx-auto mb-2'>DashBoard</h1>
      <div className="w-full flex justify-around">
        <button onClick={() => {
          setAddIncomeOpen(!addIncomeOpen) 
          setAddExpenseOpen(false)}} className="bg-slate-400 p-3 rounded-xl w-32">
          <h1>Add Income</h1>
        </button>
        <button onClick={() => {
          setAddExpenseOpen(!addExpenseOpen)
          setAddIncomeOpen(false)
          }} className="bg-slate-400 p-3 rounded-xl w-32">
          <h1>Add Expense</h1>
        </button>
      </div>

      {/* INCOME */}
      <div className="flex flex-col items-center w-full">  
        {
          addIncomeOpen && 
          <div className="flex flex-col items-center border-2 w-full h-max bg-gray-400 rounded-xl p-5">        
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
                  categoriesDataIncome.map((i) => (
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
        }

        {/* EXPENSE */}
        {
          addExpenseOpen && 
          <div className="flex flex-col items-center border-2 w-full h-max bg-gray-400 rounded-xl p-5">
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
                  categoriesDataExpense.map((i) => (
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

              <button type="submit" className="p-2 w-40 mx-auto rounded-xl bg-green-300 mt-2">Add Expense</button>
            </form>
        </div>
        }
      </div>
    </div>
    <div className="bg-green-300 w-full h-full border-2 border-red-500">
      hii
    </div>
     
      
    </main>
    </LoggedInUserComponent>
    </UserLayout>

  );
}
