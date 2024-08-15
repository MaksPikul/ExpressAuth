//const formSchema = require("@project/common")
//import { formSchema } from '../common';
const yup = require("yup")

const formSchema = yup.object().shape({
    email: yup.string()
      .email("Invalid email address")
      .required("Email required")
      .min(6, "Email too short")
      .max(27, "Email Too long"),
    password: yup.string()
      .required("Password required")
      .min(6, "Password too short")
      .max(27, "Password Too long"),
  })


const registerSchema = yup.object().shape({
    password: yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .max(20, 'Password cannot be longer than 20 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required')
})


const validateForm = (req ,res, next) => {

    const formData = req.body;
        formSchema.validate(formData)
            .catch(() => {
                res.status(422).send();   
            })
            .then(valid => {
                if (valid) {
                    console.log("form valid");
                    next()
                }
                else {
                    res.status(422).send();   
                }
            })
}

module.exports = validateForm