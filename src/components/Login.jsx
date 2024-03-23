import React from 'react'
import {useFormik } from "formik";
import * as yup from "yup";
import {TextField, Button, Stack, FormControl, FormLabel, FormHelperText, ButtonGroup, Typography} from "@mui/material"
import { useNavigate } from 'react-router';
//import { formSchema } from '../common';
import { useContext } from 'react';
import { AccountContext } from './AccountContext.jsx';



export default function Login () {
  const {setUser} = useContext(AccountContext)
  const navigate = useNavigate();

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


    // on submission of form, fetch data, with the response, do certain things
    onSubmit: ((values, actions) => {
        const vals = {...values};
        console.log("goes here nutty")
        actions.resetForm();
        fetch("http://localhost:4000/auth/login",{
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type" : "application/json",
          },
            body: JSON.stringify(vals),
        }).catch(error => {
            return;
          })
          .then(res => {
            if (!res || !res.ok || res.status >= 400){
              return;
            }
            return res.json()
          })
          .then(data => {
            if (!data){return;}
              
              setUser({...data})
              navigate("/home")
        })

        }),
  });
  

  return (
      
      /*<Stack
      spacing={2} // Adjust spacing as needed
      direction="column" // Align items vertically
      justifyContent="center" // Center items horizontally
      alignItems="center" // Center items vertically
      component={}
      >
      */
      <form onSubmit={formik.handleSubmit}>
        <Typography variant="h4">Log In</Typography>

        
          <TextField
            id="email"
            name="email"
            label="email"
            value={formik.values.email}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
       

        
          <TextField
            id="password"
            name="password"
            label="password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
        

        
          <Button type="submit" >Log In</Button>
          <Button onClick={() => navigate("/register")}>Create Account</Button>

          
      </form>   
      //</Stack>
      
  )
}


