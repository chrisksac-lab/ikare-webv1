import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import tw from "twrnc"
import AppointControl from '../../buttons/AppointControl'

function AppointmentCard({doctorImage, doctorName, title, date}) {
  return (
    <>
        <View style={tw`p-4 mt-2 border-b border-gray-300 bg-gray-100`}>
            <View style={tw`flex flex-row justify-between items-center`}>
            {
                doctorImage
            }
            <View style={tw`w-full flex flex-col justify-between`}>
                <Text style={tw`text-6 font-semibold`}>{doctorName}</Text>
                <Text style={tw``}>Details: {title}</Text>
                <Text>Date: {date}</Text>
              </View>
            </View>
                <View style={tw`flex mt-3 flex-row justify-between items-center`}>
                    <TouchableOpacity style={tw`p-2 bg-teal-600 rounded-4 w-[45%]`}>
                        <Text style={tw`text-center text-white`}>Cancel</Text>
                    </TouchableOpacity>
                    <AppointControl 
                     name="Reschedule"
                     status="active"
                     isControl={true}
                    />
                </View>

        </View>
    </>
  )
}

export default AppointmentCard