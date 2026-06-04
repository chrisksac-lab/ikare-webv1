import React, {useState, useEffect} from 'react'
import { FlatList, ScrollView, Text, View } from 'react-native'
import tw from "twrnc"
import AppointControl from '../../buttons/AppointControl'
import AppointmentCard from '../cards/AppointmentCard'
import axiosInstance from "../../../utils/axiosInstance/axiosInstance";
import { getStoredUser } from '../../../services/storage'
import { useQuery } from '@tanstack/react-query'
// import Loader from "../../Loader"
import { ActivityIndicator } from 'react-native'

function AppointmentList() {
    const [original, setOriginal] = useState([])
    const [appointmentList, setAppointmentList] = useState([])
    const [activeControl, setActiveControl] = useState()
    const [controls, setControls] = useState([
        {
        name: "All",
        status: "active"
        },
        {
            name: "UpComing",
            status: "inactive"
        },
        {
            name: "Pending",
            status: "inactive"
        },
])

const getActiveDetails = async() => {
    const url = "/api/user/get-singleuser";
    const activeUser = await getStoredUser()
    try {
        const response = await axiosInstance.post(url, {id: activeUser?._id, role: "PATIENT"})
        setAppointmentList(response.data.data.appointments)
        setOriginal(response.data.data.appointments)
        return response.data.data.appointments
    }
    catch(error) {
        console.log(error)
    }
}
    const handleChangeStatus = (val) => {
        const arr = [...controls]
        arr.map(control => {
                control.status = "inactive"
        })
        arr.map(control => {
            if(control.name == val)
            control.status = "active"
        })
        setActiveControl(val)
        handleFilterAppointments(val)
        setControls(arr)
    }

    const handleFilterAppointments = (activeControl) => {
        const appointments = [...original];
        switch(activeControl) {
            case "All":
                setAppointmentList(original)
                break
            case "UpComing":
                const filtered = appointments.filter(appointment => appointment?.status === "ACCEPTED")
                setAppointmentList(filtered)
                break;
            default:
                const filteredA = appointments.filter(appointment => appointment?.status === "PENDING")
                setAppointmentList(filteredA)
        }
    }
    const {data, isLoading} = useQuery({queryKey: ["active-details"], queryFn:getActiveDetails})
    const renderItem = ({item}) => (
        <AppointmentCard 
        doctorName={item?.user}
        doctorImage={item?.doctorImage}
        date={item?.date}
        title={item?.details}
        />
    )
  return (
    <>
        <View style={tw`p-4`}>
            <Text style={tw`mb-3 text-6 font-semibold`}>Appointments List</Text>
            <View style={tw`flex flex-row justify-between`}>
                {
                    controls?.map((control, index) => {
                        return(
                              <AppointControl 
                                key={index}
                                name={control.name}
                                status={control.status}
                                isControl={false}
                                onPress={() => handleChangeStatus(control.name)}
                                />
                        )
                    })
                }
            </View>
            {
                isLoading ?
                <ActivityIndicator />
                :
                <FlatList 
              data={appointmentList}
              renderItem={renderItem}
              keyExtractor={(item) => item._id.toString()}
              />}
        </View>
    </>
  )
}

export default AppointmentList