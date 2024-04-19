"use client"
// import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import { Provider } from "react-redux";
import { store } from "../redux/store.js";

// const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <body className={inter.className}> */}
      <body>
        <Provider store={store}>
          {/* <div className="h-full "> */}
            {/* <Navbar/> */}
            {children}
            <Toaster position="bottom-center"/>
          {/* </div> */}
        </Provider>
      </body>
    </html>
  );
}
