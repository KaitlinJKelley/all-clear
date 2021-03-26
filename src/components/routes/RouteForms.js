// Reponsible for Route Form layout and state
import React, { useContext, useState, useEffect } from "react"
import { getRouteStreetNames } from "../../modules/RouteStreetNames"
import { userStorageKey } from "../auth/authSettings"
import { RouteContext } from "./RouteProvider"
import { TrafficContext } from "./TrafficProvider"
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/Form';
import { Card } from "react-bootstrap"
import "./RouteForm.css"

export const RouteForms = () => {
    // imports functions to be used in this component
    const { addNewRoute, getRoutes, getRoutePath } = useContext(RouteContext)
    // Will be used to determine if all form fields are filled
    const [isComplete, setIsComplete] = useState(false)
    // Will be used to cause re-render when array of street names is ready to be displayed on DOM
    const [visualPath, setVisualPath] = useState(["Don't forget to check your path before clicking Save!"])
    // Will be used to save route to database
    const [route, setRoute] = useState({})
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
        // Go to the key that matches "name" and change the value of that key to match the user's input
        newOptions[event.target.name] = event.target.value
        // set state so the DOM re-renders with updated info
        setOptions(newOptions)
        // If none of the values in the newOptions object are empty strings
        if (Object.values(newOptions).includes("") === false) {
            // isComplete is true, which means all input fields are filled
            setIsComplete(true)
        } else {
            // Prevents app from breaking if a user completely backspaces after completing all fields
            setIsComplete(false)
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
        setVisualPath([])
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
            getRoutePath(newRoute.origin, newRoute.destination)
                
                // sets visualPath state variable equal to array of street names to invoke re-render
                .then(arrayOfStreetNames => setVisualPath(arrayOfStreetNames))
        }

    }, [options])

    return (
        <>
            <div className="formsAndInput">
                <fieldset className="newRoute__forms--title">
                    <legend>Route Name</legend>
                    <Form.Control type="text" name="name" value={options.name} placeholder="Route Name (ex. Home to Work)" onChange={event => handleInputChange(event)} required></Form.Control>
                </fieldset>
                <div className="newRoute__forms">
                    <Form className="newRoute__forms--origin">
                        <legend>Origin</legend>
                        <fieldset>
                            {/* <label htmlFor="originStreet"></label> */}
                            <Form.Control placeholder="Street" type="text" name="originStreet" value={options.originStreet} onChange={event => handleInputChange(event)} required></Form.Control>
                        </fieldset>

                        <fieldset>
                            <label htmlFor="originCSZ"></label>
                            <Form.Control placeholder="City, State Zip" type="text" name="originCSZ" value={options.originCSZ} onChange={event => handleInputChange(event)} required></Form.Control>
                        </fieldset>

                    </Form>

                    <Form className="newRoute__forms--destination">
                        <legend>Destination</legend>
                        <fieldset>
                            {/* <label htmlFor="destinationStreet"></label> */}
                            <Form.Control placeholder="Street" type="text" name="destinationStreet" value={options.destinationStreet} onChange={event => handleInputChange(event)} required></Form.Control>
                        </fieldset>

                        <fieldset>
                            <label htmlFor="destinationCSZ"></label>
                            <Form.Control placeholder="City, State Zip" type="text" name="destinationCSZ" value={options.destinationCSZ} onChange={event => handleInputChange(event)} required></Form.Control>
                        </fieldset>

                    </Form>
                </div>
            </div>
            <div className="newRoute__path">
                <Card.Title>Your Route Path</Card.Title>
                {visualPath.join(" to ")}
            </div>
            <button className="btn--saveRoute" type="submit"
                // Button is disabled until isComplete equals true
                // When the user clicks Save Route, invoke handleSaveClick
                disabled={!isComplete} className="save button" onClick={() => handleSaveClick()}>Save Route</button>
        </>
    )
}