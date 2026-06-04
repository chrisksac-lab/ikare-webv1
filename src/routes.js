import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./views/auth/LoginScreen";
import RegisterScreen from "./views/auth/RegisterScreen";
import Patient from "./views/other/Patient";
import ProfessionalStack from "./views/other/ProfessionalStack";
import Settings from "./components/professional/screens/Settings";
import Profile from "./components/professional/screens/Profile";
import Prescription from "./components/professional/screens/Prescription";
import { useEffect, useState, useContext } from "react";
import { getStoredUser, getValue } from "./services/storage";
import {AppContext} from "./providers/AppContext"

const Stack = createStackNavigator();
const screenOptions = {
    headerShown: false
}

function AuthStack (){
    return (
        <Stack.Navigator>
            <Stack.Screen options={screenOptions} name='Login' component={LoginScreen} />
            <Stack.Screen options={screenOptions} name='Register' component={RegisterScreen} />
        </Stack.Navigator>
    )
}

function RootStack(){
    const [token, setToken] = useState()
    const [user, setUser] = useState()
    const getInfo = async() => {
        const token = await getValue("role");
        const user = await getStoredUser()
        setToken(token);
        setUser(user)
    }
    useEffect(() => {
        getInfo()
    }, [token])
    return (
        <Stack.Navigator>
            <Stack.Screen options={screenOptions} name="Welcome"  component={
                token == "PATIENT" ?
                Patient
                :
                ProfessionalStack
            } />
            <Stack.Screen options={screenOptions} name="Settings" component={Settings} />
            <Stack.Screen options={screenOptions} name="Doctor Profile" component={Profile} />
            <Stack.Screen options={screenOptions} name="Prescription" component={Prescription} />
        </Stack.Navigator>
    )
}

export {AuthStack, RootStack}