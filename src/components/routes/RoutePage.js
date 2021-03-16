// Responsible for rendering user's Saved Routes and Route Form
import React, { useContext, useEffect } from "react"
import { RouteForms } from "./RouteForms"
import { RouteContext } from "./RouteProvider"

export const RoutePage = () => {

    return (
        <>
            <h1>Checkpoint</h1>
            <button className="btn--logout">Logout</button>
            <section className="savedRoutes">
                <h2>Saved Routes</h2>
                <div className="savedRoutes__cards">
                    No saved routes
                {/* Call RouteCard to render each route to DOM */}
                </div>
            </section>
            <div className="newRoute">
                <h2>New Route</h2>
                <div className="newRoute__forms">
                    {/* Invoke RouteForm coponent to render New Route form to DOM */}
                    <RouteForms />
                </div>
            </div>
        </>
    )
}