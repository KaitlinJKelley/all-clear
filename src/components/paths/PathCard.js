import React from "react"

export const PathCard = ({pathArray}) => {

    return (
        <article className="pathCard">
            <div>{pathArray.join(" to ")}</div>
            <button>Select</button>
        </article>
    )   
}