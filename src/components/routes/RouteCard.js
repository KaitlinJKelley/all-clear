import React from "react"

export const RouteCard = ({route}) => {
    return (
        <article>
            <h3>{route.name}</h3>
            <button>Edit</button>
        </article>
    )
}