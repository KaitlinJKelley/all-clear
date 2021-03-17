import React, { createContext, useContext, useState } from "react"
import { getRouteStreetNames } from "../../modules/RouteStreetNames"
import { RouteContext } from "./RouteProvider"

export const TrafficContext = createContext()

export const TrafficProvider = (props) => {
    // Declares state variable that can be set once traffice data is returned
    const [incidents, setIncidents] = useState({})

    // imports functions to be used in this component
    const { getLatLong, getDirections } = useContext(RouteContext)

    const getTrafficIncidentData = (latLongArray) => {
        // FixedLatLongString will contain a single string of all lat/long pairs, separated by semicolons
        const fixedLatLongString = latLongArray.join(";")
        return fetch(`https://traffic.ls.hereapi.com/traffic/6.0/incidents.json?corridor=${fixedLatLongString}%3B20&apiKey=${process.env.REACT_APP_API}`)
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
            .then(res => setIncidents(res))
    }

    const getIncidentAndLocation = (origin, destination) => {
        // Modified on line 81
        let finalLatLong = []
        // Reassigned on line 64
        let arrayOfPromises = []

        // Reassigned on line 47 to obj containing lat/long pair for origin address
        let originLatLong = {}
        // Reassigned on line 54 to obj containing lat/long pair for destination address
        let destinationLatLong = {}
        // Returns promise to geocode origin address string
        return getLatLong(origin)
            .then(res => {
                // Reassigns originLatLong to contain an object of lat/long key/value pairs for origin address
                originLatLong = res.items[0].position
                // Returns promise to geocode destination address string
                return getLatLong(destination)
            })
            .then(res => {
                // Reassigns destinationLatLong to contain an object of lat/long key/value pairs for destination address
                destinationLatLong = res.items[0].position
                // Returns turn by turn directions from origin to destination
                // Variables on lines 40 & 42
                return getDirections(originLatLong, destinationLatLong)
            })
            .then(route => {
                // START HERE
                //     // // Returns an array of just street names that the user will follow during their drive; line 21
                const streetNamesArray = getRouteStreetNames(route)
                // Formats the list of street names to be converted to lat/long pairs
                const FormattedStreetNames = streetNamesArray.map(string => string.replaceAll(" ", "+"))

                // Maps the formatted street names and gets lat/long for each
                arrayOfPromises = FormattedStreetNames.map(streetName => {
                    // Runs each street name string through the geocoder API to the lat/long
                    return getLatLong(streetName)

                })
                return Promise.all(arrayOfPromises)
            })
            .then(optionsArray => {
                optionsArray.forEach(options => {
                    
                    const splitOrigin = origin.split(" ")
                    const splitDestination = destination.split(" ")

                    const originCity = splitOrigin.splice(-3, 1)
                    const destinationCity = splitDestination.splice(-3, 1)

                    // maps the returned options and chooses whichever lat/long pair from the object contains the origin or destination city name 
                    options.items.map(item => item.title.toLowerCase().includes(`${originCity[0].toLowerCase()}`) ||
                        item.title.toLowerCase().includes(`${destinationCity[0].toLowerCase()}`) ? finalLatLong.push(Object.values(item.position)) : item)
                })
            })
            .then(() => getTrafficIncidentData(finalLatLong))
            .catch(error => {
                console.log(error)
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