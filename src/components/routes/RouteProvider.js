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

    const addNewRoute = routeObj => {
        return fetch (`http://localhost:8088/routes`), {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(routeObj)
        }
    }
    

    return (
        <RouteContext.Provider value={{
            getLatLong, getDirections, addNewRoute
        }}>
            {props.children}
        </RouteContext.Provider>
    )
}