import React, { createContext, useState } from "react"
import { userStorageKey } from "../auth/authSettings"

export const UserContext = createContext()

export const UserProvider = (props) => {


    const [userObject, setUserObject] = useState({})

    const currentUserId = sessionStorage.getItem(userStorageKey)

    const getLoggedInUserObject = () => {

        return fetch(`http://localhost:8088/users/${currentUserId}`)
            .then(res => res.json())
            .then(setUserObject)
    }

    const updateUser = (userObj) => {
        return fetch(`http://localhost:8088/users/${userObj.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userObj)
        })
    }

    return (
        <UserContext.Provider value={{
            getLoggedInUserObject, userObject, updateUser
        }}>
            {props.children}
        </UserContext.Provider>
    )
}