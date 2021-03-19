import React, { useContext, useEffect, useState } from "react"
import { RouteContext } from "./RouteProvider"
import { TrafficContext } from "./TrafficProvider"

export const RouteCard = ({ routeObj }) => {
    const { getIncidentAndLocation, incidents } = useContext(TrafficContext)

    const { deleteRoute } = useContext(RouteContext)

    // state variable that will contain traffic incidents for a certain route
    const [incidentsToPost, setIncidentsToPost] = useState([])
    // Will store event.target.id after CheckTraffic is clicked
    const [eventId, setEventId] = useState(0)
    // Will store the message to be posted to the DOM on the appropriate card
    const [messageToPost, setMessageToPost] = useState(<div></div>)

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

    const handleEditClick = () => {
        
    }

    const handleDeleteClick = () => {
        debugger
        deleteRoute(routeObj.id)
    }

    return (
        <article>
            <h3>{routeObj.name}</h3>
            {<button id={routeObj.id} onClick={(event) => { handleCheckTrafficClick(event) }}>Check Traffic</button>}
            {messageToPost}
            <button>Edit Route</button>
            <button onClick={() => handleDeleteClick()}>Delete Route</button>
        </article>
    )
}