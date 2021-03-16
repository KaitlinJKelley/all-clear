import React, { useContext, useState, useEffect } from "react"
import { RouteContext } from "./RouteProvider"


export const RouteForms = () => {

    const {getLatLong, getDirections} = useContext(RouteContext)

    const [isComplete, setIsComplete] = useState(false)

    const [route, setRoute] = useState({
        name: "", 
        origin: "",
        destination: "",
        userId: 0
    })

    const [options, setOptions] = useState({ 
        originStreet: "",
        originCSZ: "",
        destinationStreet: "",
        destinationCSZ: ""
    })

    const handleInputChange = (event) => {

        const newOptions = {...options}

        for (let option in newOptions) {
            if (option === event.target.name) {
                // debugger
                newOptions[option] = event.target.value
                setOptions(newOptions)
            }
            if (Object.values(newOptions).includes("") === false) {
                setIsComplete(true)
            }
        }

    }

    const handleSaveClick = (event) => {}

    useEffect(() => {
        const newRoute = {
            name: "",
            origin: options.originStreet + options.originCSZ,
            destination: options.destinationStreet + options.destinationCSZ,
            userId: 0
        }
        setRoute(newRoute)
        // debugger
        console.log(isComplete)
        if(isComplete) {
            // getLatLong(route.origin)
            // Need to getLatLong of destination
            // map route
            // declare a path variable containing []
            // set path = response
        }

    }, [options])

    return (
        <>
            <form className="newRoute__forms--origin">
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
                {/* map over path array to display route path on DOM*/}
            </div>
            <button className="btn--saveRoute">Save Route</button>
        </>
    )
}