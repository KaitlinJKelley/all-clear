import React, { createContext, useEffect, useState } from "react"
import { getRouteStreetNames } from "../../modules/RouteStreetNames"

export const RouteContext = createContext()

export const RouteProvider = (props) => {
    const [routes, setRoutes] = useState([])

    const [routeForRoutePath, setRouteForRoutePath] = useState({})

    //  Use HERE GeoCoding and Search API to convert street addresses to lat/long pair
    const getLatLong = (address) => {
        return fetch(`https://geocode.search.hereapi.com/v1/geocode?q=${address}&apiKey=${process.env.REACT_APP_API}`,)
            .then(res => res.json())
    }

    // HERE Router API creates path from origin to destination
    // Uses string interpolation to insert the values (lat/long) of the origin and destination objects
    const getDirections = (originObj, destinationObj) => {
        return fetch(`https://router.hereapi.com/v8/routes?transportMode=car&origin=${Object.values(originObj)}&destination=${Object.values(destinationObj)}&return=polyline,turnbyturnactions&apikey=${process.env.REACT_APP_API}`)
            .then(res => res.json())
    }

    const addNewRoute = routeObj => {
        return fetch(`http://localhost:8088/routes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(routeObj)
        })
            .then(getRoutes)
    }
    //set routes state variable equal to an array of all routes 
    const getRoutes = () => {
        return fetch("http://localhost:8088/routes")
            .then(res => res.json())
            .then(routesArray => setRoutes(routesArray))
    }

    const getRouteById = (routeObjId) => {
        return fetch(`http://localhost:8088/routes/${routeObjId}`)
            .then(res => res.json())
    }

    const deleteRoute = (routeId) => {
        return fetch(`http://localhost:8088/routes/${routeId}`, {
            method: "DELETE"
        })
            .then(getRoutes)
    }

    const updateRoute = routeObj => {
        return fetch(`http://localhost:8088/routes/${routeObj.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(routeObj)
        })
            .then(getRoutes)
    }

    const getRoutePath = (origin, destination) => {
        let originLatLong = {}
        let destinationLatLong = {}
        return getLatLong(origin)
            .then(res => {
                // res.items[0].position is an object containing lat and long as key value pairs
                return originLatLong = res.items[0].position
            })
            .then(() => getLatLong(destination))
            .then(res => {
                // changes empty object variable equal to an object containing lat/long pair
                return destinationLatLong = res.items[0].position
            })
            // Returns turn by turn directions from origin to destination
            .then(() => getDirections(originLatLong, destinationLatLong))
            // Returns an array of strings, where wach string is the next street a user should take 
            .then(directions => getRouteStreetNames(directions))

    }

    useEffect(() => {
        // Try to put full function inside useEffect dependent on routeForRoutePath. 
        // state variable will be set on add and on update to trigger useEffect
        // Add conditional to make sure variable is not an empty object
        // set variable back to initial state after new path is posted?
    }, []) 

    const createNewRoutePathObj = (routeObj) => {
        let origin = routeObj.origin
        let destination = routeObj.destination
        const newRoutePath = {
            streetName: "",
            latLong: "",
            routeId: 0,
            order: 0
        }
        getRoutePath(routeObj.origin, routeObj.destination)
            .then(arrayOfStreetNames => {
                return arrayOfStreetNames.map(streetName => {
                    // Runs each street name string through the geocoder API to get the lat/long
                    return getLatLong(streetName)
                        .then(resObj => {
                            newRoutePath.streetName = streetName
                            resObj.items.forEach(streetNameObj => {
                                // Splices the origin and destination string into an array of strings
                                const splitOrigin = origin.split(" ")
                                const splitDestination = destination.split(" ")

                                // returns an array of a single string representing city name
                                const originCity = splitOrigin.splice(-3, 1)
                                const destinationCity = splitDestination.splice(-3, 1)
                                if (streetNameObj.title.toLowerCase().includes(`${originCity[0].toLowerCase()}`) ||
                                    streetNameObj.title.toLowerCase().includes(`${destinationCity[0].toLowerCase()}`)) {
                                    newRoutePath.latLong = (Object.values(streetNameObj.position))
                                }
                                newRoutePath.routeId = routeObj.id
                                newRoutePath.order++
                                debugger
                                postRoutePath(newRoutePath)
                            })
                        })
                })
            })
    }

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
        <RouteContext.Provider value={{
            getLatLong, getDirections, addNewRoute, getRoutes, routes, getRouteById, deleteRoute, updateRoute, getRoutePath
        }}>
            {props.children}
        </RouteContext.Provider>
    )
}