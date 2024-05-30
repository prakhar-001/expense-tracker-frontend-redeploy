"use client"
// provider.js
import { Provider } from "react-redux";
import { store } from "../redux/store.js";

const ProviderWrapper = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ProviderWrapper;
