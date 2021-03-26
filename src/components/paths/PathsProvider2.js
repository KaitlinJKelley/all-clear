import React, { createContext, useContext, useEffect, useState } from "react"
import { RouteContext } from "../routes/RouteProvider"

export const PathsContext = createContext()

export const PathsProvider2 = (props) => {
    console.log("PathsProvider ran")
    const { getLatLong, getRoutePath, newRoute, getRoutes } = useContext(RouteContext)
    useEffect(() => {

        if (newRoute.origin) {
            let newRoutePath = {
                streetName: "",
                latLong: "",
                routeId: 0,
                order: 0
            }

            let arrayOfPromises = []
            let finalLatLong = []
            let latLongStreetObjects = []
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
                    console.log("optionsArray", optionsArray)
                    // optionsArray is an array of objects where each object contains an array of objects representing a potential street name
                    optionsArray.forEach(options => {

                        // Splices the origin and destination string into an array of strings
                        const splitOrigin = origin.split(" ")
                        const splitDestination = destination.split(" ")

                        // returns an array of a single string representing city name
                        const [originCity] = splitOrigin.splice(-3, 1)
                        const [destinationCity] = splitDestination.splice(-3, 1)

                        const optionsStreetNames = options.items.map(itemObj => itemObj.title)

                        const optionsStreetNamesString = optionsStreetNames.join("")
                        console.log('optionsStreetNamesString: ', optionsStreetNamesString);

                        // debugger

                        if (optionsStreetNamesString.toLowerCase().includes(`${originCity.toLowerCase()}`) || optionsStreetNamesString.toLowerCase().includes(`${destinationCity.toLowerCase()}`)) {

                            latLongStreetObjects.push(options.items.find(item => item.title.toLowerCase().includes(`${originCity.toLowerCase()}`) || item.title.toLowerCase().includes(`${destinationCity.toLowerCase()}`)))
                        } else {
                            latLongStreetObjects.push(" ")
                        }
                    })
                })
                .then(async () => {
                    // debugger
                    latLongStreetObjects.map(item => item === " " ? finalLatLong.push("") : finalLatLong.push(Object.values(item.position)))

                    console.log("finalLatLong", finalLatLong)
                    console.log("finalArrayOfStreetNames", finalArrayOfStreetNames)
                    for (let i = 0; i < finalLatLong.length; i++) {
                        if (finalLatLong[i] === "") {
                            const newRoutePath = {
                                streetName: finalArrayOfStreetNames[i],
                                latLong: finalLatLong[i],
                                routeId: newRoute.id,
                                order: i + 1
                            }
                            postRoutePath(newRoutePath)
                            await timer(50)
                        } else {

                            const [destructuredLat, destructuredLong] = finalLatLong[i]
                            const newRoutePath = {
                                streetName: finalArrayOfStreetNames[i],
                                latLong: destructuredLat + ", " + destructuredLong,
                                routeId: newRoute.id,
                                order: i + 1
                            }
                            // debugger
                            postRoutePath(newRoutePath)
                            await timer(50)

                        }
                    }
                })
        }
    }, [newRoute])

    const timer = ms => new Promise(res => {
        setTimeout(res, ms)
        console.log("timed")
    })

    const postRoutePath = (routePathObj) => {
        return fetch(`http://localhost:8088/paths`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(routePathObj)
        })
    }

    const getPathByRouteId = (routeObj) => {
        return fetch(`http://localhost:8088/paths?routeId=${routeObj.id}`)
            .then(res => res.json())
    }


    return (
        <PathsContext.Provider value={{
            getPathByRouteId
        }}>
            {props.children}
        </PathsContext.Provider>
    )
}