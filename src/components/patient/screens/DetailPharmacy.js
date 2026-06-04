import React, {useState} from 'react'
import { Image } from 'react-native'
import { ActivityIndicator, Text, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { useQuery } from '@tanstack/react-query'
import tw from "twrnc"
import axios from 'axios'

function DetailPharmacy({navigation, route}) {
  const {currentLocation, institute} = route.params
  const [calculatedDistance, setCalculatedDistance] = useState()
    const [mapImage, setMapImage] = useState("")
  const getMapImageAndDistance = async() => {
    try {
      const response = await axios.get(`https://api.geoapify.com/v1/routing?waypoints=${currentLocation?.lat},${currentLocation?.lng}|${institute?.properties.lat},${institute?.properties.lon}&mode=walk&apiKey=aa5f7d1c48194551932ad37bbc9b0d83`)
      const distance = response.data.features[0].properties.distance
      setCalculatedDistance(distance)
      const image = `https://maps.geoapify.com/v1/staticmap?style=osm-bright-grey&width=600&height=400&center=lonlat:${institute?.properties.lon},${institute?.properties.lat}&zoom=14.8713&marker=lonlat:${institute?.properties.lon},${institute?.properties.lat};type:material;color:%231f63e6;size:x-large;icon:cloud;icontype:awesome;text:1;whitecircle:no|lonlat:-122.67129648458975,45.52309591904512;type:material;color:%231f63e6;size:x-large;icon:cloud;icontype:awesome;text:2;whitecircle:no|lonlat:-122.66444608451033,45.522964424673916;type:material;color:%231f63e6;size:x-large;icon:cloud;icontype:awesome;text:3;whitecircle:no&apiKey=aa5f7d1c48194551932ad37bbc9b0d83`
      setMapImage(image)
      return response.data.features[0].properties
  }
  catch(error) {
      Toast.show({
        type: "error",
        text1: error.message
      })
  }
  }
  const {data, isLoading} = useQuery({queryKey:["getMapImage"], queryFn:getMapImageAndDistance})
  return (
    <>
      <View style={tw`p-4`}>
        <Text style={tw`text-[18px] font-semibold`}>Name: {institute?.properties.name ?? institute?.properties.formatted}</Text>
        <Text style={tw`text-[18px] font-semibold mt-2`}>Distance: {calculatedDistance}m</Text>
        <Text style={tw`text-[18px] font-semibold mt-2`}>Mode: Walk</Text>
        <Text style={tw`text-[18px] font-semibold mt-2`}>Approximated time: {data?.time}</Text>
        {
          isLoading ?
          <ActivityIndicator size={36} style={tw`mt-5`} />
          :
          <Image 
            source={{uri: mapImage}}
            resizeMode="contain"
            style={tw`w-full h-[200px] mt-5`} 
            />
        }
      </View>
    </>
  )
}

export default DetailPharmacy