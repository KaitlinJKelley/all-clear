import { Route, Redirect } from "react-router-dom"
import { Login } from "./auth/Login"
import { Register } from "./auth/Register"
import { userStorageKey } from "./auth/authSettings"
import { RoutePage } from "./routes/RoutePage"
import { RouteProvider } from "./routes/RouteProvider"
import { TrafficProvider } from "./routes/TrafficProvider"
import { PathsProvider2 } from "./paths/PathsProvider2"
import { UserProvider } from "./users/UserProvider"
import { UserEditForm } from "./users/UserEditForm"
// debugger
export const Checkpoint = () => {
  return (
    <>
      <Route render={() => {
        if (sessionStorage.getItem(userStorageKey)) {
          // If the user is logged in
          return (
            <>
            <UserProvider> 
              <RouteProvider>
                <PathsProvider2>
                  <TrafficProvider>
                    {/* <PathsProvider> */}
                    <Route exact path="/">
                      <RoutePage />
                    </Route>
                    <Route exact path="/edit-profile">
                      <UserEditForm />
                    </Route>
                    {/* </PathsProvider> */}
                  </TrafficProvider>
                </PathsProvider2>
              </RouteProvider>
            </UserProvider>
            </>
          )
        } else {
          return <Redirect to="/login" />;
        }
      }} />

      <Route path="/login">
        <Login />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
    </>
  )
}
