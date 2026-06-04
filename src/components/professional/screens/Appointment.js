import React, { useState, useEffect } from 'react'
import { ActivityIndicator, FlatList, ScrollView, Text, View, TouchableOpacity, Pressable } from 'react-native'
import tw from "twrnc"
import axiosInstance from '../../../utils/axiosInstance/axiosInstance'
import { getStoredUser, getValue } from '../../../services/storage'
import { useQuery } from '@tanstack/react-query'
// import Loader from "../../../components/Loader"
import Toast from 'react-native-toast-message'
import { CallContent, CallControls, CallingState, StreamCall, StreamVideo, StreamVideoClient, useCallStateHooks, useStreamVideoClient } from '@stream-io/video-react-native-sdk'
import { apiKey, token } from '../../../utils/constants/stream'

function Appointment({navigation, route}) {
  const [acceptedAppointments, setAcceptedAppointments] = useState([]);
  const [active, setActive] = useState("PENDING")
  const [room, setRoom] = useState("")
  const [activeUser, setActiveUser] = useState()
  const [hospital, setActiveHospital] = useState()
  const [appointment, setAppointment] = useState()
  const [call, setCall] = useState()
  const [callStarted, setCallStarted] = useState(false)
  const user = {
    id: activeUser?._id
  }
  //  const [client, setClient] = useState()
   const [userToken, setUserToken] = useState("")
   const state = useCallStateHooks()
  // useEffect(() => {
  //   async function getConsultationToken() {
  //       try {
  //         const data = await getStoredUser()
  //         const response = await axiosInstance.post("/api/user/consult-token", data);
  //         console.log(response.data)
  //         const client = StreamVideoClient.getOrCreateInstance({apiKey, user: {id:data?._id}, token: response.data?.data})
  //         setClient(client);
  //         setUserToken(response.data?.data);
  //       } catch(error) {
  //         console.log(error);
  //         Toast.show({
  //           type: "info",
  //           text1: "Check your internet connection"
  //         })
  //       }
  //   }
  //   getConsultationToken()
  //   return () => {
  //     client?.disconnectUser()
  //     setCallStarted(false)
  //     setClient(null)
  //   }
  // }, [])
  useEffect(() => {
      return () => {
        if (call?.callingState != CallingState.LEFT) {
          call?.leave()
        }
      }
  }, [call]);
  const client = new StreamVideoClient(apiKey)
  const startConsultation = async(item) => {
      try {
        const room = "consultation"+new Date().getTime()
        setRoom(room);
        setAppointment(item);
        const user_data = await getStoredUser();
        const call_response = await axiosInstance.post("/api/user/consult-token", user_data);
        const token = call_response.data?.data
        client.connectUser({id: user_data?._id}, token)
        if (item?.consultation?.room) {
          const _call = client.call("default", item?.consultation?.room);
          setCallStarted(true)
          _call.join({create: false})
          .then(() => {
            setCall(_call)
          })
          .catch(error => console.log(error))  
        }
        else {
          const _call = client.call("default", room);
          setCallStarted(true)
          _call.join({create: true})
          .then( async () => {
            setCall(_call);
            const url = "/api/user/start-consultation"
            const data = {
              room,
              doctor: activeUser,
              patient: item?.user,
              appointment: item,
              hospital: JSON.parse(await getValue("hospital"))
            }
          const response = await axiosInstance.post(url, data)
          if (response.status == 200)
            Toast.show({
              type: "success",
              text1: response.data.message
          })
          else
            Toast.show({
              type: "error",
              text1: response.data.message
          })
          })
          .catch(error => console.log(error))
        }        
      }
      catch(error) {
        Toast.show({
          type: "error",
          text1: error.message
        })
      }
  }

  const endConsultation = async() => {
     try {
         await call?.endCall()
         const url = "/api/user/end-consultation"
         const data = {
            doctor: activeUser,
            patient: appointment?.user,
            appointment: appointment
         }
         const response = await axiosInstance.put(url, data)
         if (response.status == 200)
           {
            setCallStarted(false);
            navigation.navigate("Prescription", {patient, appointment});
          }
         else
           Toast.show({
             type: "error",
             text1: response.data.message
         })
     }
     catch(error) {
       Toast.show({
         type: "error",
         text1: error.message
       })
     }
 }

  const getActiveDetails = async() => {
    const url = "/api/user/get-singleuser";
    const user = await getStoredUser()
    const hospitalS = await getValue("hospital")
    const host = JSON.parse(hospitalS)
    setActiveHospital(host)
    setActiveUser(user)
    try {
      const response = await axiosInstance.post(url, {id: user?._id, hospitalName:host?.name})
      const filteredData = [...response.data.data.appointments].filter(appt => (appt.status === "PENDING"))
      const accepted = [...response.data.data.appointments].filter(appt => (appt.status === "ACCEPTED"))
      setAcceptedAppointments(accepted)
      return filteredData
    }
    catch(error) {
      console.log("ERROR", error.response.data.message ?? error.message)
    }
  }

  const {data, isLoading} = useQuery({queryKey:["get-active-details"], queryFn:getActiveDetails})

  const handleSwitchControl = (value) => {
    setActive(value)
  } 

  const renderItem = ({item}) => {
    return(
      <View style={tw`p-4 mt-2 border-b border-gray-300`}>
            <View style={tw`flex flex-row justify-between items-center`}>
            {
                item?.patientImage
            }
            <View style={tw`w-full flex flex-col justify-between`}>
                <Text style={tw`text-6 font-semibold`}>Patient: {item?.user}</Text>
                <Text style={tw``}>Details: {item?.details}</Text>
                <Text>Date: {item?.date}</Text>
              </View>
            </View>
                <View style={tw`flex mt-3 flex-row justify-between items-center`}>
                    <TouchableOpacity onPress={() => handleDecision("DENIED", item, item?.user)} style={tw`p-2 bg-teal-600 rounded-4 w-[45%]`}>
                        <Text style={tw`text-center text-white`}>Decline</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDecision("ACCEPTED", item, item?.user)} style={tw`p-2 bg-blue-800 rounded-4 w-[45%]`}>
                        <Text style={tw`text-center text-white`}>Accept</Text>
                    </TouchableOpacity>
                </View>
        </View>
    )
  }

  const renderAcceptedItem = ({item}) => {
    return(
      <View style={tw`p-4 mt-2 border-b border-gray-300`}>
            <View style={tw`flex flex-row justify-between items-center`}>
            {
                item?.patientImage
            }
            <View style={tw`w-full flex flex-col justify-between`}>
                <Text style={tw`text-6 font-semibold`}>Patient: {item?.user}</Text>
                <Text style={tw``}>Details: {item?.details}</Text>
              </View>
            </View>
                { new Date(item?.date) <= new Date() ?
                <View style={tw`flex mt-3 flex-row justify-center gap-8 items-center`}>
                    <TouchableOpacity onPress={async() => await startConsultation(item)} style={tw`p-2 bg-teal-600 rounded-4 w-[45%]`}>
                        { item?.consultation?.room ? <Text style={tw`text-center text-white`}>Add Device</Text> : <Text style={tw`text-center text-white`}>Launch call</Text>}
                    </TouchableOpacity>
                    <TouchableOpacity style={tw`p-2 bg-red-800 rounded-4 w-[45%]`}>
                        <Text style={tw`text-center text-white`}>Cancel</Text>
                    </TouchableOpacity>
                </View>
                :
                <View>
                    <Text>Consultation in {new Date(new Date(item?.date)-new Date()).getHours()}hours {new Date(new Date(item?.date)-new Date()).getMinutes()}mins</Text>
                </View>  
              }
        </View>
    )
  }

  const handleDecision = async(response, appt, patient) => {
      const doctor = await getStoredUser()
      const hospitalString = await getValue("hospital")
      const url = "/api/user/respond-to-appointment";
      const data = {
        response,
        appointment:appt,
        doctor,
        patient: {email:patient},
        hospital: JSON.parse(hospitalString)
      }
      axiosInstance.post(url, data)
      .then(response => Toast.show({
        type: "success",
        text1: response.data.message
      }))
      .catch(error => Toast.show({
        type: "error",
        text1: error.message ?? error.response.data.message
      }))
  }
  return (
      callStarted ?
        <>
        {
          call ? <>
          <StreamVideo client={client}>
              <StreamCall call={call}>
                  <View style={tw`flex-1 justify-center bg-white`}>
                    <CallContent onHangupCallHandler={endConsultation} />
                  </View>
              </StreamCall>
          </StreamVideo>
        </> :
          <ActivityIndicator size={40} />
        }

        </> 
    :
    <>
    <View style={tw`flex flex-row p-4 justify-center gap-8`}>
       <Pressable onPress={() => handleSwitchControl("PENDING")} style={tw`p-4 ${active == "PENDING" ? "bg-teal-800" : "bg-white border-2 border-teal-800"} rounded-xl`}>
          <Text style={tw`${active == "PENDING" ? "text-white": "text-teal-800"} font-bold`}>PENDING</Text>
       </Pressable>
       <Pressable onPress={() => handleSwitchControl("ACCEPTED")} style={tw`p-4 rounded-xl ${active == "ACCEPTED" ? "bg-teal-800" : "bg-white border-2 border-teal-800"}`}>
          <Text style={tw`${active == "ACCEPTED" ? "text-white": "text-teal-800"} font-bold`}>ACCEPTED</Text>
       </Pressable>
    </View>
      {
        isLoading ?
        <ActivityIndicator />
        :
        <>
      { active == "ACCEPTED" && 
      <FlatList
       ListEmptyComponent={() => {
            return (
              <View style={tw`p-4`}>
                  <Text style={tw`text-[16px] font-semibold`}>Nothing to display</Text>
              </View>
            )
       }} 
       data={acceptedAppointments}
       renderItem={renderAcceptedItem}
       keyExtractor={(item) => item._id.toString()}
      />}
       { active == "PENDING" && 
       <FlatList 
       data={data}
       ListEmptyComponent={() => {
        return (
          <View style={tw`p-4`}>
              <Text style={tw`text-[16px] font-semibold`}>Nothing to display</Text>
          </View>
        )
   }}
       renderItem={renderItem}
       keyExtractor={(item) => item._id.toString()}
      />}
        </>
      }
    </>
  )
}

export default Appointment