import React, { createContext, useContext } from "react"
import { getRouteStreetNames } from "../../modules/RouteStreetNames"
import { RouteContext } from "./RouteProvider"

export const TrafficContext = createContext()

export const TrafficProvider = (props) => {
    // imports functions to be used in this component
    const { getLatLong, getDirections } = useContext(RouteContext)

    const getTrafficIncidentData = (latLongArray) => {
        const fixedLatLongString = latLongArray.join(";")
        // Finally got Traffic Incident data back but somehow also still getting a 400 error???
        return fetch(`https://traffic.ls.hereapi.com/traffic/6.0/incidents.json?corridor=${fixedLatLongString}%3B20&apiKey=${process.env.REACT_APP_API}`)
            .then(res => {
                if (res.ok) {
                    console.log("got a good response", res)
                    return res
                } else {
                    console.log("you don't want that response")
                }
            })
            .then(res => res.json())
            .then(res => console.log("response", res))
    }

    const getIncidentAndLocation = (origin, destination) => {
        // debugger
        let originString = origin
        let destinationString = destination
        getLatLong(origin)
        .then(res => {
                // debugger
                // position is the object conataining the lat/long pair
                // debugger
                return origin = res.items[0].position
            })
            // Returns lat/long of user/s destination opint
            .then(() => getLatLong(destination))
            .then(res => {
                return destination = res.items[0].position
            })
            // Returns turn by turn directions from origin to destination
            .then(() => getDirections(origin, destination))
            .then(route =>
                // // Returns an array of just street names that the user will follow during their drive; line 21
                getRouteStreetNames(route)
            )
            .then(streetNamesArray => {
                // Formats the list of street names to be converted to lat/long pairs
                const FormattedStreetNames = streetNamesArray.map(string => string.replaceAll(" ", "+"))
                // FormattedStreetNames[0] += `%2C${originZip}`
                // FormattedStreetNames[1] += `%2C${destinationZip}`
                let finalLatLong = []
                // Maps the formatted street names and gets lat/long for each
                let arrayOfPromises = FormattedStreetNames.map(streetName => {
                    // Runs each street name string through the geocoder API to the lat/long
                    return getLatLong(streetName)
                        .then(options => {
                            // Splits the CSZ strings into [city, state, zip]
                            // debugger
                            const splitOrigin = originString.split(" ")
                            const splitDestination = destinationString.split(" ")

                            const originCity = splitOrigin.splice(-3, 1)
                            const destinationCity = splitDestination.splice(-3, 1)

                            // maps the returned options and chooses whichever lat/long pair from the object contains the origin or destination city name 
                            // returns undefined, because the map is pushing the appropriate lat/long pair into finalLatLong array on line 116
                            return options.items.map(item => item.title.includes(`${originCity}`) ||
                                item.title.includes(`${destinationCity}`) ? finalLatLong.push(Object.values(item.position)) : item)
                        })

                }).flat()
                Promise.all(arrayOfPromises)
                    // Passes in an array of nested arrays, where each nested array contains a lat/long pair; line 61
                    .then((res) => getTrafficIncidentData(finalLatLong))
                    .catch(error => {
                        console.log(error)
                    })

            })
    }
    return (
        <TrafficContext.Provider value={{
            getIncidentAndLocation
        }}>
            {props.children}
        </TrafficContext.Provider>
    )

}