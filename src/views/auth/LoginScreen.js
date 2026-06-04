import React, { useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import tw from "twrnc"
import { Image } from 'react-native'
import { Text } from 'react-native'
import FormInput from '../../components/inputs/FormInput'
import { MaterialIcons, Entypo } from '@expo/vector-icons'
import PrimaryButton from '../../components/buttons/PrimaryButton'
import { Formik } from 'formik'
import * as Yup from "yup"
import axiosInstance from '../../utils/axiosInstance/axiosInstance'
import Toast from 'react-native-toast-message'
import { getValue, setUser, setValue } from '../../services/storage'
import { ActivityIndicator } from 'react-native-paper'

function LoginScreen(props) {
    const validationSchema = Yup.object().shape({
        email: Yup.string()
                        .required("*"),
        password: Yup.string()
                  .required("*")
    })
  const initialValues = {
    email: "", password: ""
  }
  const [isLoading, setIsLoading] = useState(false)
  const onSubmit = (values) => {
    setIsLoading(true)
    const url = "/api/auth/login";
      axiosInstance.post(url, {...values, auth:"email_and_password"})
      .then(async response => {
          await setValue("token", response.data.data.token)
          await setValue("user", JSON.stringify(response.data.data.user))
          await setValue("role", response.data.data.role)
          Toast.show({
            type: "success",
            text1: "Welcome"
          })
          if (response.data?.data.role === "DOCTOR")
          {
            await setValue("hospital", JSON.stringify(response.data?.data.hospital))
          }
            props.navigation.push("NavigationStacks")
      })
      .catch(error => {
        Toast.show({
            type: "error",
            text1: error.response?.data.message ?? error.message
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <>
        <ScrollView style={tw`bg-white`}>
         <View style={tw`p-8 flex flex-col justify-between h-full w-full`}>
            <Image
             source={require("../../../assets/images/login.png")}
             resizeMode="contain"
             style={tw`w-full h-50 mt-7`}
            />
            <Text style={tw`text-[#0C3778] text-left text-10 font-bold`}>Sign In</Text>
             <Formik
              onSubmit={(values) => onSubmit(values)}
              validationSchema={validationSchema}
              initialValues={initialValues}
             >
             {({
                    handleChange, 
                    handleBlur,
                    handleSubmit, 
                    touched,
                    values,
                    errors,
                    isValid}) => (
                <>
                {
                    errors.emailMatricle && errors.password && <Text style={tw`text-red-600`}>* Required</Text>
                }
              <FormInput 
               icon={<MaterialIcons name='email' size={24} style={tw`text-[#8B8989]`} />}
               name="default"
               value={values.emailMatricle}
               onBlur={handleBlur("email")}
               onChange={handleChange("email")}
               placeholder="Email"
              />
              {
                errors.email && touched.email && <Text style={tw`text-red-600 mb-3`}>{errors.email}</Text>
              }
              <FormInput 
               icon={<MaterialIcons name='lock' size={24} style={tw`text-[#8B8989]`} />}
               type="password"
               value={values.password}
               onBlur={handleBlur("password")}
               onChange={handleChange("password")}
               placeholder="Password"
              />
              {
                errors.password && touched.password && <Text style={tw`text-red-600 mb-3`}>{errors.password}</Text>
              }
             <TouchableOpacity style={tw`mt-5 w-full`}>
                    <Text style={tw`text-4 text-right text-[#0C3778] font-semibold`}>Forgot password ?</Text>
             </TouchableOpacity>
             {isLoading ?
                <ActivityIndicator size={40} />
                :
               <PrimaryButton 
                name="Login"
                onPress={handleSubmit}
               />}
               </>
                    )}
            </Formik>
               <View  style={tw`flex flex-row font-semibold justify-between items-center w-[50%] mt-5`}>
               <Text style={tw`text-5 font-semibold`}>New to iKare ? </Text>
                 <TouchableOpacity onPress={() => props.navigation.navigate("Register")}>
                    <Text style={tw`text-[#0C3778] font-semibold text-5`}>Register</Text>
                    </TouchableOpacity>
                </View>
             </View>
       </ScrollView>
    </>
  )
}

export default LoginScreen