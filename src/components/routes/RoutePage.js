// Responsible for rendering user's Saved Routes and Route Form
import React, { useContext, useEffect, useState } from "react"
import { getRouteStreetNames } from "../../modules/RouteStreetNames"
import { userStorageKey } from "../auth/authSettings"
import { RouteCard } from "./RouteCard"
import { RouteForms } from "./RouteForms"
import { RouteContext } from "./RouteProvider"
import { TrafficContext } from "./TrafficProvider"

export const RoutePage = () => {
    // imports routes state variable and getRoutes function
    const { routes, getRoutes, getLatLong, getDirections } = useContext(RouteContext)

    const { getIncidentAndLocation, incidents } = useContext(TrafficContext)
    // Declares state variable to be mapped once useEffect runs
    const [userRoutes, setUserRoutes] = useState([])
    // const [incidents, setIncidents] = useState([])

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
    // Consider moving entire map into conditional and setting a state variable to call inside JSX
    // If it still doesn't work, ASK JISIE

    useEffect(() => {
        if (userRoutes.length > 0) {
            // debugger
            const promise = userRoutes.map(route => {
                if (userRoutes.length > 0) {
                    return getIncidentAndLocation(route.origin, route.destination)

                }
            })
            Promise.all(promise)
                // Passes in an array of nested arrays, where each nested array contains a lat/long pair; line 61
                .then(() => {
                    console.log(incidents)
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }, [userRoutes])


    return (
        <>
            <h1>Checkpoint</h1>
            <button className="btn--logout">Logout</button>
            <section className="savedRoutes">
                <h2>Saved Routes</h2>
                <div className="savedRoutes__cards">

                    {userRoutes.map(route => {

                        // Passes in an array of nested arrays, where each nested array contains a lat/long pair; line 61

                        // debugger
                        // on each object iteration invoke RouteCard component and pass routeName as props
                        console.log(incidents)
                        return <RouteCard key={route.id} routeName={route.name} incidents={incidents} />


                        // .then(incidents => {
                        //     // on each object iteration invoke RouteCard component and pass routeName as props
                        //     console.log(incidents)
                        //     return <RouteCard key={route.id} routeName={route.name} />
                        // })
                        // }
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