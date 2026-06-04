import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import Pharmacy from '../Pharmacy'
import tw from "twrnc"
import DetailPharmacy from "../../screens/DetailPharmacy"

function PharmacyNavigation() {
    const Stack = createStackNavigator()
    const screenOptions = {headerShown: false}
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen options={screenOptions} name='Pharmacy' component={Pharmacy} />
        <Stack.Screen options={{
          headerTitle: "Institute Information",
          headerTintColor: `#0C3778`,
        }} name='Detailed Pharmacy' component={DetailPharmacy} />
      </Stack.Navigator>
    </>
  )
}

export default PharmacyNavigation