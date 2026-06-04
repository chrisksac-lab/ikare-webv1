import React, { useEffect, useState } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity } from 'react-native'
import tw from "twrnc"
import { getStoredUser } from '../../../services/storage'
import * as Notifications from "expo-notifications";
import * as Device from "expo-device"
import * as Constants from "expo-constants";
import { View } from 'react-native';
import {MaterialIcons} from "@expo/vector-icons";
import { Pressable } from 'react-native';
import Toast from 'react-native-toast-message';
import { Modal } from 'react-native';
import { CallContent, StreamCall, StreamVideo, StreamVideoClient } from '@stream-io/video-react-native-sdk';
import { apiKey, token } from '../../../utils/constants/stream';
import { ActivityIndicator } from 'react-native';

export default function Consultation() {
  async function schedulePushNotification(title, body) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: { data: 'goes here' },
      },
      trigger: { seconds: 2 },
    });
  }
  const [activeUser, setActiveUser] = useState()
  const [appointment, setAppointment] = useState()
  const compareFunction = (dateStringA, dateStringB) => {
    const milliA = new Date(dateStringA).getTime();
    const milliB = new Date(dateStringB).getTime();
    return milliA-milliB;
 }
  useEffect(() => {
    const getActiveDetails = async () => {
      const user = await getStoredUser()
      setActiveUser(user)
      const appointments = user.appointments
      const acceptedAppointments = [...appointments].filter(appt => appt.status === "ACCEPTED")
      const filteredAppointments = [...acceptedAppointments].sort((a,b) => compareFunction(a,b))
      setAppointment(filteredAppointments[0])
      // if (new Date(appointment?.date).getHours() == new Date().getHours()) {
      //   const currentMins = new Date().getMinutes()
      //   const appointmentMins = new Date(appointment?.date).getMinutes()
      //   if ((appointmentMins-currentMins) <= 10) {
      //       const title = "Video consultation reminder"
      //       const body = `Your next video consultation starts in ${appointmentMins-currentMins}`
      //       await schedulePushNotification(title, body)
      //   }
      // }
   }
   getActiveDetails()
  }, [])
  const client = new StreamVideoClient({apiKey: apiKey})
  const [call, setCall] = useState();
  const makePayments = async () => {
      if (tel.trim().length == 0) {
        Toast.show({
          type: "error",
          text1: "Fill the form !"
        })
      }
      else if(tel.trim().length != 9) {
          Toast.show({
            type: "error",
            text1: "Enter a cameroonian phone number !"
          })
      }
      else if(!/^6{1}(5\d|(7\d|[89]\d))\d{3}\d{3}$/.test(tel)) {
          Toast.show({
            type: "error",
            text1: "Enter either MTN or Orange number"
          })
      }
      else {
        try {
          Toast.show({
            type: "info",
            text1: "Be ready to validate payment on your phone"
           });
          const url = "/api/user/make-payment";
          const user = activeUser;
          const doctor = appointment?.user
          const response = await axiosInstance.post(url, {tel_fee:tel, ...user, details:"Consultation fee", amount: 100, doctor});
          if (response.status == 200)
          {
            Toast.show({
              type: "success",
              text1: response.data?.message
             });
             const user_data = await getStoredUser();
             const call_response = await axiosInstance.post("/api/user/consult-token", user_data);
             const token = call_response.data?.data
             client.connectUser({id: user_data?._id}, token)
             const _call = client.call("default", appointment?.consultation?.room);
             setCallStarted(true)
             _call.join({create:false})
             .then(() => {
                setCall(_call)
             })
             .catch(error => console.log(error))
          }
          else 
          Toast.show({
            type: "error",
            text1: response?.data?.message
           });
        }
        catch(error) {
           Toast.show({
            type: "error",
            text1: error.message
           });
        }
      }
  }
  const [callStarted, setCallStarted] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [tel, setTel] = useState("")

  return (
      <ScrollView style={tw`px-8 py-4`}>       
                {
                  paymentModalOpen ?
                  <View style={tw`bg-white w-full h-2/3`}>
                <Text style={tw`p-4 text-center flex items-center justify-center text-blue-900 text-[20px] font-bold w-full`}>Make a payment</Text>
                      <View style={tw`bg-white p-6`}>
                      <Text style={tw`text-[18px] font-semibold`}>Phone Number</Text>
                      <TextInput 
                          value={tel}
                          onChangeText={(text) => setTel(text)}
                          placeholder='Ex: 691524478'
                          style={tw`mt-1 border rounded-[10px] p-3`}
                      />
                        <View style={tw`flex flex-row justify-between mt-[30%]`}>
                        <Pressable onPress={() => makePayments()} style={tw`rounded-[10px] bg-teal-900 p-3`}>
                          <Text style={tw`text-white font-bold text-center`}>Initiate payment</Text>
                      </Pressable>
                      <Pressable onPress={() => setPaymentModalOpen(false)} style={tw`rounded-[10px] bg-red-700 p-3`}>
                          <Text style={tw`text-white text-center font-bold`}>Cancel</Text>
                      </Pressable>
                        </View>
                      </View>
                </View>
                :
              <>
        {
          callStarted ?
            <>
              {
                call ?
                <StreamVideo client={client}>
                <StreamCall call={call}>
                    <CallContent onHangupCallHandler={() => call?.leave()} />
                </StreamCall>
              </StreamVideo> :
              <ActivityIndicator size={40} />
              }
            </>
          :
          <View>
        {
          // new Date(appointment?.date).toISOString() == new Date().toISOString() ?
          appointment?.date <= new Date().toISOString() ?
          <>
            <Text style={tw`text-[20px] font-semibold`}>Ongoing Video Consultation</Text>
            <Text style={tw`text-[16px] font-bold mt-2`}>Doctor: {appointment?.user}</Text>
            <Text style={tw`mt-2`}>Details: {appointment?.details}</Text>
            {
              appointment?.consultation?.room ?
              <TouchableOpacity onPress={() => setPaymentModalOpen(true)} style={tw`mt-5 rounded-[15px] p-4 bg-teal-800`}>
                <Text style={tw`text-white text-center font-semibold`}>Join a call</Text>
            </TouchableOpacity>:
            <Text style={tw`w-full p-3 text-white text-center bg-red-700`}>Call not yet started !</Text>
            }
          </> 
          :
          <>
              <Text style={tw`text-[16px] font-bold`}>Doctor: {appointment?.user}</Text>
              <Text>Details: {appointment?.details}</Text>
              <Text>Next Video Consultation in : {new Date(appointment?.date).getHours()-new Date().getHours()}hours {new Date(appointment?.date).getMinutes()-new Date().getMinutes()}minutes</Text>
          </>
        }
        </View>
        }
        </>
      }
    </ScrollView>
  )
}
