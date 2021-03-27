import React, { useContext, useEffect, useState } from "react"
import Button from 'react-bootstrap/Button';
import { UserContext } from "./UserProvider"
import "./UserEditForm.css"
import Form from 'react-bootstrap/Form';
import { useHistory } from "react-router";

export const UserEditForm = () => {
    const { getLoggedInUserObject, userObject, updateUser } = useContext(UserContext)

    const history = useHistory()

    const [userToEdit, setUserToEdit] = useState({})

    useEffect(() => {
        getLoggedInUserObject()

    }, [])

    useEffect(() => {
        setUserToEdit(userObject)
    }, [userObject])

    const handleInputChange = (event) => {
        const updatedUserToEdit = { ...userToEdit }
        updatedUserToEdit[event.target.name] = event.target.value

        setUserToEdit(updatedUserToEdit)
    }

    const handleSaveClick = () => {
        updateUser(userToEdit)
        history.push("/")

    }
    
    return (
        <Form id="modal">
            <h3 id="userEditHeader">User Profile Information</h3>
            <legend htmlFor="firstName">First Name</legend>
            <Form.Control name="firstName" type="text" value={`${userToEdit.firstName}`} onChange={(event) => handleInputChange(event)}></Form.Control>
            <legend htmlFor="lastName">Last Name</legend>
            <Form.Control name="lastName" type="text" value={`${userToEdit.lastName}`} onChange={(event) => handleInputChange(event)}></Form.Control>
            <legend htmlFor="email">Email</legend>
            <Form.Control name="email" type="text" value={`${userToEdit.email}`} onChange={(event) => handleInputChange(event)}></Form.Control>
            <Button id="userEditSave" onClick={() => handleSaveClick()} >Save Changes</Button>
        </Form>
    )

}