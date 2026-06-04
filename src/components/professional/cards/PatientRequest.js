import React from 'react'
import {View, Text, TouchableOpacity} from "react-native"
import tw from "twrnc"
import AppointControl from '../../buttons/AppointControl'

function PatientRequest({patientImage, patientName, title, date, onPress}) {
  return (
    <>
        <View style={tw`p-4 mt-2 border-b border-gray-300`}>
            <View style={tw`flex flex-row justify-between items-center`}>
            {
                patientImage
            }
            <View style={tw`w-full flex flex-col justify-between`}>
                <Text style={tw`text-6 font-semibold`}>{patientName}</Text>
                <Text style={tw``}>{title}</Text>
                <Text>{date}</Text>
              </View>
            </View>
                <View style={tw`flex mt-3 flex-row justify-between items-center`}>
                    <TouchableOpacity onPress={onPress} style={tw`p-2 bg-teal-600 rounded-4 w-[45%]`}>
                        <Text style={tw`text-center text-white`}>Decline</Text>
                    </TouchableOpacity>
                    <AppointControl 
                     onPress={onPress}
                     name="Accept"
                     status="active"
                     isControl={true}
                    />
                </View>

        </View>
        </>
)
}

export default PatientRequest