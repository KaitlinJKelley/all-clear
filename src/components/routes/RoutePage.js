// Responsible for rendering user's Saved Routes and Route Form
import React, { useContext, useEffect, useState } from "react"
import { userStorageKey } from "../auth/authSettings"
import { RouteCard } from "./RouteCard"
import { RouteForms } from "./RouteForms"
import { RouteContext } from "./RouteProvider"

export const RoutePage = () => {
    // imports routes state variable and getRoutes function
    const { routes, getRoutes } = useContext(RouteContext)
    // Declares state variable to be mapped once useEffect runs
    const [userRoutes, setUserRoutes] = useState([])

    useEffect(() => {
        // gets and sets all routes
        getRoutes()
    }, [])

    useEffect(() => {
        // debugger
        const currentUserId = parseInt(sessionStorage.getItem(userStorageKey))
        // filters the array containing all route objects and return and array containing only the objects for the currently logged in user
        const filteredRoutes = routes.filter(route => route.userId === currentUserId)
        // sets userRoutes equal to filteredRoutes
        setUserRoutes(filteredRoutes)
    }, [routes])

    return (
        <>
            <h1>Checkpoint</h1>
            <button className="btn--logout">Logout</button>
            <section className="savedRoutes">
                <h2>Saved Routes</h2>
                <div className="savedRoutes__cards">
                    
                        {userRoutes.map(route => {
                            // debugger
                            // on each object iteration invoke RouteCard component and pass routeName as props
                            return <RouteCard key={route.id} routeName={route.name} />
                        })}

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