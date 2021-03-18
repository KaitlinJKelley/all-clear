import React, { useContext, useEffect, useState } from "react"
import { TrafficContext } from "./TrafficProvider"

export const RouteCard = ({routeObj}) => {
    const { getIncidentAndLocation, incidents } = useContext(TrafficContext)

    const [incidentsToPost, setIncidentsToPost] = useState([])

    const [checkTrafficClicked, setcheckTrafficClicked] = useState(false)

    const handleCheckTrafficClick = () => {
        getIncidentAndLocation(routeObj.origin, routeObj.destination)
    }

    const incidentMessage = () => {
        // debugger
        if (incidentsToPost.length > 0) {
            return incidentsToPost.map(incident => incident?.TRAFFICITEMDESCRIPTION[0].content)
        } else {
            return "All clear! There are no incidents blocking your route"
        }
    }
    useEffect(() => {
        setIncidentsToPost(incidents)
    }, [incidents])

    useEffect(() => {
        // debugger
        if (incidentsToPost.length > 0) {
        setcheckTrafficClicked(true)
        }
    }, [incidentsToPost])


    return (
        <article>
            <h3>{routeObj.name}</h3>
            <button onClick={() => {handleCheckTrafficClick()}}>Check Traffic</button>
            <button>Edit Route</button>
            <div>{checkTrafficClicked ? incidentMessage() : ""}</div>
        </article>
    )
}