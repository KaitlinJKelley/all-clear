import React, { createContext, useState } from "react"

export const RouteContext = createContext()

export const RouteProvider = (props) => {
    const [routes, setRoutes] = useState([])

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
    }
    //set routes state variable equal to an array of all routes 
    const getRoutes = () => {
        return fetch("http://localhost:8088/routes")
            .then(res => res.json())
            .then(routes => setRoutes(routes))
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
        return fetch(`http://localhost:8088/messages/${routeObj.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(routeObj)
        })
            .then(getRoutes)
    }

    return (
        <RouteContext.Provider value={{
            getLatLong, getDirections, addNewRoute, getRoutes, routes, getRouteById, deleteRoute, updateRoute
        }}>
            {props.children}
        </RouteContext.Provider>
    )
}