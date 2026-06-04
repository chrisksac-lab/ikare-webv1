import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import Appointment from '../Appointment'
import AppointmentList from '../AppointmentList'
import Hospital from '../../screens/Hospital'
import AppointmentForm from '../../screens/AppointmentForm'

function AppointmentNavigation() {
    const Stack = createStackNavigator()
    const screenOptions = {headerShown: false}
  return (
    <>
        <Stack.Navigator>
            <Stack.Screen
            options={screenOptions}
            name='Hospitals' component={Appointment} />
            <Stack.Screen name='Appointment List' 
             options={screenOptions}
            component={AppointmentList} />
            <Stack.Screen name='Appointment Form' options={screenOptions} component={AppointmentForm} />
            <Stack.Screen name='Hospital Details' options={screenOptions} component={Hospital} />
        </Stack.Navigator>
    </>
  )
}

export default AppointmentNavigation