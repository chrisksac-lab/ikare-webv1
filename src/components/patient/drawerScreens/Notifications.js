import React, { useState } from 'react'
import { ActivityIndicator, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native'
import tw from "twrnc"
import { useQuery } from '@tanstack/react-query'
import { getStoredUser } from '../../../services/storage'
import axiosInstance from '../../../utils/axiosInstance/axiosInstance'
import { TextInput } from 'react-native'
import Toast from 'react-native-toast-message'

export default function Notifications() {
    const [form, setForm] = useState(null)
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(false)
    const [followUp, setFollowUp] = useState([])
    const [userSelectedAppointment, setUserSelectedAppointment] = useState(null)
    const getActiveDetails = async() => {
        const url = "/api/user/get-singleuser";
        const activeUser = await getStoredUser()
        try {
            const response = await axiosInstance.post(url, {id: activeUser?._id, role:"PATIENT"})
            const appointments = response.data.data.appointments
            setAppointments(appointments);
            return appointments;
        }
        catch(error) {
            console.log(error)
        }
    }
    const sendResponseToFollowup = async () => {
        try {
            const url = "/api/user/response-to-form";
            const response = axiosInstance.post(url, {consultation: userSelectedAppointment?.consultation?._id, patient: JSON.parse(await getStoredUser()), followup: followUp})
            if ((await response).status == 200) {
                Toast.show({
                    type: "success",
                    text1: (await response)?.data.message
                })
            }
            else 
                Toast.show({
            type: "error",
            text1: (await response).data?.message
        })
        } catch(error) {
            console.log(error)
            Toast.show({
                type: "error",
                text1: error?.message
            })
        }
     }
    const [isOpen, setIsOpen] = useState(false)
    const {isLoading, data} = useQuery({queryKey:["get-data"], queryFn:getActiveDetails})
  return (
    <>
        <Modal 
        visible={isOpen}
        animationType='slide'
        presentationStyle="fullScreen"
        style={tw`p-3 bg-gray-800 text-white`}
        >
            <Text style={tw`text-center font-semibold`}>Answer the following questions please</Text>
            {
                [...followUp]?.map((com, index) => {
                    return (
                        <View className='p-3' key={index}>
                        <Text>ID: {com._id}</Text>
                        {
                            com?.communication?.map((data, index) => (
                                <View className='p-3 border-b-2 border-teal-800'>
                                   <Text>{index+1}. {data?.question}</Text>
                        <TextInput type="text" 
                        value={data?.answer} 
                        required className='p-2 w-full rounded-[10px] outline-none' 
                        onChangeText={(text) => {
                            const all = [...followUp];
                            all.forEach(foll => {
                                if (foll?._id == com?._id) {
                                    foll?.communication?.forEach(comm => {
                                        if (comm._id == data?._id) {
                                            comm.answer = text;
                                        }
                                    })
                                }
                            })
                            setFollowUp(all)
                        }} placeholder='Provide an answer' />
                                 </View>
                            ))
                        }       
                    </View>
                    )
                    })
            }
            <TouchableOpacity onPress={sendResponseToFollowup} style={tw`p-2 rounded-[10px] bg-blue-900 mt-5`}>
                <Text style={tw`text-white text-center`}>Send response</Text>
            </TouchableOpacity>
        </Modal>
        <View style={tw`p-4`}>
            <Text style={tw`text-[24px] text-center font-semibold text-[#0C3778]`}>Follow-up forms</Text>
            {
                isLoading ?
                <Text style={tw`text-center`}>
                    <ActivityIndicator size={40} style={tw`mt-7 text-center`} />
                </Text>
                :
                [...appointments].filter(appt=>appt?.consultation?.prescription?.followup?.length>0)?.length == 0 ?
                <Text style={tw`text-center mt-5 font-semibold text-[18px]`}>Nothing to display</Text>
                :
                [...appointments].filter(appt=>appt?.consultation?.prescription?.followup?.length>0)?.map(form => (
                    <Pressable key={form?._id} style={tw`border-b flex flex-col justify-between items-start gap-1 p-4 border-blue-800`} onPress={() => {
                        setForm(form);
                        setIsOpen(!isOpen);
                        setFollowUp(form);
                        setUserSelectedAppointment(form);
                    }}>
                        <Text>{form?._id}</Text>
                        <Text>{form?.consultation?.prescription?.diagnosis}</Text>
                        <Text>{form?.consultation?.user}</Text>
                        <Text>{form.consultation?.date}</Text>
                    </Pressable>
                ))
            }
        </View>
    </>
  )
}
