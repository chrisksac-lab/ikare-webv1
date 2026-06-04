import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import tw from "twrnc"

function CallDecision({name, onPress, launch}) {
  return (
    <>
    {
        launch ? 
        <TouchableOpacity 
        onPress={onPress}
        style={tw`p-2 rounded-4 bg-teal-700`}>
            <Text style={tw`text-center text-white`}>{name}</Text>
        </TouchableOpacity>
         :
         <TouchableOpacity 
        onPress={onPress}
        style={tw`p-2 rounded-4 bg-white`}>
            <Text style={tw`text-center text-[#0C3778]`}>{name}</Text>
        </TouchableOpacity>

    }
        
    </>
  )
}

export default CallDecision