import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React, { useEffect } from 'react'
import HealthProfessional from "./HealthProfessional"
import { Text, View } from 'react-native'
import tw from "twrnc"
import Prescription from '../../components/professional/screens/Prescription'
import Settings from "../../components/professional/screens/Settings"
import Profile from "../../components/professional/screens/Profile"
import { getStoredUser, getValue } from '../../services/storage'
import socket from '../../utils/socket'

function ProfessionalStack() {
  useEffect(() => {
      async function getUser() {
        const user = await getStoredUser()
      const userRole = await getValue("role")
    const hospitalS = await getValue("hospital")
    const host = JSON.parse(hospitalS)
    socket.emit("send-mobile-socket", {...user, userRole, hospital_id:host?._id})
      }
      // getActiveDetails()
      getUser()
  })
    const Stack = createStackNavigator()
  return (
    <>
            <Stack.Navigator>
                <Stack.Screen options={{
                    headerShown: false
                }} name="Main Dashboard" component={HealthProfessional} />
                <Stack.Screen
                 options={{
                    headerTitle: "Issue a prescription",
                    headerTintColor: "#fff",
                    headerStyle: tw`bg-[#0C3778]`
                 }} 
                name="Prescription" 
                component={Prescription} />
                <Stack.Screen name="Settings" component={Settings} />
                <Stack.Screen name="Profile" options={{
                    headerTitle: "Edit your profile",
                    headerTintColor: "#fff",
                    headerStyle: tw`bg-[#0C3778]`
                 }} component={Profile} />
            </Stack.Navigator>
    </>
  )
}

export default ProfessionalStack