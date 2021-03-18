import React, { createContext, useContext, useState } from "react"
import { getRouteStreetNames } from "../../modules/RouteStreetNames"
import { RouteContext } from "./RouteProvider"

export const TrafficContext = createContext()

export const TrafficProvider = (props) => {
    // Declares state variable that can be set once traffice data is returned
    const [incidents, setIncidents] = useState([])

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
            .then(res => {
                console.log(res?.TRAFFICITEMS.TRAFFICITEM)
                setIncidents(res?.TRAFFICITEMS.TRAFFICITEM)
                })
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
                // Runs the turn by turn directions through the getRouteStreetNames function
                //Returns an array of street name strings that the user will follow during their drive
                const streetNamesArray = getRouteStreetNames(route)
                // Formats the list of street names to be converted to lat/long pairs
                const FormattedStreetNames = streetNamesArray.map(string => string.replaceAll(" ", "+"))

                // Maps the formatted street names and gets lat/long for each
                arrayOfPromises = FormattedStreetNames.map(streetName => {
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
                    const originCity = splitOrigin.splice(-3, 1)
                    const destinationCity = splitDestination.splice(-3, 1)

                    // maps the items array for every object inside the optionsArray and chooses the object that contains a 
                    // title key that includes either origin or destination city and pushes the lat/long values into finalLatLong array
                    options.items.map(item => item.title.toLowerCase().includes(`${originCity[0].toLowerCase()}`) ||
                        item.title.toLowerCase().includes(`${destinationCity[0].toLowerCase()}`) ? finalLatLong.push(Object.values(item.position)) : item)
                })
            })
            // Sets incident state equal to traffic incident data returned from fetch call
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