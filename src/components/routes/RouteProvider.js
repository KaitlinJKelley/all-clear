import React, { createContext, useState } from "react"

export const RouteContext = createContext()

export const RouteProvider = (props) => {
    //  Use HERE GeoCoding and Search API to convert street addresses to lat/long pair
    const getLatLong = (address) => {
        return fetch (`https://geocode.search.hereapi.com/v1/geocode?q=${address}&apiKey=${process.env.REACT_APP_API}`)
        .then(res => res.json())
        .then(res => console.log(res))
    }

    // HERE Router API creates path from origin to destination
    let directions = []
    const getDirections = (origin, destination) => {
        return fetch (`https://router.hereapi.com/v8/routes?transportMode=car&origin=${Object.values(origin)}&destination=${Object.values(destination)}&return=polyline,turnbyturnactions&apikey=${process.env.REACT_APP_API}`)
        .then(res => res.json())
        .then(res => directions = res) 
        .then(res => console.log(res))
    }

    

    return (
        <RouteContext.Provider value={{
            getLatLong, getDirections
        }}>
            {props.children}
        </RouteContext.Provider>
    )
}