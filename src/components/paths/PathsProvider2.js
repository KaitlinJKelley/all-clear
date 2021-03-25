import React, { createContext, useContext, useEffect, useState } from "react"
import { RouteContext } from "../routes/RouteProvider"

export const PathsContext = createContext()

export const PathsProvider2 = (props) => {
    console.log("PathsProvider ran")
    const { getLatLong, getRoutePath, newRoute } = useContext(RouteContext)
    // debugger
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

                        // .then(options => {
                        // console.log(optionsArray)
                        // debugger
                        // optionsArray is an array of objects where each object contains an array of objects representing a potential street name
                        // optionsArray.forEach(options => {

                        // Splices the origin and destination string into an array of strings
                        // const splitOrigin = origin.split(" ")
                        // const splitDestination = destination.split(" ")

                        // returns an array of a single string representing city name
                        // const originCity = splitOrigin.splice(-3, 1)
                        // const destinationCity = splitDestination.splice(-3, 1)

                        // const originState = splitOrigin(-2, 1)
                        // const destinationState = splitDestination(-2, 1)

                        // maps the items array for every object inside the optionsArray and chooses the object that contains a 
                        // title key that includes either origin or destination city and pushes the lat/long values into finalLatLong array
                        // options.items.forEach(item => item.title.toLowerCase().includes(`${originCity[0].toLowerCase()}`) ||
                        //     item.title.toLowerCase().includes(`${destinationCity[0].toLowerCase()}`) ? newRoutePath.latLong = (Object.values(item.position)) : newRoutePath.latLong = "")
                        // Promise.all(getLatLong(streetName)) .then(() => {
                        // })
                        // if (newRoutePath.latLong !== "") {
                        //     newRoutePath = {
                        //         streetName: streetName,
                        //         latLong: newRoutePath.latLong,
                        //         routeId: newRoute.id,
                        //         order: newRoutePath.order++
                        //     }

                        //     postRoutePath(newRoutePath)
                        // }

                        // })
                        // })

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

                        // const originState = splitOrigin(-2, 1)
                        // const destinationState = splitDestination(-2, 1)

                        // maps the items array for every object inside the optionsArray and chooses the object that contains a 
                        // title key that includes either origin or destination city and pushes the lat/long values into finalLatLong array
                        // options.items.forEach(item => item.title.toLowerCase().includes(`${originCity[0].toLowerCase()}`) ||
                        //     item.title.toLowerCase().includes(`${destinationCity[0].toLowerCase()}`) ? finalLatLong.push(Object.values(item.position)) : finalLatLong.push(""))
                        // options.items.forEach(item => item.title ? arrayOfPotentialStreetNames.push(item) : item)

                        const optionsStreetNames = options.items.map(itemObj => itemObj.title)

                        const optionsStreetNamesString = optionsStreetNames.join("")
                        console.log('optionsStreetNamesString: ', optionsStreetNamesString);

                        // debugger

                        if (optionsStreetNamesString.toLowerCase().includes(`${originCity}`) || optionsStreetNamesString.toLowerCase().includes(`${destinationCity}`)) {
                            // Put .find inside .map to return first instance of street name!!!
                            // options.items.map(item => item.title.toLowerCase().includes(`${originCity}`) ||
                            //     item.title.toLowerCase().includes(`${destinationCity}`) ? finalLatLong.push(item.title) : item)
                            // debugger
                            latLongStreetObjects.push(options.items.find(item => item.title.toLowerCase().includes(`${originCity}`) || item.title.toLowerCase().includes(`${destinationCity}`)))
                        } else {
                            latLongStreetObjects.push(" ")
                        }
                    })
                })
                .then(() => {
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
                            
                        }
                    }
                })
        }
    }, [newRoute])

    const timer = ms => new Promise(res => {
        setTimeout(res, ms)
        console.log("timed")
    })

    const postRoutePath = async (routePathObj) => {
        await timer(5000)
        .then(() => {
            return fetch(`http://localhost:8088/paths`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(routePathObj)
        })})
    }


    return (
        <PathsContext.Provider value={{

        }}>
            {props.children}
        </PathsContext.Provider>
    )
}