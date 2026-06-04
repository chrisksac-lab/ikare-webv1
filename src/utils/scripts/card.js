import { Add, CloudCircle, DateRange, GroupOutlined, ModeNight, PeopleOutlined, PlusOne, TimeToLeave, Timelapse } from "@mui/icons-material";

export const cardData = [
    {
        number: "452",
        icon: <GroupOutlined/>,
        middleText: "Total Employees",
        footerIcon: <Add />,
        footerText: "2 new employees added"
    },
    {
        number: "360",
        icon: <Timelapse />,
        middleText: "On Time",
        footerIcon: <PlusOne />,
        footerText: "-10% Less than yesterday"
    },
    {
        number: "30",
        icon: <CloudCircle />,
        middleText: "Absent",
        footerIcon: <PlusOne />,
        footerText: "+3% Increase than yesterday"
    },
    {
        number: "62",
        icon: <TimeToLeave />,
        middleText: "Late Arrival",
        footerIcon: <PlusOne />,
        footerText: "+3% Less than yesterday"
    },
    {
        number: "6",
        icon: <ModeNight />,
        middleText: "Early Departures",
        footerIcon: <PlusOne />,
        footerText: "-10% Less than yesterday"
    },
    {
        number: "42",
        icon: <DateRange />,
        middleText: "Time-off",
        footerIcon: <PlusOne />,
        footerText: "2% Less than yesterday"
    },
]