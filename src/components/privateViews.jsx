import { useContext } from "react";
import { AccountContext } from "./AccountContext.jsx";
import React from 'react'

const { Outlet, Navigate } = require("react-router-dom");

const useAuth = () => {
    const { user }= useContext(AccountContext)
    return user && user.loggedIn;
}

const PrivateViews = () => {
    const isAuthed = useAuth();
    return isAuthed ? <Outlet/> : <Navigate to="/" />
}

export default PrivateViews;