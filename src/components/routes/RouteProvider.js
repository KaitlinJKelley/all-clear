import React, { createContext } from "react"

export const RouteContext = createContext()

export const RouteProvider = (props) => {
    //  Use HERE GeoCoding and Search API to convert street addresses to lat/long pair
    const getLatLong = (address) => {
        return fetch (`https://geocode.search.hereapi.com/v1/geocode?q=${address}&apiKey=${process.env.REACT_APP_API}`)
        .then(res => res.json())
        .then(res => {console.log(res)})    
    }

    return (
        <RouteContext.Provider value={{
            getLatLong
        }}>
            {props.children}
        </RouteContext.Provider>
    )
}