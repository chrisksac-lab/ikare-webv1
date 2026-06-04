import React from 'react'
import { Text, View } from 'react-native'
import tw from "twrnc"

function HomeCard({cardTitle, cardDesc, icon}) {
  return (
    <>
        <View style={tw`flex mt-5 flex-row items-center rounded-4 bg-[#D9D9D9]`}>
            <View style={tw`bg-[#0C3778] justify-center items-center w-20 h-20 rounded-4`}>
                {icon}
            </View>
            <View style={tw`flex flex-col left-6`}>
                <Text style={tw`text-5 font-semibold`}>{cardTitle}</Text>
                <Text style={tw`text-4 font-semibold text-[#0C3778]`}>{cardDesc}</Text>
            </View>
        </View>
    </>
  )
}

export default HomeCard