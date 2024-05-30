// "use client"
// import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
// import Navbar from "@/components/Navbar";
import { Provider } from "react-redux";
import { store } from "../redux/store.js";
import { Metadata } from "next";
import ProviderWrapper from "@/components/provider.js";

// const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create next app",
  description: "Generated for testing",
  manifest: "/manifest.json"
}

export const viewport = {
  themeColor: "#334155",
}
 
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <body className={inter.className}> */}
      <body className="dark:bg-slate-700">
        <ProviderWrapper>
        {/* <Provider store={store}> */}
          {/* <div className="h-full "> */}
            {/* <Navbar/> */}
            {children}
            <Toaster position="bottom-center"/>
          {/* </div> */}
        {/* </Provider> */}
        </ProviderWrapper>
      </body>
    </html>
  );
}
