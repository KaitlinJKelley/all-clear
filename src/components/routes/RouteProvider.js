import React, { createContext, useEffect, useState } from "react"
import { getRouteStreetNames } from "../../modules/RouteStreetNames"
import { PathsProvider } from "../paths/PathsProvider"
import { PathsProvider2 } from "../paths/PathsProvider2"

export const RouteContext = createContext()

export const RouteProvider = (props) => {
    const [routes, setRoutes] = useState([])

    const [newRoute, setNewRoute] = useState({})

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
        .then(res => res.json())
        .then(setNewRoute)
        .then(getRoutes)
        .then(() => <PathsProvider2 />)
        // .then(setNewRoute({}))
        // .then(() => <PathsProvider />)
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
            .then(directions => getRouteStreetNames(directions, origin))
    }

    return (
        <RouteContext.Provider value={{
            getLatLong, getDirections, addNewRoute, getRoutes, routes, getRouteById, deleteRoute, updateRoute, getRoutePath, newRoute
        }}>
            {props.children}
        </RouteContext.Provider>
    )
}