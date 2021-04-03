import React, { createContext, useContext, useEffect } from "react"
import { RouteContext } from "../routes/RouteProvider"

export const PathsContext = createContext()

export const PathsProvider2 = (props) => {
    const { getLatLong, getRoutePath, newRoute } = useContext(RouteContext)
    useEffect(() => {

        if (newRoute.origin) {
            let arrayOfPromises = []
            let finalLatLong = []
            let latLongStreetObjects = []
            let finalArrayOfStreetNames = []
            let origin = newRoute.origin
            let destination = newRoute.destination
            getRoutePath(newRoute.origin, newRoute.destination)
                .then(arrayOfStreetNames => {
                    arrayOfPromises = arrayOfStreetNames.map(streetName => {
                        // Runs each street name string through the geocoder API to get the lat/long
                        return getLatLong(streetName)
                    })
                    // Waits for arrayOfPromises to return and then returns that result (the lat/long of each street name)
                    return Promise.all(arrayOfPromises)
                })
                .then(optionsArray => {
                    // optionsArray is an array of objects where each object contains an array of objects representing a potential street name
                    optionsArray.forEach(options => {
                        // Splices the origin and destination string into an array of strings
                        const splitOrigin = origin.split(" ")
                        const splitDestination = destination.split(" ")

                        // returns an array of a single string representing city name
                        const [originCity] = splitOrigin.splice(-3, 1)
                        const [destinationCity] = splitDestination.splice(-3, 1)

                        // Returns an array of just street name strings, includes steet address, city, state, zip
                        const optionsStreetNames = options.items.map(itemObj => itemObj.title)

                        // Joins entire array of street names to create 1 single string containing all potential street names
                        const optionsStreetNamesString = optionsStreetNames.join("")

                        // Checks to see if the joined string of all street names contains origin or destination city
                        if (optionsStreetNamesString.toLowerCase().includes(`${originCity.toLowerCase()}`) || optionsStreetNamesString.toLowerCase().includes(`${destinationCity.toLowerCase()}`)) {
                            // If true, push the first street name object that contains origin or destination city into latLongStreetObjects array
                            latLongStreetObjects.push(options.items.find(item => item.title.toLowerCase().includes(`${originCity.toLowerCase()}`) || item.title.toLowerCase().includes(`${destinationCity.toLowerCase()}`)))
                        } else {
                            // If false, push an empty string (placeholder) into array
                            latLongStreetObjects.push(" ")
                        }
                    })
                })
                // Uses async/await so that the entire function runs and then awaits completion of specified function
                .then(async () => {
                    // Maps array of street name objects and pushes either the placeholder empty string or the lat/long into finalLatLong
                    latLongStreetObjects.map(item => item === " " ? finalLatLong.push("") : finalLatLong.push(Object.values(item.position)))

                    // Runs everything inside the loop as many times as there are items in finalLatLong
                    for (let i = 0; i < finalLatLong.length; i++) {
                        // For placeholder strings, create path objects with empty string in place of latLong
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
                            // Where lat/long are not empty strings, use lat/long fot latlong
                            const [destructuredLat, destructuredLong] = finalLatLong[i]
                            const newRoutePath = {
                                streetName: finalArrayOfStreetNames[i],
                                latLong: destructuredLat + ", " + destructuredLong,
                                routeId: newRoute.id,
                                order: i + 1
                            }
                            postRoutePath(newRoutePath)
                            // Waits 50 ms between posts to prevent 429 error
                            await timer(50)

                        }
                    }
                })
        }
    }, [newRoute])

    const timer = ms => new Promise(res => {
        setTimeout(res, ms)
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