import React from 'react'
import { Text, View } from 'react-native'
import tw from "twrnc"
import {MaterialCommunityIcons, Octicons} from "react-native-vector-icons"

function InfoCard({number, style, info}) {
  return (
    <>
        <View style={tw`p-4 rounded-4 ${style}`}>
            <View style={tw`flex flex-row justify-between items-center`}>
                <Octicons size={30} name="person" color="white" />
                <MaterialCommunityIcons size={30} name="menu-open" color="white" />
            </View>
                <View style={tw`items-center`}>
                    <Text style={tw`text-15 text-white font-bold`}>{number}</Text>
                    <Text style={tw`text-white font-semibold`}>{info}</Text>
                </View>
        </View>
    </>
  )
}

export default InfoCard