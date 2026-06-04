import React, {useEffect, useState} from 'react'
import { View, TextInput, TouchableOpacity } from 'react-native'
import { ScrollView, Text } from 'react-native'
import tw from "twrnc"
import HospitalCard from '../cards/HospitalCard'
import {MaterialIcons} from "@expo/vector-icons"
import axiosInstance from "../../../utils/axiosInstance/axiosInstance"
import { useQuery } from '@tanstack/react-query'
import { FlatList } from 'react-native'
// import Loader from "../../Loader";
import { ActivityIndicator } from 'react-native'

function Appointment({navigation}) {
  const getHospitals = async() => {
    const url = "/api/hospital/get-hospitals";
    try {
      const response = await axiosInstance.get(url)
      return response.data.data;
    }
    catch(error) {
      console.log(error)
    }
  }
  const {data, isLoading} = useQuery({queryKey: ["hospital-details"], queryFn:getHospitals})
  const renderItem = ({item}) => (
    <HospitalCard 
      onPress={() => navigation.navigate("Hospital Details", item)}
      name={item.name}
      location={item.location}
      icon={<MaterialIcons name="healing" size={90} style={tw`text-[#0C3778]`} />}
      desc={item.desc}
    />
  )
  return (
    <>
      {/* <ScrollView> */}
          <View style={tw`p-4`}>
            <View style={tw`flex flex-row items-center justify-between`}>
               <View style={tw`flex flex-row justify-between rounded-5 w-[55%]  bg-[#EAE9E9] items-center p-2`}> 
                <MaterialIcons style={tw`text-[#999898]`} name="search" size={30} />
                <TextInput 
                 placeholder="Search hospital"
                  style={tw`w-[80%]`}
                />
               </View>
                <TouchableOpacity 
                 onPress={() => navigation.navigate("Appointment List")}
                style={tw`p-3  bg-teal-700 rounded-4`}>
                    <Text style={tw`font-semibold text-white`}>View appointments</Text>
                </TouchableOpacity>
            </View>
            <Text style={tw`text-5 font-semibold text-center mt-5`}>All Hospitals</Text>
            {
                isLoading ?
                <ActivityIndicator />
                :
                <FlatList 
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => item._id.toString()}
              />}
          </View>
      {/* </ScrollView> */}
    </>
  )
}

export default Appointment