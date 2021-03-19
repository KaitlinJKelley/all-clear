import React, { useContext, useEffect, useState } from "react"
import { RouteContext } from "./RouteProvider"
import { TrafficContext } from "./TrafficProvider"

export const RouteCard = ({ routeObj }) => {
    const { getIncidentAndLocation, incidents } = useContext(TrafficContext)

    const { deleteRoute, getRouteById, updateRoute } = useContext(RouteContext)

    // state variable that will contain traffic incidents for a certain route
    const [incidentsToPost, setIncidentsToPost] = useState([])
    // Will store event.target.id after CheckTraffic is clicked
    const [eventId, setEventId] = useState(0)
    // Will store the message to be posted to the DOM on the appropriate card
    const [messageToPost, setMessageToPost] = useState(<div></div>)

    const [editClicked, setEditClicked] = useState(false)

    const [routeToEdit, setRouteToEdit] = useState({})

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
        // debugger
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
            // set routeToEdit equal to the routeObj that needs to be edited
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

    const handleSaveClick = () => {
        // Update the route in the database to match the changed route
        updateRoute(routeToEdit)
    }

    return (
        <article>
            {/* In the empty div add the origin and destination input fields populated from the routeToEdit keys; don't forget the id */}
            {editClicked ? <> <input id={"name"} type="text" value={routeToEdit.name} onChange={event => handleChangeInput(event)}></input> <div></div> </>
            : <h3>{routeObj.name}</h3>}
            {<button id={routeObj.id} onClick={(event) => { handleCheckTrafficClick(event) }}>Check Traffic</button>}
            {messageToPost}
            {editClicked ? <button className="button btn--save" onClick={() => { handleSaveClick(); setEditClicked(false) }} id={`${routeObj.id}`}>Save Changes</button>
                : <button className="button btn--edit" onClick={() => { handleEditClick(); setEditClicked(true) }} id={`${routeObj.id}`}>Edit</button>}
            <button onClick={() => handleDeleteClick()}>Delete Route</button>
        </article>
    )
}