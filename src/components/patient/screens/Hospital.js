import React, {useState, useEffect} from 'react'
import { Image, Text, View } from 'react-native'
import tw from "twrnc"
import {MaterialIcons} from "@expo/vector-icons"
import HospitalCard from '../cards/HospitalCard'
import {getStoredUser} from "../../../services/storage";
import { Avatar } from 'react-native-elements'
import axiosInstance from "../../../utils/axiosInstance/axiosInstance";

function Hospital({navigation, route}) {
    const [activeUser, setActiveUser] = useState()
    useEffect(() => {
        async function getUser(){
            const user = await getStoredUser();
            setActiveUser(user)
        }
        getUser()
    })
    const {name, location, doctors} = route.params
    const title = [
        "General Practitioner",
        "Cardiologist",
        "Surgeon",
        "Pediatry"
    ]
  return (
    <>
        <View style={tw`p-4`}>
                <View style={tw`flex flex-row justify-between items-center`}>
                    <MaterialIcons name="local-hospital" size={50} style={tw`text-teal-800`} />
                    <Text style={tw`font-bold text-7 text-teal-800`}> {name}</Text>
                </View>
            <Text style={tw`text-5 font-semibold mt-3`}>Welcome back, 
            <Text style={tw`font-bold`}> {activeUser?.fullname} </Text></Text>
            <View style={tw`mt-5`}>
                <Text style={tw`text-4 text-center font-bold mb-2 text-teal-800`}>Meet our doctors</Text>
                {
                    doctors?.map((doctor, index) => {
                        return (
                            
                                <HospitalCard 
                                 onPress={() => navigation.navigate("Appointment Form", {
                                    doctor,
                                    hospital: {...route.params}
                                 })}
                                 key={index}
                                 icon={doctor.image ? 
                                    <Avatar source={{uri: axiosInstance.getUri()+doctor.image}} size={60} rounded />
                                    :
                                    <MaterialIcons size={60} name="account-circle" />
                                 }
                                name={doctor?.fullname}
                                location={title[0]}
                                />  
                        )
                    })
                }
                
            </View>
        </View>
    </>
  )
}

export default Hospital