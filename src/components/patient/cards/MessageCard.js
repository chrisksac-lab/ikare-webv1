import React from 'react'
import { Text, View, Image } from 'react-native'
import tw from "twrnc"
import {MaterialIcons} from "@expo/vector-icons"
import axiosInstance from "../../../utils/axiosInstance/axiosInstance"

function MessageCard({incoming, message, time, isSeen, documents}) {
  return (
    <>
        { incoming ?
             documents.length > 0 
             ?
             <View>
                {
                    documents?.map(doc => (
                        <View style={tw`flex flex-row justify-between h-50 items-center mt-7`}> 
                    <View style={tw`p-4 rounded-5 bg-gray-800 w-[65%] h-full`}>
                        <Image style={tw`contain w-full h-[90%]`} source={{uri:axiosInstance.getUri()+doc}} />
                        <Text style={tw`text-right mt-2 text-gray-500`}>{new Date(time).toLocaleDateString() + " "+ new Date(time).getHours()+":"+new Date(time).getMinutes()}</Text>
                    </View>
                    <View></View>
                    </View>
                     ))
                }
             </View>
            :
            <View style={tw`flex flex-row justify-between items-center mt-2`}> 
            <View style={tw`p-4 rounded-5 bg-gray-800`}>
                <Text style={tw`text-white`}>{message}</Text>
                <Text style={tw`text-right mt-2 text-gray-500`}>{new Date(time).toLocaleDateString() + " "+ new Date(time).getHours()+":"+new Date(time).getMinutes()}</Text>
            </View>
            <View></View>
            </View>
            :
            (documents.length > 0 
             ?
             documents?.map(doc => (
                <View style={tw`flex flex-row justify-between h-50 items-center mt-8`}> 
                        <View></View>
            <View style={tw`p-4 rounded-5 bg-teal-900 w-[65%]`}>
                <Image style={tw`contain w-full h-[90%]`} source={{uri:axiosInstance.getUri()+doc}} />
                <View style={tw`mt-2 flex flex-row items-center self-end`}>
                    <Text style={tw`text-gray-400 text-4`}>{new Date(time).toLocaleDateString() + " "+ new Date(time).getHours()+":"+new Date(time).getMinutes()}</Text>
                    <MaterialIcons name="check" size={24} style={tw`text-gray-400`} />
                </View>
            </View>
            </View>
             ))
            :
            <View style={tw`flex flex-row justify-between items-center mt-2`}>  
            <View></View>
            <View style={tw`p-4 rounded-5 bg-teal-900 max-w-[70%]`}>
                <Text style={tw`text-white`}>{message}</Text>
                <View style={tw`mt-2 flex flex-row items-center self-end`}>
                    <Text style={tw`text-gray-400 text-3`}>{new Date(time).toLocaleDateString() + " "+ new Date(time).getHours()+":"+new Date(time).getMinutes()}</Text>
                    <MaterialIcons name="check" size={24} style={tw`text-gray-400`} />
                </View>
            </View>
            </View>)
        }
        
    </>
  )
}

export default MessageCard