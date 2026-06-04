import * as Yup from "yup";
import { validateCamtel, validateMTN, validateOrange } from "./validatePhone";

export const validationSchema =  Yup.object().shape({
    fullName:  Yup.string()
                .required("*")
                .matches(/^[A-Za-z\s]+$/i, "Only letters and whitespaces are allowed"),
    emailAddress: Yup.string()
                    .email("Enter a valid email address")
                    .required("*"),
    password:      Yup.string()
                    .min(5, "Password too short !")
                    .matches(/^[A-Za-z0-9]+[`!@#$%^&()_+\-=\[\]{};':"\\|,.<>\/?~]/, "Password should include letters, numbers and special characters !")
                    .required("*"),
    confirmPassword:  Yup.string()
                      .required("*")
                      .oneOf([Yup.ref("password"), null], "Passwords must match !"),
    telNumber: Yup.string()
                .required("*")
                .min(9, "Enter a Cameroonian Phone Number")
                .max(9, "Enter a Cameroonian Phone Number")
                .test("validate-phone", "Enter either MTN, Orange or CAMTEL", (tel) => (validateMTN(tel) && validateOrange(tel) && validateCamtel(tel)) == false)
})

