import {combineReducers} from "@reduxjs/toolkit";
import user from "./slice/user";

const rootReducer = combineReducers({
    user: user
})

export default rootReducer;