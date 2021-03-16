import React from "react"

export const RouteCard = ({routeName}) => {
    return (
        <article>
            <h3>{routeName}</h3>
            <button>Edit</button>
        </article>
    )
}