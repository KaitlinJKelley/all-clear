import React, { createContext, useState } from "react"

export const RouteContext = createContext()

export const RouteProvider = (props) => {
    //  Use HERE GeoCoding and Search API to convert street addresses to lat/long pair

    const getLatLong = (address) => {
        return fetch (`https://geocode.search.hereapi.com/v1/geocode?q=${address}&apiKey=${process.env.REACT_APP_API}`)
        .then(res => res.json())
    }

    // HERE Router API creates path from origin to destination
    // Uses string interpolation to insert the values (lat/long) of the origin and destination objects
    const getDirections = (originObj, destinationObj) => {
        return fetch (`https://router.hereapi.com/v8/routes?transportMode=car&origin=${Object.values(originObj)}&destination=${Object.values(destinationObj)}&return=polyline,turnbyturnactions&apikey=${process.env.REACT_APP_API}`)
        .then(res => res.json())

    }

    

    return (
        <RouteContext.Provider value={{
            getLatLong, getDirections
        }}>
            {props.children}
        </RouteContext.Provider>
    )
}