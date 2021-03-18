import React, { useContext, useEffect, useState } from "react"
import { TrafficContext } from "./TrafficProvider"

export const RouteCard = ({ routeObj }) => {
    const { getIncidentAndLocation, incidents } = useContext(TrafficContext)

    // state variable that will contain traffic incidents for a certain route
    const [incidentsToPost, setIncidentsToPost] = useState([])

    const [eventId, setEventId] = useState(0)

    const [messageToPost, setmessageToPost] = useState(<div></div>)

    const handleCheckTrafficClick = (event) => {
        // Gets incident data from API and sets incidents equal to an array of incident objects
        getIncidentAndLocation(routeObj.origin, routeObj.destination)
            .then(() => {

                setEventId(parseInt(event.target.id))
            })
    }

    const addDiv = () => {
        if (eventId === routeObj.id) {
            if (incidentsToPost.length > 0) {
                // returns the content message for each incident
                return <div>{incidentsToPost.map(incident => incident?.TRAFFICITEMDESCRIPTION[0].content)}</div>
            } else {
                // Returns all clear message if no incidents are returned
                return <div>All clear! There are no incidents blocking your route</div>
            }
        }
    }

    useEffect(() => {
        // When incidents variable changes, incidentsToPost is set equal to incidents
        setIncidentsToPost(incidents)
    }, [incidents])

    useEffect(() => {
        setmessageToPost(addDiv())
    }, [eventId])

    return (
        <article>
            <h3>{routeObj.name}</h3>
            {<button id={routeObj.id} onClick={(event) => { handleCheckTrafficClick(event) }}>Check Traffic</button>}
            <button>Edit Route</button>
            {messageToPost}
        </article>
    )
}