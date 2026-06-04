import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import tw from "twrnc"

function SecondaryButton({name, onPress}) {
    return (
      <>
        <View style={tw`mt-5`}>
          <TouchableOpacity
          onPress={onPress}
           style={tw`p-2 w-[50%] rounded-5 bg-[#0C3778]`}
          >
              <Text style={tw`text-white text-5 text-center font-bold`}>{name}</Text>
          </TouchableOpacity>
        </View>
      </>
    )
  }

export default SecondaryButton