"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import UserLayout from "@/components/User-Layout.js";
import LoggedInUserComponent from "../components/Logged-In-User-Only-Layout.js";
import { useSelector } from "react-redux";
import ProviderWrapper from "@/components/provider.js";
import { Gauge , gaugeClasses } from '@mui/x-charts/Gauge';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';

// React ChartJs 2 Graphs and Charts
import { Line } from "react-chartjs-2";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, ArcElement, Legend } from "chart.js";
import { useTheme } from '@emotion/react';
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip)
ChartJS.register(ArcElement, Tooltip, Legend)



export default function Home() {
  const {user, loading} = useSelector(state => state.userReducer)
  const userId = user?._id;

  const [addIncomeOpen, setAddIncomeOpen] = useState(false)
  const [addExpenseOpen, setAddExpenseOpen] = useState(false)
  const [categoriesDataIncome, setCategoriesDataIncome] = useState([])
  const [categoriesDataExpense, setCategoriesDataExpense] = useState([])

  // Variables for Fetching Expenses Data
  const [expensesData, setExpensesData] = useState([]);
  const [selectedModeExpense, setSelectedModeExpense] = useState("all");
  const [selectedMonthExpense, setSelectedMonthExpense] = useState("all");
  const [selectedYearExpense, setSelectedYearExpense] = useState("2024");

  // Variables for Fetching Incomes Data
  const [incomesData, setIncomesData] = useState([]);
  const [selectedMonthIncome, setSelectedMonthIncome] = useState("all");
  const [selectedModeIncome, setSelectedModeIncome] = useState("all");
  const [selectedYearIncome, setSelectedYearIncome] = useState("2024");
  
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

  useEffect(() => {
    fetchExpenses(userId, selectedMonthExpense, selectedYearExpense, selectedModeExpense);
    fetchYearlyExpenses(userId, selectedMonthExpense, selectedYearExpense, selectedModeExpense);
  }, [selectedMonthExpense, selectedYearExpense, selectedModeExpense]);

  useEffect(() => {
    fetchIncomes(userId, selectedMonthIncome, selectedYearIncome, selectedModeIncome);
 }, [selectedMonthIncome, selectedYearIncome, selectedModeIncome]);

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

  // Fetching Expenses Yearly wihtout month filter
  const fetchYearlyExpenses = async (userId, month, year, mode) => {
    // console.log(userId + "  " + month + "  " + year)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_VITE_SERVER}/api/v1/transaction/get-expenses?id=${userId}&month=all&year=${year}&mode=${mode}`);
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }
      const data = await response.json();
      // setExpensesData(data.expenses); 
    } catch (error) {
      console.error('Error fetching expenses:', error);
  }
  }
  // Fetching Expenses
  const fetchExpenses = async (userId, month, year, mode) => {
    // console.log(userId + "  " + month + "  " + year)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_VITE_SERVER}/api/v1/transaction/get-expenses?id=${userId}&month=${month}&year=${year}&mode=${mode}`); // Assuming this is your API endpoint for fetching expenses
      if (!response.ok) {
        throw new Error('Failed to fetch expenses');
      }
      const data = await response.json();
      const groupedExpenses = groupExpensesByCategory(data.expenses);
      console.log(groupedExpenses)
      setExpensesData(data.expenses);
      const total = data.expenses.reduce((acc, income) => acc + +income.amount, 0);
      // setTotalExpense(total);
    } catch (error) {
      console.error('Error fetching expenses:', error);
  }
  }
  // console.log(expensesData)

  const groupExpensesByCategory = (expenses) => {
    return expenses.reduce((accumulator, expense) => {
      // Find the index of the category in the accumulator array
    let categoryIndex = accumulator.findIndex(categoryArray => categoryArray[0].category === expense.category);

    // If the category does not exist, create a new array for it
    if (categoryIndex === -1) {
      accumulator.push([expense]);
    } else {
      // If the category exists, add the expense to its existing array
      accumulator[categoryIndex].push(expense);
    }

    return accumulator;
  }, []);
  };
  
  
  // Calculating monthy expenses from the fetched expenses data
  const calculateMonthlyExpenses = (expenses) => {
    // Initialize an array of 12 zeros to represent the months
    let monthlyExpenses = new Array(12).fill(0);
  
    // Process each expense
    expenses.forEach(expense => {
      // Parse the date string to get a Date object
      const date = new Date(Date.parse(expense.date));
      
      // Extract the month (0-based) and add 1 to match January (1) to December (12)
      const monthIndex = date.getMonth();
      
      // Update the corresponding month's expense with the current expense's amount
      monthlyExpenses[monthIndex] += parseFloat(expense.amount);
    });
  
    return monthlyExpenses;
  };
  const monthlyExpenses = calculateMonthlyExpenses(expensesData);
  // console.log(monthlyExpenses);

  


  // Fetching incomes
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
      // setTotalIncome(total);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  }
  // Calculating monthy incomes from the fetched incomes data
  const calculateMonthlyIncomes = (incomes) => {
    // Initialize an array of 12 zeros to represent the months
    let monthlyIncomes = new Array(12).fill(0);
  
    // Process each expense
    incomes.forEach(income => {
      // Parse the date string to get a Date object
      const date = new Date(Date.parse(income.date));
      
      // Extract the month (0-based) and add 1 to match January (1) to December (12)
      const monthIndex = date.getMonth();
      
      // Update the corresponding month's expense with the current expense's amount
      monthlyIncomes[monthIndex] += parseFloat(income.amount);
    });
  
    return monthlyIncomes;
  };
  const monthlyIncomes = calculateMonthlyIncomes(incomesData);
  // console.log(monthlyExpenses);

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

