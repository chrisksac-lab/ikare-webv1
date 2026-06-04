import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { Pressable } from 'react-native'
import tw from "twrnc"

function AppointControl({name, status, onPress, isControl}) {
  return (
    <>
      {
        isControl == false ? 
        <Pressable
         onPress={onPress}
         style={
            status === "active" ?
            tw`bg-[#0C3778] p-2 rounded-4 w-[31%]` 
            :
            tw`bg-gray-300 p-2 rounded-4 w-[31%]`
         }
        >
            <Text style={
                status === "active" ?
                tw`text-center text-white`:
                tw`text-gray-800 text-center`
            }>{name}</Text>
        </Pressable> :
        <TouchableOpacity
        onPress={onPress}
        style={
           status === "active" ?
           tw`bg-[#0C3778] p-2 rounded-4 w-[45%]` 
           :
           tw`bg-gray-300 p-2 rounded-4 w-[45%]`
        }
       >
           <Text style={
               status === "active" ?
               tw`text-center text-white`:
               tw`text-gray-800 text-center`
           }>{name}</Text>
       </TouchableOpacity>
      }
    </>
  )
}

export default AppointControl