import React, { useState } from 'react'
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import tw from "twrnc"
import {MaterialIcons} from "@expo/vector-icons"
import Toast from 'react-native-toast-message'
import axiosInstance from "../../../utils/axiosInstance/axiosInstance"
import { useQuery } from '@tanstack/react-query'
import { SelectList } from 'react-native-dropdown-select-list'
import SelectDropdown from 'react-native-select-dropdown'

function Notification() {
  const [open, setOpen] = useState(false)
  const [communication, setCommunication] = useState([])
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState("")
  const [consultation, setConsultation] = useState("")
  const handleGetPatients = async() => {
    const url = "/api/user/patients";
    try {
       const response = await axiosInstance.get(url)
       const users = response.data?.data
       const patientsWithPrescriptions = [];
       var patientFollowups = [];
       users?.forEach(user => {
          const patientAppointments = user?.appointments?.filter(appt => appt?.consultation?.prescription != null)
          if (patientAppointments?.length > 0) {
            patientsWithPrescriptions.push(user)
          }
          patientAppointments?.forEach(patientAppt => {
              if (patientAppt?.consultation?.prescription?.followup?.length > 0) {
                 patientFollowups.push({...patientAppt, userId: user?._id, fullname:user?.fullname, email:user?.email})
              }
          }) 
       })
       
       setPatients(patientsWithPrescriptions);
       return patientFollowups;
    }
    catch(error) {
      console.log(error)
    }
  }
  const {isLoading, data} = useQuery({queryKey: ["get-patients"], queryFn:handleGetPatients})
  const handleValidate = async() => {
    if (communication.length == 0)
      Toast.show({
    type: "error",
    text1: "Add atleast one question !"
  })
  const url = "/api/user/send-followup-form";
  try {
      const parseQuestions = []
      communication.forEach(quest => {
        parseQuestions.push({question: quest?.value, answer: ""})
      })
      const activeUser = await getStoredUser()
      const data = {
         source: activeUser?._id,
         destination: selectedPatient,
         communication: parseQuestions,
         consultation
      }
      const response = await axiosInstance.post(url, data)
      if (response.status == 200)
          Toast.show({
            type: "success",
            text1: response.data?.message
        })
      else
      Toast.show({
        type: "error",
        text1: response.data?.message
    })
  }catch(error) {
     console.log(error)
  }
  }
  const handleAddQuestion = () => {
    setCommunication((state) => [...state, {placehoder: "Enter your question", label: `Question ${communication.length+1}`, value: ""}])
  }
  const handleDeleteQuestion = (label) => {
    const questionFilter = [...communication].filter(quest => quest?.label != label)
    setCommunication(questionFilter)
  }
  return (
    <>
    <Modal
        visible={open}
        animationType='slide'
        presentationStyle="fullScreen"
        style={tw`p-4 bg-gray-800 text-white`}
        >
          <MaterialIcons size={32} onPress={() => setOpen(false)} name="close" style={tw`text-right top-3 right-5`} />
          <Text style={tw`text-center text-[18px] font-semibold text-blue-800 mt-7`}>Ask as many questions as you wish</Text>
          <View style={tw`w-[85%] self-center mt-2`}>
            <SelectDropdown 
             data={patients}
             onSelect={(selectedItem, index) => {
                console.log(selectedItem)
                setSelectedPatient(selectedItem?._id)
             }}
             renderButton={(selectedItem, isOpened) => (
                <View style={tw`p-2 flex flex-row justify-between border rounded-[10px] mt-2 items-center`}>
                    <Text>{(selectedItem && selectedItem.fullname) || "Select a patient" }</Text>
                    {
                      isOpened ?
                      <MaterialIcons name="keyboard-arrow-up" size={24} />
                      :
                      <MaterialIcons name="keyboard-arrow-down" size={24} />
                    }
                </View>
             )}
             renderItem={(item, index, isSelected) => (
              <View style={tw`p-4 bg-teal-900`}>
                  <Text>{item.fullname}</Text>
              </View>
            )}
            search
            searchPlaceHolder='Search by patient name'
            showsVerticalScrollIndicator
            />
          </View>
          <View style={tw`w-[85%] self-center mt-2`}>
          <SelectDropdown 
             data={() => [...patients].find(pat => (pat?._id == selectedPatient || pat?.fullname == selectedPatient))?.appointments?.filter(appt => appt?.consultation?.prescription != null)}
             onSelect={(selectedItem, index) => {
                console.log(selectedItem)
                setConsultation(selectedItem?.consultation?._id)
             }}
             renderButton={(selectedItem, isOpened) => (
                <View style={tw`p-2 flex flex-row justify-between border rounded-[10px] mt-2 items-center`}>
                    <Text>{(selectedItem && selectedItem.consultation?.date) || "Select a consultation date" }</Text>
                    {
                      isOpened ?
                      <MaterialIcons name="keyboard-arrow-up" size={24} />
                      :
                      <MaterialIcons name="keyboard-arrow-down" size={24} />
                    }
                </View>
             )}
             renderItem={(item, index, isSelected) => (
              <View style={tw`p-4 bg-teal-900`}>
                  <Text>{item.fullname}</Text>
              </View>
            )}
            showsVerticalScrollIndicator
            />
          </View>
          <ScrollView>
             {
                communication.length == 0 ?
                <View style={tw`p-2 flex justify-center mt-7 items-center`}>
                  <Text style={tw`text-[20px] font-semibold`}>No Question asked</Text>
                </View>
                :
                [...communication].map(com => (
                    <View key={com?.label} style={tw`p-4 border-b flex flex-row justify-center gap-8 items-center border-gray-100`}>
                        <View style={tw`w-[80%]`}>
                        <Text>{com?.label}</Text>
                        <TextInput 
                         placeholder={com?.placehoder}
                         value={com?.value}
                         onChangeText={(text) => {
                          const all = [...communication];
                          all.forEach(ques => {
                              if (ques?.label == com?.label)
                              {
                                ques.value = text
                              }
                          })
                          setCommunication(all);
                         }}
                         style={tw`p-2 rounded-[10px] border border-gray-100`}
                        />
                        </View>
                        <MaterialIcons onPress={() => handleDeleteQuestion(com?.label)} name="delete-outline" size={28} color="red" />
                    </View>
                ))
             }
          </ScrollView>
          <View style={tw`flex flex-row justify-between items-center p-4`}>
              <Pressable onPress={handleAddQuestion} style={tw`bg-green-800 rounded-[10px] p-3`}>
                  <Text style={tw`text-center text-white`}>Add a Question</Text>
              </Pressable>
              <Pressable onPress={handleValidate} style={tw`bg-blue-800 rounded-[10px] p-3`}>
                  <Text style={tw`text-center text-white`}>Validate</Text>
              </Pressable>
              <Pressable onPress={() => setOpen(false)} style={tw`bg-red-600 rounded-[10px] p-3`}>
                  <Text style={tw`text-center text-white`}>Cancel</Text>
              </Pressable>
          </View>
      </Modal>
        <View style={tw`p-4`}>
            <Pressable onPress={() => setOpen(!open)} style={tw`p-2 bg-teal-800 rounded-[15px] self-end`}>
                <Text style={tw`text-white`}>Add a form</Text>
            </Pressable>
        </View>
        <ScrollView>
           <View>
           {
            data?.length === 0
            ?
            <Text style={tw`text-center text-[18px] font-semibold`}>No followup at the moment</Text>
            :
          data?.map(dt => (
              <View style={tw`p-4 flex flex-col justify-between items-start gap-1 h-[10vh] border-b-2 border-teal-900 mt-2`}>
                  <Text>ID: {dt?._id}</Text>
                  <Text>Patient: {dt?.fullname}</Text>
                  <Text>Email: {dt?.email}</Text>
                  <View style={tw`flex`}>
                    <Pressable style={tw`p-2 rounded-[15px] bg-teal-900`}>
                        <Text style={tw`text-center text-white`}>View response</Text>
                    </Pressable>
                  </View>
              </View>
          ))
        }
           </View>
        </ScrollView>
    </>
  )
}

export default Notification;