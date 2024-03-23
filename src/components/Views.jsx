import React from 'react';
import { Route, Routes } from "react-router-dom";
import Login from './Login.jsx'
import Signup from './Signup.jsx'
import PrivateViews from './privateViews.jsx';
import { useContext } from 'react';
import { AccountContext } from './AccountContext.jsx';


export default function Views () {
  const { user } = useContext(AccountContext);
  return user.loggedIn === null ? (
    <div>Loading...</div>
  ) :(

    //
        <Routes>
            <Route path="/" element={<Login />}> </Route>
            <Route path="/register" element={<Signup />}> </Route>
            <Route element={<PrivateViews/>}>
              <Route path="/home" element={<div> at home lolers</div>}/>
            </Route>
          <Route path="*" element={<Login />} />
        </Routes>

    
  )
  
}


