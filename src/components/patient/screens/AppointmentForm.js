import React, {useState, useEffect} from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import tw from "twrnc"
import {MaterialIcons} from "@expo/vector-icons"
import DateTimePickerModal from "react-native-modal-datetime-picker";
import PrimaryButton from "../../buttons/PrimaryButton"
import axiosInstance from "../../../utils/axiosInstance/axiosInstance";
import Toast from 'react-native-toast-message';
import {getStoredUser} from "../../../services/storage";
import { Avatar } from 'react-native-elements';

function AppointmentForm({navigation, route}) {
  const {doctor, hospital} = route.params
  const [activeUser, setActiveUser] = useState()
    useEffect(() => {
        async function getUser(){
            const user = await getStoredUser();
            setActiveUser(user)
        }
        getUser()
    })
  const [appointmentDate, setAppointmentDate] = useState("")
  const [details, setDetails] = useState("")
  const handleSubmitRequest = async() => {
     if (appointmentDate && details) {
        const url = "/api/user/book-appointment";
        const data = {
          date: appointmentDate,
          details,
          doctor,
          patient: activeUser,
          hospital: hospital?.name
        }
        axiosInstance.post(url, data)
        .then(response => {
          Toast.show({
            type: "success",
            text1: response.data.message
          })
        })
        .catch(error => {
          Toast.show({
            type: "error",
            text1: error.response.data.message ?? error.message
          })
        })
     }
     else
      Toast.show({
        type: "error",
        text1: "Fill in the empty fields"
    })
  }
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setAppointmentDate(date)
    hideDatePicker();
  };
  return (
    <>
      <View style={tw`p-4`}>
          <View style={tw`flex flex-row bg-white p-4 justify-between items-center shadow-md rounded-4`}>
            <View style={tw`flex flex-col justify-between`}>
                <Text style={tw`text-6 text-[#0C3778] font-bold`}>{doctor?.fullname}</Text>
                <Text style={tw`font-semibold`}>{"General Practitioner"}</Text>
            </View>
              { doctor?.image ?
                <Avatar rounded size={60} source={{uri: axiosInstance.getUri()+doctor.image}} />
                :
                <MaterialIcons name="account-circle" size={60} />
              }
          </View>
            <View style={tw`mt-3 shadow-md bg-white rounded-4 p-4`}>
            <Text style={tw`text-center text-5 font-semibold`}>Appointment Form</Text>
              <Pressable
               onPress={showDatePicker}
               style={tw`p-2 rounded-4 bg-teal-700 mt-4`}>
                  <Text style={tw`text-white text-center font-bold`}>Choose a date</Text>
              </Pressable>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="datetime"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />
                <Text style={tw`mt-7 text-4 font-semibold`}>Appointment Details</Text>
                    <TextInput 
                     placeholder='Enter the motive'
                     numberOfLines={5}
                     onChangeText={(text) => setDetails(text)}
                     keyboardType="default"
                     style={tw`mt-3 rounded-xl p-4 w-full border border-gray-300`}
                    />
                    <PrimaryButton 
                      onPress={() => handleSubmitRequest()}
                      name="Book Appointment"
                    />
            </View>
      </View>
    </>
  )
}

export default AppointmentForm