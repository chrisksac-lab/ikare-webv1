import React from 'react'
import { ActivityIndicator, Image, ScrollView, TextInput } from 'react-native'
import { Text, View } from 'react-native'
import tw from "twrnc"
import {MaterialCommunityIcons, MaterialIcons} from "react-native-vector-icons"
import { TouchableOpacity } from 'react-native'
import { useState } from 'react'
import Toast from 'react-native-toast-message'
import axiosInstance from "../../../utils/axiosInstance/axiosInstance"
import {getStoredUser, getValue} from "../../../services/storage";

function Prescription({navigation, route}) {
  const [quantity, setQuantity] = useState("")
  const [info, setInfo] = useState("")
  const [diagnosis, setDiagnosis] = useState("")
  const [drug, setDrug] = useState("")
  const {patient, appointment} = route?.params ?? {}
  const [isLoading, setIsLoading] = useState(false)
  const handleSubmit = async() => {
      if (!diagnosis || !quantity || !info || !drug) {
        Toast.show({
          type: "error",
          text1:"Fill in the form fields"
        })
      }
      else {
          setIsLoading(true)
          const data = {
            appointment,
            patient,
            doctor: await getStoredUser(),
            hospital: JSON.parse(await getValue("hospital")),
            prescription: {
              drug,
              info,
              quantity,
              diagnosis
            }
          }
          const url = "/api/user/issue-prescription";
          axiosInstance.post(url, data)
          .then(response => Toast.show({
            type: "success",
            text1: response.data.message
          }))
          .catch(error => Toast.show({
            type: "failure",
            text1: error.response.data.message ?? error.message
          }))
          .finally(() => setIsLoading(false))
      }
  }
  return (
    <>
      <ScrollView>
        {
          isLoading ?
          <ActivityIndicator size={36} style={tw`mt-5`} />
          :
          <View style={tw`p-4`}>
            <Image 
             source={require("../../../../assets/images/prescription.png")}
              resizeMode='contain'
              style={tw`w-100 self-center h-75`}
            />
            <View style={tw`rounded-10 w-full p-4 bg-gray-200 h-full`}>
              <View style={tw`bg-white flex flex-row justify-between mt-6 p-4 rounded-5 items-center`}>
              <MaterialIcons name="person" size={25} style={tw`text-gray-400`} />
              <TextInput 
               placeholder="Patient's Email"
               style={tw`w-90%`}
               value={patient}
               readOnly
              />
              </View>
              <View style={tw`bg-white flex flex-row justify-between mt-6 p-4 rounded-5 items-center`}>
              <MaterialIcons name="person" size={25} style={tw`text-gray-400`} />
              <TextInput 
               placeholder="Diagnosis"
               style={tw`w-90%`}
               value={diagnosis}
               onChangeText={(text) => setDiagnosis(text)}
               numberOfLines={5}
              />
              </View>
              <View style={tw`bg-white flex flex-row justify-between mt-5 p-4 rounded-5 items-center`}>
              <MaterialCommunityIcons name="pill" size={25} style={tw`text-gray-400`} />
              <TextInput 
               placeholder="Drug Name"
               value={drug}
               onChangeText={(text) => setDrug(text)}
               style={tw`w-90%`}
              />
              </View>
              <View style={tw`bg-white flex flex-row justify-between items-center mt-5 p-4 rounded-5`}>
                  <MaterialCommunityIcons size={25} name="pill" style={tw`text-gray-400`} />
                  <TextInput 
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(text) => setQuantity(text)}
                    style={tw`w-90%`}
                    />
              </View>
              <View style={tw`bg-white flex flex-row justify-between mt-5 p-4 rounded-5 items-center`}>
              <MaterialCommunityIcons name="text" size={25} style={tw`text-gray-400`} />
              <TextInput 
               placeholder="Guideline"
               value={info}
               onChange={(text) => setInfo(text)}
               style={tw`w-90%`}
              />
              </View>
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={tw`p-3 mt-5 bg-[#0C3778] rounded-5`}>
                    <Text style={tw`text-white font-semibold text-center`}>Prescribe</Text>
                </TouchableOpacity>
            </View>
        </View>}
        </ScrollView>
    </>
  )
}

export default Prescription