const [theme, setTheme] = useState("")
useEffect(() => {
  const Usertheme = localStorage.getItem("theme")
  setTheme(Usertheme);
  console.log(Usertheme)
}, [])


// Graphs and Charts
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const lineDataExpense = {
  labels: months,
  datasets: [{
    label: "Expenses of the month",
    data: monthlyExpenses,
    borderColor: "rgb(252, 57, 23)",
    backgroundColor: "white",
    pointBorderColor: "rgb(252, 57, 23)",
    borderJoinStyle: "bezier",
    tension: 0.5,
    borderWidth: 2,
    pointRadius: 4,

  }]
}
const lineDataIncome = {
  labels: months,
  datasets: [{
    label: "Expenses of the month",
    data: monthlyIncomes,
    borderColor: "rgb(0,225,71)",
    backgroundColor: "white",
    pointBorderColor: "rgb(0,225,71)",
    borderJoinStyle: "bezier",
    tension: 0.5,
    borderWidth: 2,
    pointRadius: 4,

  }]
}
const lineOptions = {
  plugins: {
    legend: true
  },
  scales: {
    x: {
      ticks: {
        color: theme === 'light' ? 'black' : 'white'
      }
    },
    y: {
      min: 0,
      autoScale: true,
      ticks: {
        color: theme === 'light' ? 'black' : 'white'      },
    }
  }
  
}
const combinedData = {
  labels: months,
  datasets: [
    {
      label: "Expense",
      data: monthlyExpenses,
      borderColor: "rgb(252, 57, 23)",
      backgroundColor: "white", // Adjust opacity if needed
      pointBorderColor: "rgb(252, 57, 23)",
      borderJoinStyle: "bezier",
      tension: 0.5,
      borderWidth: 2,
      pointRadius: 4,
    },
    {
      label: "Income",
      data: monthlyIncomes,
      borderColor: "rgb(0,225,71)",
      backgroundColor: "white", // Adjust opacity if needed
      pointBorderColor: "rgb(0,225,71)",
      borderJoinStyle: "bezier",
      tension: 0.5,
      borderWidth: 2,
      pointRadius: 4,
    }
  ]
};

