import {combineReducers} from "@reduxjs/toolkit";
import user from "./slice/user";
import users from "./slice/users"

const rootReducer = combineReducers({
    user: user,
    users: users
})

export default rootReducer;