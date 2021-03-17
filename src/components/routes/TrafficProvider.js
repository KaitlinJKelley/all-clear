import React, { createContext, useContext, useState } from "react"
import { getRouteStreetNames } from "../../modules/RouteStreetNames"
import { RouteContext } from "./RouteProvider"

export const TrafficContext = createContext()

export const TrafficProvider = (props) => {

    const [incidents, setIncidents] = useState({})
    // imports functions to be used in this component
    const { getLatLong, getDirections } = useContext(RouteContext)

    const getTrafficIncidentData = (latLongArray) => {
        const fixedLatLongString = latLongArray.join(";")
        // Finally got Traffic Incident data back but somehow also still getting a 400 error???
        return fetch(`https://traffic.ls.hereapi.com/traffic/6.0/incidents.json?corridor=${fixedLatLongString}%3B20&apiKey=${process.env.REACT_APP_API}`)
            .then(res => {
                if (res.ok) {
                    console.log("got a good response", res)
                    // setIncidents(res)
                    return res.json()
                } else {
                    console.log("you don't want that response")
                    
                }
            })
            .then(res => setIncidents(res))
    }

    const getIncidentAndLocation = (origin, destination) => {
        let finalLatLong = []
        let arrayOfPromises = []
        // debugger
        // let originString = origin
        // let destinationString = destination
        let originLatLong = {}
        let destinationLatLong = {}
        // debugger
        return getLatLong(origin)
            .then(res => {
                // debugger
                // position is the object conataining the lat/long pair
                // debugger
                console.log("LOOK HERE", res)
                originLatLong = res.items[0].position

                return getLatLong(destination)
            })
            // Returns lat/long of user/s destination opint
            // .then(() => getLatLong(destination))
            .then(res => {
                destinationLatLong = res.items[0].position
                // From reassigned variables on lines 38 & 39
                return getDirections(originLatLong, destinationLatLong)
            })
            // Returns turn by turn directions from origin to destination
            // .then(() => getDirections(origin, destination))
            // .then(route =>{
            //     // // Returns an array of just street names that the user will follow during their drive; line 21
            //     // debugger
            // })
            .then(route => {
                const streetNamesArray = getRouteStreetNames(route)
                // Formats the list of street names to be converted to lat/long pairs
                const FormattedStreetNames = streetNamesArray.map(string => string.replaceAll(" ", "+"))
                // FormattedStreetNames[0] += `%2C${originZip}`
                // FormattedStreetNames[1] += `%2C${destinationZip}`

                // Maps the formatted street names and gets lat/long for each
                arrayOfPromises = FormattedStreetNames.map(streetName => {
                    // Runs each street name string through the geocoder API to the lat/long
                    // debugger
                    return getLatLong(streetName)

                })
                return Promise.all(arrayOfPromises)
            })
            // .then(() => Promise.all(arrayOfPromises))
            .then(optionsArray => {
                // Splits the CSZ strings into [city, state, zip]
                // debugger
                optionsArray.forEach(options => {

                    const splitOrigin = origin.split(" ")
                    const splitDestination = destination.split(" ")

                    const originCity = splitOrigin.splice(-3, 1)
                    const destinationCity = splitDestination.splice(-3, 1)

                    // maps the returned options and chooses whichever lat/long pair from the object contains the origin or destination city name 
                    // returns undefined, because the map is pushing the appropriate lat/long pair into finalLatLong array on line 116
                    // debugger
                    options.items.map(item => item.title.toLowerCase().includes(`${originCity[0].toLowerCase()}`) ||
                        item.title.toLowerCase().includes(`${destinationCity[0].toLowerCase()}`) ? finalLatLong.push(Object.values(item.position)) : item)
                })
                // debugger
                // return getTrafficIncidentData(finalLatLong)
            })
            // debugger
            // Promise.all(arrayOfPromises)
            // Passes in an array of nested arrays, where each nested array contains a lat/long pair; line 61
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