import React, { useContext, useEffect, useState } from "react"
import { PathsContext } from "./PathsProvider2"
import "./PathCard.css"

export const PathCard = ({ pathArray, pathId, style }) => {
    const { PathsProvider2, setSelectedPath } = useContext(PathsContext)


    // const [eventId, setEventId] = useState(-1)

    const handleSelected = (event) => {
        setSelectedPath(pathArray)
    }

    return (
        <article className="pathCard">
            <div style={style} /*className={pathId} style={eventId === pathId ? {backgroundColor: "green"} : {backgroundColor: "white"}}*/>
                {pathArray.join(" to ")}
            </div>
            <button /* style={style} className={pathId}*/ onClick={(event) => handleSelected(event)}>Select</button>
        </article >
    )
}