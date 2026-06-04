export const currentTime = () => {
    var randomHour = Math.floor(Math.random() * 23)
    var randomMin =  Math.floor(Math.random() * 59)
    if(randomHour < 10)
    randomHour = "0"+randomHour
    if(randomMin<10)
    randomMin = "0"+randomMin
    return  randomHour + ":"+ randomMin;
}

export const correctTime = () => {
    var currentHour = new Date().getHours()
    var currentMin = new Date().getMinutes()
    if(currentHour<10)
    currentHour = "0"+currentHour
    if(currentMin<10)
    currentMin = "0"+currentMin 
    return new Date().getHours()+":"+ new Date().getMinutes()
}

export const extractHour = (date) =>
{
    var year = new Date().getFullYear()
    var month = new Date(). getMonth()
    var day = new Date().getDate()
    const colon = date.indexOf(":")
   var current = new Date(year, month, day, date.substring(0, colon), date.substring(colon+1, date.length))
    return current.getTime()
}

export const sortContacts = (contactArray) => {
    contactArray?.sort((a, b) => 
    {
    if( new Date(a?.lastNotif?.date) < new Date(b?.lastNotif?.date)) 
    return 1
    else if(new Date(a?.lastNotif?.date) > new Date(b?.lastNotif?.date)) 
    return -1 
    else return 0
    }
    )
    return contactArray;
}

export const searchContactFromChat = (entered, contactList) => {
    const contactFilter = contactList.filter(contact => contact.name.includes(entered))
    return contactFilter;
}

export const unShiftContacts = (contactArray, currentUserId) => {
    for(let i=0;i<contactArray.length;i++)
    {
        if(contactArray[i]._id == currentUserId)
        {
            contactArray.unshift(contactArray[i])
            contactArray.splice(i+1, 1)
        }
    }
    return contactArray;
}