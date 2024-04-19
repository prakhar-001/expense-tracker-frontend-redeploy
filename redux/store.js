import { configureStore } from "@reduxjs/toolkit";
// import { userAPI } from "./api/userApi.js";
import { userReducer } from "./reducer/userReducer.js";
// import { cartReducer } from "./reducer/cartReducer.js";


export const store = configureStore({
    reducer:{
        [userReducer.name]: userReducer.reducer,
        // [cartReducer.name]: cartReducer.reducer,
        
    },
    // middleware: (mid) => [...mid(), userAPI.middleware, productAPI.middleware, orderAPI.middleware, addressAPI.middleware, wishlistAPI.middleware],
});