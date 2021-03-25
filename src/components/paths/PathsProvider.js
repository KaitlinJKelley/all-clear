
// In order but lat/long is not associated with correct street nane
// throws connection refused error
import React, { createContext, useContext, useEffect, useState } from "react"
import { RouteContext } from "../routes/RouteProvider"

export const PathsContext = createContext()

export const PathsProvider = (props) => {
    console.log("PathsProvider ran")
    const { getLatLong, getRoutePath, newRoute } = useContext(RouteContext)

    // debugger
    useEffect(() => {

        if (newRoute.origin) {
           
            let arrayOfPromises = []
            let finalLatLong = []
            let finalArrayOfStreetNames = []
            let origin = newRoute.origin
            let destination = newRoute.destination
            getRoutePath(newRoute.origin, newRoute.destination)
            .then(arrayOfStreetNames => {
                finalArrayOfStreetNames = arrayOfStreetNames
                // debugger
                arrayOfPromises = arrayOfStreetNames.map(streetName => {
                    // Runs each street name string through the geocoder API to get the lat/long
                    return getLatLong(streetName)
                    
                })
                // Waits for arrayOfPromises to return and then returns that result (the lat/long of each street name)
                return Promise.all(arrayOfPromises)
            })
            .then(optionsArray => {
                console.log(optionsArray)
                // optionsArray is an array of objects where each object contains an array of objects representing a potential street name
                optionsArray.forEach(options => {
                    
                    // Splices the origin and destination string into an array of strings
                    const splitOrigin = origin.split(" ")
                    const splitDestination = destination.split(" ")
                    
                    // returns an array of a single string representing city name
                    const originCity = splitOrigin.splice(-3, 1)
                    const destinationCity = splitDestination.splice(-3, 1)

                    // const originState = splitOrigin(-2, 1)
                    // const destinationState = splitDestination(-2, 1)
                    
                    // maps the items array for every object inside the optionsArray and chooses the object that contains a 
                    // title key that includes either origin or destination city and pushes the lat/long values into finalLatLong array
                    options.items.forEach(item => item.title.toLowerCase().includes(`${originCity[0].toLowerCase()}`) ||
                    item.title.toLowerCase().includes(`${destinationCity[0].toLowerCase()}`) ? finalLatLong.push(Object.values(item.position)) : item)
                })
            })
            .then(() => {
                console.log("finalLatLong", finalLatLong)
                console.log("finalArrayOfStreetNames", finalArrayOfStreetNames)
                for (let i = 0; i < finalLatLong.length; i++) {
                    const [destructuredLat, destructuredLong] = finalLatLong[i]
                    const newRoutePath = {
                        streetName: finalArrayOfStreetNames[i],
                        latLong: destructuredLat + ", " + destructuredLong,
                        routeId: newRoute.id,
                        order: i + 1
                    }
                    // debugger
                    postRoutePath(newRoutePath)
                }
            })
        }
    }, [newRoute])
        
        
        const postRoutePath = (routePathObj) => {
            return fetch(`http://localhost:8088/paths`, {
                method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(routePathObj)
        })
    }

    return (
        <PathsContext.Provider value={{

        }}>
            {props.children}
        </PathsContext.Provider>
    )
}