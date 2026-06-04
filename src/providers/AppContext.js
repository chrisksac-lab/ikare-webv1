import {createContext} from 'react'

export const AppContext = createContext({
    storedInformation: null,
    setStoredInformation: () => {},
})