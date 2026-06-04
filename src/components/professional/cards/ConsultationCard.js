import React from 'react'
import { Text, View } from 'react-native'
import tw from "twrnc"
import {MaterialIcons} from "@expo/vector-icons"
import CallDecision from '../button/CallDecision'

function ConsultationCard({time, name, launch, btnVal, style}) {
    const launchCall = () => {}
  return (
    <>
        <View style={tw`p-4 mt-5 rounded-5 ${style}`}>
            <View style={tw`flex flex-row justify-between items-center`}>
                <MaterialIcons name="person" color="white" size={30} />
                <Text style={tw`text-white font-semibold`}>{time}</Text>
            </View>
                <Text style={
                   launch ? 
                   tw`text-white text-7 mb-3 mt-2`
                   : 
                   tw`text-7 mb-3 mt-2`
                    }>{name}</Text>
            <CallDecision 
             name={btnVal}
             launch={launch}
             onPress={() => launchCall}
            />
        </View>
    </>
  )
}

export default ConsultationCard