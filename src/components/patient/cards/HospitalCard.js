import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import tw from "twrnc"

function HospitalCard({name, location, desc, icon, onPress}) {
  return (
    <>
            <TouchableOpacity 
              onPress={onPress}
            style={tw`p-2 flex flex-row w-full gap-2 items-center border-t border-gray-300 mt-2`}>
                {
                    icon
                }
                <View style={tw`flex flex-col justify-between`}>
                    <Text style={tw`text-6 font-bold text-[#0C3778]`}>{name}</Text>
                    <Text style={tw`font-semibold `}>{location}</Text>
                   {desc && <Text>{desc}</Text> }
                </View>
            </TouchableOpacity>
    </>
  )
}

export default HospitalCard