//const formSchema = require("@project/common")
//import { formSchema } from '../common';
const yup = require("yup")


const validateForm = (req ,res) => {
    
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

    const formData = req.body;
        formSchema.validate(formData)
            .catch(err => {
                res.status(422).send();
                console.log("problem :3")
                console.log(err.errors);    
            })
            .then(valid => {
                if (valid) {
                    console.log("form valid");
                }
            })
}

module.exports = validateForm