import React from 'react'
import UserLayout from "@/components/User-Layout.js"
import LoggedInUserComponent from "@/components/Logged-In-User-Only-Layout.js"

const page = () => {
  return (
    <UserLayout>
    <LoggedInUserComponent>
      <div className="flex flex-col items-center justify-between p-24">
        <h1 className='text-2xl font-bold dark:text-white mx-auto mb-2'>Transactions</h1>
      </div>
    </LoggedInUserComponent>
    </UserLayout>
  )
}

export default page