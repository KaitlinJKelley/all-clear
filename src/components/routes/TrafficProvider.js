import React, { createContext, useContext, useState } from "react"
import { getRouteStreetNames } from "../../modules/RouteStreetNames"
import { PathsContext } from "../paths/PathsProvider2"
import { RouteContext } from "./RouteProvider"

export const TrafficContext = createContext()

export const TrafficProvider = (props) => {
    // Declares state variable that can be set once traffice data is returned
    const [incidents, setIncidents] = useState({})

    // imports functions to be used in this component
    const { getLatLong, getDirections, getRouteById } = useContext(RouteContext)

    const { getPathByRouteId } = useContext(PathsContext)

    const getIncidentAndLocation = (routeObj) => {
        // Returns an array of path objects from database
        return getPathByRouteId(routeObj)
        .then(routePathArray => {
            let latLongString = ""
            // Iterates over each path object
            // If latLong contains a lat/long add the lat/long to latLongString with a semicolon at the end
            routePathArray.forEach(streetNameObj => streetNameObj.latLong !== "" ? latLongString = latLongString + streetNameObj.latLong + ";" : latLongString)
            return getTrafficIncidentData(latLongString)
        })
    }

    const getTrafficIncidentData = (latLongString) => {
        //Replaces spaces with empty strings
        latLongString = latLongString.replace(/\s+/g,'')

        return fetch(`https://traffic.ls.hereapi.com/traffic/6.0/incidents.json?corridor=${latLongString}20&apiKey=${process.env.REACT_APP_API}`)
            .then(res => {
                if (res.ok) {
                    // Tells me I got a good res
                    console.log("got a good response", res)
                    return res.json()
                } else {
                    // Tells me I got a bad response
                    console.log("you don't want that response")

                }
            })
            // sets incidents equal to data that was returned from fetch call
            .then(res => {
                console.log(res)
                setIncidents(res)
            })
    }

    return (
        <TrafficContext.Provider value={{
            getIncidentAndLocation, incidents
        }}>
            {props.children}
        </TrafficContext.Provider>
    )

}