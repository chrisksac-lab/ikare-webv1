import React, { useState } from 'react'
import { Alert, Text, TextInput, View } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list'
import tw from "twrnc"
import PharmacyCard from '../cards/PharmacyCard'
import * as location from "expo-location";
import Toast from 'react-native-toast-message'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { ActivityIndicator } from 'react-native'
import { ScrollView } from 'react-native'

function Pharmacy({navigation}) {
  const [currentLocation, setCurrentLocation] = useState();
  const [hospitals, setHospitals] = useState([])
  const [pharmacy, setPharmacy] = useState([])
  const [filterLocation, setFilterLocation] = useState("")
  const [filterDrug, setFilterDrug] = useState("")
  const [filterStoreType, setFilterStoreType] = useState("")
  const handleFilter = () => {}
  const getGeoLocation = async() => {
        let {status} = await location.requestForegroundPermissionsAsync()
        if (status !== "granted") {
            Toast.show({
              type: "info",
              text1: "Permission denied"
            })
            return
        }
        let locationObj = await location.getCurrentPositionAsync();
        setCurrentLocation({lat: locationObj.coords.latitude, lng: locationObj.coords.longitude})
        const url = `https://api.geoapify.com/v2/places?categories=healthcare.pharmacy,healthcare.hospital,healthcare.clinic_or_praxis&bias=proximity:${locationObj.coords.longitude},${locationObj.coords.latitude}&limit=20&apiKey=aa5f7d1c48194551932ad37bbc9b0d83`
        axios.get(url)
        .then(async response => {
          const healthInstitutes = response.data.features
          const hospitals = [...healthInstitutes].filter(institute => (institute.properties.categories.includes('healthcare.hospital') || institute.properties.categories.includes('healthcare.clinic_or_praxis')))
          const pharmacies = [...healthInstitutes].filter(institute => institute.properties.categories.includes('healthcare.pharmacy'))
          const resp = await axios.get(`https://api.geoapify.com/v1/routing?waypoints=${locationObj.coords.latitude},${locationObj.coords.longitude}|${pharmacies[pharmacies.length-2].properties.lat},${pharmacies[pharmacies.length-2].properties.lon}&mode=walk&apiKey=aa5f7d1c48194551932ad37bbc9b0d83`)
         setHospitals(hospitals)
          setPharmacy(pharmacies)
          console.log(pharmacies)
          return response.data.features
        })
        .catch(error => console.log(error))
  }
  const {data, isLoading} = useQuery({queryKey:["get-geolocation"], queryFn:getGeoLocation})
  const handleViewMap = (institute) => {
    navigation.navigate("Detailed Pharmacy", {currentLocation, institute})
  }
  return (
    <ScrollView style={tw`h-full`}>
        <View style={tw`p-4`}>
          <Text style={tw`text-5 font-bold`}>Filter By</Text>
          <View style={tw`mt-5 flex flex-row justify-between items-center`}>
              <TextInput 
                placeholder='Drug'
                value={filterDrug}
                onChangeText={(text) => {setFilterDrug(text); handleFilter()}}
                style={tw`p-4 border border-gray-200 rounded-4 w-[32%] text-center`}
              />
              <TextInput 
                placeholder='Location'
                value={filterLocation}
                onChangeText={(text) => {setFilterLocation(text); handleFilter()}}
                style={tw`p-4 border border-gray-200 rounded-4 w-[32%] text-center`}
              />
              <SelectList 
                placeholder='Store Type'
                data={["Day", "Night"]}
                setSelected={(text) => setFilterStoreType(text)}
                onSelect={() => handleFilter()}
                style={tw`p-4 border border-gray-200 rounded-4 w-[32%] text-center`}
              />
           </View>
              {
                isLoading ?
                <ActivityIndicator size={36} style={tw`mt-5`} />
                :
                <>
                <View style={tw`mt-5`}>
                  <Text style={tw`text-5 font-semibold border-b-2 p-4 border-gray-300`}>Nearby Hospitals</Text>
                  {
                    [...hospitals].map(hospital => (
                      <PharmacyCard 
                      key={hospital?.properties.place_id}
                      tel={hospital?.properties?.contact?.phone}
                      onPress={() => handleViewMap(hospital)}
                      name={hospital?.properties.name ?? hospital?.properties.formatted}
                      location={hospital?.properties.suburb}
                     />
                    ))
                  }
              </View>
              <View style={tw`mt-5`}>
                  <Text style={tw`text-5 font-semibold border-b-2 p-4 border-gray-300`}>Nearby Pharmacies</Text>
                  {
                    [...pharmacy].map(hospital => (
                      <PharmacyCard 
                      key={hospital?.properties.place_id}
                      tel={hospital?.properties?.contact?.phone}
                      onPress={() => handleViewMap(hospital)}
                      name={hospital?.properties.name ?? hospital?.properties.formatted}
                      location={hospital?.properties.suburb}
                     />
                    ))
                  }
              </View>
              </>
              }
        </View>
    </ScrollView>
  )
}

export default Pharmacy