import React from 'react'
import { TextInput, TouchableOpacity } from 'react-native'
import { View } from 'react-native'
import tw from "twrnc"

function FormInput({icon, name, value, onBlur, onChange, type, placeholder}) {
  return (
    <>
        <View style={tw`p-4 bg-[#E8E4E4] mt-5 text-[#8B8989] rounded-4 w-full flex flex-row justify-between items-center`}>
          {
            icon
          }
          <TextInput 
           style={tw`w-[90%]`}
           placeholder={placeholder}
           value={value}
           onBlur={onBlur}
           onChangeText={onChange}
           keyboardType={name}
           secureTextEntry={type == "password" ? true : false}
          />
        </View>
    </>
  )
}

export default FormInput