import { useNavigate } from "react-router-dom";
import React from 'react'
const { createContext, useEffect, useState } = require("react");

export const AccountContext = createContext();
export const UserContext = ({children}) => {
    const [user, setUser] = useState({
        loggedIn: null,
        //redisKey: null,
        //token: localStorage.getItem('token')
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:4000/auth/login",
        {
            credentials: "include",
            headers: {
                //'authorization': `Bearer ${user.token}`,  
                'Content-Type': 'application/json'
            }
        })
        .catch(err => {
            setUser({loggedIn: false}) 
            return})
        .then(res => {
            if (!res || !res.ok || res.status >= 400){
                setUser({loggedIn: false}) 
                return}
            return res.json()
            })
        .then( data => {
            if (!data){
                setUser({loggedIn: false}) 
                return
            }
            else{
                setUser ({...data})
                navigate("/home")
            }
        })
    }, [])


    return (<AccountContext.Provider value={{user, setUser}}>
        {children}
    </AccountContext.Provider>)
}

