// Reponsible for Route Form layout and state
import React, { useContext, useState, useEffect } from "react"
import { getRouteStreetNames } from "../../modules/RouteStreetNames"
import { userStorageKey } from "../auth/authSettings"
import { RouteContext } from "./RouteProvider"

export const RouteForms = () => {
    // imports functions to be used in this component
    const { getLatLong, getDirections, addNewRoute, getRoutes } = useContext(RouteContext)
    // Will be used to determine if all form fields are filled
    const [isComplete, setIsComplete] = useState(false)
    // Will be used to cause re-render when array of street names is ready to be displayed on DOM
    const [path, setPath] = useState([])
    // Will be used to save route to database
    const [route, setRoute] = useState({
        name: "",
        origin: "",
        destination: "",
        userId: 0
    })
    // Because an input field can't be matched to a route key, this state variable will be used until all fields are ready to setRoute
    const [options, setOptions] = useState({
        name: "",
        originStreet: "",
        originCSZ: "",
        destinationStreet: "",
        destinationCSZ: ""
    })

    const handleInputChange = (event) => {
        // copy options object
        const newOptions = { ...options }
        // for each key in the newOptions object
        for (let option in newOptions) {
            // if the current key being iterated over matches the name of the input field being filled
            if (option === event.target.name) {
                // change the value of that key to match the user's input
                newOptions[option] = event.target.value
                // set state so the DOM re-renders with updated info
                setOptions(newOptions)
            }
            // If none of the values in the newOptions object are empty strings
            if (Object.values(newOptions).includes("") === false) {
                // isComplete is true, which means all input fields are filled
                setIsComplete(true)
            }
        }
    }

    const handleSaveClick = () => {
        // debugger
       addNewRoute(route)
       setOptions({
            name: "",
            originStreet: "",
            originCSZ: "",
            destinationStreet: "",
            destinationCSZ: ""
       })
       setPath([])
       setIsComplete(false)
    }

    useEffect(() => {
        const currentUserId = parseInt(sessionStorage.getItem(userStorageKey))
        // Every time setOptions is called to change the options object's value
        // Decalre a newRoute variable that mirrors route variable layout with concatenated values
        const newRoute = {
            name: options.name,
            origin: options.originStreet + " " + options.originCSZ,
            destination: options.destinationStreet + " " + options.destinationCSZ,
            userId: currentUserId
        }
        // change route state to match newRoute
        setRoute(newRoute)
        // if all input fields are filled
        if (isComplete) {
            let originLatLong = {}
            let destinationLatLong = {}
            getLatLong(route.origin)
                .then(res => {
                    // res.items[0].position is an object containing lat and long as key value pairs
                    return originLatLong = res.items[0].position
                })
                .then(() => getLatLong(route.destination))
                .then(res => {
                    // changes empty object variable equal to an object containing lat/long pair
                    return destinationLatLong = res.items[0].position
                })
                // Returns turn by turn directions from origin to destination
                .then(() => getDirections(originLatLong, destinationLatLong))
                // Returns an array of strings, where wach string is the next street a user should take 
                .then(directions => getRouteStreetNames(directions))
                // sets path state variable equal to array of street names to invoke re-render
                .then(arrayOfStreetNames => setPath(arrayOfStreetNames))
        }

    }, [options])
    // Invokes getRoutes when path variable changes
    // This changes the state of the routes variable (in the RouteProvider) when a new route is saved, 
    // so the RoutePage automatically updates with the new route
    useEffect(() => {
        getRoutes()
    }, [path])

    return (
        <>
            <form className="newRoute__forms--origin">
            <fieldset>
                    <label htmlFor="name">Route Name (ex. Home to Work)</label>
                    <input type="text" name="name" value={options.name} onChange={event => handleInputChange(event)} required></input>
                </fieldset>
                <legend>Origin</legend>
                <fieldset>
                    <label htmlFor="originStreet">Street</label>
                    <input type="text" name="originStreet" value={options.originStreet} onChange={event => handleInputChange(event)} required></input>
                </fieldset>

                <fieldset>
                    <label htmlFor="originCSZ">City, State Zip</label>
                    <input type="text" name="originCSZ" value={options.originCSZ} onChange={event => handleInputChange(event)} required></input>
                </fieldset>

            </form>

            <form className="newRoute__forms--destination">
                <legend>Destination</legend>
                <fieldset>
                    <label htmlFor="destinationStreet">Street</label>
                    <input type="text" name="destinationStreet" value={options.destinationStreet} onChange={event => handleInputChange(event)} required></input>
                </fieldset>

                <fieldset>
                    <label htmlFor="destinationCSZ">City, State Zip</label>
                    <input type="text" name="destinationCSZ" value={options.destinationCSZ} onChange={event => handleInputChange(event)} required></input>
                </fieldset>

            </form>
            <div className="newRoute__path">
                <h3>Your Route Path</h3>
                {path.join(" to ")}
            </div>
            <button className="btn--saveRoute" type="submit"
            // Button is disabled until isComplete equals true
            // When the user clicks Save Route, invoke handleSaveClick
            disabled={!isComplete} onClick={() => handleSaveClick()}>Save Route</button>
        </>
    )
}