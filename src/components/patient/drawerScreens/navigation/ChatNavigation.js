import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Chat from '../Chat'
import tw from "twrnc"
import ChatScreen from '../../screens/ChatScreen'

function ChatNavigation() {
    const Stack = createStackNavigator()
  return (
    <>
        <Stack.Navigator
         screenOptions={{
            headerShown: true
         }}
        >
            <Stack.Screen 
             options={{
                headerShown: false,
             }}
            name='Contacts' component={Chat} />
            <Stack.Screen name='DrawerChatScreen' options={{
                headerShown: false
            }} component={ChatScreen} />
        </Stack.Navigator>
    </>
    )
}

export default ChatNavigation