const combineLineOptions = {
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
    
  },
  scales: {
    x: {
      ticks: {
        color: theme === 'light' ? 'black' : 'white'}
        // trying bibiu iubuib
    },
    y: {
      min: 0,
      autoScale: true,
      ticks: {
        color: theme === 'light' ? 'black' : 'white'},
    }
  }
}
const doughnutData = {
  labels: ["yes", "no", "hii","joker", "poll","abc","xyz"],
  datasets: [{
    labels: "Poll",
    data: [2,15, 45, 8, 11,1,56],
    backgroundColor:["yellow", "green","pink", "cyan", "wheat"],
    borderColor: ["yellow", "red"],
  }]
}
const doughnutOptions = {

}
  return (

    // <ProviderWrapper> 

    <UserLayout>
    <LoggedInUserComponent>
    <main className="flex flex-col sm:flex-row justify-between sm:pt-5 pb-24 gap-2 sm:gap-5 h-screen sm:h-[90vh] w-auto mx-2 sm:mx-20 sm:px-2 ">


    {/* ADD Income and Expense Button Container*/}
    <div className="w-full sm:w-1/4 h-auto flex flex-col gap-2">
      {/* Buttons */}
      <h1 className='text-2xl font-bold dark:text-white mx-auto mb-2'>DashBoard</h1>
      <div className="w-full flex justify-around">
        <button onClick={() => {
          setAddIncomeOpen(!addIncomeOpen) 
          setAddExpenseOpen(false)}} className="bg-green-300 dark:bg-slate-900 dark:text-white p-3 rounded-xl w-32">
          <h1>Add Income</h1>
        </button>
        <button onClick={() => {
          setAddExpenseOpen(!addExpenseOpen)
          setAddIncomeOpen(false)
          }} className="bg-green-300 dark:bg-slate-900 dark:text-white p-3 rounded-xl w-32">
          <h1>Add Expense</h1>
        </button>
      </div>

      {/* ADD INCOME AND EXPENSE FORM */}
      <div className="flex flex-col items-center w-full">  
        {/* INCOME */}
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

              <button type="submit" className="p-2 w-40 mx-auto rounded-xl bg-green-300 dark:bg-slate-800 dark:text-white mt-2">Add Income</button>            
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

              <button type="submit" className="p-2 w-40 mx-auto rounded-xl bg-green-300 dark:bg-slate-800 dark:text-white mt-2">Add Expense</button>
            </form>
        </div>
        }
      </div>
    </div>


    {/* ANALYSIS CONTAINER */}
    <div className=" w-full sm:w-3/4 h-full flex flex-col gap-4 sm:gap-8">

      {/* Filters for Analysis */}
      <div className="text-base flex justify-evenly sm:justify-end gap-5 mx-0 w-full sm:mx-0 mt-2 sm:mt-0 h-8">
            <select value={selectedModeExpense} onChange={(e) => {setSelectedModeExpense(e.target.value), setSelectedModeIncome(e.target.value)}} className='rounded-xl px-2 border-2 border-green-400 dark:border-slate-900'>
                <option value="all">All Mode</option>
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
            </select>
            <select value={selectedMonthExpense} onChange={(e) => {setSelectedMonthExpense(e.target.value), setSelectedMonthIncome(e.target.value)
            }} className='rounded-xl px-2 border-2 border-green-400 dark:border-slate-900'>
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
            <select value={selectedYearExpense} onChange={(e) => {setSelectedYearExpense(e.target.value), setSelectedYearIncome(e.target.value)}} className='rounded-xl px-2 border-2 border-green-400 dark:border-slate-900'>
                {/* <option value="2024">2024</option> */}
                {Array.from({ length: 5 }, (_, i) => 2022 + i).map((year) => (
                 <option key={year} value={year}>{year}</option>
                ))}
            </select>
        </div>

      {/* Line Charts Container*/}
      <div className='w-full flex flex-col sm:flex-row gap-2 '>
        <div className='w-full sm:w-1/2 h-56 sm:h-64'> 
          <h1 className='text-white font-semibold mb-2'>Expenses Yearly Analysis</h1>
          <Line data={lineDataExpense} options={lineOptions} className='w-full h-auto sm:w-auto sm:h-72 p-0 m-0' ></Line>
        </div>
        <div className='w-full sm:w-1/2 h-56 sm:h-64'>
          <h1 className='text-white font-semibold mb-2'>Incomes Yearly Analysis</h1>
          <Line data={lineDataIncome} options={lineOptions} className='w-full h-auto sm:w-auto sm:h-72 p-0 m-0' ></Line>
        </div>
      </div>

      <div className='w-full flex flex-col sm:flex-row gap-2'>
        <div className='w-full sm:w-2/3 h-56 sm:h-64'> 
          <h1 className='text-white font-semibold mb-2'>Financial Analysis</h1>
          <Line data={combinedData} options={combineLineOptions} className='w-full h-auto sm:w-auto sm:h-72 p-0 m-0 ' />
        </div>
      </div>

      {/* <div className='w-full h-96 border-2'>
        doughnutData
        <Doughnut data={doughnutData} options={doughnutOptions} className='w-auto h-full'></Doughnut>
      </div> */}





    </div>
      
    </main>
    </LoggedInUserComponent>
    </UserLayout>

    
  );
}
