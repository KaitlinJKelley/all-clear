import React, { useContext, useEffect, useState } from "react"
import { PathsContext } from "./PathsProvider2"

export const PathCard = ({pathArray, pathId, style}) => {
    const { PathsProvider2 } = useContext(PathsContext)

    const [eventId, setEventId] = useState(-1)

    const handleSelected = (event) => {
        // debugger
        event.target.style.backgroundColor = "green"
        setEventId(parseInt(event.target.className))
       
    }
    
    return (
        <article className="pathCard">
            <div style={style} className={pathId} style={eventId === pathId ? {backgroundColor: "green"} : {backgroundColor: "white"}}>{pathArray.join(" to ")}
            <button style={style} className={pathId} onClick={(event) => handleSelected(event)}>Select</button>
            </div>
        </article>
    )   
}