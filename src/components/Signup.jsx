import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Form, useFormik } from "formik";
import * as yup from "yup";
import {TextField, Button, Stack, FormControl, FormLabel, FormHelperText, ButtonGroup, Typography} from "@mui/material"
//const formSchema = require("@project/common")
//import { formSchema } from '../common';
import { useContext } from 'react';
import { AccountContext } from './AccountContext.jsx';



const Signup = () => {
  const navigate = useNavigate();
  const {setUser} = useContext(AccountContext)
  
      const validation = yup.object({
        email: yup.string()
          .required("Email required")
          .min(6, "Email too short")
          .max(27, "Email Too long"),
          password: yup.string()
          .required("Password required")
          .min(6, "Password too short")
          .max(27, "Password Too long"),
      })
    
      const formik = useFormik({
        initialValues: {email: "", password: ""},
        validationSchema: validation,
    
        onSubmit: ((values, actions) => {
          console.log("dogsssssss")
          const vals = {...values};
          actions.resetForm();
          fetch("http://localhost:4000/auth/register",{
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type" : "application/json"
            },
              body: JSON.stringify(vals),
          })
            .catch(error => {
              return;
            })
            .then(res => {
              if (!res || !res.ok || res.status >= 400){
                return;
              }
              else {
                return res.json();
              }
            })
            .then(data => {
              if (!data){return;}
              console.log("why not")
              setUser({...data})
              navigate("/home")
            })
      }),
    });
    
      return (
          
        /*
          <Stack
          spacing={2} // Adjust spacing as needed
          direction="column" // Align items vertically
          justifyContent="center" // Center items horizontally
          alignItems="center" // Center items vertically
          >
          */
          <form onSubmit={formik.handleSubmit}>
            <Typography variant="h4">Register new Account</Typography>
    
            
              <TextField
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            
    
            
              <TextField
                id="password"
                name="password"
                label="Password"
                type="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
            
    
            
              <Button type="submit">Create Account</Button>
              <Button onClick={()=> navigate("/")}>Back</Button>
            
      
          </form>
  )
}

export default Signup
