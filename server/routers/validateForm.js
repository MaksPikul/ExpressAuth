//const formSchema = require("@project/common")
//import { formSchema } from '../common';
const yup = require("yup")

const formSchema = yup.object().shape({
    email: yup.string()
      .required("Email required")
      .min(6, "Email too short")
      .max(27, "Email Too long"),
      password: yup.string()
      .required("Password required")
      .min(6, "Password too short")
      .max(27, "Password Too long"),
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