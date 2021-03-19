import React, { useContext, useEffect, useState } from "react"
import { getRouteStreetNames } from "../../modules/RouteStreetNames"
import { RouteContext } from "./RouteProvider"
import { TrafficContext } from "./TrafficProvider"

export const RouteCard = ({ routeObj }) => {
    const { getIncidentAndLocation, incidents, getRoutePath } = useContext(TrafficContext)

    const { deleteRoute, getRouteById, updateRoute, getLatLong, getDirections } = useContext(RouteContext)

    // state variable that will contain traffic incidents for a certain route
    const [incidentsToPost, setIncidentsToPost] = useState([])
    // Will store event.target.id after CheckTraffic is clicked
    const [eventId, setEventId] = useState(0)
    // Will store the message to be posted to the DOM on the appropriate card
    const [messageToPost, setMessageToPost] = useState(<div></div>)
    // Will be used to determine when to show buttons/input vs text
    const [editClicked, setEditClicked] = useState(false)
    // will be used to generate fields for input and handle changes to route
    const [routeToEdit, setRouteToEdit] = useState({})
    // Will be used to determine if all fields are complete
    const [isComplete, setIsComplete] = useState(false)
    // Will be used to cause re-render when array of street names is ready to be displayed on DOM
    const [path, setPath] = useState([])

    // TRAFFIC INFO

    const handleCheckTrafficClick = (event) => {
        // Gets incident data from API and sets incidents equal to an array of incident objects
        getIncidentAndLocation(routeObj.origin, routeObj.destination)
            .then((res) => {
                // Sets eventId equal to event.target.id (id of the route where the button was clicked)
                setEventId(parseInt(event.target.id))
            })
    }

    const addDiv = () => {
        // If eventId === the id of the object that was clicked
        if (eventId === routeObj.id) {
            // If IncidentsToPost is not undefined
            if (incidentsToPost) {
                // If there are any incidents
                if (incidentsToPost.length > 0) {
                    // returns the content message for each incident
                    // debugger
                    return <div>{incidentsToPost.map(incident => incident?.TRAFFICITEMDESCRIPTION[0].content)}</div>
                }
            } else {
                // Returns all clear message if there are no incident objects in the array
                return <div>All clear! There are no incidents blocking your route</div>
            }
        }
    }

    useEffect(() => {
        // When incidents variable changes, incidentsToPost is set equal to incidents
        setIncidentsToPost(incidents.TRAFFICITEMS?.TRAFFICITEM)
    }, [incidents])

    useEffect(() => {
        // When eventId set messageToPost equal to whatever is returned from the addDiv function
        setMessageToPost(addDiv())
    }, [eventId])

    // DELETE

    const handleDeleteClick = () => {
        deleteRoute(routeObj.id)
    }

    // EDIT

    const handleEditClick = () => {
        // Get the route that needs to be edited
        getRouteById(routeObj.id)
            // set routeToEdit equal to the routeObj returned from the fetch call
            .then(routeObj => setRouteToEdit(routeObj))
    }

    const handleChangeInput = (event) => {
        // copy the route
        const newRouteToEdit = { ...routeToEdit }
        // Go to the key that matches the id of the input field being changed and reassign that key to whatever the user typed
        newRouteToEdit[event.target.id] = event.target.value
        // set routeToEdit equal to the changed route
        setRouteToEdit(newRouteToEdit)
    }

    const handleViewPathClick = () => {
        const newRouteToEdit = { ...routeToEdit }
        // returns an array of strings; each string is a street name
        getRoutePath(newRouteToEdit.origin, newRouteToEdit.destination)
            // set path equal to the array of street names
            .then(arrayOfStreetNames => setPath(arrayOfStreetNames))
    }

    useEffect(() => {
        // Checks to see if the route is at least 15 characters long
        if (routeToEdit.origin?.length > 15 && routeToEdit.origin?.length > 15) {
            setIsComplete(true)
        } else {
            setIsComplete(false)
        }
    }, [routeToEdit])

    const handleSaveClick = () => {
        // Update the route in the database to match the changed route
        updateRoute(routeToEdit)
        // sets path back to an empty array ro remove the route path from the card
        setPath([])
    }

    return (
        <article>
            {/* Checks to see if editClicked is true */}
            {editClicked ?
                <>
                    {/* If true, display inout field/textarea fields containing route name, origin, and destination that the user can change */}
                    <input id={"name"} type="text" value={routeToEdit.name} onChange={event => handleChangeInput(event)}></input>
                    <div>
                        <textarea id={"origin"} type="text" value={routeToEdit.origin} onChange={event => handleChangeInput(event)}></textarea>
                        <textarea id={"destination"} type="text" value={routeToEdit.destination} onChange={event => handleChangeInput(event)}></textarea>
                        <button onClick={() => handleViewPathClick()}>View Route Path</button>
                    </div>
                    <div className="newRoute__path">
                        <h3>Your Route Path</h3>
                        {/* Use css white space pre-wrap to force line breaks? or display flex on div */}
                        {path.join(" to ")}
                    </div>
                </>
                // If false, just display the route name as a header
                : <h3>{routeObj.name}</h3>}
            {/* Check Traffic Button */}
            {<button id={routeObj.id} onClick={(event) => { handleCheckTrafficClick(event) }}>Check Traffic</button>}

            {messageToPost}
            {/* Checks to see if editClicked is true */}
            {editClicked ?
                // If true, display a Save button; disabled when any field is incomplete 
                <button className="button btn--save" disabled={!isComplete} onClick={() => { handleSaveClick(); setEditClicked(false) }} id={`${routeObj.id}`}>Save Changes</button>
                // If false, display Edit button
                : <button className="button btn--edit" onClick={() => { handleEditClick(); setEditClicked(true) }} id={`${routeObj.id}`}>Edit</button>}
            {/* Delete button */}
            <button onClick={() => handleDeleteClick()}>Delete Route</button>
        </article>
    )
}