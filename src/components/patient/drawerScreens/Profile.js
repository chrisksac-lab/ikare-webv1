import React, {useEffect, useState} from 'react'
import {Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native'
import { View } from 'react-native'
import tw from "twrnc"
import {MaterialIcons} from "@expo/vector-icons"
import { getStoredUser, getValue } from '../../../services/storage'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../../../utils/axiosInstance/axiosInstance'
import * as ExpoImage from "expo-image-picker"
import { Avatar } from 'react-native-elements'

function Profile() {
  const [activeUser, setActiveUser] = useState(null)
  const getActiveDetails = async() => {
    const url = "/api/user/get-singleuser";
    const user = await getStoredUser()
    const userRole = await getValue("role")
    const host = JSON.parse(hospitalS)
    try {
      const response = await axiosInstance.post(url, {id: user?._id, role: "PATIENT"})
      const accepted = [...response.data.data?.appointments].filter(appt => (appt.status === "ACCEPTED"))
      // setAcceptedAppointments(accepted)
      return response.data.data;
    }
    catch(error) {
      console.log("ERROR", error.response.data.message ?? error.message)
    }
  }

  const {data, isLoading} = useQuery({queryKey:["data"], queryFn:getActiveDetails})
  useEffect(() => {
      async function getUser() {
        setActiveUser(await getStoredUser())
      }
      // getActiveDetails()
      getUser()
  }, [])
  const handleUploadPicture = async () => {
    const activeUser  = await getStoredUser()
      let result = await ExpoImage.launchImageLibraryAsync({
        mediaTypes: ExpoImage.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        base64: true
      })
      if (!result.canceled) {
        const url = "/api/user/change-picture";
        axiosInstance.post(url, {user:JSON.stringify(activeUser), platform:"mobile", base64: result.assets[0].base64, extension:getFileExtension(result.assets[0].fileName, "."), user_id:activeUser?._id}, {headers: {"Content-Type": "multipart/form-data"}})
        .then(response => Toast.show({
          type: "success",
          text1: response.data?.message
        }))
        .catch(error => Toast.show({
          type: "error",
          text1: error?.response?.data.message ?? error.message
        }))
      }
  }
  return (
    <View style={tw`flex flex-col h-[80%] justify-between items-start p-5`}>
        <View style={tw`w-full`}>
        <Text style={tw`text-[18px] font-semibold`}>Fullname</Text>
        <TextInput 
          style={tw`border border-gray-200 p-3 w-full rounded-[15px] mt-2`}
          value={activeUser?.fullname}
        />
        </View>
        <View style={tw`w-full`}>
        <Text style={tw`text-[18px] font-semibold`}>Email</Text>
        <TextInput 
          style={tw`border border-gray-200 p-3 w-full rounded-[15px] mt-2`} 
          value={activeUser?.email}
        />
        </View>
        <View style={tw`w-full`}>
        <Text style={tw`text-[18px] font-semibold`}>Gender</Text>
        <TextInput 
          style={tw`border border-gray-200 p-3 w-full rounded-[15px] mt-2`}
          value={activeUser?.gender}
        />
        </View>
        <View style={tw`w-full`}>
        <Text style={tw`text-[18px] font-semibold`}>Phone Number</Text>
        <TextInput 
          style={tw`border border-gray-200 p-3 w-full rounded-[15px] mt-2`}
          value={activeUser?.tel}
        />
        </View>
          <View>
            <Text style={tw`text-[18px] font-semibold`}>Avatar</Text>
            <Pressable style={tw`flex flex-row mt-2 justify-start items-center`} onPress={handleUploadPicture}>
          {
          activeUser?.image ?
              <Avatar rounded size={75} source={{uri: axiosInstance.getUri()+activeUser.image}} />
          :
          <Avatar containerStyle={{backgroundColor: "teal"}} rounded size={75} title={activeUser?.fullname[0].toUpperCase()+activeUser?.fullname[1].toUpperCase()} />
            }
            <MaterialIcons name="edit" size={28} />
          </Pressable>
          </View>
    </View>
  )
}

export default Profile