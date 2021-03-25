import { Route, Redirect } from "react-router-dom"
import { Login } from "./auth/Login"
import { Register } from "./auth/Register"
import { userStorageKey } from "./auth/authSettings"
import { RoutePage } from "./routes/RoutePage"
import { RouteProvider } from "./routes/RouteProvider"
import { TrafficProvider } from "./routes/TrafficProvider"
import { PathsProvider } from "./paths/PathsProvider"
import { PathsProvider2 } from "./paths/PathsProvider2"
// debugger
export const Checkpoint = () => {
  return (
    <>
      <Route render={() => {
        if (sessionStorage.getItem(userStorageKey)) {
          // If the user is logged in
          return (
            <>
              <RouteProvider>
                <TrafficProvider>
                  {/* <PathsProvider> */}
                  <PathsProvider2>
                    <Route exact path="/">
                      <RoutePage />
                    </Route>
                  </PathsProvider2>
                  {/* </PathsProvider> */}
                </TrafficProvider>
              </RouteProvider>
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
