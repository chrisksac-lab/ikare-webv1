import React, { useEffect, useState } from 'react'
import { Image, Text, View } from 'react-native'
import tw from "twrnc"
import HomeCard from '../cards/HomeCard'
import {MaterialIcons, Entypo} from "@expo/vector-icons"
import { getStoredUser } from '../../../services/storage'
import { ScrollView } from 'react-native'

function Home() {
  const [activeUser, setActiveUser] = useState()
  const getInfo = async() => {
      const user = await getStoredUser()
      setActiveUser(user)
  }
  useEffect(() => {
    getInfo()
  })
  return (
    <>
    <ScrollView style={tw`p-4 h-full`}>
      <Text style={tw`text-7 font-semibold`}>Good morning 
        <Text style={tw`font-bold text-[#0C3778]`}> {activeUser?.fullname} </Text></Text>
        <Image
          resizeMode="contain"
          style={tw`self-center mt-[-10%] h-75`} 
          source={require("../../../../assets/images/heart.png")}
        />
        <Text style={tw`text-6 font-semibold text-center`}>Your condition</Text>
         <HomeCard 
          cardTitle="Heart Rate"
          cardDesc="120 bpm"
          icon={<Entypo name="heart-outlined" size={45} style={tw`text-white`} />}
         />
        <HomeCard 
          cardTitle="Blood status"
          cardDesc="120/70"
          icon={<MaterialIcons name="healing" size={45} style={tw`text-white`} />}
         />
         <HomeCard 
          cardTitle="Blood glucose"
          cardDesc="120 bpm"
          icon={<MaterialIcons name="bar-chart" size={45} style={tw`text-white`} />}
         />
     </ScrollView>
    </>
  )
}

export default Home