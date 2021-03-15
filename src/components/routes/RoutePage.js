import React, { useContext, useEffect } from "react"
import { RouteContext } from "./RouteProvider"

export const RoutePage = () => {

    const {getLatLong} = useContext(RouteContext)

    
    useEffect(() => {
        // getLatLong("1320 Blue Ridge Circle mobile al 36695")
        
    }, [])


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
                    <form className="newRoute__forms--origin">
                        <legend>Origin</legend>
                        <fieldset>
                            <label htmlFor="origin__street">Street</label>
                            <input type="text" name="origin__street" id="" required></input>
                        </fieldset>

                        <fieldset>
                            <label htmlFor="origin__cityStateZip">City, State Zip</label>
                            <input type="text" name="origin__cityStateZip" id="" required></input>
                        </fieldset>

                        {/* <fieldset>
                            <label htmlFor="origin__state">State</label>
                            <input type="text" name="origin__state" id="" required></input>
                        </fieldset>

                        <fieldset>
                            <label htmlFor="origin__zip">Zip Code</label>
                            <input type="text" name="origin__zip" id="" required></input>
                        </fieldset> */}
                    </form>

                    <form className="newRoute__forms--destination">
                    <legend>Destination</legend>
                        <fieldset>
                            <label htmlFor="destination__street">Street</label>
                            <input type="text" name="destination__street" id="" required></input>
                        </fieldset>

                        <fieldset>
                            <label htmlFor="destination__cityStateZip">City, State Zip</label>
                            <input type="text" name="destination__cityStateZip" id="" required></input>
                        </fieldset>

                        {/* <fieldset>
                            <label htmlFor="destination__state">State</label>
                            <input type="text" name="destination__state" id="" required></input>
                        </fieldset>

                        <fieldset>
                            <label htmlFor="destination__zip">Zip Code</label>
                            <input type="text" name="destination__zip" id="" required></input>
                        </fieldset> */}
                    </form>
                </div>
                <div className="newRoute__path">
                    {/* Invoke function to render turnbyturn direction streetnames to DOM */}
                </div>
                <button className="btn--saveRoute">Save Route</button>
            </div>
        </>
    )
}