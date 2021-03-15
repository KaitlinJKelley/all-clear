import React from "react"

export const RoutePage = () => {
    return (
        <>
        <h1>Checkpoint</h1>
        <section className="savedRoutes">
            <div className="savedRoutes__cards">
                {/* Call RouteCard to render each route to DOM */}
            </div>
        </section>
        <div className="newRoute">
            <h2>New Route</h2>
            <div className="newRoute__forms">

            </div>
            <div className="newRoute__path">
                {/* Invoke function to render turnbyturn direction streetnames to DOM */}
            </div>
            <button className="btn--saveRoute">Save Route</button>
        </div>
        </>
    )
}