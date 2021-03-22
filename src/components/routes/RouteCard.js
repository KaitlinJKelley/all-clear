import React, { useContext, useEffect, useState } from "react"
import { getRouteStreetNames } from "../../modules/RouteStreetNames"
import { RouteContext } from "./RouteProvider"
import { TrafficContext } from "./TrafficProvider"
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {ButtonGroup} from 'react-bootstrap';
import "./RouteCard.css"

export const RouteCard = ({ routeObj }) => {
    const { getIncidentAndLocation, incidents } = useContext(TrafficContext)

    const { deleteRoute, getRouteById, updateRoute, getRoutePath } = useContext(RouteContext)

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
        // Gets incident data from API and sets incidents equal to the response object
        getIncidentAndLocation(routeObj.origin, routeObj.destination)
            .then(() => {
                // Sets eventId equal to event.target.id (id of the route where the button was clicked)
                setEventId(parseInt(event.target.id))
            })
    }

    const addDiv = () => {
        // If eventId === the id of the object that was clicked
        if (eventId === routeObj.id) {
            // If IncidentsToPost is not undefined
            if (incidentsToPost) {
                // returns the content message for each incident
                return <div>{incidentsToPost.map(incident => <Card.Text key={Math.random()}>{ incident?.TRAFFICITEMDESCRIPTION[0].content}</Card.Text>)}</div>
            } else {
                // Returns all clear message if there are no incident objects in the array
                return <Card.Text>All clear! There are no incidents blocking your route</Card.Text>
            }
        }
    }

    useEffect(() => {
        // When incidents variable changes, incidentsToPost is set equal to an array incident objects
        setIncidentsToPost(incidents?.TRAFFICITEMS?.TRAFFICITEM)
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
            // set path equal to the array of street names so the user can view the street names on their route
            .then(arrayOfStreetNames => setPath(arrayOfStreetNames))
    }

    useEffect(() => {
        // Checks to see if the route is at least 15 characters long; allows the user to save the route even if they don't make changes
        if (routeToEdit.origin?.length > 15 && routeToEdit.destination?.length > 15) {
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
        <Card className="savedRoutes__cards--routeCard">
            {/* Checks to see if editClicked is true */}
            {editClicked ?
                <>
                    {/* IF TRUE, display inout field/textarea fields containing route name, origin, and destination that the user can change */}
                    <input id={"name"} type="text" value={routeToEdit.name} onChange={event => handleChangeInput(event)}></input>
                    <div>
                        <textarea id={"origin"} type="text" value={routeToEdit.origin} onChange={event => handleChangeInput(event)}></textarea>
                        <textarea id={"destination"} type="text" value={routeToEdit.destination} onChange={event => handleChangeInput(event)}></textarea>
                    </div>
                    <Card.Body className="newRoute__path">
                        <h3>Your Route Path</h3>
                        <Button className="route button" onClick={() => handleViewPathClick()}>View Route Path</Button>
                        {path.map(name => <Card.Text key={Math.random()}>{name}</Card.Text>)}
                    </Card.Body>
                </>
                // IF FALSE, just display the route name as a header
                : <Card.Title>{routeObj.name}</Card.Title>}

            {/* Check Traffic Button */}
            {messageToPost}
            {<Button className="traffic button" id={routeObj.id} onClick={(event) => { handleCheckTrafficClick(event) }}>Check Traffic</Button>}

            {/* Checks to see if editClicked is true */}
            <ButtonGroup aria-label="First group">
            {editClicked ?
                // If true, display a Save button; disabled when any field is incomplete 
                <Button className="save button" disabled={!isComplete} onClick={() => { handleSaveClick(); setEditClicked(false) }} id={`${routeObj.id}`}>Save Changes</Button>
                // If false, display Edit button
                : <Button className="edit button" onClick={() => { handleEditClick(); setEditClicked(true) }} id={`${routeObj.id}`}>Edit</Button>}
            {/* Delete button */}
            <Button className ="delete button" onClick={() => handleDeleteClick()}>Delete Route</Button>
            </ButtonGroup>
        </Card>
    )
}