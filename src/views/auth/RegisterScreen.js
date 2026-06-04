import { Formik } from 'formik'
import React, {useState} from 'react'
import { Image, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native'
import tw from "twrnc"
import FormInput from '../../components/inputs/FormInput'
import {MaterialIcons} from "@expo/vector-icons"
import { validationSchema } from '../../utils/validation/registerValidation'
import PrimaryButton from '../../components/buttons/PrimaryButton'
import axiosInstance from "../../utils/axiosInstance/axiosInstance"
import { SelectList } from 'react-native-dropdown-select-list'

function RegisterScreen(props) {
  const genderList = ["Male", "Female"]
  const [gender, setGender] = useState("Male")
  const onSelectGender = (text) => {
      setGender(text)
  }
    const initialValues = {
        fullname: "",
        email: "",
        password: "",
        tel: ""
    }
    const onSubmit = (values) => {
      const url = "/api/user/register";
      axiosInstance.post(url, {...values, gender})
      .then(response => {
          Toast.success("Registration successfull")
          // props.navigation.navigate("/login")
      })
      .catch(error => Toast.error(error.message ?? error.response.data.message))
    }
  return (
    <>
        <ScrollView>
            <View style={tw`p-8`}>
                <Image 
                 source={require("../../../assets/images/splash2.png")}
                 resizeMode="cover"
                 style={tw`self-center w-full h-60`}
                />
                <Text style={tw`text-[#0C3778] text-left text-10 font-bold`}>Create Account</Text>
                 <Formik
                  initialValues={initialValues}
                  onSubmit={(values) => onSubmit(values)}
                  validationSchema={validationSchema}>
                    {({
                        handleSubmit,
                        handleChange,
                        handleBlur,
                        touched,
                        values,
                        errors
                       }) => (
                        <>
                          {
                            errors && 
                            (
                                errors.fullname && touched.fullname && values.fullname.trim().length == 0 ||
                                errors.email && touched.email && values.email.trim().length == 0 ||
                                errors.tel && touched.tel && values.tel.trim().length == 0 ||
                                errors.password && touched.password && values.password.trim().length == 0
                            ) && <Text style={tw`text-red-600`}>* Required</Text>
                          }
                            <FormInput 
                              placeholder="Full Name"
                              type="text"
                              value={values.fullname}
                              onChange={handleChange("fullname")}
                              onBlur={handleBlur("fullname")}
                              name="default"
                              icon={<MaterialIcons name="edit" size={24} style={tw`text-[#8B8989]`} />}
                            />
                            {
                                errors.fullname && touched.fullname && <Text style={tw`text-red-600 mt-2`}>{errors.fullname}</Text>
                            }
                            <FormInput 
                              placeholder="Email Address"
                              type="text"
                              value={values.email}
                              onChange={handleChange("email")}
                              onBlur={handleBlur("email")}
                              name="email-address"
                              icon={<MaterialIcons name="email" size={24} style={tw`text-[#8B8989]`} />}
                            />
                            {
                                errors.email && touched.email && <Text style={tw`text-red-600 mt-2`}>{errors.email}</Text>
                            }
                            <FormInput 
                                placeholder="Telephone"
                                type="tel"
                                value={values.tel}
                                onChange={handleChange("tel")}
                                onBlur={handleBlur("tel")}
                                name="phone-pad"
                                icon={<MaterialIcons name="phone" size={24} style={tw`text-[#8B8989]`} />}
                            />
                            {
                                errors.tel && touched.tel && <Text style={tw`text-red-600 mt-2`}>{errors.tel}</Text>
                            }
                            <FormInput 
                                 placeholder="Password"
                                 type="password"
                                 value={values.password}
                                 onChange={handleChange("password")}
                                 onBlur={handleBlur("password")}
                                 name="default"
                                 icon={<MaterialIcons name="lock" size={24} style={tw`text-[#8B8989]`} />}
                            />
                            {
                                errors.password && touched.password && <Text style={tw`text-red-600 mt-2`}>{errors.password}</Text>
                            }
                            <View style={tw`mb-5`}></View>
                            <SelectList
                             data={genderList}
                             setSelected={onSelectGender}
                             placeholder='Select your gender'
                            />
                            <PrimaryButton 
                                name="Register"
                                onPress={handleSubmit}
                            />
                        </>
                    )}
                 </Formik>
                 <View  style={tw`flex flex-row font-semibold justify-between items-center w-[50%] mt-5`}>
               <Text style={tw`text-5 font-semibold`}>Got an account ? </Text>
                 <TouchableOpacity onPress={() => props.navigation.navigate("Login")}>
                    <Text style={tw`text-[#0C3778] font-semibold text-5`}>Log In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    </>
  )
}

export default RegisterScreen