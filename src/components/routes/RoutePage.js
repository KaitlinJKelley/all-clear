// Responsible for rendering user's Saved Routes and Route Form
import React, { useContext, useEffect } from "react"
import { currentUserId } from "../auth/authSettings"
import { RouteForms } from "./RouteForms"
import { RouteContext } from "./RouteProvider"

export const RoutePage = () => {
    const { routes, getRoutes } = useContext(RouteContext)

    useEffect(() => {
        getRoutes()
    }, [])

    return (
        <>
            <h1>Checkpoint</h1>
            <button className="btn--logout">Logout</button>
            <section className="savedRoutes">
                <h2>Saved Routes</h2>
                <div className="savedRoutes__cards">
                    Looks like you don't have any saved routes! Complete the form below to add a new route
                {/* Call RouteCard to render each route to DOM for the currently logged in user*/}
                
                </div>
            </section>
            <div className="newRoute">
                <h2>New Route</h2>
                <div className="newRoute__forms">
                    {/* Invoke RouteForm component to render New Route form to DOM */}
                    <RouteForms />
                </div>
            </div>
        </>
    )
}